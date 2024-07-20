import React, { useCallback } from 'react';
import { List, Image } from 'antd';
import Collection from '../../components/Collection';
import {
    ACCESS_TOKEN_TYPE,
    getAccessToken,
    getAlbumPhoto,
    IAlbum,
    IAlbumPhoto,
} from '../../utils/facebook';

export default function Album({
    albumId,
    album,
}: {
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
                <Image
                    src={item.image}
                    width={150}
                    height={150}
                    style={{ objectFit: 'cover', borderRadius: '10px' }}
                />
            </List.Item>
        );
    }, []);

    const downloadItem = useCallback((item: IAlbumPhoto) => {
        return {
            url: item.image,
            name: item.id + '.jpg',
        };
    }, []);

    return (
        <Collection
            collectionName={'Album ' + album.name}
            fetchNext={fetchNext}
            renderItem={renderItem}
            downloadItem={downloadItem}
            getItemCursor={item => item.id}
            rowKey={item => item.id}
        />
    );
}
