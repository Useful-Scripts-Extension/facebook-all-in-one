import React, { useEffect, useRef, useState } from 'react';
import { Button, Image, List, Space, Tooltip } from 'antd';
import InfiniteScroll from './InfiniteScroll';

export default function Collection<T>({
    renderItem,
    fetchNext,
}: {
    readonly renderItem: (data: T) => React.ReactNode;
    readonly fetchNext: (currentData?: T[]) => Promise<T[] | undefined>;
}) {
    const [hasMore, setHasMore] = useState(true);
    const [data, setData] = useState([] as T[]);

    useEffect(() => {
        setData([]);
        next([]);
    }, [fetchNext]);

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

    return (
        <Space
            direction="vertical"
            style={{
                width: '100%',
                // maxHeight: '100vh',
                // overflowY: 'auto',
                // overflowX: 'hidden',
            }}
        >
            <InfiniteScroll
                disabled={false}
                next={() => next()}
                hasNext={hasMore}
                loader={
                    <Space style={{ display: 'flex', justifyContent: 'center' }}>
                        <Tooltip title={'Click to load'}>
                            <Button onClick={() => next()}>
                                <i className="fa-solid fa-spinner fa-spin fa-lg"></i>
                            </Button>
                        </Tooltip>
                    </Space>
                }
                endMessage={
                    <p style={{ textAlign: 'center' }}>
                        <b>Yay! You have seen it all</b>
                    </p>
                }
            >
                <Image.PreviewGroup>
                    <List grid={{ gutter: 10 }} dataSource={data} renderItem={renderItem} />
                </Image.PreviewGroup>
            </InfiniteScroll>
        </Space>
    );
}
