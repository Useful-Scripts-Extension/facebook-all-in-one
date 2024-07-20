import React, { useCallback } from 'react';
import { Badge, List, Spin } from 'antd';
import {
    getGroupVideo,
    getUserVideo,
    getVideoInfo,
    IEntityAbout,
    IVideo,
    TargetType,
} from '../../utils/facebook';
import { formatSeconds } from '../../utils/helper';
import Collection from '../../components/Collection';
import ImageLazyPreview from '../../components/ImageLazyPreview';

export default function Videos({ target }: { readonly target: IEntityAbout | null }) {
    const fetchNext = useCallback(
        async (currentData: IVideo[] = [], cursor?: string) => {
            if (!target?.id || !target?.type) return;

            cursor = cursor || currentData?.[currentData?.length - 1]?.cursor || '';
            const res =
                target?.type === TargetType.Group
                    ? await getGroupVideo({ id: target?.id, cursor })
                    : await getUserVideo({ id: target?.id, cursor });
            return res.videos;
        },
        [target]
    );

    const downloadItem = useCallback(async (item: IVideo) => {
        if (!item.source) {
            const videoInfo = await getVideoInfo(item.id);
            item.source = videoInfo.source;
        }
        return {
            url: item.source,
            name: item.id + '.mp4',
        };
    }, []);

    const renderItem = useCallback((item: IVideo) => {
        return (
            <List.Item>
                <Badge.Ribbon text={item.length ? formatSeconds(item.length) : null}>
                    <ImageLazyPreview
                        src={item.picture}
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
                        height={200}
                        style={{ objectFit: 'cover' }}
                    />
                </Badge.Ribbon>
            </List.Item>
        );
    }, []);

    return (
        <Collection
            collectionName={target?.name + ' - Videos'}
            fetchNext={fetchNext}
            renderItem={renderItem}
            downloadItem={downloadItem}
            getItemCursor={item => item.cursor}
            rowKey={item => item.id}
        />
    );
}
