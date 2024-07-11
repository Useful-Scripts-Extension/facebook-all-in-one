import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import {
    App,
    Avatar,
    Button,
    DatePicker,
    Image,
    Input,
    List,
    Space,
    Tooltip,
    Typography,
} from 'antd';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import { produce } from 'immer';
import dayjs from 'dayjs';
import {
    findFirstMessage,
    getFbUrlFromId,
    getMessagesAfterMsgId,
    getUidFromUrl,
    getUserAvatarFromUid,
    getUserInfoFromUid,
    getMessagesAtTimeCursor,
    trackEvent,
} from '../../utils/facebook';
import useStore, { selectors } from '../../store';

const dateFormat = 'YYYY-MM-DD';
const minDate = dayjs('2004-01-01', dateFormat);

const MessagePosition = {
    SINGLE: 'single',
    START: 'start',
    MIDDLE: 'middle',
    END: 'end',
};

const CACHED = {
    friend: {},
};

export default function FirstMessages() {
    const { message } = App.useApp();
    const location = useLocation();
    const { t } = useTranslation();

    const friendUidParam = location.state?.friendUid;

    const myProfile = useStore(selectors.profile);

    const [fetchingFirstMsg, setFetchingFirstMsg] = useState(false);
    const [pagingState, setPagingState] = useState({
        fetchingNext: false,
        fetchingPrev: false,
        hasNext: true,
        hasPrev: true,
    });

    const [time, setTime] = useState(null);
    const [friendUrlOrUid, setFriendUrlOrUid] = useState(friendUidParam);
    const [friendProfile, setFriendProfile] = useState(null);
    const [messages, setMessages] = useState([]);

    // group nearest message that have same sender id
    const messagesGrouped = useMemo(() => {
        if (!messages?.length) return [];
        const grouped = [];
        for (let i = 0; i < messages.length; i++) {
            let preId = messages[i - 1]?.message_sender?.id;
            let curId = messages[i]?.message_sender?.id;
            let nextId = messages[i + 1]?.message_sender?.id;

            let type = MessagePosition.SINGLE;
            if (curId == preId && curId == nextId) type = MessagePosition.MIDDLE;
            else if (curId == preId) type = MessagePosition.END;
            else if (curId == nextId) type = MessagePosition.START;

            grouped.push({
                ...messages[i],
                _messagePosition: type,
            });
        }
        return grouped;
    }, [messages]);

    // remember scroll position
    const listRef = useRef(null);
    const scrollHeightRef = useRef(0);
    const _setMessages = msgs => {
        scrollHeightRef.current = listRef.current?.scrollHeight || 0;
        console.log(msgs);
        setMessages(msgs);
    };
    const hasFetchRef = useRef({
        prev: false,
        next: false,
    });
    useLayoutEffect(() => {
        if (hasFetchRef.current.prev) {
            if (!pagingState.fetchingPrev) {
                hasFetchRef.current.prev = false;
                let newScollHeight = listRef.current?.scrollHeight || 0;
                if (newScollHeight > scrollHeightRef.current)
                    listRef.current?.scrollTo({ top: newScollHeight - scrollHeightRef.current });
            }
        }
        if (getRecentRef.current) {
            getRecentRef.current = false;
            listRef.current?.scrollTo({ top: listRef.current?.scrollHeight || 0 });
        }
    }, [messages, pagingState.fetchingPrev]);

    // fetch functions
    const getRecentRef = useRef(false);
    const getRecentMessage = async () => {
        trackEvent('FirstMessages:getRecentMessage');
        const key = 'getRecentMessage';

        try {
            setPagingState(
                produce(state => {
                    state.hasNext = false;
                    state.hasPrev = false;
                })
            );

            let friendUid;
            if (/\d+$/.test(friendUrlOrUid)) {
                friendUid = friendUrlOrUid;
            } else {
                message.loading({ key, content: t('Fetching friend uid...') });
                friendUid = await getUidFromUrl(friendUrlOrUid);
            }
            if (!friendUid) throw new Error('Invalid friend url');

            let friendInfo = CACHED.friend[friendUid];
            if (!friendInfo) {
                message.loading({ key, content: t('Fetching friend info...') });
                friendInfo = await getUserInfoFromUid(friendUid);
                if (!friendInfo) throw new Error('Failed to fetch friend info');
            }
            setFriendProfile(friendInfo);

            // fetch recent messages
            message.loading({ key, content: t('Fetching recent messages...') });
            const now = dayjs();
            setTime(now);

            const msgs = await getMessagesAtTimeCursor({
                friendUid,
                time: now.valueOf(),
            });
            _setMessages(msgs);
            if (msgs?.length > 0) message.success({ key, content: t('Fetch completed') });
            else message.info({ key, content: t('No data to show') });

            getRecentRef.current = true;
            setPagingState(
                produce(state => {
                    state.hasNext = msgs.length > 1;
                    state.hasPrev = true;
                    state.fetchingNext = false;
                    state.fetchingPrev = false;
                })
            );
        } catch (e) {
            message.error({ key, content: t('Failed to fetch') + ': ' + e.message });
        }
    };

    useEffect(() => {
        if (friendUidParam) getRecentMessage();
    }, [friendUidParam]);

    const getFirstMessage = async () => {
        trackEvent('FirstMessages:getFirstMessage');
        try {
            setFetchingFirstMsg(true);

            const data = await findFirstMessage({
                friendUid: friendProfile.uid,
                startTime: minDate.valueOf(),
                endTime: dayjs().valueOf(),
                progress: mid => {
                    setTime(dayjs(mid));
                },
            });

            console.log('first message', data);
            if (!data?.length) {
                message.info(t('No data to show'));
            } else {
                let msgs = await getMessagesAfterMsgId({
                    friendUid: friendProfile.uid,
                    msgId: data[0].message_id,
                });
                if (!msgs?.length) {
                    msgs = await getMessagesAtTimeCursor({
                        friendUid: friendProfile.uid,
                        time: dayjs(Number(data[0].timestamp_precise)).add(1, 'day').valueOf(),
                    });
                }
                console.log(msgs);
                if (msgs.length) _setMessages(msgs);
                else message.info(t('No data to show'));

                setPagingState(
                    produce(state => {
                        state.hasNext = true;
                        state.hasPrev = true;
                    })
                );
            }
        } catch (err) {
            message.error(t('Failed to fetch') + ': ' + err.message);
            console.log(err);
        } finally {
            setFetchingFirstMsg(false);
        }
    };

    const onSelectDate = async value => {
        trackEvent('FirstMessages:onSelectDate');
        let time = dayjs(value).valueOf();
        const msg = await getMessagesAtTimeCursor({
            friendUid: friendProfile.uid,
            time: time,
        });
        console.log(msg);
        _setMessages(msg);

        setPagingState(
            produce(state => {
                state.hasNext = true;
                state.hasPrev = true;
            })
        );
    };

    const fetchNext = async () => {
        trackEvent('FirstMessages:fetchNext');
        try {
            setPagingState(
                produce(state => {
                    state.fetchingNext = true;
                })
            );
            const msgs = await getMessagesAfterMsgId({
                friendUid: friendProfile.uid,
                msgId: messages?.[messages.length - 1]?.message_id,
                direction: 'down',
            });
            console.log(msgs);
            if (msgs.length > 1) {
                msgs.shift();
                _setMessages([...messages, ...msgs]);
            }
            hasFetchRef.current.next = true;
            setPagingState(
                produce(pagingState => {
                    pagingState.hasNext = msgs.length > 1;
                })
            );
        } catch (e) {
            message.error(t('Failed to fetch') + ': ' + e.message);
        } finally {
            setPagingState(
                produce(pagingState => {
                    pagingState.fetchingNext = false;
                })
            );
        }
    };

    const fetchPrev = async () => {
        trackEvent('FirstMessages:fetchPrev');
        try {
            setPagingState(
                produce(state => {
                    state.fetchingPrev = true;
                })
            );
            const msgs = await getMessagesAfterMsgId({
                friendUid: friendProfile.uid,
                msgId: messages?.[0]?.message_id,
                direction: 'up',
            });
            if (msgs.length > 1) {
                msgs.pop();
                _setMessages([...msgs, ...messages]);
            }
            hasFetchRef.current.prev = true;
            setPagingState(
                produce(state => {
                    state.hasPrev = msgs.length > 1;
                })
            );
        } catch (e) {
            message.error(t('Failed to fetch') + ': ' + e.message);
        } finally {
            setPagingState(
                produce(state => {
                    state.fetchingPrev = false;
                })
            );
        }
    };

    const renderMessages = () => {
        if (!messagesGrouped?.length) return null;
        return (
            <List
                header={
                    <Space style={{ display: 'flex', justifyContent: 'center' }}>
                        <Button
                            type="primary"
                            onClick={fetchPrev}
                            loading={pagingState.fetchingPrev}
                            disabled={!pagingState.hasPrev}
                        >
                            {!pagingState.fetchingPrev && <i className="fas fa-arrow-up" />}
                            {pagingState.hasPrev ? t('Fetch previous') : t('No more message')}
                        </Button>
                    </Space>
                }
                split={false}
                dataSource={messagesGrouped}
                renderItem={msg => (
                    <MessageItem
                        message={msg}
                        myProfile={myProfile}
                        friendProfile={friendProfile}
                    />
                )}
                footer={
                    <Space style={{ display: 'flex', justifyContent: 'center' }}>
                        <Button
                            type="primary"
                            onClick={fetchNext}
                            loading={pagingState.fetchingNext}
                            disabled={!pagingState.hasNext}
                        >
                            {!pagingState.fetchingNext && <i className="fas fa-arrow-down" />}
                            {pagingState.hasNext ? t('Fetch next') : t('No more message')}
                        </Button>
                    </Space>
                }
            />
        );
    };

    return (
        <Space direction="vertical" style={{ width: '100%' }}>
            <Space direction="horizontal">
                <Space.Compact>
                    <Input
                        value={friendUrlOrUid}
                        placeholder="Enter friend url/uid"
                        onChange={e => setFriendUrlOrUid(e.target.value)}
                    />
                    <Tooltip title={t('Scan messages')} placement="bottom" mouseEnterDelay={0.5}>
                        <Button
                            type="primary"
                            onClick={getRecentMessage}
                            loading={fetchingFirstMsg}
                        >
                            <i className="fas fa-search" />
                        </Button>
                    </Tooltip>
                </Space.Compact>

                <Space.Compact>
                    <DatePicker
                        showTime
                        value={time}
                        minDate={minDate}
                        // maxDate={dayjs()}
                        onChange={(value, dateString) => {
                            console.log('Selected Time: ', value);
                            console.log('Formatted Selected Time: ', dateString);
                            setTime(value);
                        }}
                        onOk={onSelectDate}
                        disabled={!friendProfile}
                    />
                    <Tooltip
                        title={t('Find first message')}
                        placement="bottom"
                        mouseEnterDelay={0.5}
                    >
                        <Button
                            type="primary"
                            onClick={getFirstMessage}
                            loading={fetchingFirstMsg}
                            disabled={!friendProfile}
                        >
                            <i className="fa-solid fa-clock-rotate-left"></i>
                        </Button>
                    </Tooltip>
                </Space.Compact>
            </Space>
            <Space
                ref={listRef}
                direction="vertical"
                size={3}
                style={{
                    width: '100%',
                    maxHeight: '70vh',
                    // maxWidth: 1000,
                    overflow: 'auto',
                    padding: 12,
                }}
            >
                {renderMessages()}
            </Space>
        </Space>
    );
}

function getMessageInfo(msg, myProfile) {
    return {
        // "GenericAdminTextMessage"
        message_id: msg?.message_id,
        sender: msg?.message_sender,
        time: Number(msg?.timestamp_precise),
        text:
            msg?.message?.text ||
            msg?.extensible_attachment?.story_attachment?.url ||
            msg?.extensible_attachment?.story_attachment?.description?.text,
        snippet: msg?.snippet,
        attachment: msg?.blob_attachments
            ?.map(_ => {
                if (_.__typename === 'MessageVideo')
                    return {
                        type: 'video',
                        uri: _.playable_url,
                        thumbnail: _.large_image?.uri || _.inbox_image?.uri || _.chat_image?.uri,
                    };
                if (_.__typename === 'MessageImage')
                    return {
                        type: 'image',
                        uri: _.large_preview?.uri || _.preview?.uri || _.thumbnail?.uri,
                    };
                if (_.__typename === 'MessageFile')
                    return {
                        type: 'file',
                        uri: _.url,
                        filename: _.filename,
                    };
                if (_.__typename === 'MessageAnimatedImage')
                    return {
                        type: 'gif',
                        uri: _?.animated_image?.uri || _?.preview_image?.uri,
                        filename: _.filename,
                    };
                return null;
            })
            .filter(Boolean),
        sticker: msg?.sticker?.url,
        replied_to_message: msg?.replied_to_message,
        isMyMessage: msg?.message_sender?.id == myProfile.uid,
    };
}

function getBorderRadius(msgPos, isMy) {
    let b = 4;
    if (isMy) {
        if (msgPos === MessagePosition.START)
            return {
                borderBottomRightRadius: b,
            };
        if (msgPos === MessagePosition.MIDDLE)
            return {
                borderBottomRightRadius: b,
                borderTopRightRadius: b,
            };
        if (msgPos === MessagePosition.END)
            return {
                borderTopRightRadius: b,
            };
    } else {
        if (msgPos === MessagePosition.START)
            return {
                borderBottomLeftRadius: b,
            };
        if (msgPos === MessagePosition.MIDDLE)
            return {
                borderBottomLeftRadius: b,
                borderTopLeftRadius: b,
            };
        if (msgPos === MessagePosition.END)
            return {
                borderTopLeftRadius: b,
            };
    }
    return {};
}

function MessageItem({ message, myProfile, friendProfile }) {
    const darkMode = useStore(selectors.darkMode);
    const info = getMessageInfo(message, myProfile);

    const _dt = message._messagePosition;
    const _my = info.isMyMessage;

    const textStyle = {
        display: 'block',
        wordBreak: 'break-word',
        padding: '8px 12px',
        backgroundColor: _my ? '#0184ff' : darkMode ? '#303030' : '#f0f0f0',
        color: darkMode || _my ? '#eee' : '#111',
        whiteSpace: 'pre-line',
        margin: 0,
        maxWidth: 400,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        borderBottomLeftRadius: 24,
        borderBottomRightRadius: 24,
        ...getBorderRadius(_dt, _my),
    };

    const showAvatar = _dt === MessagePosition.END || _dt === MessagePosition.SINGLE;
    const spacer = <div style={{ flex: 1 }}></div>;

    return (
        <div
            style={{
                display: 'flex',
                alignItems: 'center',
                width: '100%',
                marginBottom: showAvatar ? 12 : 2,
            }}
        >
            {_my ? (
                spacer
            ) : showAvatar ? (
                <a href={getFbUrlFromId(info.sender.id)} target="_blank">
                    <Avatar
                        shape="circle"
                        size={40}
                        src={getUserAvatarFromUid(info.sender.id)}
                        style={{ marginRight: 8 }}
                    />
                </a>
            ) : (
                <div style={{ width: 48 }}></div>
            )}
            <Tooltip
                title={dayjs(info.time).format('YYYY-MM-DD HH:mm')}
                placement={_my ? 'left' : 'right'}
            >
                {!info.text && !info.sticker && !info.attachment?.length && info.snippet && (
                    <Typography.Paragraph style={textStyle}>{info.snippet}</Typography.Paragraph>
                )}
                {info.text && (
                    <Typography.Paragraph style={textStyle}>{info.text}</Typography.Paragraph>
                )}
                {info.sticker && <Image width={150} src={info.sticker} />}
                {info.attachment?.map((attachment, index) => {
                    if (attachment.type === 'video')
                        return (
                            <video
                                key={'attachment' + index}
                                src={attachment.uri}
                                controls
                                style={{ maxHeight: 300, maxWidth: 300 }}
                            />
                        );
                    if (attachment.type === 'image' || attachment.type === 'gif')
                        return (
                            <Image
                                key={'attachment' + index}
                                src={attachment.uri}
                                style={{ maxHeight: 300, maxWidth: 300 }}
                            />
                        );
                    if (attachment.type === 'file')
                        return (
                            <a
                                key={'attachment' + index}
                                href={attachment.uri}
                                target="_blank"
                                rel="noreferrer"
                                style={textStyle}
                            >
                                File: {attachment.filename}
                            </a>
                        );
                    return null;
                })}
            </Tooltip>
            {!_my && spacer}
        </div>
    );
}
