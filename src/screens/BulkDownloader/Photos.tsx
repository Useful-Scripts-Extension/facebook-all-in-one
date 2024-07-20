import React, { useCallback } from 'react';
import { List, Image } from 'antd';
import {
    getGroupPhotos,
    getLargestPhoto,
    getUserPhotos,
    IEntityAbout,
    IUserPhoto,
    TargetType,
} from '../../utils/facebook';
import Collection from '../../components/Collection';
import ImageLazyPreview from '../../components/ImageLazyPreview';

export default function Photos({ target }: { readonly target: IEntityAbout | null }) {
    const fetchNext = useCallback(
        async (currentData: IUserPhoto[] = [], fromCursor?: string) => {
            if (!target?.id || !target?.type) return;
            const res =
                target.type === TargetType.Group
                    ? await getGroupPhotos({
                          id: target.id,
                          cursor:
                              fromCursor || currentData?.[currentData?.length - 1]?.cursor || '',
                      })
                    : await getUserPhotos({
                          id: target.id,
                          cursor:
                              fromCursor || currentData?.[currentData?.length - 1]?.cursor || '',
                      });
            return res.photos;
        },
        [target]
    );

    const renderItem = useCallback((item: IUserPhoto) => {
        return (
            <List.Item>
                <ImageLazyPreview
                    src={item.thumbnail}
                    alt={item.accessibility_caption}
                    width={150}
                    height={150}
                    style={{ objectFit: 'cover', borderRadius: '10px' }}
                    // custom
                    defaultPreviewSrc={item.image}
                    getPreview={() => getLargestPhoto(item.id).then(_ => _.image)}
                />
            </List.Item>
        );
    }, []);

    const downloadItem = useCallback(
        async (item: IUserPhoto, index: number) => {
            if (!item.image && target?.type === TargetType.Group) {
                const photo = await getLargestPhoto(item.id);
                item.image = photo.image || photo.thumbnail || item.thumbnail;
            }
            return {
                url: item.image,
                name: item.id + '.jpg',
            };
        },
        [target?.id]
    );

    return (
        <Image.PreviewGroup>
            <Collection
                collectionName={target?.name + ' - Photos'}
                fetchNext={fetchNext}
                renderItem={renderItem}
                downloadItem={downloadItem}
                getItemCursor={item => item.cursor || ''}
                rowKey={item => item.id}
            />
        </Image.PreviewGroup>
    );
}
