import { fetchExtension } from './extension';
import { fetchGraphQl, IEntityAbout, TargetType } from './facebook';

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
        type: TargetType.IGUser,
        url: `https://www.instagram.com/${user?.username}`,
        raw: json,
    };
}
export type IGReel = {
    id: string;
    type: string;
    width: number;
    height: number;

    image: string;
    video: string;

    play_count: number;
    view_count: number;
    comment_count: number;
    like_count: number;

    cursor: string;
};

export async function getInstaReels(uid = '', cursor = ''): Promise<IGReel[]> {
    const res = await fetchInstaGraphQl({
        fb_api_req_friendly_name: 'PolarisProfileReelsTabContentQuery_connection',
        variables: {
            after: cursor, // 'QVFBa2xwV0lGMm90bTRtWDRqOFFuNzRjbVI3dEUtYkhIOVJNeldJYVdYaEVFQ0ZUZ1NHTFBBMWhfcS00cF9PaGhsOHFsRThOVk04S3l0N2pGbjRkMEVoSw==',
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
    const { edges = [], page_info = {} } =
        json?.data?.xdt_api__v1__clips__user__connection_v2 || {};

    return edges.map(edge => {
        const media = edge?.node?.media || {};
        return {
            id: media.id,
            type: edge?.node?.__typename,
            width: media.original_width,
            height: media.original_height,

            image: media.image_versions2?.candidates?.sort(
                (a, b) => b.width * b.height - a.width * a.height
            )?.[0]?.url,
            video: media.video_versions?.find(_ => _.type == 101)?.url,

            comment_count: media.comment_count,
            like_count: media.like_count,
            play_count: media.play_count,
            view_count: media.view_count,

            cursor: edge?.cursor || page_info?.end_cursor,
        } as IGReel;
    });
}

export function fetchInstaGraphQl(
    params: object | string = {},
    url: string = 'https://www.instagram.com/graphql/query'
) {
    return fetchGraphQl(params, url);
}
