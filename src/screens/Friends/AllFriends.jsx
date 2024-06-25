import { useEffect, useMemo, useRef, useState } from 'react';
import {
    App,
    Avatar,
    Button,
    Dropdown,
    Image,
    Popconfirm,
    Row,
    Space,
    Tag,
    Tooltip,
    Typography,
    Popover,
} from 'antd';
import { useTranslation } from 'react-i18next';
import useStore, { selectors } from '../../store';
import {
    addFriend,
    checkCanMessage,
    getAllFriends,
    getAllLockedFriends,
    getAllProfilePhotos,
    getFbUrlFromId,
    pokeFriend,
    unfriend,
} from '../../utils/facebook';
import MyTable from '../../components/MyTable';
import fileDownload from 'js-file-download';
import { objectToCsv, sleep } from '../../utils/helper';
import dayjs from 'dayjs';
import { produce } from 'immer';
import useStateStore from '../../hooks/useStateStore';
import UploadModal from '../../components/UploadModal';

const { Title } = Typography;

const FRIEND_STATUS = {
    POKED: 'Poked',
    UNFRIENDED: 'Unfriended',
    REQUESTED: 'Requested friend',
    NEW: 'New friend',
    LOCKED: 'Locked',
    BLOCKED_MESSAGE: 'Blocked messages',
};

const FRIEND_STATUS_COLOR = {
    [FRIEND_STATUS.POKED]: 'green',
    [FRIEND_STATUS.LOCKED]: 'orange',
    [FRIEND_STATUS.UNFRIENDED]: 'red',
    [FRIEND_STATUS.BLOCKED_MESSAGE]: 'red',
    [FRIEND_STATUS.NEW]: 'blue',
    [FRIEND_STATUS.REQUESTED]: 'pink',
};

const canAddFriend = friend => {
    const s = friend?.statuses || [];
    return (
        !s.includes(FRIEND_STATUS.REQUESTED) &&
        (s.includes(FRIEND_STATUS.NEW) || s.includes(FRIEND_STATUS.UNFRIENDED))
    );
};

const canUnfriend = friend => {
    const s = friend?.statuses || [];
    return !s.includes(FRIEND_STATUS.NEW) && !s.includes(FRIEND_STATUS.UNFRIENDED);
};

export default function AllFriends() {
    const { message, notification } = App.useApp();
    const { t } = useTranslation();

    const profile = useStore(selectors.profile);
    const [friends, setFriends] = useStateStore(selectors.friends, selectors.setFriends);

    const friendsData = useMemo(
        () =>
            friends?.map((f, i) => ({
                ...f,
                recent: i,
                url: getFbUrlFromId(f.uid),
            })) || [],
        [friends]
    );

    const [loading, setLoading] = useState(false);
    const [loadingLockedFriends, setLoadingLockedFriends] = useState(0);
    const [loadingBlockedMessages, setLoadingBlockedMessages] = useState(0);
    const tableRef = useRef(null);

    useEffect(() => {
        if (profile?.uid && !friends?.length) onClickReload();

        // getAllProfilePhotos({ uid: '100003208487477', onProgress: data => console.log(data) }).then(
        //     console.log
        // );
    }, []);

    const updateFriendStatus = (friends, status, override = false, insertAtStart = false) => {
        setFriends(preFriends => {
            const newFriends = produce(preFriends, draft => {
                if (!Array.isArray(friends)) friends = [friends];
                for (let friend of friends) {
                    let found = draft.find(f => f.uid == friend.uid);
                    if (found) {
                        if (!found.statuses) found.statuses = [];
                        if (!override && !found.statuses.includes(status))
                            found.statuses.push(status);
                        else {
                            if (!Array.isArray(status)) status = [status];
                            found.statuses = status;
                        }
                    } else {
                        if (insertAtStart) draft.unshift({ ...friend, statuses: [status] });
                        else draft.push({ ...friend, statuses: [status] });
                    }
                }
                return draft;
            });
            return newFriends;
        });
    };

    const onClickReload = () => {
        if (loading) return;
        const key = 'onClickReload';
        message.loading({ key, content: t('Fetching friends...') }, 0);
        setLoading(true);
        getAllFriends({ myUid: profile?.uid })
            .then(data => {
                if (!data?.length) return message.error(t('No data to show'));
                setFriends(data);
                console.log(data);
                message.success({ key, content: t('Fetch completed') });
                tableRef.current.clearFilter();
            })
            .catch(err => {
                message.error({ key, content: t('Failed to fetch') + ': ' + err.message });
                console.log(err);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const onClickExport = (selectedData, type) => {
        let dataToSave = selectedData?.length ? selectedData : friends;
        if (!dataToSave?.length) return message.error(t('No data to export'));
        let filename = 'friends_' + dayjs().format('YYYY-MM-DD-HHmmss');
        if (type == 'json') fileDownload(JSON.stringify(dataToSave), filename + '.json');
        else if (type == 'csv') fileDownload(objectToCsv(dataToSave), filename + '.csv');
        else message.error(t('Unsupported file type'));
    };

    const onClickUnfriendOne = async record => {
        const key = 'onClickUnfriendOne' + record.uid;
        try {
            message.loading({ key, content: t('Unfriending...') + ' ' + record.name }, 0);
            await unfriend({ myUid: profile?.uid, targetUid: record.uid });
            message.success({ key, content: t('Unfriend completed') + ': ' + record.name });

            updateFriendStatus(record, FRIEND_STATUS.UNFRIENDED);
            return true;
        } catch (err) {
            message.error({
                key,
                content: t('Failed to unfriend') + ': ' + record.name + ': ' + err.message,
            });
            console.log(err);
            return false;
        }
    };

    const onClickUnfriendSelected = async selectedData => {
        const removedUid = new Set();
        for (let record of selectedData) {
            const success = await onClickUnfriendOne(record);
            if (success) removedUid.add(record.uid);
            await sleep(500);
        }
        notification.success({
            message: t('Success'),
            description: t('Unfriended completed {{count}} friends', {
                count: removedUid.size + '/' + selectedData.length,
            }),
            duration: 0,
        });
    };

    const onClickPokeFriend = async record => {
        const key = 'onClickPokeFriend' + record.uid;
        try {
            message.loading({ key, content: t('Poking...') + ' ' + record.name }, 0);
            await pokeFriend({ myUid: profile?.uid, targetUid: record.uid });
            message.success({ key, content: t('Poke completed') + ': ' + record.name });
            updateFriendStatus(record, FRIEND_STATUS.POKED);
            return true;
        } catch (err) {
            message.error({
                key,
                content: t('Failed to poke') + ': ' + record.name + ': ' + err.message,
            });
            console.log(err);
            return false;
        }
    };

    const onClickPokeSelected = async selectedData => {
        const pokedUid = new Set();
        for (let record of selectedData) {
            const success = await onClickPokeFriend(record);
            if (success) pokedUid.add(record.uid);
            await sleep(500);
        }
        notification.success({
            message: t('Success'),
            description: t('Poke completed {{count}} friends', {
                count: pokedUid.size + '/' + selectedData.length,
            }),
            duration: 0,
        });
    };

    const onClickAddFriend = async record => {
        const key = 'onClickAddFriend' + record.uid;
        try {
            message.loading(
                { key, content: t('Sending friend request...') + ' ' + record.name },
                0
            );
            await addFriend({ myUid: profile?.uid, targetUid: record.uid });
            message.success({
                key,
                content: t('Send friend request success') + ': ' + record.name,
            });
            updateFriendStatus(record, FRIEND_STATUS.REQUESTED);
            return true;
        } catch (e) {
            message.error({ key, content: t('Failed to send friend request') + ': ' + e.message });
            return false;
        }
    };

    const onClickAddFriendSelected = async selectedData => {
        const addedUid = new Set();
        for (let record of selectedData) {
            const success = await onClickAddFriend(record);
            if (success) addedUid.add(record.uid);
            await sleep(500);
        }
        notification.success({
            message: t('Success'),
            description: t('Send friend request success {{count}} users', {
                count: addedUid.size + '/' + selectedData.length,
            }),
            duration: 0,
        });
    };

    const onClickFindLockedFriends = async () => {
        if (loadingLockedFriends) return;

        tableRef.current.clearFilter();

        setLoadingLockedFriends('...');
        message.loading(t('Finding locked friends...'));

        try {
            const lockedFriends = await getAllLockedFriends({
                myUid: profile?.uid,
                onFound: (user, lockedUsers) => {
                    message.info(
                        t('Found locked friend') + `: ${user.name} (${lockedUsers.length})`
                    );
                    updateFriendStatus(user, FRIEND_STATUS.LOCKED);
                },
                onPage: (pageNum, loaded, locked) => {
                    setLoadingLockedFriends(
                        `${locked}/${loaded} - ${~~((loaded / friends.length) * 100)}%`
                    );
                },
            });

            if (lockedFriends?.length) {
                tableRef.current.setDataSelected(lockedFriends);
                notification.success({
                    message: t('Success'),
                    description: t('Found {{count}} locked friends', {
                        count: lockedFriends.length,
                    }),
                    duration: 0,
                });
            } else {
                notification.info({
                    message: t('Success'),
                    description: t('No locked friends found'),
                });
            }
        } catch (err) {
            notification.error({
                message: t('Error'),
                description: t('Failed to find locked friends') + ': ' + err.message,
                duration: 0,
            });
            console.log(err);
        }
        setLoadingLockedFriends(false);
    };

    const onClickFindBlockedMessages = async () => {
        if (loadingBlockedMessages) return;
        setLoadingBlockedMessages(true);

        const dataSelected = tableRef.current.getDataSelected();

        const listFriendsToCheck = dataSelected?.length ? dataSelected : friends;

        const key = 'onClickFindBlockedMessages';
        message.loading({ key, content: t('Finding blocked messages...') }, 0);

        const blockedMessages = [];
        for (let i = 0; i < listFriendsToCheck.length; i++) {
            const friend = listFriendsToCheck[i];
            setLoadingBlockedMessages(
                `${blockedMessages.length}/${i + 1} - ${~~((i / listFriendsToCheck.length) * 100)}%`
            );
            if (!(await checkCanMessage(friend.uid))) {
                blockedMessages.push(friend);
                tableRef.current.setDataSelected(blockedMessages);
                updateFriendStatus(friend, FRIEND_STATUS.BLOCKED_MESSAGE);
                message.success({
                    key,
                    content: t('Found') + ' ' + friend.name + ' (' + blockedMessages.length + ')',
                });
            }
        }
        setLoadingBlockedMessages(false);

        const content = blockedMessages.length
            ? t('Found {{count}} friends blocking your messages', {
                  count: blockedMessages.length,
              })
            : t('No blocked messages found');
        message.success({ key, content });
        notification.success({
            message: t('Success'),
            description: content,
            duration: 0,
        });
    };

    const onUploadFriendsFile = async text => {
        if (!text) return message.error(t('File empty'));

        try {
            const json = JSON.parse(text);
            if (!json?.length) return message.error(t('No data'));

            // TODO validate json data + support import list uid
            // for (let friend of json) {
            //     console.log(typeof friend);
            // }
            // return;

            // check new friends
            const newFriends = [];
            for (let friend of friends) {
                let foundInFile = json.find(f => f.uid == friend.uid);
                if (!foundInFile) newFriends.push(friend);
            }

            // check unfriended
            const removedFriends = [];
            for (let friend of json) {
                let foundInCurrent = friends.find(f => f.uid == friend.uid);
                if (!foundInCurrent) {
                    removedFriends.push(friend);
                }
            }

            updateFriendStatus(newFriends, FRIEND_STATUS.NEW);
            updateFriendStatus(removedFriends, FRIEND_STATUS.UNFRIENDED);

            [
                t('Found {{count}} new friends', { count: newFriends.length }),
                t('Found {{count}} unfriended', { count: removedFriends.length }),
            ].forEach(text =>
                notification.success({
                    message: t('Success'),
                    description: text,
                    duration: 0,
                })
            );

            // show unfriended / new friends
            if (removedFriends.length || newFriends.length) {
                tableRef.current.setDataSelected([...removedFriends, ...newFriends]);
            }
        } catch (err) {
            message.error(err.message);
        }
    };

    const columns = [
        {
            title: '#',
            key: 'recent',
            dataIndex: 'recent',
            sorter: (a, b) => a.recent - b.recent,
            render: (text, record, index) => record.recent + 1,
            width: 70,
            align: 'center',
            headerAlign: 'center',
        },
        {
            title: t('Name'),
            dataIndex: 'name',
            key: 'name',
            sorter: (a, b) => a.name.localeCompare(b.name),
            render: (text, record, index) => {
                return (
                    <Row align="middle">
                        <Avatar
                            shape="square"
                            src={<Image src={record.avatarLarge} fallback={record.avatar} />}
                            size={50}
                        />
                        <a href={record.url} target="_blank" style={{ marginLeft: '10px' }}>
                            <b>{record.name}</b>
                        </a>
                    </Row>
                );
            },
            width: 'auto',
        },
        {
            title: t('Friend status'),
            dataIndex: 'status',
            key: 'status',
            sorter: (a, b) => a.status - b.status,
            width: 150,
            filters: Object.entries(FRIEND_STATUS).map(([key, value]) => ({
                text:
                    t(value) + ' (' + friends.filter(f => f.statuses?.includes(value)).length + ')',
                value,
            })),
            onFilter: (value, record) => record.statuses?.includes(value),
            render: (text, record, index) => {
                if (!record?.statuses?.length) return t('Friend');
                return record.statuses
                    .map(status => ({
                        key: status,
                        value: t(status),
                    }))
                    .map(({ key, value }) => (
                        <Tag key={key} color={FRIEND_STATUS_COLOR[key]}>
                            {value}
                        </Tag>
                    ));
            },
        },
        {
            title: 'Uid',
            dataIndex: 'uid',
            key: 'uid',
            sorter: (a, b) => a.uid > b.uid,
            width: 150,
        },
        {
            title: t('Action'),
            dataIndex: 'action',
            key: 'download',
            render: (text, record, index) => (
                <Space.Compact>
                    <Tooltip title={t('Poke')}>
                        <Popconfirm
                            title={t('Poke friend')}
                            description={t('Are you sure want to poke this friend?')}
                            onConfirm={() => onClickPokeFriend(record)}
                            okText={t('Yes')}
                            cancelText={t('No')}
                        >
                            <Button
                                type="default"
                                icon={<i className="fa-regular fa-hand-point-right"></i>}
                            ></Button>
                        </Popconfirm>
                    </Tooltip>

                    {record.statuses?.includes(FRIEND_STATUS.UNFRIENDED) ||
                    record.statuses?.includes(FRIEND_STATUS.NEW) ? (
                        <Tooltip title={t('Request friend')}>
                            <Popconfirm
                                title={t('Request make friend')}
                                description={t(
                                    'Are you sure want to request make friend with this user?'
                                )}
                                onConfirm={() => onClickAddFriend(record)}
                                okText={t('Yes')}
                                cancelText={t('No')}
                            >
                                <Button
                                    type="default"
                                    icon={<i className="fa-solid fa-user-plus"></i>}
                                ></Button>
                            </Popconfirm>
                        </Tooltip>
                    ) : (
                        <Tooltip title={t('Unfriend')}>
                            <Popconfirm
                                title={t('Unfriend user')}
                                description={t('Are you sure want to unfriend this user?')}
                                onConfirm={() => onClickUnfriendOne(record)}
                                okText={t('Yes')}
                                cancelText={t('No')}
                            >
                                <Button
                                    danger
                                    type="primary"
                                    icon={<i className="fa-solid fa-trash-can"></i>}
                                ></Button>
                            </Popconfirm>
                        </Tooltip>
                    )}
                </Space.Compact>
            ),
            width: 150,
            align: 'right',
        },
    ];

    const renderTitle = dataSelected => {
        const _canAddFriend = dataSelected?.filter?.(canAddFriend);
        const _canUnfriend = dataSelected?.filter?.(canUnfriend);
        return (
            <>
                <Button
                    type="primary"
                    icon={
                        loading ? (
                            <i className="fa-solid fa-rotate-right fa-spin"></i>
                        ) : (
                            <i className="fa-solid fa-rotate-right"></i>
                        )
                    }
                    onClick={onClickReload}
                >
                    {t('Reload')}
                </Button>

                <Dropdown
                    menu={{
                        items: [
                            { key: 'json', label: '.json' },
                            { key: 'csv', label: '.csv' },
                        ],
                        onClick: e => onClickExport(dataSelected, e.key),
                    }}
                >
                    <Button type="primary" icon={<i className="fa-solid fa-download"></i>}>
                        {t('Export') +
                            ' ' +
                            (dataSelected?.length ? dataSelected?.length : friendsData.length)}
                    </Button>
                </Dropdown>

                <Space.Compact>
                    <Tooltip title={t('Find locked friends')}>
                        <Button
                            loading={loadingLockedFriends}
                            icon={<i className="fa-solid fa-lock"></i>}
                            onClick={onClickFindLockedFriends}
                        >
                            {t('Locked friends')}
                            {loadingLockedFriends ? ` (${loadingLockedFriends})` : ''}
                        </Button>
                    </Tooltip>

                    <Popover
                        title={t('Check who is blocking your messages')}
                        content={
                            dataSelected?.length
                                ? t('Check in {{count}} friends selected', {
                                      count: dataSelected?.length,
                                  })
                                : t('TIP: You can select friends to check instead of check all')
                        }
                    >
                        <Popconfirm
                            title={t('Check who is blocking your messages')}
                            description={t('Are you sure to check {{count}} friends?', {
                                count: dataSelected?.length || friendsData.length,
                            })}
                            onConfirm={onClickFindBlockedMessages}
                            okText={t('Yes')}
                            cancelText={t('No')}
                        >
                            <Button
                                loading={loadingBlockedMessages}
                                icon={<i className="fa-solid fa-comment-slash"></i>}
                            >
                                {t('Blocked messages')}
                                {loadingBlockedMessages ? ` (${loadingBlockedMessages})` : ''}
                            </Button>
                        </Popconfirm>
                    </Popover>

                    <UploadModal
                        accept=".json"
                        title={t('Upload friends file')}
                        text={t('Click or drag file to this area to upload')}
                        hint={t('Support only .json backup file')}
                        onSubmit={onUploadFriendsFile}
                        renderButton={({ showModal }) => (
                            <Popover
                                title={t('Check who unfriend you')}
                                content={t(
                                    'How it work: Export friends data to file, then compare it later'
                                )}
                            >
                                <Button
                                    // loading={loadingLockedFriends}
                                    icon={<i className="fa-solid fa-user-large-slash"></i>}
                                    onClick={showModal}
                                >
                                    {t('Detect unfriend')}
                                </Button>
                            </Popover>
                        )}
                    />
                    {dataSelected?.length ? (
                        <>
                            <Popconfirm
                                title={t('Poke {{count}} selected friends', {
                                    count: dataSelected.length,
                                })}
                                description={t('Are you sure to poke these friends?')}
                                onConfirm={() => onClickPokeSelected(dataSelected)}
                                okText={t('Yes')}
                                cancelText={t('No')}
                            >
                                <Tooltip
                                    title={t('Poke {{count}} selected friends', {
                                        count: dataSelected.length,
                                    })}
                                >
                                    <Button
                                        type="default"
                                        icon={<i className="fa-solid fa-hand-point-right"></i>}
                                    >
                                        {dataSelected.length ? ' ' + dataSelected.length : ''}
                                    </Button>
                                </Tooltip>
                            </Popconfirm>

                            {_canAddFriend?.length > 0 ? (
                                <Popconfirm
                                    title={t('Request friend {{count}} selected users', {
                                        count: _canAddFriend.length,
                                    })}
                                    description={t('Are you sure to add friend these users?')}
                                    onConfirm={() => onClickAddFriendSelected(_canAddFriend)}
                                    okText={t('Yes')}
                                    cancelText={t('No')}
                                >
                                    <Tooltip
                                        title={t('Add friend {{count}} selected users', {
                                            count: _canAddFriend.length,
                                        })}
                                    >
                                        <Button icon={<i className="fa-solid fa-user-plus"></i>}>
                                            {_canAddFriend.length}
                                        </Button>
                                    </Tooltip>
                                </Popconfirm>
                            ) : null}

                            {_canUnfriend?.length > 0 ? (
                                <Popconfirm
                                    title={t('Unfriend {{count}} selected friends', {
                                        count: _canUnfriend.length,
                                    })}
                                    description={t('Are you sure to unfriend these friends?')}
                                    onConfirm={() => onClickUnfriendSelected(_canUnfriend)}
                                    okText={t('Yes')}
                                    cancelText={t('No')}
                                >
                                    <Tooltip
                                        title={t('Unfriend {{count}} selected friends', {
                                            count: _canUnfriend.length,
                                        })}
                                    >
                                        <Button
                                            danger
                                            type="primary"
                                            icon={<i className="fa-solid fa-trash-can"></i>}
                                        >
                                            {_canUnfriend.length}
                                        </Button>
                                    </Tooltip>
                                </Popconfirm>
                            ) : null}
                        </>
                    ) : null}
                </Space.Compact>
            </>
        );
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100%' }}>
            <Row align="middle" style={{ margin: '16px' }}>
                <Title level={3} style={{ margin: 0 }}>
                    {t('Friends manager')}
                </Title>
                <Tag style={{ marginLeft: '10px', fontWeight: 'bold', color: '#888' }}>
                    {friendsData.length}
                </Tag>
            </Row>
            <MyTable
                ref={tableRef}
                data={friendsData}
                columns={columns}
                size="small"
                searchable
                selectable
                keyExtractor={_ => _.uid}
                style={{ flex: 1, maxHeight: '100%' }}
                renderTitle={renderTitle}
            />
        </div>
    );
}
