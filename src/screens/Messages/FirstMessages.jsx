import { useEffect, useState } from 'react';
import { App, Button, DatePicker, Image, Input, Space, Tooltip, Typography } from 'antd';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import dayjs from 'dayjs';
import {
    findFirstMessage,
    getMessagesAfter,
    getUidFromUrl,
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

    const [time, setTime] = useState(null);
    const [loading, setLoading] = useState(false);
    const [fetchingNext, setFetchingNext] = useState(false);
    const [fetchingPrev, setFetchingPrev] = useState(false);
    const [friendUrl, setFriendUrl] = useState('https://www.facebook.com/99.thuhien');
    const [friendProfile, setFriendProfile] = useState(null);
    const [messages, setMessages] = useState([]);

    const getFriendProfile = async () => {
        message.loading(t('Fetching friend uid...'));
        const friendUid = await getUidFromUrl(friendUrl);
        if (!friendUid) throw new Error('Invalid friend url');

        message.loading(t('Fetching friend info...'));
        const friendInfo = await getUserInfoFromUid(friendUid);
        if (!friendInfo) throw new Error('Failed to fetch friend info');
        setFriendProfile(friendInfo);

        return friendInfo;
    };

    const getFirstMessage = async () => {
        try {
            setLoading(true);

            let friendProfile = await getFriendProfile();

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
        let friend = friendProfile;
        if (!friend) {
            friend = await getFriendProfile();
        }

        console.log(value);
        let time = dayjs(value).valueOf();
        const msg = await isExistMessage({
            friendUid: friend.uid,
            cursor: time,
        });
        console.log(msg);
        setMessages(msg);
    };

    const fetchNext = async () => {
        try {
            setFetchingNext(true);
            const msgs = await getMessagesAfter({
                friendUid: friendProfile.uid,
                msgId: messages[messages.length - 1].message_id,
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
                msgId: messages[0].message_id,
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
                        value={friendUrl}
                        placeholder="Enter friend uid"
                        onChange={e => setFriendUrl(e.target.value)}
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
                    />
                    <Button type="primary" onClick={getFirstMessage} loading={loading}>
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
        sender: msg?.message_sender?.id,
        time: Number(msg?.timestamp_precise),
        text: msg?.message?.text,
        sticker: msg?.sticker?.url,
        replied_to_message: msg?.replied_to_message,
        isMyMessage: msg?.message_sender?.id == myProfile.uid,
    };
}

function MessageItem({ message, myProfile, friendProfile }) {
    const info = getMessageInfo(message, myProfile);

    return (
        <div style={{ display: 'flex', width: '100%', padding: 8 }}>
            {info.isMyMessage && <div style={{ flex: 1 }}></div>}
            <Tooltip
                title={dayjs(info.time).format('YYYY-MM-DD HH:mm')}
                placement={info.isMyMessage ? 'left' : 'right'}
                style={{ width: '100%' }}
            >
                {info.text && (
                    <Typography.Text
                        style={{
                            wordBreak: 'break-word',
                            padding: '8px 12px',
                            borderRadius: 24,
                            backgroundColor: info.isMyMessage ? '#0084ff' : '#303030',
                        }}
                    >
                        {info.text}
                    </Typography.Text>
                )}
                {info.sticker && <Image width={150} src={info.sticker} />}
            </Tooltip>
        </div>
    );
}
