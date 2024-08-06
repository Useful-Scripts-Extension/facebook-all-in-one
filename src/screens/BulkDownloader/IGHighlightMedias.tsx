import React, { useCallback, useEffect } from 'react';
import { List, Image } from 'antd';
import Collection from '../../components/Collection';
import { IEntityAbout } from '../../utils/facebook';
import { getInstaHighlightMedias, IGHighlight, IGReel } from '../../utils/instagram';
import icons from '../../assets/icons';

export default function IGHighlightItems({
    target,
    highlight,
}: {
    readonly target: IEntityAbout | null;
    readonly highlight: IGHighlight;
}) {
    useEffect(() => {
        getInstaHighlightMedias(highlight.id);
    }, [highlight]);

    const fetchNext = useCallback(
        async currentData => {
            if (!highlight?.id) return;

            // TODO: verify if this api has paging?
            if (currentData?.length) return [];
            const res = await getInstaHighlightMedias(highlight.id);
            return res;
        },
        [highlight]
    );

    const renderItem = useCallback((item: IGReel) => {
        return (
            <List.Item>
                <Image
                    src={item.image}
                    width={200}
                    height={330}
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
                            : true
                    }
                />
                {item.video && (
                    <div
                        style={{
                            position: 'absolute',
                            top: 10,
                            right: 10,
                            pointerEvents: 'none',
                        }}
                    >
                        {icons.IGVideo}
                    </div>
                )}
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
            collectionName={target?.igName + ' - IG Highlight - ' + highlight.title}
            fetchNext={fetchNext}
            renderItem={renderItem}
            downloadItem={downloadItem}
            rowKey={item => item.id}
        />
    );
}
