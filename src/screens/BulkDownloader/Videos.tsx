import React, { useEffect, useRef, useState } from 'react';
import { Badge, Card, Image, List } from 'antd';
import { ACCESS_TOKEN_TYPE, getAccessToken, getAllVideos, IVideo } from '../../utils/facebook';
import { formatSeconds, limitString } from '../../utils/helper';
import useForceStop from '../../hooks/useForceStop';

export default function Videos({ targetId }: { targetId: string | undefined }) {
    const forceStop = useForceStop();
    const [videos, setVideos] = useState([] as IVideo[]);

    useEffect(() => {
        if (targetId) refresh();
    }, [targetId]);

    const refresh = async () => {
        let f = forceStop.start();

        if (targetId) {
            const accessToken = await getAccessToken(ACCESS_TOKEN_TYPE.EAAB);
            const videos = await getAllVideos({
                id: targetId,
                accessToken,
                onProgress: _videos => {
                    setVideos([..._videos]);
                    return f.value();
                },
            });
            setVideos(videos);
        }
    };

    return (
        <List
            pagination={{ showTotal: total => `Total ${total} videos`, defaultPageSize: 20 }}
            grid={{ gutter: 10 }}
            dataSource={videos}
            renderItem={item => (
                <List.Item>
                    <Card
                        hoverable={true}
                        style={{ width: 200 }}
                        cover={
                            <Badge.Ribbon text={formatSeconds(item.length)}>
                                <Image
                                    src={item.picture}
                                    preview={{
                                        destroyOnClose: true,
                                        imageRender: () => (
                                            <video
                                                autoPlay
                                                controls
                                                src={item.source}
                                                style={{ maxWidth: '90%', maxHeight: '90%' }}
                                            />
                                        ),
                                        toolbarRender: () => null,
                                    }}
                                    width={200}
                                    height={200}
                                    style={{ objectFit: 'cover' }}
                                />
                            </Badge.Ribbon>
                        }
                        actions={[
                            <a href={item.url} target="_blank">
                                <i className="fa-solid fa-up-right-from-square"></i>
                            </a>,
                        ]}
                    >
                        <Card.Meta title={limitString(item.description, 50)} />
                    </Card>
                </List.Item>
            )}
        />
    );
}
