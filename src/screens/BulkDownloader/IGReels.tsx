import React, { useCallback } from 'react';
import { List, Image } from 'antd';
import Collection from '../../components/Collection';
import { IEntityAbout } from '../../utils/facebook';
import { getInstaReels, IGReel } from '../../utils/instagram';

export default function IGReels({ target }: { readonly target: IEntityAbout | null }) {
    const fetchNext = useCallback(
        async (currentData: IGReel[] = [], fromCursor?: string) => {
            if (!target?.id) return;
            const res = await getInstaReels(
                target.id,
                fromCursor || currentData[currentData.length - 1]?.cursor
            );
            return res;
        },
        [target]
    );

    const renderItem = useCallback((item: IGReel) => {
        return (
            <List.Item>
                <Image
                    src={item.image}
                    width={230}
                    height={360}
                    style={{ objectFit: 'cover' }}
                    preview={{
                        destroyOnClose: true,
                        imageRender: () => (
                            <video
                                autoPlay
                                controls
                                loop
                                src={item.video}
                                style={{ maxWidth: '90vw', maxHeight: '90vh' }}
                            />
                        ),
                        toolbarRender: () => null,
                    }}
                />
            </List.Item>
        );
    }, []);

    const downloadItem = useCallback((item: IGReel, index: number) => {
        const hasVideo = !item.video;
        return {
            url: hasVideo ? item.video : item.image,
            name: item.id + (hasVideo ? '.mp4' : '.jpg'),
        };
    }, []);

    return (
        <Collection
            collectionName={target?.id + ' - IG Reels'}
            fetchNext={fetchNext}
            renderItem={renderItem}
            downloadItem={downloadItem}
            getItemCursor={item => item.cursor || ''}
            rowKey={item => item.id}
        />
    );
}
