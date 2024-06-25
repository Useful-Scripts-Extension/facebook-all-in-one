import lodash_get from 'lodash/get';
import { fetchExtension, sendMessage } from './extesion';

// #region helper
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

export function fetchGraphQl(params: object | string = {}, url: string = ''): Promise<any> {
    let query = '';
    if (typeof params === 'string') query = '&q=' + encodeURIComponent(params);
    else query = wrapGraphQlParams(params);

    return sendMessage({
        action: 'request_graphql',
        query,
        url,
    });
}
// #endregion

// #region user

export function getUserAvatarFromUid(uid: string, size = 500) {
    return `https://graph.facebook.com/${uid}/picture?height=${size}&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;
}

export async function getEntityInfoFromId(entityID: string, context = 'DEFAULT') {
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

export async function getUidFromUrl(url: string) {
    try {
        let text = await fetchExtension(url);
        if (text) {
            let uid = /(?<="userID":")(.\d+?)(?=")/.exec(text);
            if (uid?.length) {
                return uid[0];
            }
        }
    } catch (e) {
        // ignore
    }
    return null;
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
    const res = await getEntityInfoFromId(targetUid);
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
            if (!item?.node?.subtitle_text || Math.random() < 0.1) {
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
