class FacebookApiBase {
    constructor(e) {
        (this.facebookBaseUrl = 'https://m.facebook.com'), (this.requestAdapter = e);
    }
    setFacebookbaseUrl(e) {
        this.facebookBaseUrl = e;
    }
    setAdapter(e) {
        let c = this.requestAdapter.prefs;
        (this.requestAdapter = e), c && (this.requestAdapter.prefs = c);
    }
    requiresId() {
        if (!this.context.userId) throw new Error('ID must be set');
    }
    requiresToken() {
        if (!this.context.accessToken) throw new Error('Access Token must be set');
    }
    requiresDtsg() {
        if (!this.context.fbDtsg) throw new Error('DTSG must be set');
    }
}

class FacebookApi extends FacebookApiBase {
    constructor(e) {
        super(e);
    }
    getAdsComposerToken(e) {
        let { data: c } = this.requestAdapter.get(
                Object.assign(
                    {
                        url: 'https://www.facebook.com/ajax/bootloader-endpoint/?modules=AdsCanvasComposerDialog.react&__a=1',
                    },
                    e
                )
            ),
            t = c.match(/"access_token":"(.*?)",/);
        if (t && t[1]) return t[1];
        throw Error('Failed to get Token');
    }
    getInstagramToken(e) {
        this.requiresId();
        let c = this.getDtsg(),
            t = {
                fb_dtsg: c,
                app_id: '124024574287414',
                redirect_uri: 'fbconnect://success',
                display: 'page',
                access_token: '',
                from_post: '1',
                return_format: 'access_token',
                domain: '',
                sso_device: 'ios',
                _CONFIRM: '1',
                _user: this.context.userId,
            },
            a = this.requestAdapter.post(
                Object.assign(
                    Object.assign(
                        {
                            url: 'https://www.facebook.com/v1.0/dialog/oauth/confirm',
                        },
                        e
                    ),
                    {
                        headers: Object.assign(
                            {
                                'content-type': 'application/x-www-form-urlencoded',
                                'user-agent': n.DESKTOP_USER_AGENT,
                                origin: 'https://www.facebook.com',
                                referer: 'https://www.facebook.com',
                                Dpr: '2',
                            },
                            null == e ? void 0 : e.headers
                        ),
                        data: (null == e ? void 0 : e.data) || new URLSearchParams(t).toString(),
                    }
                )
            ),
            r = a.data.match(/access_token=(.*)(?=&data_access_expiration_time)/);
        if (r && r[1]) return (this.context.accessToken = r[1]), r[1];
        throw Error('FAILED_RETRIEVING_TOKEN');
    }
    getDtsg(e = !1) {
        if (this.context.fbDtsg && !e) return this.context.fbDtsg;
        let { data: c } = this.requestAdapter.get({
                url: `${this.facebookBaseUrl}/home.php`,
                headers: {
                    Accept: 'text/html',
                },
            }),
            t = '';
        return (
            (t = this.context.fbDtsgRegex
                ? c.match(this.context.fbDtsgRegex)[1]
                : c.match(/"dtsg":{"token":"([^"]+)"/)[1]),
            (this.context.fbDtsg = t),
            t
        );
    }
    setUserAgent(e) {
        this.requestAdapter.setDefaultHeaders(
            Object.assign(Object.assign({}, this.requestAdapter.prefs.defaultHeaders), {
                'user-agent': e,
            })
        );
    }
}

class GraphQL extends FacebookApi {
    constructor(e) {
        super(e);
        this.graphApiBase = 'https://graph.facebook.com';
        this.context = {};
    }
    getProfile(e) {
        return this.graphAPI(e, {});
    }
    getFriends(e) {
        return this.graphQl('4936483286421335', {
            id: e,
            query: '',
            scale: 1,
        }).then(e =>
            e.data.user.friends.edges.map(e => {
                let c = Object.assign({}, e.node);
                return c;
            })
        );
    }
    setAvatarShieldState(e, c) {
        return this.graphQl('2456027404479550', {
            input: {
                is_shielded: c,
                actor_id: e,
                session_id: (0, n.randomString)(24),
                client_mutation_id: '1001' + (10 + 80 * Math.random()),
            },
        });
    }
    getSentFriendRequests(e = 8, c = '') {
        return this.graphQl('3032982086830073', {
            count: e,
            cursor: c,
            scale: 1.5,
        }).then(e => e.data.viewer.outgoing_friend_requests_connection);
    }
    getVideoInfoLegacy(e) {
        let c = this.requestAdapter.get({
            url: `https://graph-video.facebook.com/${e}`,
            params: {
                access_token: this.context.accessToken,
                fields: 'source,picture',
            },
        });
        return JSON.parse(c);
    }
    getFriendRequests(e = 8, c = '') {
        let t = this.graphQl('3387424654654854', {
            count: e,
            cursor: c,
            scale: 2,
        });
        return t.data.viewer.friending_possibilities;
    }
    acceptFriendRequest(e) {
        return this.graphQl('3750307704981867', {
            input: {
                friend_requester_id: e,
                source: 'friends_tab',
                actor_id: 'me',
                client_mutation_id: '19',
            },
            scale: 2,
            refresh_num: 0,
        });
    }
    declineFriendRequest(e) {
        return this.graphQl('4189738374386264', {
            input: {
                friend_requester_id: e,
                source: 'friends_tab',
                actor_id: 'me',
                client_mutation_id: '20',
            },
            scale: 2,
            refresh_num: 0,
        });
    }
    graphApiLoadPostComments() {}
    postReelVideo(e, c = '') {
        let t =
                (0, n.makeGUID)(8) +
                '-' +
                (0, n.makeGUID)(4) +
                '-' +
                (0, n.makeGUID)(4) +
                '-' +
                (0, n.makeGUID)(4) +
                '-' +
                (0, n.makeGUID)(12),
            a =
                (0, n.makeGUID)(8) +
                '-' +
                (0, n.makeGUID)(4) +
                '-' +
                (0, n.makeGUID)(4) +
                '-' +
                (0, n.makeGUID)(4) +
                '-' +
                (0, n.makeGUID)(12);
        return this.graphQl('3361164650605194', {
            image_low_height: 2048,
            image_medium_width: 540,
            automatic_photo_captioning_enabled: 'false',
            angora_attachment_profile_image_size: 110,
            poll_facepile_size: 110,
            default_image_scale: '3',
            image_high_height: 2048,
            image_large_aspect_height: 565,
            image_low_width: 360,
            image_medium_height: 2048,
            include_mentions_messenger_sharing_params: !0,
            media_type: 'image/jpeg',
            size_style: 'contain-fit',
            image_high_width: 1080,
            input: {
                video_start_time_ms: 0,
                producer_supported_features: ['LIGHTWEIGHT_REPLY'],
                tag_expansion_metadata: {
                    tag_expansion_ids: [],
                },
                place_attachment_setting: 'SHOW_ATTACHMENT',
                past_time: {
                    time_since_original_post: 0,
                },
                message: {
                    text: c,
                },
                logging: {
                    composer_session_id: a,
                },
                camera_post_context: {
                    source: 'CAMERA_SYSTEM',
                    platform: 'FACEBOOK',
                    deduplication_id: a,
                },
                connection_class: 'EXCELLENT',
                is_welcome_to_group_post: !1,
                is_throwback_post: 'NOT_THROWBACK_POST',
                is_boost_intended: !1,
                reshare_original_post: 'SHARE_LINK_ONLY',
                idempotence_token: 'FEED_' + a,
                inspiration_prompts: [
                    {
                        prompt_type: 'MANUAL',
                        prompt_tracking_string: '0',
                        prompt_id: '1752514608329267',
                    },
                ],
                is_tags_user_selected: !1,
                composer_entry_picker: 'camera',
                fb_shorts: {
                    remix_status: 'NOT_APPLICABLE',
                    is_fb_short: !0,
                    dsc_deal_id: null,
                    aggregation_attribution_source_id: null,
                },
                composer_type: 'reels',
                composer_source_surface: 'short_form_video',
                implicit_with_tags_ids: [],
                composer_entry_point: 'tap_creation_button_in_short_form_video_profile_reels_tab',
                client_mutation_id: t,
                audiences: [
                    {
                        undirected: {
                            privacy: {
                                tag_expansion_state: 'UNSPECIFIED',
                                deny: [],
                                base_state: 'EVERYONE',
                                allow: [],
                            },
                        },
                    },
                ],
                is_thanks_group_post: !1,
                source: 'MOBILE',
                actor_id: this.context.userId,
                audiences_is_complete: !0,
                attachments: [
                    {
                        video: {
                            notify_when_processed: !1,
                            id: e,
                        },
                    },
                ],
                action_timestamp: ~~(new Date().getTime() / 1e3),
                composer_session_events_log: {
                    number_of_keystrokes: 0,
                    number_of_copy_pastes: 0,
                    composition_duration: 0,
                },
                looking_for_players: {
                    selected_game: '',
                },
                is_group_linking_post: !1,
            },
            poll_voters_count: 5,
            action_location: 'feed',
            include_image_ranges: !0,
            profile_image_size: 110,
            reading_attachment_profile_image_height: 371,
            bloks_version: (0, n.makeGUID)(20),
            image_large_aspect_width: 1080,
            reading_attachment_profile_image_width: 248,
            profile_pic_media_type: 'image/x-auto',
            question_poll_count: 100,
            angora_attachment_cover_image_size: 1320,
            fetch_fbc_header: !0,
        });
    }
    postVideoStory(e, c) {
        let t = (0, n.randomMutationId)(),
            a = (0, n.randomMutationId)(),
            r = (0, n.randomMutationId)();
        return this.graphQl(
            '3361164650605194',
            {
                client_mutation_id: t,
                actor_id: e,
                input: {
                    actor_id: e,
                    client_mutation_id: a,
                    source: 'WWW',
                    audiences: [
                        {
                            stories: {
                                self: {
                                    target_id: e,
                                },
                            },
                        },
                    ],
                    logging: {
                        composer_session_id: r,
                        ref: 'feedx_sprouts',
                    },
                    with_tags_ids: [],
                    multilingual_translations: [],
                    camera_post_context: {
                        deduplication_id: r,
                        source: 'composer',
                    },
                    composer_source_surface: 'newsfeed',
                    composer_entry_point: 'feedx_sprouts',
                    composer_entry_time: 170,
                    composer_session_events_log: {
                        composition_duration: 15,
                    },
                    composer_type: 'feedx_sprouts',
                    branded_content_data: {},
                    direct_share_status: 'NOT_SHARED',
                    sponsor_relationship: 'WITH',
                    web_graphml_migration_params: {
                        target_type: 'feed',
                        xhpc_composerid: 'rc.u_fetchstream_41_4',
                        xhpc_context: 'profile',
                        xhpc_publish_type: 'FEED_INSERT',
                        waterfall_id: r,
                    },
                    external_movie_data: {},
                    place_attachment_setting: 'HIDE_ATTACHMENT',
                    attachments: [
                        {
                            video: {
                                id: c,
                                notify_when_processed: !0,
                            },
                        },
                    ],
                },
            },
            {}
        );
    }
    getProfileVideos(e, c = '') {
        return this.graphQl('3975496529227403', {
            count: 8,
            cursor: c,
            scale: 1,
            id: (0, n.safeBase64Encode)(`app_collection:${e}:1560653304174514:133`),
        }).then(e => e.data.node.pageItems);
    }
    createVideoUploadChunk(e, c, t) {
        this.requiresToken();
        let a = this.context.accessToken;
        return this.graphAPI(`v2.4/${e}/videos`, {
            file_size: c,
            title: t,
            upload_phase: 'start',
            access_token: a,
        });
    }
    deletePosts(e) {
        return (
            this.requiresId(),
            this.graphQl('5178842672166603', {
                input: {
                    action: 'MOVE_TO_TRASH',
                    category_key: 'MANAGEYOURPOSTS',
                    render_location: 'ACTIVITY_LOG',
                    story_ids: e,
                    transaction_id: '1657623306876',
                    actor_id: this.context.userId,
                    client_mutation_id: '1',
                },
            })
        );
    }
    moveToTrash(e) {
        return (
            this.requiresId(),
            this.graphQl('5962446683854959', {
                input: {
                    story_id: (0, n.safeBase64Encode)(`S:_I${this.context.userId}:${e}:${e}`),
                    story_location: 'TIMELINE',
                    actor_id: this.context.userId,
                    client_mutation_id: '1',
                },
            })
        );
    }
    getFollowers(e, c = '', t = 8) {
        let { data: a } = this.graphQl('3506925852733151', {
            count: t,
            cursor: c,
            scale: 1.5,
            search: null,
            id: (0, n.safeBase64Encode)(`app_collection:${e}:2356318349:33`),
        });
        return a.data.node.pageItems;
    }
    followUser(e) {
        return (
            this.requiresId(),
            this.graphQl(
                '4451435638222552',
                {
                    input: {
                        is_tracking_encrypted: !1,
                        subscribe_location: 'PROFILE',
                        subscribee_id: e,
                        tracking: null,
                        actor_id: this.context.userId,
                        client_mutation_id: '3',
                    },
                    scale: 1.5,
                },
                {
                    additionalParams: {
                        fb_api_caller_class: 'RelayModern',
                        fb_api_req_friendly_name: 'CometUserFollowMutation',
                    },
                }
            )
        );
    }
    cancelSentFriendRequest(e) {
        return (
            this.requiresId(),
            this.graphQl('3226051994092510', {
                input: {
                    cancelled_friend_requestee_id: e,
                    source: 'manage_outgoing_requests',
                    actor_id: this.context.userId,
                    client_mutation_id: '5',
                },
                scale: 1.5,
            })
        );
    }
    loadStoryByTime(e, c) {
        let t = this.graphQl('5928783027132009', {
                lower_bound_time: e,
                upper_bound_time: c,
                scale: 1,
                blur: null,
                shouldEnableLiveInStoriesDropdown: !1,
                shouldEnableLiveInStories: !0,
                isStoryCommentingEnabled: !1,
                feedbackSource: 65,
                displayCommentsContextIsStorySet: !1,
                useDefaultActor: !1,
                displayCommentsFeedbackContext: null,
                displayCommentsContextEnableComment: !0,
                displayCommentsContextIsAggregatedShare: !1,
                displayCommentsContextIsAdPreview: !1,
                feedLocation: 'COMET_MEDIA_VIEWER',
                focusCommentID: null,
                UFI2CommentsProvider_commentsKey: 'StoriesArchiveContentPaneRoot',
            }),
            a = t.data;
        return (
            'string' == typeof a && (a = JSON.parse(t.data.split('\n')[0])),
            a.data.viewer.stories_data.story_archive.cards
        );
    }
    getStoriesBuckets(e, c = !0, t = '') {
        return this.graphQl('4980352055338816', {
            bucketsCount: e,
            cursor: t,
            hideSelfBucket: c,
            scale: 1,
            id: this.context.userId || 4,
        })
            .then(e => e.data.node.unified_stories_buckets)
            .catch(e => {
                throw (console.error(e), Error('LOAD_BUCKETS_ERROR'));
            });
    }
    getNewsfeed(e = 10, c = '') {
        return this.graphQl('4789735617816593', {
            count: e,
            cursor: c,
            feedLocation: 'NEWSFEED',
            orderby: ['TOP_STORIES'],
            scale: 2,
            useDefaultActor: !1,
        }).then(e => {
            let c = e.split('\n').map(e => JSON.parse(e)),
                t = c.find(
                    e =>
                        'CometNewsFeed_viewer$defer$CometNewsFeed_viewer_news_feed$page_info' ===
                        e.label
                ),
                a = t.data.page_info;
            return (
                c.filter(e => e && (e.data.viewer || 'ORGANIC' === e.data.category)),
                {
                    posts: c
                        .map(e => {
                            var c, t, a, r;
                            return e.data.viewer
                                ? null ===
                                      (t =
                                          null === (c = e.data.viewer.news_feed.edges[0].node) ||
                                          void 0 === c
                                              ? void 0
                                              : c.feedback) || void 0 === t
                                    ? void 0
                                    : t.id
                                : null ===
                                      (r =
                                          null === (a = e.data.node) || void 0 === a
                                              ? void 0
                                              : a.feedback) || void 0 === r
                                ? void 0
                                : r.id;
                        })
                        .filter(e => e),
                    page_info: a,
                }
            );
        });
    }
    reactPost(e, c, t = 'NEWS_FEED') {
        this.requiresId();
        let a = {
            useDefaultActor: !1,
            scale: 2,
            input: {
                client_mutation_id: '1',
                actor_id: this.context.userId,
                is_tracking_encrypted: !0,
                feedback_source: t,
                feedback_reaction_id: `${c}`,
                feedback_id: e,
            },
        };
        return this.graphQl('5149167608480558', a);
    }
    postComment(e, c, t, r = 'PROFILE') {
        -1 !== c.indexOf('_') && (c = c.split('_')[1]);
        let a = this.graphQl('5112758175433174', {
            feedLocation: 'NEWS_FEED' === r ? 'NEWSFEED' : 'TIMELINE',
            feedbackSource: 'NEWS_FEED' === r ? 1 : 0,
            focusCommentID: null,
            includeNestedComments: !1,
            input: {
                attachments: null,
                feedback_id: 'NEWS_FEED' === r ? c : (0, n.safeBase64Encode)(`feedback:${c}`),
                message: {
                    ranges: [],
                    text: t,
                },
                is_tracking_encrypted: !0,
                feedback_source: r,
                actor_id: e,
                client_mutation_id: '4',
            },
            scale: 2,
            useDefaultActor: !1,
            UFI2CommentsProvider_commentsKey:
                'NEWS_FEED' === r ? 'CometModernHomeFeedQuery' : 'ProfileCometTimelineRoute',
        });
        return a.data;
    }
    getArchivedStories(e, c = 8, t = '') {
        let a = this.graphQl('2474284976008135', {
            count: c,
            cursor: t,
            scale: 1.5,
            id: (0, n.safeBase64Encode)(`app_collection:${e}:235134840312703:175`),
        });
        return a.data.node.pageItems;
    }
    getStoriesBucketsData(e) {
        var c;
        let t = this.graphQl('2913003758722672', {
                bucketIDs: e,
                scale: 1,
                prefetchPhotoUri: !1,
            }),
            a = null === (c = t.data) || void 0 === c ? void 0 : c.nodes;
        if (a) return a;
        throw Error('PARSE_BUCKETS_ERROR');
    }
    getStoryBucketPreview(e, c) {
        return (
            this.requiresId(),
            this.graphQl('5127393270671537', {
                input: {
                    bucket_id: e,
                    story_id: c,
                    actor_id: this.context.userId,
                    client_mutation_id: 30,
                },
                scale: 1,
            }).then(e => e.data.direct_message_thread_update_seen_state.bucket)
        );
    }
    getStoryBucketWithFeedback(e) {
        return this.graphQl('6572391022883318', {
            UFI2CommentsProvider_commentsKey: 'StoriesSuspenseContentPaneRootWithEntryPointQuery',
            blur: 10,
            bucketID: e,
            displayCommentsContextEnableComment: !0,
            displayCommentsContextIsAdPreview: !1,
            displayCommentsContextIsAggregatedShare: !1,
            displayCommentsContextIsStorySet: !1,
            displayCommentsFeedbackContext: null,
            feedbackSource: 65,
            feedLocation: 'COMET_MEDIA_VIEWER',
            focusCommentID: null,
            initialLoad: !1,
            isStoryCommentingEnabled: !1,
            initialBucketID: e,
            scale: 1,
            shouldDeferLoad: !1,
            shouldEnableArmadilloStoryReply: !1,
            shouldEnableLiveInStories: !0,
            __relay_internal__pv__StoriesIsCommentEnabledrelayprovider: !1,
            __relay_internal__pv__StoriesIsContextualReplyDisabledrelayprovider: !0,
            __relay_internal__pv__StoriesIsShareToStoryEnabledrelayprovider: !1,
            __relay_internal__pv__StoriesRingrelayprovider: !1,
            __relay_internal__pv__StoriesLWRVariantrelayprovider: 'www_new_reactions',
        }).then(e => ('object' == typeof e ? e : JSON.parse(e.split('\n')[0])));
    }
    reactStory(e, c) {
        return (
            this.requiresId(),
            this.graphQl('2551662911531159', {
                input: {
                    lightweight_reaction_actions: {
                        offsets: [0],
                        reaction: c,
                    },
                    message: '',
                    story_id: e,
                    story_reply_type: 'LIGHT_WEIGHT',
                    actor_id: this.context.userId,
                    client_mutation_id: '2',
                },
            })
        );
    }
    getAccountBucketInfo(e) {
        let c = this.getProfileHeaderInfo(e);
        return JSON.parse(
            c.split('\n').find(e => e.includes('ProfileCometProfilePictureContainer'))
        ).data.story_bucket.nodes;
    }
    getProfileHeaderInfo(e) {
        return this.graphQl('4192155837522535', {
            scale: 1,
            userID: e,
            useIncrementalDelivery: !0,
        });
    }
    postTimeline(e, c = '', t = 'SELF', a = [], r = [], n = null) {
        let o = [];
        return (
            a.forEach(e => {
                o.push({
                    photo: {
                        id: e,
                    },
                });
            }),
            r.forEach(e => {
                o.push({
                    video: {
                        id: e,
                        notify_when_processed: !0,
                    },
                });
            }),
            n &&
                o.push({
                    link: {
                        share_scrape_data: n.share_scrape_data,
                    },
                }),
            this.graphQl('4369847706457679', {
                input: {
                    composer_entry_point: 'inline_composer',
                    composer_source_surface: 'timeline',
                    source: 'WWW',
                    attachments: o,
                    audience: {
                        privacy: {
                            allow: [],
                            base_state: t.toUpperCase(),
                            deny: [],
                            tag_expansion_state: 'UNSPECIFIED',
                        },
                    },
                    message: {
                        ranges: [],
                        text: c,
                    },
                    with_tags_ids: [],
                    inline_activities: [],
                    explicit_place_id: '0',
                    text_format_preset_id: '0',
                    actor_id: e,
                    client_mutation_id: '1',
                },
                feedLocation: 'TIMELINE',
                feedbackSource: 0,
                gridMediaWidth: 230,
                gridImageHeight: 420,
                gridImageWidth: 420,
                scale: 1.5,
                privacySelectorRenderLocation: 'COMET_STREAM',
                renderLocation: 'timeline',
                useDefaultActor: !1,
                inviteShortLinkKey: null,
                isFeed: !1,
                isFundraiser: !1,
                isFunFactPost: !1,
                isGroup: !1,
                isTimeline: !0,
                isSocialLearning: !1,
                isPageNewsFeed: !1,
                isProfileReviews: !1,
                isWorkSharedDraft: !1,
                UFI2CommentsProvider_commentsKey: 'ProfileCometTimelineRoute',
                useCometPhotoViewerPlaceholderFrag: !0,
                hashtag: null,
                canUserManageOffers: !1,
            })
        );
    }
    getLinkPreview(e) {
        let c = this.graphQl(
            '6532276176846627',
            {
                feedLocation: 'FEED_COMPOSER',
                focusCommentID: null,
                goodwillCampaignId: '',
                goodwillCampaignMediaIds: [],
                goodwillContentType: null,
                params: {
                    url: e,
                },
                privacySelectorRenderLocation: 'COMET_COMPOSER',
                renderLocation: 'composer_preview',
                parentStoryID: null,
                scale: 1.5,
                useDefaultActor: !1,
                shouldIncludeStoryAttachment: !1,
            },
            {
                additionalParams: {
                    fb_api_caller_class: 'RelayModern',
                    fb_api_req_friendly_name: 'ComposerLinkAttachmentPreviewQuery',
                },
            }
        );
        return c.data.link_preview;
    }
    getSinglePostContent(e) {
        let c = this.graphQl(
            '4633209070111168',
            {
                UFI2CommentsProvider_commentsKey: 'CometSinglePostRoute',
                displayCommentsContextEnableComment: null,
                displayCommentsContextIsAdPreview: null,
                displayCommentsContextIsAggregatedShare: null,
                displayCommentsContextIsStorySet: null,
                displayCommentsFeedbackContext: null,
                feedbackSource: 2,
                feedLocation: 'PERMALINK',
                focusCommentID: null,
                privacySelectorRenderLocation: 'COMET_STREAM',
                renderLocation: 'permalink',
                scale: 1,
                storyID: e,
                useDefaultActor: !1,
            },
            {
                additionalParams: {
                    fb_api_caller_class: 'RelayModern',
                    fb_api_req_friendly_name: 'CometSinglePostContentQuery',
                },
            }
        );
        return c.data.node;
    }
    getGroupFriendMembers(e, c = '', t = 10) {
        let a = this.graphQl('6895406627151312', {
            count: t,
            cursor: c,
            groupID: e,
            scale: 1,
            id: e,
        });
        return a.data.node.group_friend_members;
    }
    getProfilePhotos(e, c = 8, t = '') {
        let a = this.graphQl(
            '4820192058049838',
            {
                count: c,
                cursor: t,
                scale: 1,
                id: (0, n.safeBase64Encode)(`app_collection:${e}:2305272732:5`),
            },
            {
                additionalParams: {
                    fb_api_caller_class: 'RelayModern',
                    fb_api_req_friendly_name:
                        'ProfileCometAppCollectionPhotosRendererPaginationQuery',
                },
            }
        );
        return a.data.node.pageItems;
    }
    deleteProfilePhoto(e, c) {
        return this.graphQl(
            '4856541607725971',
            {
                feedLocation: 'COMET_MEDIA_VIEWER',
                focusCommentID: null,
                input: JSON.stringify({
                    photo_id: c,
                    actor_id: e,
                    client_mutation_id: '1',
                }),
                isProfilePic: !1,
                scale: 1,
                renderLocation: null,
                privacySelectorRenderLocation: 'COMET_MEDIA_VIEWER',
                useDefaultActor: !1,
            },
            {
                additionalParams: {
                    fb_api_caller_class: 'RelayModern',
                    fb_api_req_friendly_name: 'CometMediaViewerPhotoDeleteActionMutation',
                },
            }
        );
    }
    getPhotoContent(e, c) {
        let t = this.graphQl('5062018580499113', {
                isMediaset: !0,
                renderLocation: 'permalink',
                nodeID: e,
                mediasetToken: c,
                scale: 1,
                displayCommentsFeedbackContext: null,
                displayCommentsContextEnableComment: null,
                displayCommentsContextIsAdPreview: null,
                displayCommentsContextIsAggregatedShare: null,
                displayCommentsContextIsStorySet: null,
                feedLocation: 'COMET_MEDIA_VIEWER',
                feedbackSource: 65,
                focusCommentID: null,
                glbFileURIHackToRenderAs3D_DO_NOT_USE: null,
                privacySelectorRenderLocation: 'COMET_MEDIA_VIEWER',
                useDefaultActor: !1,
                UFI2CommentsProvider_commentsKey: 'CometPhotoRootQuery',
            }),
            a = JSON.parse(t.data.split('\n')[0]);
        return a.data.currMedia;
    }
    setPhotoPrivacy(e, c, t = 'SELF', a = [], r = []) {
        return this.graphQl(
            '4879007762150284',
            {
                input: {
                    privacy_mutation_token: null,
                    privacy_row_input: {
                        allow: r,
                        base_state:
                            a.length && r.length
                                ? 'SELF'
                                : a.length
                                ? 'FRIENDS'
                                : r.length
                                ? 'SELF'
                                : t,
                        deny: a,
                        tag_expansion_state: 'UNSPECIFIED',
                    },
                    privacy_write_id: (0, n.safeBase64Encode)(`privacy_scope_renderer:{'id':${c}}`),
                    render_location: 'COMET_MEDIA_VIEWER',
                    actor_id: e,
                    client_mutation_id: '10',
                },
                privacySelectorRenderLocation: 'COMET_MEDIA_VIEWER',
                scale: 1,
                storyRenderLocation: null,
                tags: null,
            },
            {
                additionalParams: {
                    fb_api_caller_class: 'RelayModern',
                    fb_api_req_friendly_name: 'CometPrivacySelectorSavePrivacyMutation',
                },
            }
        );
    }
    getTimelineTaggedPostsReview(e = '', c = 3) {
        let t = this.graphQl(
                '4734064746673071',
                {
                    UFI2CommentsProvider_commentsKey: 'ProfileCometTimelineReviewUnits',
                    count: c,
                    cursor: e,
                    displayCommentsContextEnableComment: null,
                    displayCommentsContextIsAdPreview: null,
                    displayCommentsContextIsAggregatedShare: null,
                    displayCommentsContextIsStorySet: null,
                    displayCommentsFeedbackContext: null,
                    feedLocation: 'TIMELINE',
                    feedbackSource: 0,
                    filter: 'FRIENDS',
                    focusCommentID: null,
                    privacySelectorRenderLocation: 'COMET_STREAM',
                    renderLocation: 'homepage_stream',
                    scale: 1,
                    useDefaultActor: !1,
                },
                {
                    additionalParams: {
                        fb_api_caller_class: 'RelayModern',
                        fb_api_req_friendly_name: 'CometTimelineReviewUnitsViewQuery',
                    },
                }
            ),
            a = JSON.parse(t.split('\n')[0]);
        return a.data.viewer.timeline_review.units;
    }
    removePostTag(e, c, t) {
        return this.graphQl(
            '6932416570164732',
            {
                input: {
                    context: {
                        support_type: 'chevron',
                        type: 4,
                        story_location: 'profile_someone_else',
                        entry_point: 'chevron_button',
                        story_permalink_token: `S:_I${c}:${t}`,
                    },
                    type: 'UNTAG',
                    actor_id: e,
                    client_mutation_id: '2',
                },
                scale: 1,
            },
            {
                additionalParams: {
                    fb_api_caller_class: 'RelayModern',
                    fb_api_req_friendly_name: 'CometFeedStoryExecuteNFXActionMutation',
                },
            }
        );
    }
    replyStory(e, c) {
        return (
            this.requiresId(),
            this.graphQl(
                '3769885849805751',
                {
                    input: {
                        message: e,
                        story_id: c,
                        story_reply_type: 'TEXT',
                        actor_id: this.context.userId,
                        client_mutation_id: '6',
                    },
                },
                {
                    additionalParams: {
                        fb_api_caller_class: 'RelayModern',
                        fb_api_req_friendly_name: 'useStoriesSendReplyMutation',
                    },
                }
            )
        );
    }
    sendMessage(e, c, t = [], r = !1, n = !1) {
        let a = Array.isArray(e),
            o = new FormData();
        return (
            r
                ? o.append('tids', `cid.g.${e}`)
                : a
                ? e.forEach(e => o.append(`ids[${e}]`, e))
                : o.append(`ids[${e}]`, e),
            o.append('body', n ? '' : c),
            n && o.append('sticker_id', c),
            o.append('waterfall_source', 'message'),
            o.append('fb_dtsg', this.getDtsg()),
            n || t.forEach(e => o.append(`photo_ids[${e}]`, e)),
            this.requestAdapter.post({
                url: 'https://m.facebook.com/messages/send/?icm=1&refid=12&ref=dbl',
                data: o,
                headers: {
                    origin: 'https://m.facebook.com',
                    referer: 'https://m.facebook.com',
                    'content-type': 'multipart/form-data',
                },
            })
        );
    }
    getReelVideoInfo(e) {
        return this.graphQl('5279476072161634', {
            UFI2CommentsProvider_commentsKey: 'CometTahoeSidePaneQuery',
            caller: 'CHANNEL_VIEW_FROM_PAGE_TIMELINE',
            displayCommentsContextEnableComment: null,
            displayCommentsContextIsAdPreview: null,
            displayCommentsContextIsAggregatedShare: null,
            displayCommentsContextIsStorySet: null,
            displayCommentsFeedbackContext: null,
            feedbackSource: 41,
            feedLocation: 'TAHOE',
            focusCommentID: null,
            privacySelectorRenderLocation: 'COMET_STREAM',
            renderLocation: 'video_channel',
            scale: 1,
            streamChainingSection: !1,
            useDefaultActor: !1,
            videoChainingContext: null,
            videoID: e,
        });
    }
    getPostReactors(e) {
        try {
            let c;
            let t = [],
                a = null,
                r = this.graphQl('6443454529016333', {
                    feedbackTargetID: e,
                    scale: 2,
                });
            for (
                t.push(
                    ...r.data.node.reactors.edges.map(e => ({
                        id: e.node.id,
                        name: e.node.name,
                    }))
                ),
                    (c = r.data.node.reactors.page_info.has_next_page) &&
                        (a = r.data.node.reactors.page_info.end_cursor);
                c;

            ) {
                let r = this.graphQl('5772264139493719', {
                    feedbackTargetID: e,
                    cursor: a,
                    count: 10,
                    reactionID: null,
                    scale: 2,
                    id: e,
                });
                t.push(
                    ...r.data.node.reactors.edges.map(e => ({
                        id: e.node.id,
                        name: e.node.name,
                    }))
                ),
                    (c = r.data.node.reactors.page_info.has_next_page) &&
                        (a = r.data.node.reactors.page_info.end_cursor);
            }
        } catch (e) {
            return '';
        }
    }
    convertStoryIdToPostId(e) {
        this.requiresId();
        let { data: c } = this.requestAdapter.post({
            url: 'https://www.facebook.com/api/graphql/',
            data: {
                av: this.context.userId,
                fb_dtsg: this.getDtsg(),
                q: `node(${e}){id}`,
            },
        });
        return Object.keys(JSON.parse(c))[0];
    }
    getPosts(e, c, t) {
        var r;
        let a = this.graphQl('6420849601359574', {
            UFI2CommentsProvider_commentsKey: 'ProfileCometTimelineRoute',
            afterTime: null,
            beforeTime: e,
            count: 3,
            cursor: t,
            displayCommentsContextEnableComment: null,
            displayCommentsContextIsAdPreview: null,
            displayCommentsContextIsAggregatedShare: null,
            displayCommentsContextIsStorySet: null,
            displayCommentsFeedbackContext: null,
            feedLocation: 'TIMELINE',
            feedbackSource: 0,
            focusCommentID: null,
            memorializedSplitTimeFilter: null,
            omitPinnedPost: !0,
            postedBy: {
                group: 'OWNER',
            },
            privacy: {
                exclusivity: 'INCLUSIVE',
                filter: 'ALL',
            },
            privacySelectorRenderLocation: 'COMET_STREAM',
            renderLocation: 'timeline',
            scale: 1,
            stream_count: 1,
            taggedInOnly: !1,
            useDefaultActor: !1,
            id: c,
            __relay_internal__pv__IsWorkUserrelayprovider: !1,
            __relay_internal__pv__IsMergQAPollsrelayprovider: !1,
            __relay_internal__pv__CometUFIIsRTAEnabledrelayprovider: !1,
            __relay_internal__pv__StoriesArmadilloReplyEnabledrelayprovider: !1,
            __relay_internal__pv__StoriesRingrelayprovider: !1,
        });
        return null === (r = JSON.parse(a.split('\n')[0]).data) || void 0 === r
            ? void 0
            : r.node.timeline_list_feed_units.edges[0];
    }
    getFriendArticles(e, c, t = this.context.userId, r) {
        let a,
            n = '',
            o = [],
            l = 0;
        do {
            let e = this.getPosts(c, t, n);
            (o = [...o, e.node.feedback]),
                (n = e.cursor),
                (a =
                    e.node.comet_sections.content.story.comet_sections.context_layout.story
                        .comet_sections.metadata[0].story.creation_time),
                l++;
        } while (e <= a && l < r);
        return o;
    }
    getActivityLog(e, c = null) {
        return this.graphQl('9696359377101461', {
            activity_history: !0,
            audience: null,
            ayi_taxonomy: !1,
            category: 'LIKEDPOSTS',
            category_key: 'LIKEDPOSTS',
            count: 25,
            cursor: c,
            entry_point: null,
            media_content_filters: [],
            month: null,
            person_id: null,
            privacy: 'NONE',
            scale: 2,
            timeline_visibility: 'STORY',
            year: null,
            id: e,
        }).then(e => e.split('\n'));
    }
    unfollowFriend(e) {
        return (
            this.requiresId(),
            this.graphQl('9941647835908867', {
                action_render_location: 'WWW_COMET_FRIEND_MENU',
                input: {
                    subscribe_location: 'FRIENDING',
                    unsubscribee_id: e,
                    actor_id: this.context.userId,
                    client_mutation_id: '4',
                },
                scale: 2,
            })
        );
    }
    getFollowing(e) {
        this.requiresId();
        let c = this.graphQl('6639102129520155', {
            count: 8,
            cursor: e,
            scale: 2,
            search: null,
            id: (0, n.safeBase64Encode)(`app_collection:${this.context.userId}:2356318349:33`),
        });
        return c.data.node.pageItems;
    }
    setPostPrivacy(e, c) {
        return this.graphQl('6246595918796717', {
            input: {
                privacy_mutation_token: null,
                privacy_row_input: {
                    allow: [],
                    base_state: c,
                    deny: [],
                    tag_expansion_state: 'UNSPECIFIED',
                },
                privacy_write_id: e,
                render_location: 'COMET_STREAM',
                actor_id: this.context.userId,
                client_mutation_id: '14',
            },
            privacySelectorRenderLocation: 'COMET_STREAM',
            scale: 1,
            storyRenderLocation: 'timeline',
            tags: null,
        });
    }
    getArticleComments(e) {
        return new Promise((c, t) => {
            var a;
            let r = null,
                n = [],
                o = !0;
            try {
                do {
                    let c = this.getComments(e, r),
                        { page_info: t, edges: l } =
                            null === (a = c.data.node) || void 0 === a
                                ? void 0
                                : a.display_comments,
                        i = l.map(e => ({
                            id: e.node.author.id,
                            name: e.node.author.name,
                        }));
                    (n = [...n, ...i]), (r = t.end_cursor), (o = t.has_next_page);
                } while (o);
                c(n);
            } catch (e) {
                t(e);
            }
        });
    }
    getArticleFriendReactions(e, c = null, t = null) {
        let { data: a } = this.graphQl('6511379402249937', {
            count: 10,
            cursor: c,
            feedbackTargetID: e,
            reactionID: t,
            scale: 2,
            id: e,
        });
        return a.node.reactors;
    }
    getLikedPages2(e, c = '', t = 8) {
        let a = this.graphQl('6495655873816618', {
            count: t,
            scale: 1,
            cursor: c,
            id: (0, n.safeBase64Encode)(`app_collection:${e}:2409997254:96`),
        });
        return a.data.node.pageItems;
    }
    leaveGroup(e) {
        return (
            this.requiresId(),
            this.graphQl('23891591443789497', {
                imageMediaType: 'image/x-auto',
                input: {
                    attribution_id_v2:
                        'CometGroupDiscussionRoot.react,comet.group,unexpected,1696995347466,265527,2361831622,;SearchCometGlobalSearchDefaultTabRoot.react,comet.search_results.default_tab,unexpected,1696995310667,657914,391724414624676,;SearchCometGlobalSearchDefaultTabRoot.react,comet.search_results.default_tab,tap_search_bar,1696995306118,990598,391724414624676,',
                    group_id: e,
                    actor_id: this.context.userId,
                    client_mutation_id: '6',
                },
                inviteShortLinkKey: null,
                isChainingRecommendationUnit: !1,
                isEntityMenu: !0,
                ordering: ['viewer_added'],
                scale: 3,
                groupID: e,
                __relay_internal__pv__GroupsCometEntityMenuChannelsrelayprovider: !1,
                __relay_internal__pv__GroupsCometGroupChatLazyLoadLastMessageSnippetrelayprovider:
                    !1,
            })
        );
    }
    unlikePage(e) {
        return (
            this.requiresId(),
            this.graphQl('5358677870817645', {
                input: {
                    is_tracking_encrypted: !1,
                    page_id: e,
                    source: 'page_profile',
                    tracking: null,
                    actor_id: this.context.userId,
                    client_mutation_id: '2',
                },
                scale: 3,
            })
        );
    }
    searchFriends(e) {
        let c = this.graphQl('4970436386382601', {
                query: {
                    fetch_count: 8,
                    fetch_mode: 'blended',
                    query_text: `["${e}"]`,
                    request_id: Date.now(),
                    session_id:
                        '0.' +
                        (function (e) {
                            let c = '';
                            for (let e = 0; e < 16; e++) c += Math.floor(10 * Math.random());
                            return c;
                        })(0),
                },
                fb_api_req_friendly_name: 'CometSearchKeywordDataSourceQuery',
                fb_api_caller_class: 'RelayModern',
            }),
            t = [];
        return (
            c.data.search_keywords_suggestion.suggestions.edges.map(e => {
                let { name: c, logging_info: a } = null == e ? void 0 : e.node,
                    r = JSON.parse(a);
                'user' == r.category &&
                    t.push({
                        id: r.kwEntId,
                        name: c,
                    });
            }),
            t
        );
    }
    getVideoInfo(e) {
        let c = this.graphQl('5279476072161634', {
                UFI2CommentsProvider_commentsKey: 'CometTahoeSidePaneQuery',
                caller: 'CHANNEL_VIEW_FROM_PAGE_TIMELINE',
                displayCommentsContextEnableComment: null,
                displayCommentsContextIsAdPreview: null,
                displayCommentsContextIsAggregatedShare: null,
                displayCommentsContextIsStorySet: null,
                displayCommentsFeedbackContext: null,
                feedbackSource: 41,
                feedLocation: 'TAHOE',
                focusCommentID: null,
                privacySelectorRenderLocation: 'COMET_STREAM',
                renderLocation: 'video_channel',
                scale: 1,
                streamChainingSection: !1,
                useDefaultActor: !1,
                videoChainingContext: null,
                videoID: e,
            }),
            t = JSON.parse(c.split('\n')[0]).data.video;
        if (t) return t;
        throw 'CANNOT_LOAD_VIDEO';
    }
    pokeFriend(e) {
        return (
            this.requiresId(),
            this.graphQl('5028133957233114', {
                input: {
                    client_mutation_id: '1',
                    actor_id: this.context.userId,
                    user_id: e,
                },
            })
        );
    }
    addFriend(e) {
        return (
            this.requiresId(),
            this.graphQl('6294978773852692', {
                input: {
                    attribution_id_v2:
                        'FriendingCometRoot.react,comet.friending,tap_tabbar,1667288605315,127814,2356318349,',
                    friend_requestee_ids: [e],
                    people_you_may_know_location: 'friends_center',
                    refs: [null],
                    source: 'people_you_may_know',
                    warn_ack_for_ids: [],
                    actor_id: this.context.userId,
                    client_mutation_id: '9',
                },
                scale: 2,
            })
        );
    }
    removeFriend(e) {
        return (
            this.requiresId(),
            this.graphQl('8752443744796374', {
                input: {
                    source: 'friending_jewel',
                    unfriended_user_id: e,
                    actor_id: this.context.userId,
                    client_mutation_id: '8',
                },
                scale: 1,
            })
        );
    }
    getProfileFriendsSection(e = this.context.userId, c = '') {
        let t = this.graphQl('4186250744800382', {
            count: 8,
            cursor: c,
            scale: 2,
            id: (0, n.safeBase64Encode)(`app_collection:${e}:2356318349:2`),
        });
        return t.data.node.pageItems;
    }
    getStickerPacks() {
        return this.graphQl('2203663463032923', {
            stickerInterface: 'messages',
        }).then(e => e.data.viewer.sticker_store.tray_packs.edges);
    }
    getStickers(e = '') {
        let c = this.graphQl('3829078343831521', {
            stickerWidth: 64,
            stickerHeight: 64,
            packID: e,
            feedbackID: '',
            hasNoFeedbackID: !0,
            numMRUStickers: 40,
        });
        return c.data.node.stickers.edges;
    }
    getActiveList() {
        let { data: e } = this.requestAdapter.post({
            url: 'https://m.facebook.com/buddylist_update.php',
            data: {
                fb_dtsg: this.getDtsg(),
                __user: this.context.userId,
                data_fetch: !0,
                send_full_data: !0,
                jazoest: ~~(new Date().getTime() / 1e3),
                lsd: (0, n.randomString)(22),
                __dyn: (0, n.randomString)(151),
                __csr: '',
                __req: 'k',
                __a: (0, n.randomString)(110),
            },
            headers: {
                'content-type': 'application/x-www-form-urlencoded',
            },
        });
        return JSON.parse(e.slice(9));
    }
    getThreads(e, c = ['INBOX'], t = new Date().getTime() + 2e4) {
        let a = this.graphQlBatch([
            {
                docId: '3426149104143726',
                variables: {
                    before: t,
                    limit: e,
                    tags: c,
                    includeDeliveryReceipts: !0,
                    includeSeqID: !1,
                },
            },
        ]);
        return a[0].o0.data.viewer.message_threads.nodes;
    }
    loadThreadInfo(e, c = 0) {
        let t = this.graphQlBatch([
            {
                docId: '3106009512862081',
                variables: {
                    id: e.toString(),
                    message_limit: c,
                    load_messages: c > 0,
                    load_read_receipts: !0,
                    load_delivery_receipts: !0,
                    is_work_teamwork_not_putting_muted_in_unreads: !1,
                },
            },
        ]);
        return t[0].o0.data.message_thread;
    }
    uploadImage(e, c) {
        let { data: t } = this.requestAdapter.post({
            url: 'https://upload.facebook.com/_mupload_/photo/x/saveunpublished/',
            params: {
                allow_spherical_photo: 'true',
                thumbnail_width: 80,
                thumbnail_height: 80,
                waterfall_id: 'f4abd1added541b18bdc22186a2aee71',
                waterfall_app_name: 'web_m_touch',
                waterfall_source: 'message',
                target_id: e,
                av: e,
                fb_dtsg: this.getDtsg(),
                __user: e,
            },
            data: c,
        });
        return JSON.parse(t.slice(9));
    }
    getMessages(e, c = 20, t = new Date().getTime() + 5e3) {
        let a = this.graphQlBatch([
            {
                docId: '2395890240532595',
                variables: {
                    id: e,
                    before: t,
                    message_limit: c,
                    load_messages: !0,
                    load_read_receipts: !0,
                    load_delivery_receipts: !0,
                    includeDeliveryReceipts: !0,
                    includeSeqID: !1,
                    is_work_teamwork_not_putting_muted_in_unreads: !1,
                },
            },
        ]);
        return a[0].o0.data.message_thread.messages.nodes;
    }
    getProfilePosts(e, c) {
        var t;

        try {
            let a = !0,
                r = [],
                n = c.limit || 1e3,
                o = new URLSearchParams({
                    since: c.since.toString(),
                    until: c.until.toString(),
                    limit: (n > 100 ? 100 : n).toString(),
                });
            for (; a && r.length < n; ) {
                let c = this.graphAPI(`v12.0/${e}/posts?${o}`, {});
                if (!c) return;
                for (let e of c.data) r.length < n && r.push(e);
                (a = !!c.paging),
                    (null === (t = c.paging) || void 0 === t ? void 0 : t.next) &&
                        (o = c.paging.next.split('?').pop());
            }
            return r;
        } catch (e) {
            return [];
        }
    }
    getPostReactionsLegacy(e) {
        var c, t, r;

        try {
            let a = !0,
                n = '',
                o = [];
            for (; a; )
                try {
                    let l = this.graphAPI(`v2.6/${e}/reactions`, {
                        limit: 1e3,
                        fields: 'id,name,type',
                        after: n,
                    });
                    o.push(...l.data),
                        (a =
                            void 0 !== (null === (c = l.paging) || void 0 === c ? void 0 : c.next)),
                        (n =
                            null ===
                                (r =
                                    null === (t = l.paging) || void 0 === t ? void 0 : t.cursors) ||
                            void 0 === r
                                ? void 0
                                : r.after);
                } catch (e) {
                    a = !1;
                }
            return o;
        } catch (e) {
            return [];
        }
    }
    getComments(e, c = 20, t = '') {
        var r;

        let a = this.graphQl('3874089129331862', {
            max_comments: c,
            feedback_id: (0, n.safeBase64Encode)('feedback:' + e),
            after_comments: t,
        });
        return void 0 !== a && (null === (r = a.data) || void 0 === r ? void 0 : r.feedback)
            ? a.data.feedback.top_level_comments
            : [];
    }
    getAllPostComments(e) {
        return new Promise((c, t) => {
            let a = !1,
                r = '',
                n = [];
            try {
                do {
                    let c = this.getComments(e, 40, r);
                    (a = c.page_info.has_next_page),
                        (r = c.page_info.end_cursor),
                        n.push(...c.nodes);
                } while (a);
                c(n);
            } catch (e) {
                t(e);
            }
        });
    }
    getJoinedGroups(e, c, t = 8) {
        let a = this.graphQl('5244211935648733', {
                count: t,
                cursor: c,
                scale: 1,
                search: null,
                id: (0, n.safeBase64Encode)(`app_collection:${e}:2361831622:66`),
            }),
            r = a.data;
        return void 0 !== r ? r.node.pageItems : [];
    }
    getLikedPages(e, c = '', t = 8) {
        let a = this.graphQl('3678001995618153', {
            count: t,
            scale: 1,
            cursor: c,
            id: (0, n.safeBase64Encode)(`app_collection:${e}:2409997254:96`),
        });
        return a.data.node.pageItems;
    }
    getPostReactions(e, c = null) {
        var t, r;

        let a = (0, n.safeBase64Encode)(`feedback:${e}`),
            o = this.graphQl('6099931570107234', {
                feedbackTargetID: a,
                scale: 2,
                cursor: c,
            });
        if (
            null ===
                (r =
                    null === (t = null == o ? void 0 : o.data) || void 0 === t ? void 0 : t.node) ||
            void 0 === r
                ? void 0
                : r.reactors
        )
            return o.data.node.reactors;
        throw Error('Failed to load reactions');
    }
    getHoverCard(e) {
        var c, t, r;

        let a = this.graphQl('6557764334241403', {
            context: 'DEFAULT',
            entityID: e,
            scale: 1,
        });
        if (
            null ===
                (r =
                    null ===
                        (t =
                            null === (c = null == a ? void 0 : a.data) || void 0 === c
                                ? void 0
                                : c.node) || void 0 === t
                        ? void 0
                        : t.comet_hovercard_renderer) || void 0 === r
                ? void 0
                : r.user
        )
            return a.data.node.comet_hovercard_renderer.user;
        throw Error('Failed to load profile');
    }
    getsArchivedStories(e, c = '', t = 8) {
        var r;

        let a = this.graphQl('3975496529227403', {
            scale: 1,
            count: t,
            cursor: c,
            id: (0, n.safeBase64Encode)(`app_collection:${e}:1560653304174514:133`),
        });
        if (null === (r = null == a ? void 0 : a.data) || void 0 === r ? void 0 : r.node.pageItems)
            return a.data.node.pageItems;
        throw Error('Failed to load stories archive');
    }
    graphQl(doc_id, variables, config = {}, signal) {
        var n;
        this.requiresId();
        let a = this.requestAdapter.post(
            Object.assign(
                {
                    url: `${this.facebookBaseUrl}/api/graphql/`,
                    data: Object.assign(
                        {
                            av:
                                null ===
                                    (n =
                                        this === null || void 0 === this ? void 0 : this.context) ||
                                void 0 === n
                                    ? void 0
                                    : n.userId.toString(),
                            doc_id: doc_id,
                            fb_dtsg: this.getDtsg(),
                            variables: JSON.stringify(variables),
                            server_timestamps: 'true',
                        },
                        config.additionalParams
                    ),
                    headers: Object.assign(Object.assign({}, config.externalHeaders), {
                        'content-type': 'application/x-www-form-urlencoded',
                    }),
                },
                signal && {
                    signal: signal.signal,
                }
            )
        );
        if ('object' == typeof a.data) return a.data;
        let o = a.data.split('\n');
        return o.length > 1 ? a.data : JSON.parse(a.data);
    }
    graphAPI(e, c) {
        this.requiresToken();
        let t = Object.assign(Object.assign({}, c), {
            access_token: this.context.accessToken,
        });
        for (let e of Object.keys(t)) void 0 === t[e] && delete t[e];
        let a = this.requestAdapter.get({
            url: `${this.graphApiBase}/${e}`,
            params: t,
            responseType: 'text',
        });
        return 'object' == typeof a.data ? a.data : JSON.parse(a.data);
    }
    graphQlBatch(e) {
        let c = {};
        e.forEach((e, t) => {
            c[`o${t}`] = {
                doc_id: e.docId,
                query_params: e.variables,
            };
        });
        let { data: t } = this.requestAdapter.post({
            url: `${this.facebookBaseUrl}/api/graphqlbatch/`,
            data: {
                fb_dtsg: this.getDtsg(),
                queries: JSON.stringify(c),
                server_timestamps: 'true',
            },
            responseType: 'text',
            headers: {
                accept: 'text/html',
                'content-type': 'application/x-www-form-urlencoded',
            },
        });
        if ('object' == typeof t) return [t];
        let a = t.split('\n');
        return a.map(e => JSON.parse(e));
    }
}
