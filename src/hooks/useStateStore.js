import { useEffect, useState } from 'react';
import useStore from '../store';

// Tạo 1 state mới với data trong cache, tự động update cache mỗi khi state thay đổi
// cần dùng hook này do useStore bình thường không thể update cache và update UI cùng lúc khi trong loop (for, while, do...)
// cần dùng setState của react mới được: setState(pre => ...)
export default function useStateStore(getSelector, setSelector) {
    const cache = useStore(getSelector);
    const setCache = useStore(setSelector);

    const [state, setState] = useState(cache);

    useEffect(() => {
        setCache(state);
    }, [state, setCache]);

    return [state, setState];
}
