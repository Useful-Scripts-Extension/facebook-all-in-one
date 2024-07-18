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
        async (currentData: IAlbumPhoto[] = []) => {
            if (!_albumId) return;
            const res = await getAlbumPhoto({
                albumId: _albumId,
                accessToken: await getAccessToken(ACCESS_TOKEN_TYPE.EAAB),
                cursor: btoa(currentData[currentData.length - 1]?.id || ''),
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

    return <Collection fetchNext={fetchNext} renderItem={renderItem} />;
}
