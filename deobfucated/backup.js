let friends = {
    fb_api_req_friendly_name: 'ProfileCometAppCollectionListRendererPaginationQuery',
    variables: {
        count: 8,
        cursor: 'AQHRam5Sp3TPtkBdB0uFuP0PmWUDWJ1G5uK8mZM4wjD16T0o4sT0fnjSH1A2spP47tiVj_g8vwT_Er2SlygGKvD8-A',
        scale: 2,
        search: null,
        id: 'YXBwX2NvbGxlY3Rpb246MTAwMDA1MTA3NjI3MDAzOjIzNTYzMTgzNDk6MzM=', // 'app_collection:100005107627003:2356318349:33'
    },
    doc_id: 7891882717499735,
};
let friend2 = {
    fb_api_req_friendly_name: 'ProfileCometAppCollectionListRendererPaginationQuery',
    variables: {
        count: 8,
        cursor: 'AQHRX-gZhNQqShfR-QmSHwzy6IbSe2rlrlaRj0z0ZV1B5l1swGNgjRKw4N295_OFX7to',
        scale: 2,
        search: null,
        id: 'YXBwX2NvbGxlY3Rpb246MTAwMDA3NjI3NjA1NjczOjIzNTYzMTgzNDk6Mw==', // 'app_collection:100007627605673:2356318349:3'
    },
    doc_id: 7891882717499735,
};

let friendList = {
    doc_id: '4936483286421335',
    av: '100004848287494',
    dpr: 1,
    __a: 1,
    __user: '100004848287494',
    variables: { id: '100004848287494', query: '', scale: 1 },
};

let getPosts =
    'https://graph.facebook.com/v2.6/100004848287494/posts?access_token=abc&limit=1000&fields=created_time%2Ccomments.limit(0).summary(true)%2Creactions.limit(0).summary(true)&until=1680946184';

let outgoing_friend_request = {
    doc_id: '3032982086830073',
    av: '100004848287494',
    dpr: 1,
    __a: 1,
    __user: '100004848287494',
    variables: { count: 8, cursor: '100006218465758', scale: 1 },
};

let incoming_friend_request = {
    doc_id: '3387424654654854',
    av: 100004848287494,
    dpr: 1,
    __a: 1,
    __user: 100004848287494,
    variables: { count: 8, cursor: '100088240509373', scale: 1 },
};

let unfriend = {
    doc_id: '2316924651742928',
    av: '100004848287494',
    fb_api_caller_class: 'RelayModern',
    fb_api_req_friendly_name: 'FriendingCometUnfriendMutation',
    dpr: 1,
    __a: 1,
    __user: 100004848287494,
    server_timestamps: true,
    variables: {
        input: {
            source: 'bd_profile_button',
            unfriended_user_id: '510404385',
            actor_id: '100004848287494',
            client_mutation_id: 1,
        },
        scale: 1,
    },
};
