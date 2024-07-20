import React, { useCallback } from 'react';
import { Badge, Image, List } from 'antd';
import { getVideo, IVideo } from '../../utils/facebook';
import { formatSeconds } from '../../utils/helper';
import Collection from '../../components/Collection';

export default function Videos({ targetId }: { readonly targetId: string | undefined }) {
    const fetchNext = useCallback(
        async (currentData: IVideo[] = []) => {
            if (!targetId) return;
            const res = await getVideo({
                id: targetId,
                cursor: currentData?.[currentData?.length - 1]?.cursor || '',
            });
            return res.videos;
        },
        [targetId]
    );

    const downloadItem = useCallback((item: IVideo) => {
        return {
            url: item.source,
            name: item.id + '.mp4',
        };
    }, []);

    const renderItem = useCallback((item: IVideo) => {
        return (
            <List.Item>
                <Badge.Ribbon text={formatSeconds(item.length)}>
                    <Image
                        src={item.picture}
                        preview={{
                            destroyOnClose: true,
                            imageRender: () => (
                                <video
                                    autoPlay
                                    controls
                                    src={item.source}
                                    style={{ maxWidth: '90%', maxHeight: '90%' }}
                                />
                            ),
                            toolbarRender: () => null,
                        }}
                        width={200}
                        height={200}
                        style={{ objectFit: 'cover' }}
                    />
                </Badge.Ribbon>
            </List.Item>
        );
    }, []);

    return (
        <Collection
            collectionName="Videos"
            fetchNext={fetchNext}
            renderItem={renderItem}
            downloadItem={downloadItem}
            getItemCursor={item => item.cursor}
            rowKey={item => item.id}
        />
    );
}
