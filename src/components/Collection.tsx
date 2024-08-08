import React, { useEffect, useRef, useState } from 'react';
import { App, Button, Divider, Dropdown, List, Space } from 'antd';
import { useIntersectionObserver, useInterval } from 'usehooks-ts';
import { useTranslation } from 'react-i18next';
import Swal, { SweetAlertResult } from 'sweetalert2';
import { download, showDefaultDownloadFolder } from '../utils/extension';
import { promiseAllStepN } from '../utils/helper';
import { trackEvent } from '../utils/facebook';
import cloneDeep from 'lodash/cloneDeep';

export type Downloadable = {
    name: string;
    url: string;
};

export enum DownloadType {
    File = 'file',
    Link = 'link',
    JSON = 'json',
}

export default function Collection<T>({
    collectionName,
    renderItem,
    fetchNext,
    rowKey,
    downloadItem,
    getItemCursor,
    downloadThreads = 5,
}: {
    readonly collectionName: string;
    readonly renderItem: (data: T, index?: number) => React.ReactNode;
    readonly fetchNext: (currentData?: T[], fromCursor?: string) => Promise<T[] | undefined>;
    readonly rowKey: (data: T) => string;
    readonly downloadItem?: (
        item: T,
        index: number
    ) => Promise<Downloadable> | Downloadable | Promise<Downloadable[]> | Downloadable[];
    readonly getItemCursor?: (item: T) => string;
    readonly downloadThreads?: number;
}) {
    const { t } = useTranslation();
    const { message, notification } = App.useApp();

    const [hasMore, setHasMore] = useState(true);
    const [data, setData] = useState([] as T[]);
    const { isIntersecting: loadMoreInView, ref: loadMoreRef } = useIntersectionObserver();

    useEffect(() => {
        setData([]);
        next([]);
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
            const newData = cloneDeep(curData);
            for (let item of res) {
                const index = newData.findIndex(_ => rowKey(_) === rowKey(item));
                if (index !== -1) newData[index] = item;
                else newData.push(item);
            }
            setData(newData);
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

    const downloadAll = async ({
        fromCursor,
        downloadType,
        startIndex = 0,
    }: {
        fromCursor?: string;
        startIndex?: number;
        downloadType?: DownloadType;
    } = {}) => {
        if (!downloadItem) return;

        if (!('showDirectoryPicker' in window)) {
            return Swal.fire({
                icon: 'error',
                title: t('Browser not supported'),
                text: t(
                    'File saver API not supported in this browser. Please use newest version of Edge or Chrome. (window.showDirectoryPicker)'
                ),
            });
        }

        // download position
        let downloadPosition: SweetAlertResult | undefined;
        if (!fromCursor) {
            downloadPosition = await Swal.fire({
                icon: 'question',
                title: t('Download') + '?',
                text: collectionName,
                showDenyButton: true,
                showCancelButton: false,
                confirmButtonText: t('Download all'),
                denyButtonText: t('Download from cursor'),
                reverseButtons: true,
            });
            if (downloadPosition.isDismissed) return;
        }

        // config
        if (!downloadPosition || downloadPosition.isDenied) {
            const config = await Swal.fire({
                icon: 'info',
                title: t('Download from cursor'),
                html: `
                <label for="from-cursor">
                    ${t('Last cursor')}: (${t('leave empty to re-download all')})
                </label><br/>
                <input
                    id="from-cursor"
                    class="swal2-input"
                    style="margin: 5px"
                    value="${
                        fromCursor || localStorage.getItem(collectionName + '_fromCursor') || ''
                    }">
                <br/>
                <label for="start-index">
                    ${t('Last index')}: (${t('for auto generate file name')})
                </label><br/>
                <input
                    id="start-index"
                    class="swal2-input"
                    style="margin: 5px"
                    value="${
                        startIndex || localStorage.getItem(collectionName + '_startIndex') || 0
                    }">
            `,
                preConfirm: () => {
                    return [
                        document.getElementById('from-cursor')?.value,
                        document.getElementById('start-index')?.value,
                    ];
                },
                showCancelButton: true,
                confirmButtonText: t('Start download'),
            });
            if (config.isDismissed || config.isDenied) return;

            fromCursor = config.value[0];
            startIndex = parseInt(config.value?.[1] || 0);
        }

        // download type
        if (!downloadType) {
            const dType = await Swal.fire({
                icon: 'question',
                title: t('Data type'),
                html: `
                    <label for="download-type">
                        ${t('Which data type you want to download?')}
                    </label><br/>
                    <select
                        id="download-type"
                        class="swal2-select"
                        style="margin: 5px">
                        ${Object.values(DownloadType)
                            .map(v => `<option value="${v}">${v}</option>`)
                            .join('')}
                    </select>
                `,
                preConfirm: () => {
                    return document.getElementById('download-type')?.value;
                },
                showCancelButton: true,
                reverseButtons: true,
            });
            if (dType.isDismissed) return;
            downloadType = dType.value as DownloadType;
        }

        trackEvent('downloadCollection:' + collectionName);

        // get download destination folder
        const dirHandler = await window.showDirectoryPicker({
            mode: 'readwrite',
            // startIn: 'downloads',
        });
        await dirHandler.requestPermission({ writable: true });

        // create folder with collection name
        const subDir = await dirHandler.getDirectoryHandle(collectionName, {
            create: true,
        });

        // start fetch and download
        const key = 'downloading_collection_' + collectionName;
        const stoppingKey = 'stopping_downloading_collection_' + collectionName;
        message.loading({ key, content: t('Downloading') + '...', duration: 0 });
        const all = fromCursor ? [] : [...data];
        let downloaded = 0,
            downloadedIncludeChilds = 0,
            failed = 0,
            downloadedByApi = 0,
            index = 0,
            firstFetch = true,
            stopFetch = false,
            hasMore = true,
            allJsons: any[] = [],
            allLinks: string[] = [];

        while (!stopFetch && hasMore) {
            const chunk = await fetchNext(all, firstFetch ? fromCursor : undefined);
            if (!chunk?.length && firstFetch && fromCursor) {
                notification.error({
                    type: 'error',
                    message:
                        t('No data at from your cursor') + fromCursor + ' (' + collectionName + ')',
                    description: t('Will download from start'),
                    duration: 0,
                });
            }
            firstFetch = false;

            console.log(chunk);
            if (chunk?.length) all.push(...chunk);
            else hasMore = false;

            const arr = all.slice(index);
            if (!arr.length) break;

            const pool = Array.from({ length: downloadThreads }, () => '');

            const { start, stop: stopQueue } = promiseAllStepN(
                downloadThreads,
                arr.map((item, i) => async (processed, pool_index) => {
                    try {
                        let data = await downloadItem(item, downloaded);
                        allJsons.push({ data, raw: item });

                        if (!Array.isArray(data)) data = [data];
                        let useDownloadFolder = false;

                        for (let j = 0; j < data.length; j++) {
                            if (stopFetch) break;
                            const { url, name } = data[j];

                            allLinks.push(url);
                            if (downloadType === DownloadType.File) {
                                const fileNamePrefix = startIndex + index + j + '_';
                                const fileName = fileNamePrefix + name;

                                try {
                                    // try download directly, using fetch blob
                                    const blob = await (await fetch(url)).blob();
                                    const fileHandler = await subDir.getFileHandle(fileName, {
                                        create: true,
                                    });
                                    const writable = await fileHandler.createWritable();
                                    await writable.write(blob);
                                    await writable.close();
                                } catch (e) {
                                    // backup download: using extension api
                                    await download({
                                        url: url,
                                        conflictAction: 'overwrite',
                                        filename: collectionName + '/' + fileName,
                                    });
                                    useDownloadFolder = true;
                                }
                            }

                            downloadedIncludeChilds++;

                            pool[pool_index] =
                                'thread ' +
                                (pool_index + 1) +
                                ': item ' +
                                (downloaded + i + 1) +
                                (data.length > 1 ? ` (${j + 1}/${data.length})` : '');

                            message.loading({
                                key,
                                content: (
                                    <span>
                                        {`${t('Downloading')}... ${downloadedIncludeChilds}`}

                                        {/* render failed */}
                                        {failed ? (
                                            <>
                                                {t('Failed')}: ${failed} <br />
                                            </>
                                        ) : (
                                            ''
                                        )}
                                        <br />

                                        {/* rener collection name */}
                                        {collectionName}
                                        <br />
                                        <i>{t('Click to stop')}</i>
                                        <br />
                                        <Divider />

                                        {/* render pool */}
                                        {pool.map((_, _i) => (
                                            <span
                                                key={_i}
                                                style={{
                                                    width: '100%',
                                                    textAlign: 'left',
                                                    display: 'block',
                                                }}
                                            >
                                                {_}
                                                <br />
                                            </span>
                                        ))}
                                        <br />
                                    </span>
                                ),
                                duration: 0,
                                onClick: () => {
                                    stopFetch = true;
                                    stopQueue();
                                    message.loading({
                                        key: stoppingKey,
                                        content: t('Stopping...'),
                                        duration: 0,
                                    });
                                },
                            });
                        }
                        if (useDownloadFolder) downloadedByApi++;
                        downloaded++;
                    } catch (e) {
                        failed++;
                        message.error({
                            content: t('Download failed') + ': ' + e.message,
                        });
                    }
                })
            );
            const chunk_downloaded = await start();
            index += chunk_downloaded.length;
        }

        if (downloadType === DownloadType.JSON || downloadType === DownloadType.Link) {
            const filename = downloadType === DownloadType.JSON ? 'data.json' : 'links.txt';
            const data =
                downloadType === DownloadType.JSON
                    ? JSON.stringify(allJsons, null, 4)
                    : allLinks.join('\n');
            const fileHandler = await subDir.getFileHandle(filename, { create: true });
            const writable = await fileHandler.createWritable();
            await writable.write(data);
            await writable.close();
        }

        // show result
        const cursor = getItemCursor?.(all[all.length - 1]);
        message.destroy(key);
        message.destroy(stoppingKey);

        if (downloadedByApi > 0) {
            notification.info({
                type: 'info',
                message: t('In Download/ folder') + ': ' + downloadedByApi,
                description: t(
                    'Files that cannot be normal downloaded, will be force download into default Download folder of your browser'
                ),
                duration: 0,
                btn: (
                    <Button onClick={showDefaultDownloadFolder}>
                        {t('Show Download/ folder')}
                    </Button>
                ),
            });
        }
        notification.success({
            type: 'success',
            message: t(stopFetch ? 'Download stopped' : 'Download finished'),
            description: (
                <ul>
                    <li>
                        <b>{t('Folder Name')}:</b> {collectionName}
                    </li>
                    <li>
                        <b>{t('Downloaded')}:</b> {downloadedIncludeChilds}
                    </li>
                    {downloadedByApi > 0 && (
                        <li>
                            <b>{t('In Download/ folder')}:</b> {downloadedByApi}
                        </li>
                    )}
                    <li>
                        <b>{t('Last index')}:</b> {index + startIndex}
                    </li>
                    <li>
                        <b>{t('Last cursor')}:</b> {cursor}
                    </li>
                </ul>
            ),
            duration: 0,
            btn: (
                <Space direction="horizontal">
                    {stopFetch ? (
                        <Button
                            onClick={() =>
                                downloadAll({
                                    downloadType,
                                    fromCursor: cursor,
                                    startIndex: index + startIndex,
                                })
                            }
                        >
                            {t('Continue download')}
                        </Button>
                    ) : null}
                </Space>
            ),
        });

        // save cache
        localStorage.setItem(collectionName + '_fromCursor', cursor + '');
        localStorage.setItem(collectionName + '_startIndex', index + startIndex + '');
    };

    return (
        <Space direction="vertical" style={{ width: '100%' }}>
            {downloadItem && data.length > 0 && (
                <Button.Group style={{ width: '100%', justifyContent: 'center' }}>
                    <Dropdown
                        menu={{
                            items: [
                                { key: DownloadType.File, label: t('Download files') },
                                { key: DownloadType.Link, label: t('Download links') },
                                { key: DownloadType.JSON, label: t('Download .json') },
                            ],
                            onClick: e => {
                                downloadAll({ downloadType: e.key as DownloadType });
                            },
                        }}
                    >
                        <Button type="primary" icon={<i className="fa-solid fa-download"></i>}>
                            {t('Download')}
                        </Button>
                    </Dropdown>
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
    );
}
