import { useEffect, useState } from 'react';
import { App, Avatar, Button, DatePicker, Image, Input, Space, Tooltip, Typography } from 'antd';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import dayjs from 'dayjs';
import {
    findFirstMessage,
    getFbUrlFromId,
    getMessagesAfter,
    getUidFromUrl,
    getUserAvatarFromUid,
    getUserInfoFromUid,
    isExistMessage,
} from '../../utils/facebook';

// import mockMsgs from '../../mock/messages.json';
import useStore, { selectors } from '../../store';

const dateFormat = 'YYYY-MM-DD';
const minDate = dayjs('2004-01-01', dateFormat);

export default function FirstMessages() {
    const { message } = App.useApp();
    const location = useLocation();
    const { t } = useTranslation();

    const myProfile = useStore(selectors.profile);
    const [loading, setLoading] = useState(false);
    const [fetchingNext, setFetchingNext] = useState(false);
    const [fetchingPrev, setFetchingPrev] = useState(false);

    const [time, setTime] = useState(null);
    const [friendUrlOrUid, setFriendUrlOrUid] = useState(location.state?.friendUid);
    const [friendProfile, setFriendProfile] = useState(null);
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        if (friendUrlOrUid) init();
    }, [friendUrlOrUid]);

    const init = async () => {
        try {
            let friendUid;
            if (/\d+$/.test(friendUrlOrUid)) {
                friendUid = friendUrlOrUid;
            } else {
                message.loading(t('Fetching friend uid...'));
                friendUid = await getUidFromUrl(friendUrlOrUid);
                message.destroy();
            }
            if (!friendUid) throw new Error('Invalid friend url');

            message.loading(t('Fetching friend info...'));
            const friendInfo = await getUserInfoFromUid(friendUid);
            message.destroy();
            if (!friendInfo) throw new Error('Failed to fetch friend info');
            setFriendProfile(friendInfo);

            // fetch recent messages
            message.loading(t('Fetching recent messages...'));
            const now = dayjs();
            setTime(now);

            const msgs = await isExistMessage({
                friendUid,
                before: now.valueOf(),
            });
            console.log(msgs);
            setMessages(msgs);
            message.destroy();
            message.success(t('Fetch completed'));
        } catch (e) {
            message.error(t('Failed to fetch') + ': ' + e.message);
        }
    };

    const getFirstMessage = async () => {
        try {
            setLoading(true);

            const data = await findFirstMessage({
                friendUid: friendProfile.uid,
                startTime: minDate.valueOf(),
                endTime: dayjs().valueOf(),
                progress: mid => {
                    setTime(dayjs(mid));
                },
            });

            console.log('first message', data);
            if (data?.[0]) {
                const msgs = await getMessagesAfter({
                    friendUid: friendProfile.uid,
                    msgId: data[0].message_id,
                });
                console.log(msgs);
                setMessages(msgs);
            }
        } catch (err) {
            message.error(t('Failed to fetch') + ': ' + err.message);
            console.log(err);
        } finally {
            setLoading(false);
        }
    };

    const onSelectDate = async value => {
        let time = dayjs(value).valueOf();
        const msg = await isExistMessage({
            friendUid: friendProfile.uid,
            before: time,
        });
        console.log(msg);
        setMessages(msg);
    };

    const fetchNext = async () => {
        try {
            setFetchingNext(true);
            const msgs = await getMessagesAfter({
                friendUid: friendProfile.uid,
                msgId: messages?.[messages.length - 1]?.message_id,
                direction: 'down',
            });
            msgs.shift();
            setMessages([...messages, ...msgs]);
        } catch (e) {
            message.error(t('Failed to fetch') + ': ' + e.message);
        } finally {
            setFetchingNext(false);
        }
    };

    const fetchPrev = async () => {
        try {
            setFetchingPrev(true);
            const msgs = await getMessagesAfter({
                friendUid: friendProfile.uid,
                msgId: messages?.[0]?.message_id,
                direction: 'up',
            });
            msgs.pop();
            setMessages([...msgs, ...messages]);
        } catch (e) {
            message.error(t('Failed to fetch') + ': ' + e.message);
        } finally {
            setFetchingPrev(false);
        }
    };

    const renderMessages = () => {
        if (!messages.length) return null;

        return (
            <>
                <Button type="primary" onClick={fetchPrev} loading={fetchingPrev}>
                    {t('Fetch previous')}
                </Button>
                {messages.map(msg => (
                    <MessageItem
                        message={msg}
                        myProfile={myProfile}
                        friendProfile={friendProfile}
                        key={msg.message_id}
                    />
                ))}
                <Button type="primary" onClick={fetchNext} loading={fetchingNext}>
                    {t('Fetch next')}
                </Button>
            </>
        );
    };

    return (
        <Space direction="vertical" style={{ width: '100%' }}>
            <Space direction="horizontal">
                <Space>
                    <Input
                        value={friendUrlOrUid}
                        placeholder="Enter friend url/uid"
                        onChange={e => setFriendUrlOrUid(e.target.value)}
                    />
                </Space>

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
                    <Button
                        type="primary"
                        onClick={getFirstMessage}
                        loading={loading}
                        disabled={!friendProfile}
                    >
                        {t('Find first message')}
                    </Button>
                </Space.Compact>
            </Space>
            <Space
                direction="vertical"
                style={{
                    width: '100%',
                    maxHeight: '70vh',
                    maxWidth: 1000,
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
        message_id: msg?.message_id,
        sender: msg?.message_sender,
        time: Number(msg?.timestamp_precise),
        text:
            msg?.message?.text ||
            msg?.extensible_attachment?.story_attachment?.url ||
            msg?.extensible_attachment?.story_attachment?.description?.text ||
            msg?.snippet,
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
                return null;
            })
            .filter(Boolean),
        sticker: msg?.sticker?.url,
        replied_to_message: msg?.replied_to_message,
        isMyMessage: msg?.message_sender?.id == myProfile.uid,
    };
}

function MessageItem({ message, myProfile, friendProfile }) {
    const info = getMessageInfo(message, myProfile);

    return (
        <div style={{ display: 'flex', alignItems: 'center', width: '100%', padding: 8 }}>
            {info.isMyMessage && <div style={{ flex: 1 }}></div>}
            {!info.isMyMessage && (
                <a href={getFbUrlFromId(info.sender.id)} target="_blank">
                    <Avatar
                        shape="circle"
                        size={40}
                        src={getUserAvatarFromUid(info.sender.id)}
                        style={{ marginRight: 8 }}
                    />
                </a>
            )}
            <Tooltip
                title={dayjs(info.time).format('YYYY-MM-DD HH:mm')}
                placement={info.isMyMessage ? 'left' : 'right'}
                style={{ width: '100%' }}
            >
                {info.text && (
                    <Typography.Paragraph
                        style={{
                            display: 'block',
                            wordBreak: 'break-word',
                            padding: '8px 12px',
                            borderRadius: 24,
                            backgroundColor: info.isMyMessage ? '#0084ff' : '#303030',
                            whiteSpace: 'pre-line',
                        }}
                    >
                        {info.text}
                    </Typography.Paragraph>
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
                    if (attachment.type === 'image')
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
                                style={{
                                    display: 'block',
                                    wordBreak: 'break-word',
                                    padding: '8px 12px',
                                    borderRadius: 24,
                                    backgroundColor: info.isMyMessage ? '#0084ff' : '#303030',
                                    color: 'white',
                                }}
                            >
                                File: {attachment.filename}
                            </a>
                        );
                    return null;
                })}
            </Tooltip>
        </div>
    );
}
