import React, { useEffect, useState } from 'react';
import { Space, Tabs, TabsProps, Input, Card, Avatar, FloatButton } from 'antd';
import { useTranslation } from 'react-i18next';
import { getEntityAbout, IAlbum, IEntityAbout, TargetType, trackEvent } from '../../utils/facebook';

const Albums = React.lazy(() => import('./Albums'));
const Videos = React.lazy(() => import('./Videos'));
const Photos = React.lazy(() => import('./Photos'));
const Album = React.lazy(() => import('./Album'));

const { Search } = Input;

const enum TabKey {
    Albums = 'Albums',
    Videos = 'Videos',
    Photos = 'Photos',
    Album = 'Album-',
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
];

export default function BulkDownloader() {
    const { t } = useTranslation();

    const [activeKey, setActiveKey] = useState<string>('');
    const [tabs, setTabs] = useState(DefaultTabs);
    const [loading, setLoading] = useState(false);
    const [about, setAbout] = useState(null as IEntityAbout | null);
    const [targetId, setTargetId] = useState('100050164073708');

    const targetType = about?.type || TargetType.User;

    // useEffect(() => {
    //     const timeout = setTimeout(onSearch, 500);
    //     return () => clearTimeout(timeout);
    // }, [targetId]);

    const onSearch = () => {
        trackEvent('BulkDownloader:onSearch');
        setLoading(true);
        getEntityAbout(targetId)
            .then(data => {
                setAbout(data);
                setTabs(DefaultTabs);
                // setActiveKey(DefaultTabs[0].key);
            })
            .catch(e => console.log(e))
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

    const tabItems: TabsProps['items'] = about
        ? tabs.map(tab => {
              const comp =
                  tab.key === TabKey.Photos ? (
                      <Photos targetId={about?.id} targetType={about?.type} />
                  ) : tab.key === TabKey.Videos ? (
                      <Videos targetId={about?.id} />
                  ) : tab.key === TabKey.Albums ? (
                      <Albums
                          targetId={about?.id}
                          targetType={about?.type}
                          onOpenAlbum={onOpenAlbum}
                      />
                  ) : tab.key.startsWith(TabKey.Album) ? (
                      <Album album={tab.props?.album} />
                  ) : null;

              return {
                  key: tab.key,
                  label: tab.label,
                  closable: tab.closable,
                  children: comp,
              };
          })
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
                <h2>{t('Bulk downloader')}</h2>

                <Search
                    value={targetId}
                    placeholder={t('Enter id of user/page/group')}
                    size="large"
                    style={{ width: 350 }}
                    onChange={e => setTargetId(e.target.value)}
                    onSearch={onSearch}
                    enterButton={
                        loading ? null : <i className="fa-solid fa-wand-magic-sparkles"></i>
                    }
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

            <FloatButton.BackTop />
        </Space>
    );
}
