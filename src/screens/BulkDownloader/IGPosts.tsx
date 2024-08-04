import React, { useCallback } from 'react';
import { List, Image } from 'antd';
import Collection from '../../components/Collection';
import { IEntityAbout } from '../../utils/facebook';
import { getInstaPosts, IGPost } from '../../utils/instagram';

export default function IGPosts({ target }: { readonly target: IEntityAbout | null }) {
    const fetchNext = useCallback(
        async (currentData: IGPost[] = [], fromCursor?: string) => {
            if (!target?.id) return;
            const res = await getInstaPosts(
                target.igName,
                fromCursor || currentData[currentData.length - 1]?.cursor
            );
            return res;
        },
        [target]
    );

    const renderItem = useCallback((item: IGPost) => {
        return (
            <List.Item>
                <Image
                    src={item.image}
                    width={250}
                    height={250}
                    style={{ objectFit: 'cover' }}
                    preview={
                        item.video
                            ? {
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
                              }
                            : undefined
                    }
                />
            </List.Item>
        );
    }, []);

    const downloadItem = useCallback((item: IGPost, index: number) => {
        const hasVideo = !item.video;
        return {
            url: hasVideo ? item.video : item.image,
            name: item.id + (hasVideo ? '.mp4' : '.jpg'),
        };
    }, []);

    return (
        <Collection
            collectionName={target?.id + ' - IG Posts'}
            fetchNext={fetchNext}
            renderItem={renderItem}
            downloadItem={downloadItem}
            getItemCursor={item => item.cursor || ''}
            rowKey={item => item.id}
        />
    );
}
