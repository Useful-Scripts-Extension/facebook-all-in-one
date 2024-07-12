import React, { useEffect, useRef, useState } from 'react';
import { Badge, Button, Card, Image, List, Space, Tooltip, Typography } from 'antd';
import { ACCESS_TOKEN_TYPE, getAccessToken, getAllAlbums, IAlbum } from '../../utils/facebook';
import { formatNumberWithCommas } from '../../utils/helper';

export default function Albums({ targetId }: { targetId: string | undefined }) {
    const [loading, setLoading] = useState(false);
    const [albums, setAlbums] = useState([] as IAlbum[]);

    useEffect(() => {
        const forceStop = refresh();
        return () => {
            forceStop();
        };
    }, [targetId]);

    const refresh = () => {
        let forceStop = false;
        if (targetId) {
            (async () => {
                try {
                    setLoading(true);
                    const accessToken = await getAccessToken(ACCESS_TOKEN_TYPE.EAAB);
                    const albums = await getAllAlbums({
                        id: targetId,
                        accessToken,
                        onProgress: _albums => {
                            setAlbums([..._albums]);
                            return forceStop;
                        },
                    });
                    setAlbums(albums);
                } catch (e) {
                    console.error(e);
                } finally {
                    setLoading(false);
                }
            })();
        }
        return () => {
            forceStop = true;
        };
    };

    return (
        <List
            pagination={{ showTotal: total => `Total ${total} albums`, defaultPageSize: 20 }}
            grid={{ gutter: 10 }}
            dataSource={albums}
            header={
                <Space style={{ display: 'flex', justifyContent: 'center' }}>
                    <Tooltip title={loading ? 'Stop' : 'Refresh'}>
                        <Button
                            icon={
                                <i
                                    className={
                                        'fa-solid fa-rotate-right' + (loading ? ' fa-spin' : '')
                                    }
                                ></i>
                            }
                            onClick={refresh}
                        >
                            Refresh {albums.length}
                        </Button>
                    </Tooltip>
                </Space>
            }
            renderItem={item => (
                <List.Item>
                    <Space direction="vertical">
                        <Badge.Ribbon text={formatNumberWithCommas(item.count)}>
                            <Image
                                src={item.picture}
                                alt={item.name}
                                width={200}
                                height={200}
                                style={{ objectFit: 'cover', borderRadius: '10px' }}
                            />
                        </Badge.Ribbon>
                        <Typography.Paragraph
                            style={{ maxWidth: '200px', wordWrap: 'break-word' }}
                            onClick={() => window.open(item.link)}
                        >
                            {item.name}
                        </Typography.Paragraph>
                    </Space>
                </List.Item>
            )}
        />
    );
}
