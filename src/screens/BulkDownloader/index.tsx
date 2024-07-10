import React, { useEffect, useRef, useState } from 'react';
import { Space, Tabs, TabsProps, Input, Select, SelectProps } from 'antd';
import { useTranslation } from 'react-i18next';
import {
    ACCESS_TOKEN_TYPE,
    getAccessToken,
    getAllAlbums,
    getHoverCard,
    getPageIdFromUrl,
} from '../../utils/facebook';

const { Search } = Input;

const tabItems: TabsProps['items'] = [
    {
        key: '1',
        label: 'About',
        children: 'Content of Tab Pane 1',
    },
    {
        key: '2',
        label: 'Albums',
        children: 'Content of Tab Pane 2',
    },
    {
        key: '3',
        label: 'Feeds',
        children: 'Content of Tab Pane 3',
    },
];

const enum TargetType {
    User = 'User',
    Page = 'Page',
    Group = 'Group',
}

const options: SelectProps['options'] = [
    {
        label: (
            <Space>
                <i className="fa-solid fa-user"></i> User
            </Space>
        ),
        value: TargetType.User,
    },
    {
        label: (
            <Space>
                <i className="fa-solid fa-pager"></i> Page
            </Space>
        ),
        value: TargetType.Page,
    },
    {
        label: (
            <Space>
                <i className="fa-solid fa-people-group"></i> Group
            </Space>
        ),
        value: TargetType.Group,
    },
];

export default function BulkDownloader() {
    const { t } = useTranslation();
    const [targetType, setTargetType] = useState(TargetType.User);
    const [targetId, setTargetId] = useState('100083616450189');
    const [data, setData] = useState(null);

    const [searching, setSearching] = useState(false);

    const accessTokenRef = useRef(null);

    useEffect(() => {
        // getAccessToken(ACCESS_TOKEN_TYPE.EAAB)
        //     .then(accessToken => (accessTokenRef.current = accessToken))
        //     .catch(alert);
    }, []);

    const onSearch = async () => {
        setSearching(true);
        try {
            const accessToken = await getAccessToken(ACCESS_TOKEN_TYPE.EAAB);
            console.log('accessToken', accessToken);
            const albums = await getAllAlbums({
                id: targetId,
                accessToken,
                onProgress: data => {
                    console.log('onProgress', data);
                },
            });
            console.log('albums', albums);
        } catch (e) {
            alert('Error: ' + e);
        } finally {
            setSearching(false);
        }
    };

    const onChangeTab = () => {};

    return (
        <Space style={{ width: '100%', height: '100%' }} direction="vertical">
            <Space
                direction="vertical"
                style={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                <h2>{t('Bulk downloader')}</h2>
                <Space.Compact>
                    <Select
                        defaultValue={TargetType.User}
                        options={options}
                        size="large"
                        value={targetType}
                        onChange={setTargetType}
                    />
                    <Search
                        value={targetId}
                        placeholder={t('Enter id of ') + targetType}
                        size="large"
                        style={{ width: 300 }}
                        onChange={e => setTargetId(e.target.value)}
                        onSearch={onSearch}
                        enterButton={<i className="fa-solid fa-wand-magic-sparkles"></i>}
                        loading={searching}
                    />
                </Space.Compact>
            </Space>

            {data ? (
                <Tabs defaultActiveKey="1" centered items={tabItems} onChange={onChangeTab} />
            ) : null}
        </Space>
    );
}
