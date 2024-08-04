import React, { useCallback } from 'react';
import { List, Image } from 'antd';
import Collection from '../../components/Collection';
import { IEntityAbout } from '../../utils/facebook';
import { getInstaReels, IGReel } from '../../utils/instagram';
import { formatNumber } from '../../utils/helper';

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
                    width={200}
                    height={330}
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
                <div
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        background:
                            'linear-gradient(0deg, rgba(0, 0, 0, 0.4) 0%, rgba(0, 0, 0, 0) 22.27%)',
                        pointerEvents: 'none',
                    }}
                >
                    <div
                        style={{
                            position: 'absolute',
                            bottom: 15,
                            left: 15,
                            fontWeight: 'bold',
                            fontSize: '1.1em',
                        }}
                    >
                        <i className="fa-solid fa-play"></i> {formatNumber(item.play_count)}
                        <br />
                        <i className="fa-solid fa-heart"></i> {formatNumber(item.like_count)}
                        <br />
                        <i className="fa-solid fa-message"></i> {formatNumber(item.comment_count)}
                    </div>
                </div>
            </List.Item>
        );
    }, []);

    const downloadItem = useCallback((item: IGReel, index: number) => {
        const hasVideo = !!item.video;
        return {
            url: hasVideo ? item.video : item.image,
            name: item.id + (hasVideo ? '.mp4' : '.jpg'),
        };
    }, []);

    return (
        <Collection
            collectionName={target?.igName + ' - IG Reels'}
            fetchNext={fetchNext}
            renderItem={renderItem}
            downloadItem={downloadItem}
            getItemCursor={item => item.cursor || ''}
            rowKey={item => item.id}
        />
    );
}
