import React, { useEffect, useMemo, useState } from 'react';
import {
    Space,
    Tabs,
    TabsProps,
    Input,
    Card,
    FloatButton,
    message,
    Image,
    Alert,
    Select,
} from 'antd';
import { useTranslation } from 'react-i18next';
import { getEntityAbout, IAlbum, IEntityAbout, TargetType, trackEvent } from '../../utils/facebook';
import { useLocation } from 'react-router-dom';
import { getInstaUserInfo } from '../../utils/instagram';
import img_getFbId from '../../assets/fb_get_id.png';
import img_getInstaName from '../../assets/insta_get_username.png';
import fb_icon from '../../assets/fb_icon.png';
import insta_icon from '../../assets/insta_icon.png';

const Albums = React.lazy(() => import('./Albums'));
const Videos = React.lazy(() => import('./Videos'));
const Photos = React.lazy(() => import('./Photos'));
const Album = React.lazy(() => import('./Album'));
const Reels = React.lazy(() => import('./Reels'));
const GroupFiles = React.lazy(() => import('./GroupFiles'));
const GroupMembers = React.lazy(() => import('./GroupMembers'));
const IGPosts = React.lazy(() => import('./IGPosts'));
const IGReels = React.lazy(() => import('./IGReels'));

const { Search } = Input;

const enum TabKey {
    // facebook
    Albums = 'Albums',
    Videos = 'Videos',
    Photos = 'Photos',
    Album = 'Album-',
    Reels = 'Reels',
    GroupFiles = 'Files',
    GroupMembers = 'Members',

    // instagram
    IGPosts = 'IGPosts',
    IGReels = 'IGReels',
}

type Tab = {
    key: string;
    label: string;
    closable?: boolean;
    props?: any;
};

const Platforms = {
    Facebook: 'Facebook',
    Instagram: 'Instagram',
};

const DefaultFBTabs: Tab[] = [
    { key: TabKey.Photos, label: TabKey.Photos, closable: false },
    { key: TabKey.Videos, label: TabKey.Videos, closable: false },
    { key: TabKey.Albums, label: TabKey.Albums, closable: false },
    { key: TabKey.Reels, label: TabKey.Reels, closable: false },
    { key: TabKey.GroupFiles, label: TabKey.GroupFiles, closable: false },
    { key: TabKey.GroupMembers, label: TabKey.GroupMembers, closable: false },
];

const DefaultIGTabs: Tab[] = [
    { key: TabKey.IGPosts, label: TabKey.IGPosts, closable: false },
    { key: TabKey.IGReels, label: TabKey.IGReels, closable: false },
];

export default function BulkDownloader() {
    const { t } = useTranslation();
    const location = useLocation();

    const _targetId = location.state?.targetId || '';

    const [activeTab, setActiveTab] = useState<string>('');
    const [platform, setPlatform] = useState(Platforms.Facebook);
    const [tabs, setTabs] = useState(DefaultFBTabs);
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
            case TargetType.IGUser:
                return (
                    <Space>
                        <i className="fa-brands fa-instagram"></i> Instagram
                    </Space>
                );
            default:
                return 'Unknow';
        }
    }, [targetType]);

    useEffect(() => {
        if (_targetId) onSearch(_targetId);
    }, [_targetId]);

    const onChangePlatform = value => {
        trackEvent('BulkDownloader:onChangePlatform:' + value);
        setPlatform(value);
    };

    const onSearch = (id = targetId) => {
        trackEvent('BulkDownloader:onSearch_' + platform + ':' + id);
        setLoading(true);

        if (platform === Platforms.Facebook) {
            getEntityAbout(id)
                .then(data => {
                    console.log(data);
                    setAbout(data);
                    setTabs(DefaultFBTabs);
                })
                .catch(e => {
                    message.error(e.message);
                })
                .finally(() => setLoading(false));
        } else if (platform === Platforms.Instagram) {
            getInstaUserInfo(id)
                .then(async user => {
                    setAbout(user);
                    setTabs(DefaultIGTabs);
                })
                .catch(e => {
                    message.error(e.message);
                })
                .finally(() => setLoading(false));
        }
    };

    const onChangeTab = key => {
        trackEvent('BulkDownloader:onChangeTab:' + key);
        setActiveTab(key);
    };

    const onEdit = (
        targetKey: React.MouseEvent | React.KeyboardEvent | string,
        action: 'add' | 'remove'
    ) => {
        if (action === 'remove') {
            let newActiveKey = activeTab;
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
            setActiveTab(newActiveKey);
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
        setActiveTab(tabKey);
    };

    const getComp = (tab: Tab) => {
        switch (tab.key) {
            case TabKey.Photos:
                return <Photos target={about} />;
            case TabKey.Videos:
                return <Videos target={about} />;
            case TabKey.Albums:
                return <Albums target={about} onOpenAlbum={onOpenAlbum} />;
            case TabKey.Reels:
                if (targetType !== TargetType.Group) return <Reels target={about} />;
                return null;
            case TabKey.GroupFiles:
                if (targetType === TargetType.Group) return <GroupFiles target={about} />;
                return null;
            case TabKey.GroupMembers:
                if (targetType === TargetType.Group) return <GroupMembers target={about} />;
                return null;
            case TabKey.IGPosts:
                return <IGPosts target={about} />;
            case TabKey.IGReels:
                return <IGReels target={about} />;
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
                    placeholder={
                        platform === Platforms.Facebook
                            ? t('Enter fb id of user/page/group')
                            : t('Enter insta username')
                    }
                    size="large"
                    style={{ width: 470 }}
                    onChange={e => setTargetId(e.target.value?.trim())}
                    onSearch={() => onSearch()}
                    enterButton={loading ? null : <i className="fa-solid fa-magnifying-glass"></i>}
                    loading={loading}
                    addonBefore={
                        <Select
                            onChange={onChangePlatform}
                            style={{ width: 120 }}
                            value={platform}
                            options={Object.entries(Platforms).map(([key, value]) => ({
                                label: key,
                                value: value,
                            }))}
                        />
                    }
                />

                {/* render about :id, url,avatar, name */}
                {about ? (
                    <Space>
                        <Card style={{ maxWidth: 500 }} actions={[]}>
                            <Card.Meta
                                avatar={
                                    <Image
                                        src={about.avatar}
                                        preview={false}
                                        style={{
                                            width: 60,
                                            height: 60,
                                            borderRadius: '50%',
                                            overflow: 'hidden',
                                        }}
                                        alt={about.name}
                                        fallback={
                                            about?.type === TargetType.IGUser ? insta_icon : fb_icon
                                        }
                                    />
                                }
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
                    defaultActiveKey={activeTab}
                    activeKey={activeTab}
                    type="editable-card"
                    centered
                    hideAdd
                    items={tabItems}
                    onChange={onChangeTab}
                    onEdit={onEdit}
                />
            ) : (
                <Space
                    direction="vertical"
                    align="center"
                    style={{ width: '100%', marginTop: 100 }}
                >
                    <Alert
                        type="info"
                        showIcon
                        message={
                            platform === Platforms.Facebook
                                ? t('Tip: Use Useful-script extension to get ID')
                                : t('Tip: Get instagram user name here')
                        }
                    />
                    <Image
                        src={platform === Platforms.Facebook ? img_getFbId : img_getInstaName}
                        height={200}
                    />
                </Space>
            )}

            <FloatButton.BackTop />
        </Space>
    );
}
