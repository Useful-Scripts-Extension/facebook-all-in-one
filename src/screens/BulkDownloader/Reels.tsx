import React, { useCallback } from 'react';
import { Badge, List, Spin, Typography } from 'antd';
import { getUserReels, getVideoInfo, IEntityAbout, IReel } from '../../utils/facebook';
import { formatSeconds } from '../../utils/helper';
import Collection from '../../components/Collection';
import ImageLazyPreview from '../../components/ImageLazyPreview';

export default function Reels({ target }: { readonly target: IEntityAbout | null }) {
    const fetchNext = useCallback(
        async (currentData: IReel[] = [], cursor?: string) => {
            if (!target?.id || !target?.type) return;

            cursor = cursor || currentData?.[currentData?.length - 1]?.cursor || '';
            const res = await getUserReels({ id: target.id, cursor });
            return res;
        },
        [target]
    );

    const downloadItem = useCallback(async (item: IReel) => {
        return {
            url: item.source,
            name: item.id + '.mp4',
        };
    }, []);

    const renderItem = useCallback((item: IReel) => {
        return (
            <List.Item>
                <Badge.Ribbon text={item.length ? formatSeconds(item.length) : null}>
                    <ImageLazyPreview
                        src={item.thumbnail}
                        defaultPreviewSrc={item.source}
                        getPreview={() =>
                            getVideoInfo(item.id).then(_ => {
                                console.log(_);
                                return _.source;
                            })
                        }
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
                        width={200}
                        height={300}
                        style={{ objectFit: 'cover' }}
                    />
                </Badge.Ribbon>
                <Typography.Paragraph
                    style={{ maxWidth: '150px', wordWrap: 'break-word' }}
                    onClick={() => window.open(item.url)}
                >
                    {item.description}
                </Typography.Paragraph>
            </List.Item>
        );
    }, []);

    return (
        <Collection
            collectionName={target?.name + ' - Reels'}
            fetchNext={fetchNext}
            renderItem={renderItem}
            downloadItem={downloadItem}
            getItemCursor={item => item.cursor}
            rowKey={item => item.id}
        />
    );
}
