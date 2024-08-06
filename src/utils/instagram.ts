import { fetchExtension } from './extension';
import { fetchGraphQl, IEntityAbout, TargetType } from './facebook';

export function fetchInstaGraphQl(
    params: object | string = {},
    url: string = 'https://www.instagram.com/graphql/query'
) {
    return fetchGraphQl(params, url);
}

export async function getInstaUserInfo(username: string): Promise<IEntityAbout | null> {
    let res = await fetchExtension(
        'https://www.instagram.com/web/search/topsearch/?query=' + username
    );
    let json = JSON.parse(res);
    if (json.status != 'ok') throw Error('Server response error');
    const user = json?.users?.find(_ => _?.user?.username == username)?.user;
    if (!user) throw Error('Instagram user not found');

    return {
        avatar: user?.profile_pic_url,
        id: user?.id,
        name: user?.full_name || user?.username,
        igName: username,
        type: TargetType.IGUser,
        url: `https://www.instagram.com/${user?.username}`,
        raw: json,
    };
}

// #region insta reels
export type IGReel = {
    id: string;
    type: string;
    width: number;
    height: number;

    image: string;
    video: string;

    play_count: number;
    view_count: number;
    like_count: number;
    comment_count: number;

    cursor: string;
};
export async function getInstaReels(uid = '', cursor = ''): Promise<IGReel[]> {
    const res = await fetchInstaGraphQl({
        fb_api_req_friendly_name: 'PolarisProfileReelsTabContentQuery_connection',
        variables: {
            after: cursor,
            before: null,
            data: {
                include_feed_video: true,
                page_size: 12,
                target_user_id: uid,
            },
            first: 4,
            last: null,
        },
        doc_id: '7845543455542541',
    });
    const json = JSON.parse(res);
    console.log('res ne', json);
    const { edges = [], page_info = {} } = findDataObject(json) || {};
    return edges.map(edge => {
        const media = edge?.node?.media || {};
        return {
            id: media.id,
            type: edge?.node?.__typename,
            width: media.original_width,
            height: media.original_height,

            image: getBiggestUrl(media.image_versions2?.candidates),
            video: media.video_versions?.find(_ => _.type == 101)?.url,

            comment_count: media.comment_count,
            like_count: media.like_count,
            play_count: media.play_count,
            view_count: media.view_count,

            cursor: edge?.cursor || page_info?.end_cursor,
        } as IGReel;
    });
}
// #endregion

// #region insta posts
export type IGCarouselItem = {
    id: string;
    video: string;
    image: string;
};
export type IGPost = {
    id: string;
    caption: string;
    video: string;
    image: string;
    carousel: IGCarouselItem[];
    created_at: number;
    like_count: number;
    comment_count: number;
    cursor: string;
};
export async function getInstaPosts(username = '', cursor = ''): Promise<IGPost[]> {
    let json;
    if (!cursor) {
        // first fetch
        const res = await fetchInstaGraphQl({
            fb_api_req_friendly_name: 'PolarisProfilePostsDirectQuery',
            variables: {
                data: {
                    count: 12,
                    include_relationship_info: true,
                    latest_besties_reel_media: true,
                    latest_reel_media: true,
                },
                username: username,
                __relay_internal__pv__PolarisFeedShareMenurelayprovider: true,
            },
            doc_id: '7898261790222653',
        });
        json = JSON.parse(res);
        console.log('first fetch', json);
    } else {
        // cursor fetch
        const res = await fetchInstaGraphQl({
            fb_api_req_friendly_name: 'PolarisProfilePostsTabContentDirectQuery_connection',
            variables: {
                after: cursor,
                before: null,
                data: {
                    count: 12,
                    include_relationship_info: true,
                    latest_besties_reel_media: true,
                    latest_reel_media: true,
                },
                first: 12,
                last: null,
                username: username,
                __relay_internal__pv__PolarisFeedShareMenurelayprovider: true,
            },
            doc_id: '7935114066569227',
        });
        json = JSON.parse(res);
        console.log('cursor fetch', json);
    }

    const { edges = [], page_info = {} } = findDataObject(json) || {};
    return edges
        .map(edge => {
            const node = edge?.node?.media || edge?.node;
            return {
                id: node?.id,
                caption: node?.caption?.text || '',
                video: getBiggestUrl(node?.video_versions),
                image: getBiggestUrl(node?.image_versions2?.candidates),
                carousel: node?.carousel_media?.map(_ => {
                    return {
                        id: _.id,
                        video: getBiggestUrl(_.video_versions),
                        image: getBiggestUrl(_.image_versions2?.candidates),
                    };
                }),
                created_at: node?.taken_at * 1000,
                like_count: node?.like_count,
                comment_count: node?.comment_count,
                cursor: edge?.cursor || page_info?.end_cursor,
            } as IGPost;
        })
        .filter(_ => _.image || _.video);
}
// #endregion

// #region insta highlight
export type IGHighlight = {
    id: string;
    title: string;
    cover: string;
};
export async function getInstaHighlights(uid: string): Promise<IGHighlight[]> {
    const res = await fetchInstaGraphQl({
        fb_api_req_friendly_name: 'PolarisProfileStoryHighlightsTrayContentDirectQuery',
        variables: { user_id: uid },
        doc_id: '7612410165515693',
    });
    const json = JSON.parse(res);
    const { edges = [], page_info = {} } = findDataObject(json) || {};

    console.log(json);

    return edges.map(
        edge =>
            ({
                id: edge?.node?.id,
                title: edge?.node?.title,
                cover: edge?.node?.cover_media?.cropped_image_version?.url,
            } as IGHighlight)
    );
}

export async function getInstaHighlightMedias(highlightId: string): Promise<IGReel[]> {
    const res = await fetchInstaGraphQl({
        fb_api_req_friendly_name: 'PolarisStoriesV3HighlightsPageQuery',
        variables: {
            initial_reel_id: highlightId,
            reel_ids: [highlightId],
            first: 3,
            last: 2,
        },
        doc_id: '7854629807955730',
    });
    const json = JSON.parse(res);
    console.log(json);
    const { edges = [], page_info = {} } = findDataObject(json) || {};

    return edges?.[0]?.node?.items?.map(item => {
        const media = item || {};
        return {
            id: media.id,
            type: '',
            width: media.original_width,
            height: media.original_height,

            image: getBiggestUrl(media.image_versions2?.candidates),
            video: media.video_versions?.find(_ => _.type == 101)?.url,

            comment_count: media.comment_count,
            like_count: media.like_count,
            play_count: media.play_count,
            view_count: media.view_count,

            cursor: '',
        } as IGReel;
    });
}
// #endregion

function getBiggestUrl(imageOrVideo) {
    return imageOrVideo?.sort((a, b) => b.width * b.height - a.width * a.height)?.[0]?.url;
}

function findDataObject(object) {
    if (!object) return null;

    // Check if the current object has edges and page_info properties
    if (object.edges && object.page_info) {
        return object;
    }

    // Iterate through all keys in the current object
    for (let key in object) {
        // Check if the value of the key is an object
        if (typeof object[key] === 'object' && object[key] !== null) {
            // Recursively call the function with the nested object
            let found = findDataObject(object[key]);
            // If an object is found, return it
            if (found) {
                return found;
            }
        }
    }

    // Return null if no object with edges and page_info is found
    return null;
}
