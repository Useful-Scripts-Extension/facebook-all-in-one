import React, { useEffect, useState } from 'react';
import { Badge, Button, Image, List, Space, Tooltip, Typography } from 'antd';
import {
    ACCESS_TOKEN_TYPE,
    getAccessToken,
    getAllAlbums,
    IAlbum,
    TargetType,
} from '../../utils/facebook';
import { formatNumberWithCommas } from '../../utils/helper';
import useForceStop from '../../hooks/useForceStop';

export default function Albums({
    targetId,
    targetType,
}: {
    targetId?: string;
    targetType?: TargetType;
}) {
    const forceStop = useForceStop();
    const [loading, setLoading] = useState(false);
    const [albums, setAlbums] = useState([] as IAlbum[]);

    useEffect(() => {
        if (targetId && targetType) refresh();
    }, [targetId, targetType]);

    const refresh = async (cursor = '') => {
        let f = forceStop.start();
        if (targetId) {
            try {
                setLoading(true);
                const albums = await getAllAlbums({
                    accessToken: await getAccessToken(ACCESS_TOKEN_TYPE.EAAB),
                    id: targetId,
                    targetType,
                    fromAlbumId: cursor,
                    onProgress: _albums => {
                        setAlbums([..._albums]);
                        return f.value();
                    },
                });
                setAlbums(albums);
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        }
    };

    const renderList = () => {
        return (
            <List
                pagination={{ showTotal: total => `Total ${total} albums`, defaultPageSize: 20 }}
                grid={{ gutter: 10 }}
                dataSource={albums}
                renderItem={item => (
                    <List.Item>
                        <Space direction="vertical">
                            <Badge.Ribbon text={formatNumberWithCommas(item.count)}>
                                <Image
                                    src={item.picture}
                                    alt={item.name}
                                    width={150}
                                    height={150}
                                    style={{ objectFit: 'cover', borderRadius: '10px' }}
                                    preview={false}
                                />
                            </Badge.Ribbon>
                            <Typography.Paragraph
                                style={{ maxWidth: '150px', wordWrap: 'break-word' }}
                                onClick={() => window.open(item.link)}
                            >
                                {item.name}
                            </Typography.Paragraph>
                        </Space>
                    </List.Item>
                )}
            />
        );
    };

    return (
        <Space direction="vertical" style={{ width: '100%' }}>
            <Space style={{ display: 'flex', justifyContent: 'center', marginBottom: 10 }}>
                <Tooltip title={loading ? 'Stop' : 'Refresh'}>
                    <Button
                        icon={
                            <i
                                className={'fa-solid fa-rotate-right' + (loading ? ' fa-spin' : '')}
                            ></i>
                        }
                        onClick={() => refresh()}
                    >
                        Refresh
                    </Button>
                </Tooltip>
            </Space>

            {renderList()}
        </Space>
    );
}
