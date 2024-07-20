import React, { useEffect, useRef, useState } from 'react';
import { App, Button, Image, List, Space } from 'antd';
import { useIntersectionObserver, useInterval } from 'usehooks-ts';
import { useTranslation } from 'react-i18next';
import Swal from 'sweetalert2';
import { promiseAllStepN } from '../utils/helper';

export type Downloadable = {
    name: string;
    url: string;
};

export default function Collection<T>({
    collectionName,
    renderItem,
    fetchNext,
    rowKey,
    downloadItem,
    getItemCursor,
}: {
    readonly collectionName: string;
    readonly renderItem: (data: T, index?: number) => React.ReactNode;
    readonly fetchNext: (currentData?: T[], fromCursor?: string) => Promise<T[] | undefined>;
    readonly rowKey: (data: T) => string;
    readonly downloadItem?: (item: T, index: number) => Promise<Downloadable> | Downloadable;
    readonly getItemCursor?: (item: T) => string;
}) {
    const { t } = useTranslation();
    const { message, notification } = App.useApp();

    const [hasMore, setHasMore] = useState(true);
    const [data, setData] = useState([] as T[]);
    const { isIntersecting: loadMoreInView, ref: loadMoreRef } = useIntersectionObserver();

    useEffect(() => {
        setData([]);
        fetchNext([]);
    }, [fetchNext]);

    // auto load more
    useInterval(() => {
        if ((!data.length || loadMoreInView) && hasMore) next();
    }, 1000);
    useEffect(() => {
        if ((!data.length || loadMoreInView) && hasMore) next();
    }, [loadMoreInView, hasMore, data]);

    // fetching data
    const fetchingRef = useRef(false);
    const next = async (curData = data) => {
        if (fetchingRef.current) return;
        fetchingRef.current = true;

        const res = await fetchNext(curData);
        console.log(res);
        if (res?.length) {
            setData([...curData, ...res]);
            setHasMore(true);
        } else if (res?.length === 0) {
            setHasMore(false);
        }
        fetchingRef.current = false;
    };

    const _renderItem = (item: T, index: number) => {
        if (index < data.length - 1) return renderItem(item, index);
        return <Space ref={loadMoreRef}>{renderItem(item, index)}</Space>;
    };

    const downloadAll = async (fromCursor?: string, startIndex = 0) => {
        if (!downloadItem) return;

        // config
        const config = await Swal.fire({
            title: 'Config',
            html: `
                <label for="from-cursor">From Cursor: (let empty to download all)</label><br/>
                <input id="from-cursor" class="swal2-input" style="margin: 5px" value="${
                    fromCursor || ''
                }">
                <br/>
                <label for="start-index">Start Index:</label><br/>
                <input id="start-index" class="swal2-input" style="margin: 5px" value="${startIndex}">
            `,
            preConfirm: () => {
                return [
                    document.getElementById('from-cursor')?.value,
                    document.getElementById('start-index')?.value,
                ];
            },
            showCancelButton: true,
            confirmButtonText: 'Start download',
        });
        if (config.isDismissed || config.isDenied) return;

        fromCursor = config.value[0];
        startIndex = parseInt(config.value?.[1] || 0);

        // get download destination folder
        const dirHandler = await window.showDirectoryPicker({ mode: 'readwrite' });
        await dirHandler.requestPermission({ writable: true });

        // start fetch and download
        const key = 'downloading_collection_' + collectionName;
        message.loading({ key, content: 'Downloading...', duration: 0 });
        const all = fromCursor ? [] : [...data];
        let downloaded = 0,
            index = 0,
            firstFetch = true,
            stopFetch = false;

        while (!stopFetch) {
            const chunk = await fetchNext(all, firstFetch ? fromCursor : undefined);
            if (!chunk?.length && firstFetch && fromCursor) {
                notification.error({
                    type: 'error',
                    message: 'No data at from id ' + fromCursor + ' (' + collectionName + ')',
                    description: 'Will download from start',
                    duration: 0,
                });
            }
            firstFetch = false;
            if (!chunk?.length) break;
            all.push(...chunk);

            const { start, stop: stopQueue } = promiseAllStepN(
                10,
                all.slice(index).map((item, i) => async () => {
                    const { url, name } = await downloadItem(item, downloaded);
                    const blob = await (await fetch(url)).blob();
                    const fileNamePrefix = startIndex + index + i + '_';
                    const fileHandler = await dirHandler.getFileHandle(fileNamePrefix + name, {
                        create: true,
                    });
                    const writable = await fileHandler.createWritable();
                    await writable.write(blob);
                    await writable.close();
                    downloaded++;
                    message.loading({
                        key,
                        content: (
                            <span>
                                {`Downloading... ${downloaded}`}
                                <br />
                                {collectionName}
                                <br />
                                <i>Click to stop</i>
                            </span>
                        ),
                        duration: 0,
                        onClick: () => {
                            stopFetch = true;
                            stopQueue();
                        },
                    });
                })
            );
            const chunk_downloaded = await start();
            index += chunk_downloaded.length;
        }

        // show result
        const cursor = getItemCursor?.(all[all.length - 1]);
        message.destroy(key);
        notification.success({
            type: 'success',
            message: 'Download ' + (stopFetch ? 'stopped' : 'finished'),
            description: (
                <ul>
                    <li>Name: {collectionName}</li>
                    <li>Downloaded: {downloaded}</li>
                    <li>Last index: {index + startIndex}</li>
                    <li>
                        Last cursor: <p style={{ wordWrap: 'normal' }}>{cursor}</p>
                    </li>
                </ul>
            ),
            duration: 0,
            btn: stopFetch ? (
                <Space direction="horizontal">
                    <Button onClick={() => downloadAll(cursor, index + startIndex)}>
                        Continue download
                    </Button>
                </Space>
            ) : null,
        });
    };

    return (
        <Image.PreviewGroup>
            <Space direction="vertical" style={{ width: '100%' }}>
                {downloadItem && (
                    <Button.Group style={{ width: '100%', justifyContent: 'center' }}>
                        <Button type="primary" onClick={() => downloadAll()}>
                            <i className="fa-solid fa-download fa-lg"></i>
                            {t('Download')}
                        </Button>
                    </Button.Group>
                )}
                <List
                    grid={{ gutter: 10 }}
                    style={{ width: '100%', justifyContent: 'center' }}
                    dataSource={data}
                    renderItem={_renderItem}
                    rowKey={rowKey}
                    loadMore={
                        hasMore ? (
                            <Space style={{ display: 'flex', justifyContent: 'center' }}>
                                <i className="fas fa-spinner fa-pulse fa-lg" />
                            </Space>
                        ) : null
                    }
                />
            </Space>
        </Image.PreviewGroup>
    );
}
