import lodash_get from 'lodash/get';
import { fetchExtension, runExtFunc } from './extension';
import { notification } from 'antd';
import i18n from '../locales';

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
    ufsVersion?: string;
} = {
    uid: null,
    fb_dtsg: null,
    urlToId: {},
    access_token: {
        [ACCESS_TOKEN_TYPE.EAAG]: null,
        [ACCESS_TOKEN_TYPE.EAAB]: null,
    },
    ufsVersion: undefined,
};

// #region helper

export async function fetchGraphQl(params: object | string = {}, url: string = ''): Promise<any> {
    let query = '';
    if (typeof params === 'string') query = '&q=' + encodeURIComponent(params);
    else
        query = wrapGraphQlParams({
            dpr: 1,
            __a: 1,
            __aaid: 0,
            __ccg: 'GOOD',
            server_timestamps: true,
            ...params,
        });

    const res = await fetchExtension(url || 'https://www.facebook.com/api/graphql/', {
        body: query + '&fb_dtsg=' + (await getFbDtsg()),
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        credentials: 'include',
    });

    // check error response
    try {
        const json = JSON.parse(res);
        if (json.errors) {
            const { summary, message, description_raw } = json.errors[0];
            if (summary) {
                console.log(json);

                const div = document.createElement('div');
                div.innerHTML = description_raw?.__html;
                const description = div.innerText;

                notification.error({
                    message: i18n.t('Facebook response Error'),
                    description: summary + '. ' + message + '. ' + description,
                    duration: 0,
                });
            }
        }
    } catch (e) {}

    return res;
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

export async function getUfsVersion() {
    if (!CACHED.ufsVersion) {
        const manifest = await runExtFunc('chrome.runtime.getManifest');
        CACHED.ufsVersion = manifest?.version || 'unknown';
    }
    return CACHED.ufsVersion;
}

export async function trackEvent(scriptId: string) {
    return;
    const text = await fetchExtension('https://useful-script-statistic.glitch.me/count', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            script: 'fb_aio_' + scriptId,
            version: await getUfsVersion(),
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

export enum TargetType {
    User = 'user',
    Page = 'page',
    Group = 'group',
    IGUser = 'ig_user',
}
export type IEntityAbout = {
    type: TargetType;
    id: string;
    name: string;
    igName?: string;
    avatar: string;
    url: string;
    raw: any;
};
export async function getEntityAbout(entityID: string, context = 'DEFAULT'): Promise<IEntityAbout> {
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
    const json = JSON.parse(res);
    const node = json.data.node;
    if (!node) throw new Error('Wrong ID / Entity not found');
    const typeText = node.__typename.toLowerCase();
    if (!Object.values(TargetType).includes(typeText))
        throw new Error('Not supported type: ' + typeText);
    const card = node.comet_hovercard_renderer[typeText];
    const type =
        typeText === 'user'
            ? card.profile_plus_transition_path?.startsWith('PAGE')
                ? TargetType.Page
                : TargetType.User
            : TargetType.Group;

    return {
        type,
        id: node.id || card.id,
        name: card.name,
        avatar: card.profile_picture.uri,
        url: card.profile_url || card.url,
        raw: json,
    };
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
        doc_id: '7561210460668291',
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
    return json;
}

// #endregion

// #region photos
export type IUserPhoto = {
    id: string;
    url: string;
    thumbnail: string;
    image: string;
    width: number;
    height: number;
    accessibility_caption: string;
    cursor?: string;
};

export type IListPhotos = {
    photos: Array<IUserPhoto>;
    page_info: {
        end_cursor: string;
        has_next_page: boolean;
    };
};
export async function getUserPhotos({ id, count = 8, cursor = '' }): Promise<IListPhotos> {
    const res = await fetchGraphQl({
        doc_id: '4820192058049838',
        fb_api_caller_class: 'RelayModern',
        fb_api_req_friendly_name: 'ProfileCometAppCollectionPhotosRendererPaginationQuery',
        variables: {
            count: count,
            cursor: cursor,
            scale: 1,
            id: btoa(`app_collection:${id}:2305272732:5`),
        },
    });
    const json = JSON.parse(res);
    const { edges = [], page_info } = json?.data?.node?.pageItems || {};
    return {
        photos: edges.map(
            edge =>
                ({
                    id: atob(edge?.node?.id).split(':').pop(),
                    url: edge?.node?.url,
                    thumbnail: edge?.node?.image?.uri,
                    image: edge?.node?.node?.viewer_image?.uri,
                    width: edge?.node?.node?.viewer_image?.width,
                    height: edge?.node?.node?.viewer_image?.height,
                    accessibility_caption: edge?.node?.node?.accessibility_caption,
                    cursor: edge?.cursor,
                } as IUserPhoto)
        ),
        page_info,
    };
}

export async function getGroupPhotos({ id, count = 8, cursor = '' }): Promise<IListPhotos> {
    const res = await fetchGraphQl({
        doc_id: '6022153214500431',
        fb_api_caller_class: 'RelayModern',
        fb_api_req_friendly_name: 'GroupsCometMediaPhotosTabGridQuery',
        variables: {
            count: count,
            cursor: cursor,
            scale: 1,
            id: id,
        },
    });
    const json = JSON.parse(res);
    const { edges = [], page_info } = json?.data?.node?.group_mediaset?.media || {};
    return {
        photos: edges.map(
            edge =>
                ({
                    id: edge?.node?.id,
                    url: edge?.node?.url,
                    thumbnail: edge?.node?.image?.uri,
                    image: edge?.node?.viewer_image?.uri,
                    width: edge?.node?.viewer_image?.width,
                    height: edge?.node?.viewer_image?.height,
                    accessibility_caption: edge?.node?.accessibility_caption,
                    cursor: edge?.cursor,
                } as IUserPhoto)
        ),
        page_info,
    };
}

export async function getLargestPhoto(photoId: string): Promise<IUserPhoto> {
    const res = await fetchGraphQl({
        fb_api_req_friendly_name: 'CometPhotoRootContentQuery',
        variables: {
            UFI2CommentsProvider_commentsKey: 'CometPhotoRootQuery',
            feedbackSource: 65,
            feedLocation: 'COMET_MEDIA_VIEWER',
            isMediaset: false,
            // mediasetToken:
            //     // group = g, user = t, page = pb
            //     (targetType === 'group' ? 'g' : targetType === 'page' ? 'pb' : 't') +
            //     '.' +
            //     targetId,
            nodeID: photoId,
            privacySelectorRenderLocation: 'COMET_MEDIA_VIEWER',
            renderLocation: 'permalink',
            scale: 2,
            useDefaultActor: false,
            useHScroll: false,

            // optional
            focusCommentID: null,
            displayCommentsContextEnableComment: null,
            displayCommentsContextIsAdPreview: null,
            displayCommentsContextIsAggregatedShare: null,
            displayCommentsContextIsStorySet: null,
            displayCommentsFeedbackContext: null,
            __relay_internal__pv__CometUFIReactionEnableShortNamerelayprovider: true,
            __relay_internal__pv__CometUFIShareActionMigrationrelayprovider: false,
            __relay_internal__pv__CometUFIReactionsEnableShortNamerelayprovider: false,
            __relay_internal__pv__CometImmersivePhotoCanUserDisable3DMotionrelayprovider: false,
        },
        doc_id: '7830475950340566',
    });
    const json = JSON.parse(res?.split('\n')?.[0] || '{}');
    const media = json?.data?.currMedia || {};
    return {
        id: photoId,
        url: media.creation_story?.url,
        accessibility_caption: media.accessibility_caption,
        image: media.image.uri,
        width: media.image.width,
        height: media.image.height,
        thumbnail: media.image.uri,
    };
}

// #endregion

// #region albums

export type IAlbum = {
    id: string;
    type: string;
    recent: number;
    name: string;
    count: number;
    link: string;
    picture: string;
    cursor?: string;
};

export async function getUserAlbum({ uid = '', cursor = '' }) {
    const albums: IAlbum[] = [];
    const res = await fetchGraphQl({
        fb_api_req_friendly_name: 'ProfileCometAppCollectionAlbumsRendererPaginationQuery',
        variables: {
            cursor,
            count: 8,
            scale: 2,
            id: btoa(`app_collection:${uid}:2305272732:6`),
        },
        doc_id: '8672545689426653',
    });
    const json = JSON.parse(res);
    const { edges = [], page_info = {} } = json?.data?.node?.pageItems || {};
    for (const edge of edges) {
        const id = atob(edge?.node?.id).split(':').pop() || '';
        albums.push({
            id,
            type: 'album',
            name: edge?.node?.title?.text,
            count: parseInt(edge?.node?.subtitle_text?.text) || 0,
            link: edge?.node?.url,
            picture: edge?.node?.image?.uri,
            cursor: edge?.cursor,
            recent: albums.length,
        });
    }
    return { albums, nextCursor: page_info?.end_cursor };
}

export async function getGroupAlbum({ groupId = '', cursor = '' }) {
    const albums: IAlbum[] = [];
    const res = await fetchGraphQl({
        fb_api_req_friendly_name: 'GroupsCometMediaAlbumsTabGridQuery',
        variables: {
            cursor,
            count: 8,
            scale: 2,
            id: groupId,
        },
        doc_id: '6894403247286675',
    });
    const json = JSON.parse(res);
    const { edges = [], page_info = {} } = json?.data?.node?.group_albums || {};
    for (const edge of edges) {
        const id = edge?.node?.id;
        albums.push({
            id,
            type: 'album',
            name: edge?.node?.title?.text,
            count: (edge?.node?.photos?.count || 0) + (edge?.node?.video?.count || 0),
            link: edge?.node?.url,
            picture: edge?.node?.album_cover_focused_image?.image?.image?.uri,
            cursor: edge?.cursor,
            recent: albums.length,
        });
    }
    return { albums, nextCursor: page_info?.end_cursor };
}

export async function getEntityAlbum({ id = '', fromId = '', accessToken = '' }) {
    const albums: IAlbum[] = [];
    const res = await fetchExtension(
        `https://graph.facebook.com/v14.0/${id}?fields=albums.limit(100)${
            fromId ? `.after(${btoa(fromId)})` : ''
        }{type,name,count,link,picture{url}}&access_token=${accessToken}`
    );
    const json = JSON.parse(res);
    if (json.albums?.data?.length) {
        for (const album of json.albums.data) {
            albums.push({
                id: album.id,
                type: album.type,
                name: album.name,
                count: album.count,
                link: album.link,
                picture: album.picture.data.url,
                recent: albums.length,
            });
        }
    }
    return { albums, nextCursor: json.albums?.paging?.cursors?.after };
}

export enum MediaType {
    IMAGE = 'image',
    VIDEO = 'video',
}
export type IAlbumPhoto = {
    id: string;
    uri: string;
    type: MediaType;
};
export async function getAlbumPhoto({
    albumId,
    accessToken = '',
    fromId = '',
}): Promise<IAlbumPhoto[]> {
    // use access_token to maximize speed (100 photos/request)
    let url = `https://graph.facebook.com/v14.0/${albumId}/photos?fields=largest_image&limit=100&access_token=${accessToken}`;
    if (fromId) url += `&after=${btoa(fromId)}`;

    let res = await fetchExtension(url);
    let json = JSON.parse(res);
    if (json?.data?.length) {
        return (
            json?.data?.map(_ => ({
                id: _.id,
                uri: _.largest_image.source,
                type: MediaType.IMAGE,
            })) || []
        );
    }

    // backup plan: use graphql (14 photos/request)
    res = await fetchGraphQl({
        doc_id: '8142948395762884',
        variables: {
            id: albumId,
            cursor: fromId ? btoa('fbid:' + fromId) : '',
            count: 14,
            renderLocation: 'permalink',
            scale: 2,
        },
    });
    json = JSON.parse(res);
    try {
        let medias = json.data.node.media.edges.map(edge => {
            return {
                id: edge.node.id,
                uri: edge.node.image.uri,
                type: edge.node.__typename === 'Video' ? MediaType.VIDEO : MediaType.IMAGE,
            };
        });
        return medias;
    } catch (e) {
        console.error(e);
        return [];
    }
}

// #endregion

// #region videos

export type IVideo = {
    id: string;
    recent: number;
    created_time: string;
    description: string;
    length: number;
    url: string;
    source: string;
    picture: string;
    cursor: string;
};
export async function getUserVideo({ id = '', cursor = '' }) {
    const videos: IVideo[] = [];
    const res = await fetchGraphQl({
        variables: {
            cursor,
            count: 8,
            scale: 1,
            id: btoa(`app_collection:${id}:1560653304174514:133`),
        },
        doc_id: '3975496529227403',
    });
    const json = JSON.parse(res);
    const { edges = [], page_info = {} } = json?.data?.node?.pageItems || {};
    for (const edge of edges) {
        const id = edge?.node?.node?.id || '';
        // const videoInfo = await getVideoInfo(id);
        videos.push({
            id,
            recent: videos.length,
            created_time: '', // videoInfo.created_time,
            description: edge?.node?.title?.text,
            length: edge?.node?.node?.playable_duration,
            url: edge?.node?.url,
            source: '', // videoInfo.source,
            picture: edge?.node?.image?.uri, //videoInfo.thumbnail
            cursor: edge?.cursor || '',
        });
    }

    return { videos, nextCursor: page_info?.end_cursor };
}

// `https://graph.facebook.com/v14.0/${id}?fields=videos.limit(100)${after ? `.after(${after})` : ''}{created_time,description,id,length,post_id,source,picture}&access_token=${accessToken}`
export async function getGroupVideo({ id = '', cursor = '' }) {
    const videos: IVideo[] = [];
    const res = await fetchGraphQl({
        fb_api_req_friendly_name: 'GroupsCometVideosRootQueryContainerQuery',
        variables: {
            cursor,
            count: 8,
            scale: 2,
            groupID: id,
        },
        doc_id: '6553573504724585',
    });
    const json = JSON.parse(res);
    const { edges = [], page_info = {} } = json?.data?.group?.group_mediaset?.media || {};
    for (const edge of edges) {
        const id = edge?.node?.id || '';
        // const videoInfo = await getVideoInfo(id);
        videos.push({
            id,
            recent: videos.length,
            created_time: '', // videoInfo.created_time,
            description: edge?.node?.title?.text,
            length: edge?.node?.node?.playable_duration,
            url: edge?.node?.url,
            source: '', // videoInfo.source,
            picture: edge?.node?.image?.uri, //videoInfo.thumbnail
            cursor: edge?.cursor || '',
        });
    }

    return { videos, nextCursor: page_info?.end_cursor };
}

export async function getVideoInfo(videoId: string) {
    const res = await fetchGraphQl({
        fb_api_req_friendly_name: 'CometTahoeRootQuery',
        variables: {
            caller: 'TAHOE',
            chainingCursor: null,
            chainingSeedVideoId: null,
            channelEntryPoint: 'TAHOE',
            channelID: '',
            feedbackSource: 41,
            feedLocation: 'TAHOE',
            focusCommentID: null,
            isCrawler: false,
            privacySelectorRenderLocation: 'COMET_STREAM',
            renderLocation: 'video_channel',
            scale: 1,
            streamChainingSection: false,
            useDefaultActor: false,
            videoChainingContext: null,
            videoID: videoId,
            __relay_internal__pv__CometUFIShareActionMigrationrelayprovider: true,
            __relay_internal__pv__CometUFIReactionsEnableShortNamerelayprovider: false,
            __relay_internal__pv__StoriesLWRVariantrelayprovider: 'www_new_reactions',
        },
        doc_id: '26374037368876407',
    });
    const json = JSON.parse(res.split('\n')[0]);
    const videoInfo = json?.data?.video || {};
    return {
        id: videoInfo.videoId || videoInfo.id,
        owner: videoInfo.owner.id,
        length: videoInfo.playable_duration_in_ms / 1000,
        url: videoInfo.url || videoInfo.permalink_url,
        width: videoInfo.original_width || videoInfo.width,
        height: videoInfo.original_height || videoInfo.height,
        source:
            videoInfo.browser_native_hd_url ||
            videoInfo.playable_url_quality_hd ||
            videoInfo.browser_native_sd_url ||
            videoInfo.playable_url,
        created_time: (videoInfo.publish_time * 1000).toString(),
        thumbnail: videoInfo.preferred_thumbnail?.image?.uri,
    };
}
// #endregion

// #region files

export type IGroupFile = {
    download_url: string;
    name: string;
    post_url: string;
    creation_time: number;
    icon: string;
    file_type: string;
    owners: Array<{
        id: string;
        name: string;
        url: string;
    }>;
    cursor?: string;
};

export async function getGroupFiles({ groupId = '', cursor = '' }): Promise<IGroupFile[]> {
    const res = await fetchGraphQl({
        fb_api_req_friendly_name: 'GroupsCometFilesTabPaginationQuery',
        variables: {
            count: 15,
            cursor: cursor,
            groupDocsFileName: null,
            groupID: groupId,
            orderby: 'TIME_DESC',
            scale: 1,
            id: groupId,
        },
        doc_id: '24326962373618252',
    });
    const json = JSON.parse(res);
    const { edges = [], page_info = {} } = json?.data?.node?.group_docs_and_files || {};

    return edges.map(
        edge =>
            ({
                download_url: edge?.node?.download_url,
                name: edge?.node?.name,
                post_url: edge?.node?.original_post?.url,
                creation_time: edge?.node?.original_post?.creation_time,
                icon: edge?.node?.icon?.uri,
                file_type: edge?.node?.file_type,
                owners: edge?.node?.original_post?.actors.map(node => ({
                    id: node?.id,
                    name: node?.name,
                    url: node?.url,
                })),
                cursor: page_info?.end_cursor,
            } as IGroupFile)
    );
}

// #endregion

// #region reels

export type IReel = {
    id: string;
    created_time: number;
    description: string;
    viewCount: number | string;
    url: string;
    source: string;
    thumbnail: string;
    width: number;
    height: number;
    length: number;
    cursor: string;
};

export async function getUserReels({ id = '', cursor = '' }): Promise<IReel[]> {
    const res = await fetchGraphQl({
        fb_api_req_friendly_name: 'ProfileCometAppCollectionReelsRendererPaginationQuery',
        variables: {
            count: 10,
            cursor: cursor,
            feedLocation: 'COMET_MEDIA_VIEWER',
            feedbackSource: 65,
            focusCommentID: null,
            renderLocation: null,
            scale: 1,
            useDefaultActor: true,
            id: btoa('app_collection:' + id + ':168684841768375:260'),
        },
        doc_id: '7821270511254925',
    });

    const json = JSON.parse(res?.split('\n')?.[0] || '{}');
    const { edges = [], page_info = {} } = json?.data?.node?.aggregated_fb_shorts || {};

    return edges.map(edge => {
        const short_form_video_context =
            edge?.profile_reel_node?.node?.short_form_video_context || {};

        return {
            id:
                edge?.profile_reel_node?.node?.video?.id ||
                atob(edge?.profile_reel_node?.id).split(':').pop(),
            created_time: edge?.profile_reel_node?.node?.creation_time,
            description: edge?.profile_reel_node?.node?.message?.text,
            viewCount: short_form_video_context?.play_count_reduced,
            source:
                short_form_video_context?.playback_video?.browser_native_hd_url ||
                short_form_video_context?.playback_video?.browser_native_sd_url,
            height: short_form_video_context?.playback_video?.height,
            width: short_form_video_context?.playback_video?.width,
            thumbnail: short_form_video_context?.playback_video?.image?.uri,
            url: short_form_video_context?.shareable_url,
            length: short_form_video_context?.playback_video?.length_in_second,
            cursor: edge?.cursor || page_info.end_cursor,
        } as IReel;
    });
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
    const res = await getEntityAbout(targetUid);
    return res.raw?.data?.node?.comet_hovercard_renderer?.user?.primaryActions?.find(
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

// #region group
export enum GropuStatusStaticFilter {
    ALL_STATUSES = 'ALL_STATUSES', // Tất cả trạng thái
    UNAVAILABLE = 'UNAVAILABLE', // Bị vô hiệu hoá tài khoản
    PAGES = 'PAGES', // Trang
    INVITED = 'INVITED', // Được mời tham gia
    NEEDS_POST_APPROVAL = 'NEEDS_POST_APPROVAL', // Cần phê duyệt bài viết
    PREAPPROVED = 'PREAPPROVED', // Đã phê duyệt trước
    BLOCKED = 'BLOCKED', // Bị cấm
    MUTED = 'MUTED', // Bị đình chỉ
}
export enum GroupMembershipType {
    ALL = 'ALL',
    MEMBER = 'MEMBER',
    VISITOR = 'VISITOR',
}
export type IGroupMember = {
    id: string;
    name: string;
    avatar: string;
    // type: 'User' | 'Page';
    url: string;
    joinedTime: string;
    lastActiveTime: string;
    cursor: string;
    recent?: number;
};

export async function getGroupMembers({
    groupId,
    cursor,
    search,
    statusFilter = GropuStatusStaticFilter.ALL_STATUSES,
}: {
    groupId: string;
    cursor?: string;
    search?: string;
    statusFilter?: GropuStatusStaticFilter;
}): Promise<IGroupMember[]> {
    const res = await fetchGraphQl({
        fb_api_req_friendly_name: 'GroupsCometPeopleProfilesPaginatedListPaginationQuery',
        variables: {
            count: 10,
            cursor,
            groupID: groupId,
            membershipType: GroupMembershipType.MEMBER,
            scale: 1,
            search: search,
            statusStaticFilter: statusFilter,
            id: groupId,
        },
        doc_id: '7804285152989966',
    });
    const json = JSON.parse(res);
    console.log(json);

    const { edges = [], page_info = {} } = json?.data?.node?.people_profiles || {};
    return edges.map(edge => {
        const metas = edge?.membership?.meta_lines?.nodes || [];
        return {
            id: edge?.node?.id,
            name: edge?.node?.name,
            avatar: edge?.node?.profile_picture?.uri,
            url: edge?.node?.profile_url,
            joinedTime: metas.find(_ => _.__typename === 'GroupsProfileJoinedTimeMetaline')?.text
                ?.text,
            lastActiveTime: metas.find(
                _ => _.__typename === 'GroupsProfileLastActivityTimeMetaline'
            )?.text?.text,
            cursor: page_info?.end_cursor,
        } as IGroupMember;
    });
}

export async function getGroupMemberCount({ groupId }) {
    const res = await fetchGraphQl({
        fb_api_req_friendly_name: 'GroupsCometMembersRootQuery',
        variables: {
            groupID: groupId,
            recruitingGroupFilterNonCompliant: false,
            scale: 2,
        },
        doc_id: '26783674461231929',
    });
    const json = JSON.parse(res);
    return (
        json?.data?.group?.all_active_members?.count ||
        json?.data?.group?.group_member_profiles?.count ||
        0
    );
}

// #endregion
