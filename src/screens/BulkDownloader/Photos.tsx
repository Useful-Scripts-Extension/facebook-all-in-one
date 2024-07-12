import React, { useEffect, useState } from 'react';
import { Image, List } from 'antd';
import { getAllPhotos, IUserPhoto, TargetType } from '../../utils/facebook';
import useForceStop from '../../hooks/useForceStop';

export default function Photos({
    targetId,
    targetType,
}: {
    targetId?: string;
    targetType?: TargetType;
}) {
    const forceStop = useForceStop();
    const [photos, setPhotos] = useState([] as IUserPhoto[]);

    useEffect(() => {
        if (targetId && targetType) refresh();
    }, [targetId, targetType]);

    const refresh = async () => {
        const f = forceStop.start();
        if (targetId) {
            try {
                const photos = await getAllPhotos({
                    targetType,
                    id: targetId,
                    onProgress: _photos => {
                        setPhotos([..._photos]);
                        return f.value();
                    },
                });
                setPhotos(photos);
            } catch (error) {
                console.error(error);
            }
        }
    };

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
                        style={{ objectFit: 'cover', borderRadius: '10px' }}
                    />
                </List.Item>
            )}
        />
    );
}
