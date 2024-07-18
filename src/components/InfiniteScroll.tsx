import { App } from 'antd';
import React, { useEffect, useRef } from 'react';
import { useIntersectionObserver, useInterval } from 'usehooks-ts';

export default function InfiniteScroll({
    disabled,
    children,
    next,
    hasNext,
    prev,
    hasPrev,
    loader,
    endMessage,
    prevLoader,
    prevEndMessage,
}: {
    readonly disabled?: boolean;
    readonly children: React.ReactNode;
    readonly next?: () => Promise<void>;
    readonly hasNext?: boolean;
    readonly prev?: () => Promise<void>;
    readonly hasPrev?: boolean;
    readonly loader: React.ReactNode;
    readonly endMessage: React.ReactNode;
    readonly prevLoader?: React.ReactNode;
    readonly prevEndMessage?: React.ReactNode;
}) {
    const { message } = App.useApp();

    const { isIntersecting: prevInView, ref: prevRef } = useIntersectionObserver();
    const { isIntersecting: nextInView, ref: nextRef } = useIntersectionObserver();

    useInterval(() => {
        checkFetchNext();
        checkFetchPrev();
    }, 500);

    useEffect(() => {
        checkFetchNext();
    }, [nextInView]);

    useEffect(() => {
        checkFetchPrev();
    }, [prevInView]);

    const fetchingNextRef = useRef(false);
    const checkFetchNext = () => {
        if (!disabled && nextInView && !fetchingNextRef.current) {
            fetchingNextRef.current = true;
            const key = 'checkFetchNext';
            message.loading({ key, content: 'Fetching next...', duration: 0 });
            next?.()
                .then(() => {
                    message.success({ key, content: 'Fetch success' });
                })
                .catch(e => {
                    message.error({ key, content: 'Fetch failed: ' + e.message });
                    console.log(e);
                })
                .finally(() => {
                    fetchingNextRef.current = false;
                });
        }
    };

    const fetchingPrevRef = useRef(false);
    const checkFetchPrev = () => {
        if (!disabled && prevInView && !fetchingPrevRef.current) {
            fetchingPrevRef.current = true;
            const key = 'checkFetchPrev';
            message.loading({ key, content: 'Fetching next...', duration: 0 });
            prev?.()
                .then(() => {
                    message.success({ key, content: 'Fetch success' });
                })
                .catch(e => {
                    message.error({ key, content: 'Fetch failed: ' + e.message });
                    console.log(e);
                })
                .finally(() => {
                    fetchingPrevRef.current = false;
                });
        }
    };

    return (
        <div style={{ flex: 1 }}>
            {prev && hasPrev && !disabled && <div ref={prevRef}>{prevLoader || loader}</div>}
            {prev && !hasPrev && (prevEndMessage || endMessage)}
            {children}
            {next && hasNext && !disabled && <div ref={nextRef}>{loader}</div>}
            {!hasNext && endMessage}
        </div>
    );
}
