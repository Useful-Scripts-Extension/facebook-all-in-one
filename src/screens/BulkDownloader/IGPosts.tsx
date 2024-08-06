import React, { useCallback } from 'react';
import { List, Image, Space } from 'antd';
import Collection from '../../components/Collection';
import { IEntityAbout } from '../../utils/facebook';
import { getInstaPosts, IGPost } from '../../utils/instagram';
import { limitString } from '../../utils/helper';
import icons from '../../assets/icons';

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
                        item.video || item.carousel?.length
                            ? {
                                  destroyOnClose: true,
                                  imageRender: () =>
                                      item.carousel?.length ? (
                                          <Space
                                              style={{
                                                  maxWidth: '90vw',
                                                  maxHeight: '90vh',
                                                  alignItems: 'center',
                                                  overflowY: 'auto',
                                                  overflowX: 'hidden',
                                              }}
                                          >
                                              <List
                                                  grid={{ gutter: 10 }}
                                                  style={{ width: '100%' }}
                                                  dataSource={item.carousel as IGPost[]}
                                                  renderItem={renderItem}
                                                  rowKey={item => item.id}
                                              />
                                          </Space>
                                      ) : (
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
                <p
                    style={{ wordWrap: 'break-word', maxWidth: 250, padding: 5 }}
                    title={item.caption}
                >
                    {limitString(item.caption, 30)}
                </p>
                <div
                    style={{
                        position: 'absolute',
                        top: 10,
                        right: 10,
                        pointerEvents: 'none',
                    }}
                >
                    {item.carousel?.length > 0 ? (
                        <>
                            <span>{item.carousel?.length}</span>
                            {icons.IGCarousel}
                        </>
                    ) : item.video ? (
                        icons.IGVideo
                    ) : null}
                </div>
            </List.Item>
        );
    }, []);

    const downloadItem = useCallback((item: IGPost, index: number) => {
        function extract(item, prefix = '') {
            const hasVideo = !!item.video;
            return {
                url: hasVideo ? item.video : item.image,
                name: prefix + item.id + (hasVideo ? '.mp4' : '.jpg'),
            };
        }
        if (item.carousel?.length > 0) return item.carousel.map((it, i) => extract(it, i + '_'));
        return extract(item);
    }, []);

    return (
        <Collection
            collectionName={target?.igName + ' - IG Posts'}
            fetchNext={fetchNext}
            renderItem={renderItem}
            downloadItem={downloadItem}
            getItemCursor={item => item.cursor || ''}
            rowKey={item => item.id}
        />
    );
}
