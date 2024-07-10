import lodash_get from 'lodash/get';
import { fetchExtension, runExtFunc } from './extension';

export enum ACCESS_TOKEN_TYPE {
    EAAG = 'EAAG',
    EAAB = 'EAAB',
}

const CACHED: {
    uid: string | null;
    fb_dtsg: string | null;
    urlToId: Record<string, string>;
    access_token: {
        [key in ACCESS_TOKEN_TYPE]: string | null;
    };
} = {
    uid: null,
    fb_dtsg: null,
    urlToId: {},
    access_token: {
        [ACCESS_TOKEN_TYPE.EAAG]: null,
        [ACCESS_TOKEN_TYPE.EAAB]: null,
    },
};

// #region helper

export async function fetchGraphQl(params: object | string = {}, url: string = ''): Promise<any> {
    let query = '';
    if (typeof params === 'string') query = '&q=' + encodeURIComponent(params);
    else query = wrapGraphQlParams(params);

    return fetchExtension(url || 'https://www.facebook.com/api/graphql/', {
        body: query + '&fb_dtsg=' + (await getFbDtsg()),
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        credentials: 'include',
    });
}

export function wrapGraphQlParams(params = {}) {
    const formBody = [];
    for (const property in params) {
        const encodedKey = encodeURIComponent(property);
        const value =
            typeof params[property] === 'string'
                ? params[property]
                : JSON.stringify(params[property]);
        const encodedValue = encodeURIComponent(value);
        formBody.push(encodedKey + '=' + encodedValue);
    }
    return formBody.join('&');
}

export async function trackEvent(scriptId: string) {
    return;
    const text = await fetchExtension('https://useful-script-statistic.glitch.me/count', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            script: 'fb_aio_' + scriptId,
            version: '1.68',
            uid: await getMyUid(),
        }),
    });
    return text;
}

// #endregion

// #region access token

export async function getFbDtsg() {
    if (CACHED.fb_dtsg) return CACHED.fb_dtsg;
    let text = await fetchExtension('https://mbasic.facebook.com/photos/upload/');
    let dtsg = RegExp(/name="fb_dtsg" value="(.*?)"/).exec(text)?.[1];
    if (!dtsg) {
        text = await fetchExtension('https://m.facebook.com/home.php', {
            headers: {
                Accept: 'text/html',
            },
        });
        dtsg =
            RegExp(/"dtsg":{"token":"([^"]+)"/).exec(text)?.[1] ||
            RegExp(/"name":"fb_dtsg","value":"([^"]+)/).exec(text)?.[1];
    }
    CACHED.fb_dtsg = dtsg || null;
    return CACHED.fb_dtsg;
}

export async function getAccessToken(type: ACCESS_TOKEN_TYPE) {
    if (CACHED.access_token[type]) return CACHED.access_token[type];

    switch (type) {
        case ACCESS_TOKEN_TYPE.EAAG:
            const text1 = await fetchExtension('https://business.facebook.com/business_locations');
            const token1 = RegExp(/(EAAG\w+)/).exec(text1)?.[1];
            CACHED.access_token[type] = token1 || null;
            return token1;

        case ACCESS_TOKEN_TYPE.EAAB:
            const fb_dtsg = await getFbDtsg();
            const uid = await getMyUid();

            const url = 'https://www.facebook.com/v1.0/dialog/oauth/confirm';
            const params = new URLSearchParams({
                fb_dtsg: fb_dtsg,
                app_id: '124024574287414',
                redirect_uri: 'fbconnect://success',
                display: 'page',
                access_token: '',
                from_post: '1',
                return_format: 'access_token',
                domain: '',
                sso_device: 'ios',
                _CONFIRM: '1',
                _user: uid,
            }).toString();

            const text2 = await fetchExtension(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: params,
            });
            const token2 = text2?.match(/(?<=access_token=)(.*?)(?=&)/)?.[0];
            CACHED.access_token[type] = token2 || null;
            return token2;
    }
}

// #endregion

// #region user

export async function getMyUid() {
    if (CACHED.uid) return CACHED.uid;
    const d = await runExtFunc('chrome.cookies.get', [
        { url: 'https://www.facebook.com', name: 'c_user' },
    ]);
    CACHED.uid = d?.value;
    return CACHED.uid;
}

export function getUserAvatarFromUid(uid: string, size = 500) {
    return `https://graph.facebook.com/${uid}/picture?height=${size}&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;
}

export async function getHoverCard(entityID: string, context = 'DEFAULT') {
    let res = await fetchGraphQl({
        fb_api_req_friendly_name: 'CometHovercardQueryRendererQuery',
        variables: {
            actionBarRenderLocation: 'WWW_COMET_HOVERCARD',
            context: context,
            entityID: entityID,
            includeTdaInfo: true,
            scale: 1,
        },
        doc_id: '7257793420991802',
    });

    return JSON.parse(res);
}

export type UserInfoObject = {
    uid: string;
    gender?: string;
    name?: string;
    alternateName?: string;
    avatar?: {
        id: string;
        link: string;
        uri: string;
    };
    cover?: {
        id: string;
        link: string;
        uri: string;
    };
};
export async function getUserInfoFromUid(uid: string): Promise<UserInfoObject> {
    const text = await fetchGraphQl({
        fb_api_req_friendly_name: 'ProfileCometHeaderQuery',
        doc_id: '4159355184147969',
        variables: {
            userID: uid,
            shouldDeferProfilePic: false,
            useVNextHeader: false,
            scale: 1.5,
        },
    });
    const json = JSON.parse('[' + text.split('\n').join(',') + ']');
    console.log(json);

    return {
        uid: uid,
        gender: lodash_get(json, '0.data.user.gender', ''),
        name: lodash_get(json, '0.data.user.name', ''),
        alternateName: lodash_get(json, '0.data.user.alternate_name', ''),
        avatar: {
            id: lodash_get(json, '0.data.user.profile_photo.id', ''),
            link: lodash_get(json, '0.data.user.profile_photo.url', ''),
            uri: lodash_get(json, '0.data.user.profilePicLarge.uri', ''),
        },
        cover: {
            id: lodash_get(json, '0.data.user.cover_photo.photo.id', ''),
            link: lodash_get(json, '0.data.user.cover_photo.photo.url', ''),
            uri: lodash_get(json, '0.data.user.cover_photo.photo.image.uri', ''),
        },
    };
}

export function getFbUrlFromId(id: string) {
    return `https://fb.com/${id}`;
}

export async function getIdFromUrl(url: string, regex: RegExp) {
    try {
        if (CACHED.urlToId[url]) return CACHED.urlToId[url];
        let text = await fetchExtension(url);
        if (text) {
            let id = regex.exec(text);
            console.log(text, id);
            if (id?.length) {
                CACHED.urlToId[url] = id[0];
                return id[0];
            }
        }
    } catch (e) {
        // ignore
    }
    return null;
}

export function getUidFromUrl(url: string) {
    return getIdFromUrl(url, /(?<="userID":")(.\d+?)(?=")/);
}

export async function searchUser(keyword: string, exact_match = true) {
    const res = await fetchGraphQl({
        doc_id: 7561210460668291,
        variables: {
            count: 5,
            allow_streaming: false,
            args: {
                callsite: 'COMET_GLOBAL_SEARCH',
                config: {
                    exact_match: exact_match,
                    high_confidence_config: null,
                    intercept_config: null,
                    sts_disambiguation: null,
                    watch_config: null,
                },
                experience: {
                    client_defined_experiences: [],
                    encoded_server_defined_params: null,
                    fbid: null,
                    type: 'PEOPLE_TAB',
                },
                filters: [],
                text: keyword,
            },
            cursor: null,
            feedbackSource: 23,
            fetch_filters: true,
            renderLocation: 'search_results_page',
            scale: 2,
            stream_initial_count: 0,
            useDefaultActor: false,
        },
    });
    const json = JSON.parse(res);
    console.log(json);
    return json;
}

// #endregion

// #region photos

export async function getProfilePhotos({ uid, count = 8, cursor = '' }) {
    const res = await fetchGraphQl({
        doc_id: '4820192058049838',
        fb_api_caller_class: 'RelayModern',
        fb_api_req_friendly_name: 'ProfileCometAppCollectionPhotosRendererPaginationQuery',
        variables: {
            count: count,
            cursor: cursor,
            scale: 1,
            id: btoa(`app_collection:${uid}:2305272732:5`),
        },
    });
    const json = JSON.parse(res);
    console.log(json);
    const { edges = [], page_info } = json?.data?.node?.pageItems || {};
    return {
        photos: edges.map(edge => ({
            url: edge?.node?.url,
            thumbnail: edge?.node?.image?.uri,
            image: edge?.node?.node?.viewer_image?.uri,
            width: edge?.node?.node?.viewer_image?.width,
            height: edge?.node?.node?.viewer_image?.height,
            accessibility_caption: edge?.node?.node?.accessibility_caption,
        })),
        page_info,
    };
}

export async function getAllProfilePhotos({ uid, onProgress }) {
    const photos = [];
    let cursor = '';
    while (true) {
        try {
            const res = await getProfilePhotos({ uid, cursor });
            if (!res?.photos?.length || !res?.page_info?.has_next_page) break;
            photos.push(...res.photos);
            onProgress?.(photos);
            cursor = res.page_info.end_cursor;
        } catch (e) {
            console.log(e);
            break;
        }
    }
    return photos;
}

export async function getAllAlbums({ id, accessToken, onProgress = albums => {} }) {
    const albums = [];
    let after = '';
    while (true) {
        try {
            const res = await fetchExtension(
                `https://graph.facebook.com/v14.0/${id}?fields=albums.limit(100){type,name,count,link,picture{url}}&access_token=${accessToken}&after=${after}`
            );
            const json = JSON.parse(res);
            if (json.albums?.data?.length) {
                albums.push(...json.albums.data);
                onProgress?.(albums);
            }

            let nextAfter = json.albums?.paging?.cursors?.after;
            if (!nextAfter || nextAfter === after) break;
            after = nextAfter;
        } catch (e) {
            console.error(e);
            break;
        }
    }
    return albums;
}

// #endregion

// #region messages

export type MessageObject = {
    id: string;
    count: number;
    recent: number;
    type: string;
    name: string;
    participants: Array<{
        id: string;
        name: string;
        avatar?: string;
    }>;
    url: string;
    isGroup: boolean;
    image?: string;
};
export async function getAllMessages(): Promise<Array<MessageObject>> {
    const res = await Promise.all([
        // normal messages
        fetchGraphQl(
            'viewer(){message_threads{count,nodes{customization_info{emoji,outgoing_bubble_color,participant_customizations{participant_id,nickname}},all_participants{nodes{messaging_actor{name,id,profile_picture}}},thread_type,name,messages_count,image,id}}}'
        ).then(res => JSON.parse(res || '{}')),

        // archived messages
        fetchGraphQl(
            {
                queries: {
                    o0: {
                        doc_id: '1475048592613093',
                        query_params: {
                            limit: 500,
                            before: Date.now(),
                            tags: ['ARCHIVED'],
                            includeDeliveryReceipts: true,
                            includeSeqID: false,
                        },
                    },
                },
            },
            'https://www.facebook.com/api/graphqlbatch/'
        ).then(res => JSON.parse(res?.split('\n')?.[0] || '{}')?.o0?.data),
    ]);
    const nodes = res
        .map(_ => _?.viewer?.message_threads?.nodes)
        .filter(Boolean)
        .flat();
    let data = nodes
        .map((node, i) => ({ ...node, recent: i })) // inject recent rank
        .map(node => {
            let participants = node.all_participants.nodes.map(p => ({
                id: p.messaging_actor.id,
                name: p.messaging_actor.name,
                avatar:
                    p.messaging_actor.profile_picture?.uri ||
                    p.messaging_actor.avatar?.big_image_src?.uri ||
                    getUserAvatarFromUid(p.messaging_actor.id),
            }));

            let d = {
                recent: node.recent,
                type: node.thread_type,
                id:
                    node.thread_key?.other_user_id ||
                    node.thread_key?.thread_fbid ||
                    (node.id ? atob(node.id)?.split(':')?.[1] : ''),
                count: node.messages_count,
                name: node.name || participants[0]?.name || '-no data-',
                participants: participants,
                image: node.image?.uri,
            };
            return {
                ...d,
                url: `https://www.facebook.com/messages/t/${d.id}`,
                isGroup: d.type === 'GROUP' || d.type === 'COMMUNITY_GROUP',
            };
        });

    return data;
}

export async function findFirstMessage({
    friendUid,
    startTime,
    endTime,
    progress,
}: {
    friendUid: string;
    startTime: number;
    endTime: number;
    progress?: Function;
}): Promise<Array<any> | undefined> {
    let mid = 1e3 * Math.round((startTime + endTime) / 2 / 1e3);
    progress?.(mid);
    let msgs = await getMessagesAtTimeCursor({ friendUid, time: mid, limit: 1 });

    if (Math.abs(endTime - startTime) <= 1e3) return msgs;

    if (msgs?.length)
        return await findFirstMessage({ friendUid, startTime, endTime: mid - 1, progress });
    else return await findFirstMessage({ friendUid, startTime: mid + 1, endTime, progress });
}

export async function getMessagesAfterMsgId({
    friendUid,
    msgId,
    direction = 'down',
    limit = 50,
}: {
    friendUid: string;
    msgId: string;
    direction?: 'down' | 'up';
    limit?: number;
}): Promise<Array<object> | Error> {
    const res = await fetchGraphQl(
        {
            other_user_fbid: friendUid,
            message_id: msgId,
            direction,
            limit,
            __a: 1,
        },
        'https://www.facebook.com/ajax/mercury/search_context.php'
    );
    const n = JSON.parse(res.substr(9)),
        t = n?.payload?.graphql_payload;
    if (t) return t;

    // let nextMsgIds = n?.payload?.search_context?.[msgId]?.down_message_ids;
    // if (nextMsgIds?.length)
    //     return await getMessagesAfterMsgId({
    //         friendUid,
    //         msgId: nextMsgIds[0],
    //         direction,
    //         limit,
    //     });

    return new Error('There is no results.');
}

export async function getMessagesAtTimeCursor({
    friendUid,
    time = null,
    limit = 50,
}: {
    friendUid: string;
    time?: null | number;
    limit?: number;
}): Promise<Array<any> | undefined> {
    const res = await fetchGraphQl(
        {
            queries: {
                o0: {
                    doc_id: '1526314457427586',
                    query_params: {
                        id: friendUid,
                        message_limit: limit,
                        load_messages: 1,
                        load_read_receipts: !0,
                        before: time,
                    },
                },
            },
        },
        'https://www.facebook.com/api/graphqlbatch/'
    );
    try {
        const n = JSON.parse(res.split('\n')[0]);
        if (n.o0.data.message_thread) return n.o0.data.message_thread.messages?.nodes || [];
    } catch (i) {
        console.error(i.message);
    }
    return [];
}

export async function checkCanMessage(targetUid) {
    const res = await getHoverCard(targetUid);
    return res?.data?.node?.comet_hovercard_renderer?.user?.primaryActions?.find(
        _ => _?.profile_action_type == 'MESSAGE'
    );
}

// #endregion

// #region friends

export async function getAllFriends({ myUid, targetUid }) {
    const res = await fetchGraphQl({
        doc_id: '4936483286421335',
        variables: {
            id: targetUid || myUid,
            query: '',
            scale: 1,
        },
    });
    try {
        console.log(JSON.parse(res));
        const json = JSON.parse(res || '{}')?.data?.user?.friends?.edges || [];
        return json.map(item => ({
            uid: item.node.id,
            name: item.node.name,
            avatar: item.node.photo?.uri,
            avatarLarge: getUserAvatarFromUid(item.node.id),
        }));
    } catch (e) {
        return [];
    }
}

export async function unfriend({ myUid, targetUid }) {
    const res = await fetchGraphQl({
        doc_id: '8752443744796374',
        variables: {
            input: {
                source: 'friending_jewel',
                unfriended_user_id: targetUid,
                actor_id: myUid,
                client_mutation_id: '8',
            },
            scale: 1,
        },
    });

    const json = JSON.parse(res || '{}');
    if (json.errors?.length) throw new Error(json.errors[0].message);
    return json;
}

export async function addFriend({ myUid, targetUid }) {
    const res = await fetchGraphQl({
        doc_id: '6294978773852692',
        variables: {
            input: {
                attribution_id_v2:
                    'FriendingCometRoot.react,comet.friending,tap_tabbar,1667288605315,127814,2356318349,',
                friend_requestee_ids: [targetUid],
                people_you_may_know_location: 'friends_center',
                refs: [null],
                source: 'people_you_may_know',
                warn_ack_for_ids: [],
                actor_id: myUid,
                client_mutation_id: '9',
            },
            scale: 2,
        },
    });
    const json = JSON.parse(res);
    if (json.errors?.length) throw new Error(json.errors[0].message);
    return json;
}

export async function pokeFriend({ myUid, targetUid }) {
    const res = await fetchGraphQl({
        doc_id: '5028133957233114',
        variables: {
            input: {
                client_mutation_id: '1',
                actor_id: myUid,
                user_id: targetUid,
            },
        },
    });
    const json = JSON.parse(res || '{}');
    if (json.errors?.length) throw new Error(json.errors[0].message);
    if (json?.data?.user_poke?.user?.poke_status != 'PENDING')
        throw new Error('Failed to poke friend: ' + json?.data?.user_poke?.user?.poke_status);
    return json;
}

export async function getProfileFriendsSection({ myUid, cursor = null }) {
    let res = await fetchGraphQl({
        doc_id: '4186250744800382',
        variables: {
            count: 8,
            cursor: cursor,
            scale: 2,
            id: btoa(`app_collection:${myUid}:2356318349:2`),
        },
    });
    return JSON.parse(res);
}

export async function getAllLockedFriends({ myUid, onFound, onPage }) {
    let lockedFriends = [];
    let cursor = null;
    let pageNum = 1;
    let loaded = 0,
        locked = 0;
    while (true) {
        const res = await getProfileFriendsSection({ myUid, cursor });
        const { edges, page_info } = res.data.node.pageItems;

        for (let item of edges) {
            if (!item?.node?.subtitle_text) {
                const user = {
                    uid: item.node.node.id,
                    url: item.node.url,
                    name: item.node.title.text,
                    avatar: item.node.image?.uri,
                    avatarLarge: getUserAvatarFromUid(item.node.id),
                };
                if (!/^\d+$/.exec(user.uid)) {
                    try {
                        let decode = atob(user.uid);
                        user.uid = /\d+/.exec(decode)?.[0] || user.uid;
                    } catch (e) {
                        console.log(e);
                    }
                }
                lockedFriends.push(user);
                locked++;
                if (typeof onFound === 'function') await onFound(user, lockedFriends);
            }
        }

        loaded += edges.length;
        await onPage(pageNum, loaded, locked);

        const { has_next_page, end_cursor } = page_info;
        if (!has_next_page) break;
        cursor = end_cursor;
        pageNum++;
    }
    return lockedFriends;
}

// #endregion
