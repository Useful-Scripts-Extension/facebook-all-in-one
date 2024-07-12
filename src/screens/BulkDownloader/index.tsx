import React, { useCallback, useEffect, useState } from 'react';
import { Space, Tabs, TabsProps, Input, Tooltip, Card, Avatar } from 'antd';
import { useTranslation } from 'react-i18next';
import { getEntityAbout, IEntityAbout, searchUser, TargetType } from '../../utils/facebook';
import { useDebounceCallback } from 'usehooks-ts';

const Albums = React.lazy(() => import('./Albums'));
const Videos = React.lazy(() => import('./Videos'));
const Photos = React.lazy(() => import('./Photos'));

const { Search } = Input;

const enum TabKey {
    Albums = 'Albums',
    Videos = 'Videos',
    Photos = 'Photos',
}

export default function BulkDownloader() {
    const { t } = useTranslation();

    const [selectedTab, setSelectedTab] = useState(TabKey.Photos);
    const [about, setAbout] = useState(null as IEntityAbout | null);
    const [targetId, setTargetId] = useState('100050164073708');

    const targetType = about?.type || TargetType.User;

    useEffect(() => {
        const timeout = setTimeout(onSearch, 500);
        return () => clearTimeout(timeout);
    }, [targetId]);

    const onSearch = () => {
        getEntityAbout(targetId)
            .then(about => {
                if (about) {
                    setAbout(about);
                }
            })
            .catch(e => console.log(e));
    };

    const onChangeTab = key => {
        setSelectedTab(key);
    };

    const tabItems: TabsProps['items'] = [
        {
            key: TabKey.Photos,
            label: 'Photos',
            children: <Photos targetId={about?.id} targetType={about?.type} />,
        },
        {
            key: TabKey.Videos,
            label: 'Videos',
            children: <Videos targetId={about?.id} />,
        },
        {
            key: TabKey.Albums,
            label: 'Albums',
            children: <Albums targetId={about?.id} targetType={about?.type} />,
        },
    ];

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

                <Search
                    value={targetId}
                    placeholder={t('Enter id of user/page/group')}
                    size="large"
                    style={{ width: 350 }}
                    onChange={e => setTargetId(e.target.value)}
                    onSearch={onSearch}
                    // enterButton={
                    //     <Tooltip title={searching ? t('Stop') : t('Start')}>
                    //         <i className="fa-solid fa-wand-magic-sparkles"></i>
                    //     </Tooltip>
                    // }
                    // loading={searching}
                />

                {/* render about :id, url,avatar, name */}
                {about ? (
                    <Space>
                        <Card style={{ maxWidth: 500 }} actions={[]}>
                            <Card.Meta
                                avatar={<Avatar size={60} src={about.avatar} />}
                                title={
                                    <a href={about.url} target="_blank">
                                        {about.name}
                                    </a>
                                }
                                description={
                                    targetType === TargetType.User ? (
                                        <Space>
                                            <i className="fa-solid fa-user"></i> User
                                        </Space>
                                    ) : targetType === TargetType.Page ? (
                                        <Space>
                                            <i className="fa-solid fa-pager"></i> Page
                                        </Space>
                                    ) : (
                                        <Space>
                                            <i className="fa-solid fa-people-group"></i> Group
                                        </Space>
                                    )
                                }
                            />
                        </Card>
                    </Space>
                ) : null}
            </Space>

            <Tabs defaultActiveKey={selectedTab} centered items={tabItems} onChange={onChangeTab} />
        </Space>
    );
}
