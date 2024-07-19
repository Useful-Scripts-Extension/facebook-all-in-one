import React, { useCallback } from 'react';
import { Image, List } from 'antd';
import { getUserPhotos, IUserPhoto, TargetType } from '../../utils/facebook';
import Collection from '../../components/Collection';

export default function Photos({
    targetId,
    targetType,
}: {
    readonly targetId?: string;
    readonly targetType?: TargetType;
}) {
    const fetchNext = useCallback(
        async (currentData: IUserPhoto[] = []) => {
            if (!targetId || !targetType) return;
            const res = await getUserPhotos({
                id: targetId,
                cursor: currentData?.[currentData?.length - 1]?.cursor || '',
            });
            return res.photos;
        },
        [targetId, targetType]
    );

    const renderItem = useCallback((item: IUserPhoto) => {
        return (
            <List.Item>
                <Image
                    src={item.thumbnail}
                    preview={{ src: item.image }}
                    alt={item.accessibility_caption}
                    width={150}
                    height={150}
                    style={{ objectFit: 'cover', borderRadius: '10px' }}
                />
            </List.Item>
        );
    }, []);

    const downloadItem = useCallback((item: IUserPhoto, index: number) => {
        return {
            url: item.image,
            name: item.id + '.jpg',
        };
    }, []);

    return (
        <Collection
            collectionName="Photos"
            fetchNext={fetchNext}
            renderItem={renderItem}
            downloadItem={downloadItem}
            rowKey={item => item.id}
        />
    );
}
