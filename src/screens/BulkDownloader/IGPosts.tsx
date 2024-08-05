import React, { useCallback } from 'react';
import { List, Image, Space } from 'antd';
import Collection from '../../components/Collection';
import { IEntityAbout } from '../../utils/facebook';
import { getInstaPosts, IGPost } from '../../utils/instagram';
import { limitString } from '../../utils/helper';

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
                            <svg
                                aria-label="Carousel"
                                fill="currentColor"
                                height="20"
                                // role="img"
                                viewBox="0 0 48 48"
                                width="20"
                            >
                                <title>Carousel</title>
                                <path d="M34.8 29.7V11c0-2.9-2.3-5.2-5.2-5.2H11c-2.9 0-5.2 2.3-5.2 5.2v18.7c0 2.9 2.3 5.2 5.2 5.2h18.7c2.8-.1 5.1-2.4 5.1-5.2zM39.2 15v16.1c0 4.5-3.7 8.2-8.2 8.2H14.9c-.6 0-.9.7-.5 1.1 1 1.1 2.4 1.8 4.1 1.8h13.4c5.7 0 10.3-4.6 10.3-10.3V18.5c0-1.6-.7-3.1-1.8-4.1-.5-.4-1.2 0-1.2.6z"></path>
                            </svg>
                        </>
                    ) : item.video ? (
                        <svg
                            aria-label="Clip"
                            fill="currentColor"
                            height="20"
                            viewBox="0 0 24 24"
                            width="20"
                        >
                            <title>Clip</title>
                            <path
                                d="m12.823 1 2.974 5.002h-5.58l-2.65-4.971c.206-.013.419-.022.642-.027L8.55 1Zm2.327 0h.298c3.06 0 4.468.754 5.64 1.887a6.007 6.007 0 0 1 1.596 2.82l.07.295h-4.629L15.15 1Zm-9.667.377L7.95 6.002H1.244a6.01 6.01 0 0 1 3.942-4.53Zm9.735 12.834-4.545-2.624a.909.909 0 0 0-1.356.668l-.008.12v5.248a.91.91 0 0 0 1.255.84l.109-.053 4.545-2.624a.909.909 0 0 0 .1-1.507l-.1-.068-4.545-2.624Zm-14.2-6.209h21.964l.015.36.003.189v6.899c0 3.061-.755 4.469-1.888 5.64-1.151 1.114-2.5 1.856-5.33 1.909l-.334.003H8.551c-3.06 0-4.467-.755-5.64-1.889-1.114-1.15-1.854-2.498-1.908-5.33L1 15.45V8.551l.003-.189Z"
                                fillRule="evenodd"
                            ></path>
                        </svg>
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
