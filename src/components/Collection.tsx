import React, { useEffect, useRef, useState } from 'react';
import { App, Button, Image, List, Space } from 'antd';
import { useIntersectionObserver, useInterval } from 'usehooks-ts';
import { useTranslation } from 'react-i18next';
import useForceStop from '../hooks/useForceStop';
import Swal from 'sweetalert2';

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
}: {
    readonly collectionName: string;
    readonly renderItem: (data: T, index?: number) => React.ReactNode;
    readonly fetchNext: (currentData?: T[]) => Promise<T[] | undefined>;
    readonly rowKey: (data: T) => string;
    readonly downloadItem?: (item: T, index: number) => Promise<Downloadable> | Downloadable;
}) {
    const { t } = useTranslation();
    const { message, notification } = App.useApp();
    const forceStop = useForceStop();

    const [hasMore, setHasMore] = useState(true);
    const [data, setData] = useState([] as T[]);
    const { isIntersecting: loadMoreInView, ref: loadMoreRef } = useIntersectionObserver();

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

    const downloadAll = async () => {
        if (!downloadItem) return;

        // const fromId = await Swal.fire({
        //     title: 'Download from id (let empty to download all)',
        //     input: 'text',
        //     inputAttributes: {
        //         autocapitalize: 'off',
        //     },
        //     showCancelButton: true,
        //     confirmButtonText: 'Start download',
        // });
        // if (fromId.isDismissed || fromId.isDenied) return;

        const dirHandler = await window.showDirectoryPicker({ mode: 'readwrite' });
        await dirHandler.requestPermission({ writable: true });

        let downloaded = 0;
        const all: T[] = [];
        const f = forceStop.start();

        // if(fromId.value) {
        //     all.push()
        // }

        const key = 'downloading_collection_' + collectionName;
        message.loading({ key, content: 'Downloading...', duration: 0 });

        while (f.value()) {
            const chunk = await fetchNext(all);
            if (!chunk?.length) break;
            all.push(...chunk);

            await Promise.all(
                chunk.map(async item => {
                    const { url, name } = await downloadItem(item, downloaded);
                    const blob = await (await fetch(url)).blob();
                    const fileHandler = await dirHandler.getFileHandle(name, { create: true });
                    const writable = await fileHandler.createWritable();
                    await writable.write(blob);
                    await writable.close();
                    downloaded++;
                    message.loading({
                        key,
                        content: 'Downloading... ' + downloaded + ' (' + collectionName + ')',
                        duration: 0,
                    });
                })
            );
        }

        const content = 'Download success ' + downloaded + ' (' + collectionName + ')';
        notification.success({ type: 'success', message: content, duration: 0 });
        message.success({ key, content });
    };

    return (
        <Image.PreviewGroup>
            <Space direction="vertical" style={{ width: '100%' }}>
                {downloadItem && (
                    <Button.Group style={{ width: '100%', justifyContent: 'center' }}>
                        <Button type="primary" onClick={downloadAll}>
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
