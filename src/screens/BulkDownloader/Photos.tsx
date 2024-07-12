import React, { useEffect, useRef, useState } from 'react';
import { Image, List } from 'antd';
import { getAllPhotos, IUserPhoto, TargetType } from '../../utils/facebook';

export default function Photos({
    targetId,
    targetType,
}: {
    targetId: string | undefined;
    targetType: TargetType | undefined;
}) {
    const [photos, setPhotos] = useState([] as IUserPhoto[]);

    const stopLoadRef = useRef(false);

    useEffect(() => {
        if (targetId && targetType)
            getAllPhotos({
                targetType: targetType,
                id: targetId,
                onProgress: _photos => {
                    setPhotos([..._photos]);
                    return stopLoadRef.current;
                },
            }).then(setPhotos);
    }, [targetId, targetType]);

    return (
        <List
            pagination={{ showTotal: total => `Total ${total} photos`, defaultPageSize: 30 }}
            grid={{ gutter: 10 }}
            dataSource={photos}
            renderItem={item => (
                <List.Item>
                    <Image
                        src={item.thumbnail}
                        preview={{ src: item.image }}
                        alt={item.accessibility_caption}
                        width={150}
                        height={150}
                        style={{ objectFit: 'cover' }}
                    />
                </List.Item>
            )}
        />
    );
}
