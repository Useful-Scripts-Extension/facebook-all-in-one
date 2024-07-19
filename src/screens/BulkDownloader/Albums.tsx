import React, { useCallback } from 'react';
import { Badge, Image, List, Space, Typography } from 'antd';
import {
    ACCESS_TOKEN_TYPE,
    getAccessToken,
    getEntityAlbum,
    IAlbum,
    TargetType,
} from '../../utils/facebook';
import { formatNumberWithCommas } from '../../utils/helper';
import Collection from '../../components/Collection';

export default function Albums({
    targetId,
    targetType,
    onOpenAlbum,
}: {
    readonly targetId?: string;
    readonly targetType?: TargetType;
    readonly onOpenAlbum?: (album: IAlbum) => void;
}) {
    const fetchNext = useCallback(
        async (currentData: IAlbum[] = []) => {
            if (!targetId || !targetType) return;
            const res = await getEntityAlbum({
                id: targetId,
                accessToken: await getAccessToken(ACCESS_TOKEN_TYPE.EAAB),
                cursor: btoa(currentData?.[currentData?.length - 1]?.id || ''),
            });
            return res.albums;
        },
        [targetId, targetType]
    );

    const renderItem = useCallback((item: IAlbum) => {
        return (
            <List.Item>
                <Space direction="vertical">
                    <Badge.Ribbon text={formatNumberWithCommas(item.count)}>
                        <Image
                            src={item.picture}
                            alt={item.name}
                            width={150}
                            height={150}
                            style={{ objectFit: 'cover', borderRadius: '10px', cursor: 'pointer' }}
                            preview={false}
                            onClick={() => {
                                onOpenAlbum?.(item);
                            }}
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
        );
    }, []);

    return (
        <Collection
            collectionName="Albums"
            fetchNext={fetchNext}
            renderItem={renderItem}
            rowKey={item => item.id}
        />
    );
}
