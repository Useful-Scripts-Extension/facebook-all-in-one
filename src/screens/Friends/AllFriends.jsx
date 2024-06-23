import { useEffect, useMemo, useState } from 'react';
import { App, Avatar, Button, Image, Row, Tag, Tooltip, Typography } from 'antd';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import useStore, { selectors } from '../../store';
import { getAllFriends, getFbUrlFromId } from '../../utils/facebook';
import MyTable from '../../components/MyTable';

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
        if (profile?.uid && !friends?.length) {
            onClickReload();
        }
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

    const onClickExport = (selectedData, type) => {};

    const onClickDelete = selectedData => {};

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
                        <Avatar shape="square" src={<Image src={record.avatar} />} size={50} />
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
                        <Button
                            type="primary"
                            danger
                            icon={<i className="fa-solid fa-trash"></i>}
                        ></Button>
                    </Tooltip>
                </>
            ),
            width: 150,
            align: 'right',
        },
    ];

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
                loadingOnReloadButton={loading}
                onClickReload={onClickReload}
                onClickExport={onClickExport}
                onClickDelete={onClickDelete}
                keyExtractor={_ => _.uid}
                style={{ flex: 1, maxHeight: '100%' }}
            />
        </div>
    );
}
