import { useEffect, useState } from 'react';
import { App, Avatar, Button, Dropdown, Row, Space, Tag, Tooltip, Typography } from 'antd';
import { MessageTwoTone } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import fileDownload from 'js-file-download';
import { useNavigate } from 'react-router-dom';
import useStore, { selectors } from '../../store';
import MyTable from '../../components/MyTable';
import { getAllMessages, getFbUrlFromId } from '../../utils/facebook';
import { numberWithCommas, objectToCsv } from '../../utils/helper';

const { Title } = Typography;

export default function AllMessages() {
    const { message } = App.useApp();
    const { t } = useTranslation();
    const navigate = useNavigate();

    const profile = useStore(selectors.profile) ?? {};
    const messages = useStore(selectors.messages) ?? [];
    const setMessages = useStore(selectors.setMessages);

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!messages?.length) onClickReload();
    }, []);

    const onClickReload = () => {
        if (loading) return;
        message.loading(t('Fetching messages...'));
        setLoading(true);
        getAllMessages()
            .then(data => {
                console.log(data);
                if (!data?.length) return message.error(t('No data to show'));
                setMessages(data);
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
        let dataToSave = selectedData?.length ? selectedData : messages;

        if (!dataToSave?.length) return message.error(t('No data to export'));

        if (type == 'json') {
            fileDownload(JSON.stringify(dataToSave), 'messages.json');
        } else if (type == 'csv') {
            dataToSave = dataToSave.map(_ => {
                return {
                    ..._,
                    participants: _.participants.map(_ => _.name).join(', '),
                    participantIds: _.participants.map(_ => _.id).join(', '),
                };
            });
            const csv = objectToCsv(dataToSave);
            fileDownload(csv, 'messages.csv');
        } else message.error(t('Unsupported file type'));
    };

    const onClickDelete = selectedData => {
        console.log(selectedData);
    };

    const onClickFirstMessages = record => () => {
        navigate('/messages/first', {
            state: { threadId: record.id },
        });
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
                        {record.isGroup ? (
                            <Dropdown
                                arrow
                                overlayStyle={{
                                    maxHeight: '350px',
                                    overflow: 'auto',
                                    border: '1px dashed gray',
                                    borderRadius: '5px',
                                }}
                                menu={{
                                    items: [
                                        {
                                            key: '-1',
                                            type: 'group',
                                            label: (
                                                <Title level={5} style={{ textAlign: 'center' }}>
                                                    {t('{{count}} members', {
                                                        count: record.participants?.length,
                                                    })}
                                                </Title>
                                            ),
                                        },
                                        { type: 'divider' },
                                        ...(record.participants?.map?.(_ => ({
                                            key: _.id,
                                            label: <b>{_.name}</b>,
                                            icon: <Avatar shape="square" src={_.avatar} />,
                                            onClick: () => window.open(getFbUrlFromId(_.id)),
                                        })) || []),
                                    ],
                                }}
                            >
                                <Space>
                                    {record.image ? (
                                        <Avatar shape="square" src={record.image} />
                                    ) : (
                                        <Avatar.Group max={{ count: 5 }}>
                                            {record.participants
                                                .filter(_ => _.id != profile?.id)
                                                .map(_ => (
                                                    <Avatar key={_.id} src={_.avatar} />
                                                ))}
                                        </Avatar.Group>
                                    )}
                                </Space>
                            </Dropdown>
                        ) : (
                            <Avatar
                                shape="square"
                                src={record.image || record.participants[0].avatar}
                            />
                        )}
                        <a href={record.url} target="_blank" style={{ marginLeft: '10px' }}>
                            <b>{record.name}</b>
                        </a>
                    </Row>
                );
            },
            filters: [
                {
                    text: t('Inactive'),
                    value: 'inactive',
                },
            ],
            onFilter: (value, record) => {
                if (value == 'inactive')
                    return record.name == '-no data-' || record.name == 'Người dùng Facebook';

                return true;
            },
            width: 'auto',
        },
        {
            title: 'Id',
            dataIndex: 'id',
            key: 'id',
            sorter: (a, b) => a.id > b.id,
            width: 150,
        },
        {
            title: t('Messages'),
            dataIndex: 'count',
            key: 'count',
            sorter: (a, b) => a.count - b.count,
            render: (text, record, index) => numberWithCommas(record.count),
            width: 100,
            align: 'right',
        },
        {
            title: t('Member'),
            dataIndex: 'participants',
            key: 'participants',
            sorter: (a, b) => a.participants.length - b.participants.length,
            render: (text, record, index) => numberWithCommas(record.participants.length),
            width: 100,
            align: 'right',
        },
        {
            title: t('Type'),
            dataIndex: 'type',
            key: 'type',
            // sorter: (a, b) => a.isGroup > b.isGroup,
            render: (text, record, index) => (record.isGroup ? t('Group') : t('Personal')),
            filters: [
                {
                    text: t('Group'),
                    value: true,
                },
                {
                    text: t('Personal'),
                    value: false,
                },
            ],
            onFilter: (value, record) => record.isGroup == value,
            width: 100,
            align: 'right',
        },
        {
            title: t('Action'),
            dataIndex: 'action',
            key: 'download',
            render: (text, record, index) => (
                <>
                    {!record.isGroup ? (
                        <Tooltip title={t('First messages')}>
                            <Button
                                type="primary"
                                icon={<i className="fa-solid fa-clock-rotate-left"></i>}
                                style={{ marginRight: '5px' }}
                                onClick={onClickFirstMessages(record)}
                            ></Button>
                        </Tooltip>
                    ) : null}
                    <Tooltip title={t('Download')}>
                        <Button
                            type="primary"
                            icon={<i className="fa-solid fa-download"></i>}
                            style={{ marginRight: '5px' }}
                        ></Button>
                    </Tooltip>
                    <Tooltip title={t('Delete')}>
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
        <>
            <Row align="middle" style={{ margin: '16px' }}>
                <MessageTwoTone style={{ fontSize: '24px', marginRight: '10px' }} />
                <Title level={3} style={{ margin: 0 }}>
                    {t('Messages manager')}
                </Title>
                <Tag style={{ marginLeft: '10px', fontWeight: 'bold', color: '#888' }}>
                    {messages.length}
                </Tag>
            </Row>
            <MyTable
                data={messages}
                columns={columns}
                size="small"
                searchable
                selectable
                loadingOnReloadButton={loading}
                onClickReload={onClickReload}
                onClickExport={onClickExport}
                onClickDelete={onClickDelete}
                keyExtractor={_ => _.id}
            />
        </>
    );
}
