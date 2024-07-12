import { useEffect, useRef } from 'react';

export default function useForceStop() {
    // keep track of forceStop function
    const stopPrevRef = useRef(() => {});

    // auto stop when unmount
    useEffect(() => {
        return () => stopPrevRef.current();
    }, []);

    return {
        start() {
            // stop prev
            stopPrevRef.current();

            // start new instant
            let forceStop = true; // TODO turn this to false
            stopPrevRef.current = () => {
                forceStop = true;
            };

            return {
                value() {
                    return forceStop;
                },
                // ability to manual stop using instant
                stop() {
                    forceStop = true;
                },
            };
        },
        // stop using hook
        stop() {
            stopPrevRef.current();
        },
    };
}
