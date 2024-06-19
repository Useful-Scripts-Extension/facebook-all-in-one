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

/**
 * Fetches GraphQL data from the specified URL using the provided parameters.
 *
 * @param {Object|string} params - The parameters to be used in the GraphQL query. If a string is provided, it will be used as the query directly.
 * @param {string} [url=''] - The URL to send the GraphQL request to. Defaults to an empty string.
 * @return {Promise} A Promise that resolves with the response from the GraphQL request.
 */
export function fetchGraphQl(params = {}, url = '') {
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

export function getUserAvatarFromUid(uid) {
    return `https://graph.facebook.com/${uid}/picture?height=500&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;
}

export async function getEntityInfoFromId(entityID, context = 'DEFAULT') {
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

/**
 * Retrieves user information from a given UID.
 *
 * @param {string} uid - The UID of the user.
 * @return {Promise<Object>} An object containing the user's information, including UID, gender, name, alternate name, avatar, and cover.
 * @throws {Error} If there is an error in fetching the GraphQL data.
 */
export async function getUserInfoFromUid(uid) {
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

export function getFbUrlFromId(id) {
    return `https://fb.com/${id}`;
}

export async function getUidFromUrl(url) {
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

/**
 * Retrieves all messages from the viewer including message threads with participants, message count, and thread details.
 * @return {Array} An array of message thread objects with details like participants, message count, and thread type.
 */
export async function getAllMessages() {
    const res = await fetchGraphQl(
        'viewer(){message_threads{count,nodes{customization_info{emoji,outgoing_bubble_color,participant_customizations{participant_id,nickname}},all_participants{nodes{messaging_actor{name,id,profile_picture}}},thread_type,name,messages_count,image,id}}}'
    );
    const msgData = JSON.parse(res);
    console.log(msgData);
    let { count: threadCount, nodes } = msgData.viewer.message_threads;
    let data = nodes
        .map((node, i) => ({ ...node, recent: i })) // inject recent rank
        .map(node => {
            let participants = node.all_participants.nodes.map(p => ({
                id: p.messaging_actor.id,
                name: p.messaging_actor.name,
                avatar: p.messaging_actor.profile_picture.uri,
                avatar_large: getUserAvatarFromUid(p.messaging_actor.id),
            }));

            let d = {
                recent: node.recent,
                type: node.thread_type,
                id: atob(node.id)?.split(':')?.[1],
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

/**
 * Finds the first message within a given time range.
 *
 * @param {Object} options - The options for finding the first message.
 * @param {string} options.friendUid - The UID of the friend in the conversation.
 * @param {number} options.startTime - The start time of the range.
 * @param {number} options.endTime - The end time of the range.
 * @param {Function} [options.progress] - Optional callback function to report progress.
 * @return {Promise<Array>} A promise that resolves to an array of messages.
 */
export async function findFirstMessage({ friendUid, startTime, endTime, progress }) {
    let mid = 1e3 * Math.round((startTime + endTime) / 2 / 1e3);
    progress?.(mid);
    let msgs = await isExistMessage({ friendUid, cursor: mid, limit: 1 });

    if (Math.abs(endTime - startTime) <= 1e3) return msgs;

    if (msgs?.length)
        return await findFirstMessage({ friendUid, startTime, endTime: mid - 1, progress });
    else return await findFirstMessage({ friendUid, startTime: mid + 1, endTime, progress });
}

/**
 * Retrieves messages after a specific message ID from a Facebook conversation.
 *
 * @param {Object} options - The options for retrieving messages.
 * @param {string} options.msgId - The ID of the message to retrieve messages after.
 * @param {number} [options.limit=50] - The maximum number of messages to retrieve.
 * @param {string} options.friendUid - The UID of the friend in the conversation.
 * @return {Promise<Object|Error>} A promise that resolves to the GraphQL payload of the messages,
 * or an error if there are no results.
 */
export async function getMessagesAfter({ friendUid, msgId, direction = 'down', limit = 50 }) {
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
        t = n.payload.graphql_payload;
    if (t) return t;
    else return new Error('There is no results.');
}

/**
 * Checks if a message exists based on the provided cursor, limit, and friend UID.
 *
 * @param {Object} options - The options for checking the message existence.
 * @param {number} options.cursor - The cursor used to fetch the message.
 * @param {number} [options.limit=50] - The maximum number of messages to fetch.
 * @param {string} options.friendUid - The UID of the friend in the conversation.
 * @return {Promise<Array|undefined>} A promise that resolves to an array of message nodes if the message exists,
 * or undefined if it doesn't.
 */
export async function isExistMessage({ friendUid, cursor = null, limit = 50 }) {
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
                        before: cursor,
                    },
                },
            },
        },
        'https://www.facebook.com/api/graphqlbatch/'
    );
    try {
        const n = JSON.parse(res.split('\n')[0]);
        if (n.o0.data.message_thread) return n.o0.data.message_thread.messages.nodes;
    } catch (i) {
        console.error(i.message);
    }
}

// #endregion
