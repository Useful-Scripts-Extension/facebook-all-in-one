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

let following = {
    av: '100004848287494',
    doc_id: '6639102129520155',
    variables: {
        count: 8,
        cursor: '',
        scale: 2,
        search: null,
        id: 'YXBwX2NvbGxlY3Rpb246MTAwMDA0ODQ4Mjg3NDk0OjIzNTYzMTgzNDk6MzM=', // app_collection:100004848287494:2356318349:33
    },
};

let unfollow = {
    av: '100004848287494',
    doc_id: '9941647835908867',
    variables: {
        action_render_location: 'WWW_COMET_FRIEND_MENU',
        input: {
            subscribe_location: 'FRIENDING',
            unsubscribee_id: '100002557721361',
            actor_id: '100004848287494',
            client_mutation_id: '4',
        },
        scale: 2,
    },
};

let likedPages = {
    av: '100004848287494',
    doc_id: '3678001995618153',
    variables: {
        count: 8,
        scale: 1,
        cursor: '',
        id: 'YXBwX2NvbGxlY3Rpb246MTAwMDA0ODQ4Mjg3NDk0OjI0MDk5OTcyNTQ6OTY=', // app_collection:100004848287494:2409997254:96
    },
};

let unlikePage = {
    av: '100004848287494',
    doc_id: '5358677870817645',
    variables: {
        input: {
            is_tracking_encrypted: false,
            page_id: '1592421391043334',
            source: 'page_profile',
            tracking: null,
            actor_id: '100004848287494',
            client_mutation_id: '2',
        },
        scale: 3,
    },
};

let joinedGroup = {
    av: '100004848287494',
    doc_id: '5244211935648733',
    variables: {
        count: 8,
        cursor: '',
        scale: 1,
        search: null,
        id: 'YXBwX2NvbGxlY3Rpb246MTAwMDA0ODQ4Mjg3NDk0OjIzNjE4MzE2MjI6NjY=', // app_collection:100004848287494:2361831622:66
    },
};

const ReactionId = {
    like: '1635855486666999',
    heart: '1678524932434102',
    love: '613557422527858',
    haha: '115940658764963',
    wow: '478547315650144',
    sad: '908563459236466',
    angry: '444813342392137',
};

let postReactions = {
    fb_api_caller_class: 'RelayModern',
    fb_api_req_friendly_name: 'CometUFIReactionIconTooltipContentQuery',
    variables: {
        feedbackTargetID: 'ZmVlZGJhY2s6MTA0OTUwMzUwMzAxMDk4Nw==', // feedback:1049503503010987 => post id
        reactionID: '1678524932434102',
    },
    doc_id: '6235145276554312',
};
