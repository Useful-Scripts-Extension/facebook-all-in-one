import React, { useCallback } from 'react';
import { List, Image, Spin } from 'antd';
import Collection from '../../components/Collection';
import {
    ACCESS_TOKEN_TYPE,
    getAccessToken,
    getAlbumPhoto,
    getVideoInfo,
    IAlbum,
    IAlbumPhoto,
    IEntityAbout,
    MediaType,
} from '../../utils/facebook';
import ImageLazyPreview from '../../components/ImageLazyPreview';

export default function Album({
    target,
    albumId,
    album,
}: {
    readonly target: IEntityAbout | null;
    readonly albumId?: string;
    readonly album: IAlbum;
}) {
    const _albumId = albumId || album.id;

    const fetchNext = useCallback(
        async (currentData: IAlbumPhoto[] = [], cursor?: string) => {
            if (!_albumId) return;
            const res = await getAlbumPhoto({
                albumId: _albumId,
                accessToken: await getAccessToken(ACCESS_TOKEN_TYPE.EAAB),
                fromId: cursor || currentData[currentData.length - 1]?.id || '',
            });
            return res;
        },
        [_albumId]
    );

    const renderItem = useCallback((item: IAlbumPhoto) => {
        return (
            <List.Item>
                {item.type == MediaType.IMAGE ? (
                    <Image
                        src={item.uri}
                        width={150}
                        height={150}
                        style={{ objectFit: 'cover', borderRadius: '10px' }}
                    />
                ) : (
                    <ImageLazyPreview
                        src={item.uri}
                        width={150}
                        height={150}
                        style={{ objectFit: 'cover', borderRadius: '10px' }}
                        defaultPreviewSrc={''}
                        getPreview={async () => {
                            const videoInfo = await getVideoInfo(item.id);
                            return videoInfo.source;
                        }}
                        renderPreview={(src, loading) => ({
                            destroyOnClose: true,
                            imageRender: () => (
                                <Spin spinning={loading}>
                                    <video
                                        autoPlay
                                        controls
                                        loop
                                        src={src}
                                        style={{ maxWidth: '90vw', maxHeight: '90vh' }}
                                    />
                                </Spin>
                            ),
                            toolbarRender: () => null,
                        })}
                    />
                )}
            </List.Item>
        );
    }, []);

    const downloadItem = useCallback(async (item: IAlbumPhoto) => {
        if (item.type == MediaType.IMAGE) {
            return {
                url: item.uri,
                name: item.id + '.jpg',
            };
        }
        const videoInfo = await getVideoInfo(item.id);
        return {
            url: videoInfo.source,
            name: item.id + '.mp4',
        };
    }, []);

    return (
        <Collection
            collectionName={target?.name + ' - Album ' + album.name}
            fetchNext={fetchNext}
            renderItem={renderItem}
            downloadItem={downloadItem}
            getItemCursor={item => item.id}
            rowKey={item => item.id}
        />
    );
}
