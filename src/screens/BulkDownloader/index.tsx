import React, { useEffect, useMemo, useState } from 'react';
import { Space, Tabs, TabsProps, Input, Card, Avatar, FloatButton, message } from 'antd';
import { useTranslation } from 'react-i18next';
import {
    getEntityAbout,
    getUserReels,
    IAlbum,
    IEntityAbout,
    TargetType,
    trackEvent,
} from '../../utils/facebook';
import { useLocation } from 'react-router-dom';

const Albums = React.lazy(() => import('./Albums'));
const Videos = React.lazy(() => import('./Videos'));
const Photos = React.lazy(() => import('./Photos'));
const Album = React.lazy(() => import('./Album'));
const GroupFiles = React.lazy(() => import('./GroupFiles'));
const Reels = React.lazy(() => import('./Reels'));

const { Search } = Input;

const enum TabKey {
    Albums = 'Albums',
    Videos = 'Videos',
    Photos = 'Photos',
    Album = 'Album-',
    Files = 'Files',
    Reels = 'Reels',
}

type Tab = {
    key: string;
    label: string;
    closable?: boolean;
    props?: any;
};

const DefaultTabs: Tab[] = [
    { key: TabKey.Photos, label: TabKey.Photos, closable: false },
    { key: TabKey.Videos, label: TabKey.Videos, closable: false },
    { key: TabKey.Albums, label: TabKey.Albums, closable: false },
    { key: TabKey.Files, label: TabKey.Files, closable: false },
    { key: TabKey.Reels, label: TabKey.Reels, closable: false },
];

export default function BulkDownloader() {
    const { t } = useTranslation();
    const location = useLocation();

    const _targetId = location.state?.targetId || '';

    const [activeKey, setActiveKey] = useState<string>('');
    const [tabs, setTabs] = useState(DefaultTabs);
    const [loading, setLoading] = useState(false);
    const [about, setAbout] = useState(null as IEntityAbout | null);
    const [targetId, setTargetId] = useState(_targetId);

    const targetType = about?.type || TargetType.User;

    const desc = useMemo(() => {
        switch (targetType) {
            case TargetType.User:
                return (
                    <Space>
                        <i className="fa-solid fa-user"></i> User
                    </Space>
                );
            case TargetType.Group:
                return (
                    <Space>
                        <i className="fa-solid fa-people-group"></i> Group
                    </Space>
                );
            case TargetType.Page:
                return (
                    <Space>
                        <i className="fa-solid fa-pager"></i> Page
                    </Space>
                );
            default:
                return 'Unknow';
        }
    }, [targetType]);

    useEffect(() => {
        if (_targetId) onSearch(_targetId);
    }, [_targetId]);

    const onSearch = (id = targetId) => {
        trackEvent('BulkDownloader:onSearch');
        setLoading(true);

        getUserReels({ id });
        getEntityAbout(id)
            .then(data => {
                console.log(data);
                setAbout(data);
                setTabs(DefaultTabs);
            })
            .catch(e => {
                message.error(e.message);
            })
            .finally(() => setLoading(false));
    };

    const onChangeTab = key => {
        trackEvent('BulkDownloader:onChangeTab:' + key);
        setActiveKey(key);
    };

    const onEdit = (
        targetKey: React.MouseEvent | React.KeyboardEvent | string,
        action: 'add' | 'remove'
    ) => {
        if (action === 'remove') {
            let newActiveKey = activeKey;
            let lastIndex = -1;
            tabs.forEach((item, i) => {
                if (item.key === targetKey) {
                    lastIndex = i - 1;
                }
            });
            const newPanes = tabs.filter(item => item.key !== targetKey);
            if (newPanes.length && newActiveKey === targetKey) {
                if (lastIndex >= 0) {
                    newActiveKey = newPanes[lastIndex].key;
                } else {
                    newActiveKey = newPanes[0].key;
                }
            }
            setTabs(newPanes);
            setActiveKey(newActiveKey);
        }
    };

    const onOpenAlbum = (album: IAlbum) => {
        let tabKey = TabKey.Album + album.id;
        trackEvent('BulkDownloader:onOpenAlbum');
        setTabs(prev => [
            ...prev,
            {
                key: tabKey,
                label: 'Album: ' + album.name,
                closable: true,
                props: {
                    album,
                },
            },
        ]);
        setActiveKey(tabKey);
    };

    const getComp = (tab: Tab) => {
        switch (tab.key) {
            case TabKey.Photos:
                return <Photos target={about} />;
            case TabKey.Videos:
                return <Videos target={about} />;
            case TabKey.Albums:
                return <Albums target={about} onOpenAlbum={onOpenAlbum} />;
            case TabKey.Files:
                if (targetType === TargetType.Group) return <GroupFiles target={about} />;
                return null;
            case TabKey.Reels:
                return <Reels target={about} />;
            default:
                if (tab.key.startsWith(TabKey.Album)) {
                    return <Album target={about} album={tab.props?.album} />;
                }
                return null;
        }
    };

    const tabItems: TabsProps['items'] = about
        ? tabs
              .map(tab => {
                  const comp = getComp(tab);
                  return {
                      key: tab.key,
                      label: tab.label,
                      closable: tab.closable,
                      children: comp,
                  };
              })
              .filter(_ => _.children)
        : [];

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
                <h2>{t('Bulk Downloader')}</h2>

                <Search
                    value={targetId}
                    placeholder={t('Enter id of user/page/group')}
                    size="large"
                    style={{ width: 350 }}
                    onChange={e => setTargetId(e.target.value)}
                    onSearch={() => onSearch()}
                    enterButton={loading ? null : <i className="fa-solid fa-magnifying-glass"></i>}
                    loading={loading}
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
                                description={desc}
                            />
                        </Card>
                    </Space>
                ) : null}
            </Space>

            {tabItems.length ? (
                <Tabs
                    defaultActiveKey={activeKey}
                    activeKey={activeKey}
                    type="editable-card"
                    centered
                    hideAdd
                    items={tabItems}
                    onChange={onChangeTab}
                    onEdit={onEdit}
                />
            ) : null}

            <FloatButton.BackTop />
        </Space>
    );
}
