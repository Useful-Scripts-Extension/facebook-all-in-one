import { useEffect, useRef, useState } from 'react';
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
} from 'antd';
import { useTranslation } from 'react-i18next';
import useStore, { selectors } from '../../store';
import {
    getAllFriends,
    getAllLockedFriends,
    getFbUrlFromId,
    pokeFriend,
    unfriend,
} from '../../utils/facebook';
import MyTable from '../../components/MyTable';
import fileDownload from 'js-file-download';
import { objectToCsv, sleep } from '../../utils/helper';
import dayjs from 'dayjs';

const { Title } = Typography;

export default function AllFriends() {
    const { message } = App.useApp();
    const { t } = useTranslation();

    const profile = useStore(selectors.profile);
    const friends = useStore(selectors.friends);
    const setFriends = useStore(selectors.setFriends);

    const friendsData = friends.map((f, i) => ({
        ...f,
        recent: i,
        url: getFbUrlFromId(f.uid),
    }));

    const [loading, setLoading] = useState(false);
    const [loadingLockedFriends, setLoadingLockedFriends] = useState(0);
    const tableRef = useRef(null);

    useEffect(() => {
        if (profile?.uid && !friends?.length) onClickReload();
    }, []);

    const onClickReload = () => {
        if (loading) return;
        const key = 'onClickReload';
        message.loading({ key, content: t('Fetching friends...') });
        setLoading(true);
        getAllFriends({ myUid: profile?.uid })
            .then(data => {
                if (!data?.length) return message.error(t('No data to show'));
                setFriends(data);
                console.log(data);
                message.success({ key, content: t('Fetch completed') });
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

    const onClickUnfriendSelected = async selectedData => {
        const removedUid = new Set();
        for (let record of selectedData) {
            const success = await onClickUnfriendOne(record);
            if (success) removedUid.add(record.uid);
            await sleep(500);
        }
        // TODO: check why state not update correctly inside for-loop?
        setFriends(friends.filter(f => !removedUid.has(f.uid)));
    };

    const onClickUnfriendOne = async record => {
        const key = 'onClickUnfriendOne' + record.uid;
        try {
            message.loading({ key, content: t('Unfriending...') + ' ' + record.name });
            await unfriend({ myUid: profile?.uid, targetUid: record.uid });
            message.success({ key, content: t('Unfriend completed') + ': ' + record.name });

            setFriends(friends.filter(f => f.uid != record.uid));
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

    const onClickPokeSelected = async selectedData => {
        const pokedUid = new Set();
        for (let record of selectedData) {
            const success = await onClickPokeFriend(record);
            if (success) pokedUid.add(record.uid);
            await sleep(500);
        }
        message.success(t('Poke completed {{count}} friends', { count: pokedUid.size }));
    };

    const onClickPokeFriend = async record => {
        const key = 'onClickPokeFriend' + record.uid;
        try {
            message.loading({ key, content: t('Poking...') + ' ' + record.name });
            await pokeFriend({ myUid: profile?.uid, targetUid: record.uid });
            message.success({ key, content: t('Poke completed') + ': ' + record.name });
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

    const onClickFindLockedFriends = async () => {
        if (loadingLockedFriends) return;

        tableRef.current.clearFilter();

        setLoadingLockedFriends(1);
        message.loading(t('Finding locked friends...'));
        const tempFriends = [...friends];

        try {
            const lockedFriends = await getAllLockedFriends({
                myUid: profile?.uid,
                onFound: (user, lockedUsers) => {
                    message.info(
                        t('Found locked friend') +
                            ': ' +
                            user.name +
                            ' (' +
                            lockedUsers.length +
                            ')'
                    );
                    setFriends([user, ...tempFriends]);
                },
                onPage: (pageNum, loaded, locked) => {
                    setLoadingLockedFriends(locked + '/' + loaded);
                },
            });

            if (lockedFriends?.length) {
                setFriends(lockedFriends.concat(friends));
                tableRef.current.setDataSelected(lockedFriends);
                message.success(
                    t('Found {{count}} locked friends', { count: lockedFriends.length })
                );
            } else {
                message.success(t('No locked friends found'));
            }
        } catch (err) {
            message.error(t('Failed to find locked friends') + ': ' + err.message);
        }
        setLoadingLockedFriends(false);
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
                                icon={<i className="fa-solid fa-trash"></i>}
                            ></Button>
                        </Popconfirm>
                    </Tooltip>
                </Space.Compact>
            ),
            width: 150,
            align: 'right',
        },
    ];

    const renderTitle = dataSelected => {
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

                <Button
                    type="primary"
                    loading={loadingLockedFriends}
                    icon={loadingLockedFriends ? null : <i className="fa-solid fa-lock"></i>}
                    onClick={onClickFindLockedFriends}
                >
                    {t('Find locked friends') +
                        (loadingLockedFriends ? ` (${loadingLockedFriends})` : '')}
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

                {dataSelected?.length ? (
                    <>
                        <Popconfirm
                            title={t('Poke {{count}} friends', { count: dataSelected.length })}
                            description={t('Are you sure to poke these friends?')}
                            onConfirm={() => onClickPokeSelected(dataSelected)}
                            okText={t('Yes')}
                            cancelText={t('No')}
                        >
                            <Button
                                type="default"
                                icon={<i className="fa-solid fa-hand-point-right"></i>}
                            >
                                {t('Poke') + (dataSelected.length ? ' ' + dataSelected.length : '')}
                            </Button>
                        </Popconfirm>
                        <Popconfirm
                            title={t('Unfriend {{count}} friends', { count: dataSelected.length })}
                            description={t('Are you sure to unfriend these friends?')}
                            onConfirm={() => onClickUnfriendSelected(dataSelected)}
                            okText={t('Yes')}
                            cancelText={t('No')}
                        >
                            <Button
                                danger
                                type="primary"
                                icon={<i className="fa-solid fa-trash-can"></i>}
                            >
                                {t('Unfriend') +
                                    (dataSelected.length ? ' ' + dataSelected.length : '')}
                            </Button>
                        </Popconfirm>
                    </>
                ) : null}

                {dataSelected.length ? (
                    <Tag color="processing" style={{ marginLeft: '10px', fontWeight: 'bold' }}>
                        {t('Selected {{count}} friends', { count: dataSelected.length })}
                    </Tag>
                ) : null}
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
