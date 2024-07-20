import React, { useCallback } from 'react';
import { Badge, Image, List, Space, Typography } from 'antd';
import {
    ACCESS_TOKEN_TYPE,
    getAccessToken,
    getEntityAlbum,
    getGroupAlbum,
    getUserAlbum,
    IAlbum,
    IEntityAbout,
    TargetType,
} from '../../utils/facebook';
import { formatNumberWithCommas } from '../../utils/helper';
import Collection from '../../components/Collection';

export default function Albums({
    target,
    onOpenAlbum,
}: {
    readonly target: IEntityAbout | null;
    readonly onOpenAlbum?: (album: IAlbum) => void;
}) {
    const fetchNext = useCallback(
        async (currentData: IAlbum[] = []) => {
            if (!target?.id || !target?.type) return;
            const lastItem = currentData?.[currentData?.length - 1];

            // accessToken way
            if (target.type !== TargetType.Group) {
                const res = await getEntityAlbum({
                    id: target?.id,
                    accessToken: await getAccessToken(ACCESS_TOKEN_TYPE.EAAB),
                    fromId: lastItem?.id || '',
                });
                return res.albums;
            }

            // graphql way
            const res2 =
                target.type === TargetType.Group
                    ? await getGroupAlbum({ groupId: target.id, cursor: lastItem?.cursor })
                    : await getUserAlbum({ uid: target.id, cursor: lastItem?.cursor });
            if (res2.albums?.length) {
                let existId = new Set(currentData.map(item => item.id));
                return res2.albums.filter(item => !existId.has(item.id));
            }
            return [];
        },
        [target]
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
        <Image.PreviewGroup>
            <Collection
                collectionName={target?.name + ' - Albums'}
                fetchNext={fetchNext}
                renderItem={renderItem}
                rowKey={item => item.id}
            />
        </Image.PreviewGroup>
    );
}
