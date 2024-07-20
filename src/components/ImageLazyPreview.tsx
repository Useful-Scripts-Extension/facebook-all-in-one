import React, { useRef, useState } from 'react';
import { Image, ImageProps, Spin } from 'antd';

export default function ImageLazyPreview(
    props: ImageProps & {
        defaultPreviewSrc: string;
        getPreview: () => Promise<string>;
        renderPreview?: (src: string, loading: boolean) => ImageProps['preview'];
    }
) {
    const { defaultPreviewSrc, getPreview, renderPreview, ...restProps } = props;

    const [loading, setLoading] = useState(false);
    const [previewSrc, setPreviewSrc] = useState(defaultPreviewSrc);
    const fetchedRef = useRef(false);

    const handleClick = () => {
        if (!previewSrc && !fetchedRef.current) {
            setLoading(true);
            getPreview()
                .then(data => {
                    setPreviewSrc(data);
                    fetchedRef.current = true;
                })
                .finally(() => setLoading(false));
        }
    };

    return (
        <Image
            {...restProps}
            preview={renderPreview?.(previewSrc, loading) || { src: previewSrc }}
            onClick={e => {
                restProps.onClick?.(e);
                handleClick();
            }}
        />
    );
}
