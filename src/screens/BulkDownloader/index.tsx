import React, { useEffect, useRef, useState } from 'react';
import { Space, Tabs, TabsProps, Input, Select, SelectProps, Tooltip } from 'antd';
import { useTranslation } from 'react-i18next';
import {
    ACCESS_TOKEN_TYPE,
    getAccessToken,
    getAllAlbums,
    getAllPhotos,
    getAllVideos,
    IAlbum,
    IUserPhoto,
    IVideo,
} from '../../utils/facebook';

const Albums = React.lazy(() => import('./Albums'));
const Videos = React.lazy(() => import('./Videos'));
const Photos = React.lazy(() => import('./Photos'));

const { Search } = Input;

const enum TargetType {
    User = 'User',
    Page = 'Page',
    Group = 'Group',
}

const enum TabKey {
    Albums = 'Albums',
    Videos = 'Videos',
    Photos = 'Photos',
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

    const [selectedTab, setSelectedTab] = useState(TabKey.Photos);
    const [targetType, setTargetType] = useState(TargetType.User);
    const [targetId, setTargetId] = useState('100064840322550');

    const [albums, setAlbums] = useState([] as IAlbum[]);
    const [videos, setVideos] = useState([] as IVideo[]);
    const [photos, setPhotos] = useState([] as IUserPhoto[]);

    const [searching, setSearching] = useState(false);

    const stopLoadRef = useRef(false);
    useEffect(() => {
        return () => {
            stopLoadRef.current = true;
        };
    }, []);

    const onSearch = async () => {
        if (searching) {
            stopLoadRef.current = true;
            setSearching(false);
            return;
        }

        stopLoadRef.current = false;
        setSearching(true);
        try {
            const accessToken = await getAccessToken(ACCESS_TOKEN_TYPE.EAAB);
            console.log('accessToken', accessToken);

            await Promise.all([
                getAllAlbums({
                    id: targetId,
                    accessToken,
                    onProgress: _albums => {
                        setAlbums([..._albums]);
                        return stopLoadRef.current;
                    },
                }).then(setAlbums),
                getAllVideos({
                    id: targetId,
                    accessToken,
                    onProgress: _videos => {
                        setVideos([..._videos]);
                        return stopLoadRef.current;
                    },
                }).then(setVideos),
                getAllPhotos({
                    id: targetId,
                    onProgress: _photos => {
                        setPhotos([..._photos]);
                        console.log(_photos.length, stopLoadRef.current);
                        return stopLoadRef.current;
                    },
                }).then(setPhotos),
            ]);
        } catch (e) {
            alert('Error: ' + e);
        } finally {
            setSearching(false);
        }
    };

    const onChangeTab = key => {
        setSelectedTab(key);
    };

    const tabItems: TabsProps['items'] = [
        {
            key: TabKey.Photos,
            label: 'Photos',
            children: <Photos photos={photos} />,
        },
        {
            key: TabKey.Videos,
            label: 'Videos',
            children: <Videos videos={videos} />,
        },
        {
            key: TabKey.Albums,
            label: 'Albums',
            children: <Albums albums={albums} />,
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
                        enterButton={
                            <Tooltip title={searching ? t('Stop') : t('Start')}>
                                <i className="fa-solid fa-wand-magic-sparkles"></i>
                            </Tooltip>
                        }
                        loading={searching}
                    />
                </Space.Compact>
            </Space>

            <Tabs defaultActiveKey={selectedTab} centered items={tabItems} onChange={onChangeTab} />
        </Space>
    );
}
