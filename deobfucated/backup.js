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

// https://www.facebook.com/friends
const incoming_friend_request2 = {
    fb_api_caller_class: 'RelayModern',
    fb_api_req_friendly_name: 'FriendingCometFriendRequestsGridPaginationQuery',
    variables: { count: 20, cursor: '61552550918705', scale: 2 },
    doc_id: '5073444706045886',
};

// https://www.facebook.com/friends/requests
const friend_request = {
    fb_api_caller_class: 'RelayModern',
    fb_api_req_friendly_name: 'FriendingCometFriendRequestsRootQuery',
    variables: { scale: 2 },
    doc_id: '4851458921570237',
};
const friend_request_paging = {
    fb_api_caller_class: 'RelayModern',
    fb_api_req_friendly_name: 'FriendingCometFriendRequestsSectionPanelPaginationQuery',
    variables: { count: 20, cursor: '100028909149830', scale: 2 },
    doc_id: '4843321999100134',
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

let sendFriendRequest = {
    av: '100004848287494',
    doc_id: '6294978773852692',
    variables: {
        input: {
            attribution_id_v2:
                'FriendingCometRoot.react,comet.friending,tap_tabbar,1667288605315,127814,2356318349,',
            friend_requestee_ids: ['100006975013040'],
            people_you_may_know_location: 'friends_center',
            refs: [null],
            source: 'people_you_may_know',
            warn_ack_for_ids: [],
            actor_id: '100004848287494',
            client_mutation_id: '9',
        },
        scale: 2,
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

// error
let fetchPostsOfOther = {
    av: '100004848287494',
    doc_id: '6420849601359574',
    variables: {
        UFI2CommentsProvider_commentsKey: 'ProfileCometTimelineRoute',
        afterTime: null,
        beforeTime: 1718989200,
        count: 3,
        cursor: '',
        displayCommentsContextEnableComment: null,
        displayCommentsContextIsAdPreview: null,
        displayCommentsContextIsAggregatedShare: null,
        displayCommentsContextIsStorySet: null,
        displayCommentsFeedbackContext: null,
        feedLocation: 'TIMELINE',
        feedbackSource: 0,
        focusCommentID: null,
        memorializedSplitTimeFilter: null,
        omitPinnedPost: true,
        postedBy: { group: 'OWNER' },
        privacy: { exclusivity: 'INCLUSIVE', filter: 'ALL' },
        privacySelectorRenderLocation: 'COMET_STREAM',
        renderLocation: 'timeline',
        scale: 1,
        stream_count: 1,
        taggedInOnly: false,
        useDefaultActor: false,
        id: '100006164142110',
        __relay_internal__pv__IsWorkUserrelayprovider: false,
        __relay_internal__pv__IsMergQAPollsrelayprovider: false,
        __relay_internal__pv__CometUFIIsRTAEnabledrelayprovider: false,
        __relay_internal__pv__StoriesArmadilloReplyEnabledrelayprovider: false,
        __relay_internal__pv__StoriesRingrelayprovider: false,
    },
};

let getPostComments = {
    fb_api_caller_class: 'RelayModern',
    fb_api_req_friendly_name: 'CommentListComponentsRootQuery',
    variables: {
        commentsIntentToken: 'CHRONOLOGICAL_UNFILTERED_INTENT_V1', // RANKED_FILTERED_INTENT_V1, RECENT_ACTIVITY_INTENT_V1
        feedLocation: 'DEDICATED_COMMENTING_SURFACE',
        feedbackSource: 110,
        focusCommentID: null,
        scale: 2,
        useDefaultActor: false,
        id: 'ZmVlZGJhY2s6MTQzNDU1MjU0NzE5OTQyOQ==', // feedback:1434552547199429

        // for paging
        commentsAfterCount: -1,
        commentsAfterCursor:
            'AQHRArL5_FWAc9MneaTScRmM7kalY4vV6yW7R5Yauiuh274L6n_8_LPrc0D5H45DHmISBc1cXfNqLgSql1-tYkXFyQ',
        commentsBeforeCount: null,
        commentsBeforeCursor: null,
    },
    doc_id: '7541250926002518',
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

let getPostReactionsCount = {
    fb_api_caller_class: 'RelayModern',
    fb_api_req_friendly_name: 'CometUFIReactionIconTooltipContentQuery',
    variables: {
        feedbackTargetID: 'ZmVlZGJhY2s6MTA0OTUwMzUwMzAxMDk4Nw==', // feedback:1049503503010987 => post id
        reactionID: '1678524932434102',
    },
    doc_id: '6235145276554312',
};

let addReactionToPost = {
    av: '100004848287494',
    doc_id: '5149167608480558',
    variables: {
        useDefaultActor: false,
        scale: 2,
        input: {
            client_mutation_id: '1',
            actor_id: '100004848287494',
            is_tracking_encrypted: true,
            feedback_source: 'PROFILE',
            feedback_reaction_id: '1678524932434102',
            feedback_id: 'ZmVlZGJhY2s6MzY4NzEzODgyNDgzNDg4Ng==', // feedback:3687138824834886
        },
    },
};

let upLongStory = {
    startUrl: 'https://graph.facebook.com/v2.4/100004848287494/videos',
    start: {
        file_size: 7172916,
        title: 'utomp3.com - Our Story in 1 Minute_v720P.mp4',
        upload_phase: 'start',
        access_token: '',
    },
    start_response: {
        video_id: '1492457854700947',
        start_offset: '0',
        end_offset: '1048576',
        upload_session_id: '1492457864700946',
    },

    progressUrl: 'https://graph.facebook.com/v2.4/me/videos',
    progress: {
        video_file_chunk: '(binary)',
        upload_phase: 'transfer',
        start_offset: 0,
        end_offset: 1048576,
        access_token: '',
        upload_session_id: '1492457864700946',
    },
};

let getHomeStories = {
    av: '100004848287494',
    doc_id: '4980352055338816',
    variables: {
        bucketsCount: 8,
        cursor: '',
        hideSelfBucket: true,
        scale: 1,
        id: '100004848287494',
    },
};

let userInfo = {
    url: 'https://www.facebook.com/api/graphqlbatch/',
    data: `batch_name:MessengerParticipantsFetcher,
__aaid:0,
__user:100004848287494,
__a:1,
__req:x,
__hs:19903.HYP:comet_pkg.2.1..2.1,
dpr:1,
__ccg:GOOD,
__rev:1014580163,
__s:illkb9:j5tfzq:efkdpv,
__hsi:7385998999642142127,
__dyn:7AzHK4HwBgDx-5Q1hyoyEqxd4Ag5S3G2O5U4e2C3-4UKewSAx-bwNwnof8boG4E762S1DwUx60xU8k0Z82_CxS320om78bbwto88422y11wBz822weS4oaEnxO0Bo4O2-2l2UtwxwhU31wiE567Udo5qfK0zEkxe2GexeeDwkUtxGm2SUbElxm3y3aexfxmu3W3y2616DBx_wHwdG7FoarCwLyES0Io88cA0z8c84p1e4UK2K364UrwFgbU5-269wqQ1FwgU4q3G1eKufxa3mUqwjUy2-2K,
__csr:gibb3A88lRFsh6IRlsLYSxfNJuzORSBfiPbLq-zagAAntRGPAjBAlbIpeIytrrdYDC9Hh7F5isBrsDuCGFeUV5A-uuEBdcUB-HcuQimVAuGKl4gGieB8-VFaQ9-8GnKjCAuQGChFFaybVSl6yF48h8ggXAAlavZ6iyFES-8haglzGVbz9WzkUGmm4pGzfK8z25yFF8kyEKUCdGbhVUC7F8y5UG59-m5p8tyE9E9rz8mxZ0wjAyEXx3Dz-8xrHz8rgxeu68iBUDm5E-fy47o4-48qAKaBwzwHG14x3-68lCAxfwAwWz8bobU9BKUC5Fo426UkiCyFU89VoaUeXx258oK2Cm3q7U885q1kwho-0yoK1uGdx6bwzguwFg620Q40_o4u0NXwty0p8O0Ko4i1nwa62G1bwj82qwfi024Gi04f2zo9k6UN5sU08pE1wEy1pw5Aw6rw3581kVA0gzwp8to0aEQ00DUA1fw4BwlE1g40sq0rl0be0bkw30UaEUw0OQE1Nu10w4CBw3DF5S0_o1h80gNw1Pa0a7w0Nqw5dJw2kU6fw10Si5O02go2OwaW0vmsMb8nw3i8ozU4C05xU0rmw,
__comet_req:15,
fb_dtsg:NAcNIjX9WtRxxyWE_ywRSj0zfD2JWmSnSA_jQpLR9cvXhOQQVYCs8bQ:7:1719250080,
jazoest:25588,
lsd:2l-io-0-XcTjjNl05b4Jvf,
__spin_r:1014580163,
__spin_b:trunk,
__spin_t:1719686901,
queries:{"o0":{"doc_id":"7225428284192887","query_params":{"ids":["100005086424758"]}}}`,
};

let postReactions = {
    fb_api_caller_class: 'RelayModern',
    fb_api_req_friendly_name: 'CometUFIReactionsDialogTabContentRefetchQuery',
    variables: {
        count: 10,
        feedbackTargetID: 'ZmVlZGJhY2s6ODA0MDQyNTc1MTY1MDA3',
        reactionID: null,
        scale: 1,
        id: 'ZmVlZGJhY2s6ODA0MDQyNTc1MTY1MDA3',
        __relay_internal__pv__CometUFIReactionEnableShortNamerelayprovider: true,
    },
    doc_id: '7311826188912908',
};
