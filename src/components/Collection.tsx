import React, { useEffect, useRef, useState } from 'react';
import { Button, List, Space, Tooltip } from 'antd';
import InfiniteScroll from 'react-infinite-scroll-component';

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
        next();
    }, [fetchNext]);

    const loadingRef = useRef(false);
    const next = async () => {
        if (loadingRef.current) return;
        loadingRef.current = true;
        console.log('local fetch next');

        const res = await fetchNext(data);
        console.log(res);
        if (res?.length) {
            setData([...data, ...res]);
            setHasMore(true);
        } else if (res?.length === 0) {
            setHasMore(false);
        }
        loadingRef.current = false;
    };

    const renderInfiniteScroll = () => {
        return (
            <InfiniteScroll
                dataLength={data.length} //This is important field to render the next data
                next={next}
                hasMore={hasMore}
                loader={
                    <Space style={{ display: 'flex', justifyContent: 'center' }}>
                        <Tooltip title={'Click to load'}>
                            <Button onClick={next}>
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
                <List grid={{ gutter: 10 }} dataSource={data} renderItem={renderItem} />
            </InfiniteScroll>
        );
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
            {renderInfiniteScroll()}
        </Space>
    );
}
