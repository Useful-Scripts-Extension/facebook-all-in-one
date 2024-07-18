import { useEffect, useRef } from 'react';

export default function usePrevious(value) {
    const prev = useRef(null);
    const cur = useRef(value);

    useEffect(() => {
        prev.current = value;
        cur.current = value;
    }, [value]);

    return prev.current;
}
