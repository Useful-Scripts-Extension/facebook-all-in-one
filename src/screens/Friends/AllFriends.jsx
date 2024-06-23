import { useEffect, useMemo, useState } from 'react';
import {
    App,
    Avatar,
    Button,
    Dropdown,
    Image,
    Popconfirm,
    Row,
    Tag,
    Tooltip,
    Typography,
} from 'antd';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import useStore, { selectors } from '../../store';
import { getAllFriends, getFbUrlFromId, unfriend } from '../../utils/facebook';
import MyTable from '../../components/MyTable';
import fileDownload from 'js-file-download';
import { objectToCsv } from '../../utils/helper';

const { Title } = Typography;

export default function AllFriends() {
    const { message } = App.useApp();
    const location = useLocation();
    const { t } = useTranslation();

    const profile = useStore(selectors.profile);
    const friends = useStore(selectors.friends);
    const setFriends = useStore(selectors.setFriends);

    const friendsData = useMemo(() => {
        return friends.map((f, i) => ({
            ...f,
            recent: i,
            url: getFbUrlFromId(f.uid),
        }));
    }, [friends]);

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (profile?.uid && !friends?.length) onClickReload();
    }, []);

    const onClickReload = () => {
        if (loading) return;
        message.loading(t('Fetching friends...'));
        setLoading(true);
        getAllFriends({ myUid: profile?.uid })
            .then(data => {
                if (!data?.length) return message.error(t('No data to show'));
                setFriends(data);
                message.destroy();
                message.success(t('Fetch completed'));
            })
            .catch(err => {
                message.error(t('Failed to fetch') + ': ' + err.message);
                console.log(err);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const onClickExport = (selectedData, type) => {
        let dataToSave = selectedData?.length ? selectedData : friends;
        if (!dataToSave?.length) return message.error(t('No data to export'));
        if (type == 'json') fileDownload(JSON.stringify(dataToSave), 'friends.json');
        else if (type == 'csv') fileDownload(objectToCsv(dataToSave), 'friends.csv');
        else message.error(t('Unsupported file type'));
    };

    const onClickUnfriendSelected = async selectedData => {
        for (let record of selectedData) {
            await onClickUnfriendOne(record);
        }
    };

    const onClickUnfriendOne = async record => {
        try {
            message.loading(t('Unfriending...') + ' ' + record.name);
            await unfriend({ myUid: profile?.uid, targetUid: record.uid });
            message.destroy();
            message.success(t('Unfriend completed') + ': ' + record.name);

            setFriends(friends.filter(f => f.uid !== record.uid));
        } catch (err) {
            message.error(t('Failed to unfriend') + ': ' + record.name + ': ' + err.message);
            console.log(err);
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
                <>
                    <Tooltip title={t('Unfriend')}>
                        <Popconfirm
                            title={t('Unfriend user')}
                            description={t('Are you sure to unfriend this user?')}
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
                </>
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
                        {dataSelected?.length
                            ? t('Export {{count}}', { count: dataSelected.length })
                            : t('Export')}
                    </Button>
                </Dropdown>

                {dataSelected?.length ? (
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
                            {t('Unfriend {{count}}', { count: dataSelected.length })}
                        </Button>
                    </Popconfirm>
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
