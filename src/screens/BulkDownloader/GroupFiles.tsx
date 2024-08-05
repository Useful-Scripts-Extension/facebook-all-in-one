import React, { useCallback } from 'react';
import { getGroupFiles, IEntityAbout, IGroupFile } from '../../utils/facebook';
import { Badge, Image, List, Space, Tooltip, Typography } from 'antd';
import Collection from '../../components/Collection';
import { useTranslation } from 'react-i18next';

export default function GroupFiles({ target }: { readonly target: IEntityAbout | null }) {
    const { t } = useTranslation();

    const fetchNext = useCallback(
        async (currentData: IGroupFile[] = [], fromCursor?: string) => {
            if (!target?.id || !target?.type) return;
            const lastItem = currentData?.[currentData?.length - 1];
            const res = await getGroupFiles({
                groupId: target?.id,
                cursor: fromCursor || lastItem?.cursor || '',
            });
            return res;
        },
        [target]
    );

    const renderItem = useCallback((item: IGroupFile) => {
        return (
            <List.Item>
                <Space direction="vertical" align="center" style={{ minWidth: 150 }}>
                    <Space style={{ padding: '10px' }}>
                        <Badge.Ribbon
                            text={<i className="fa fa-times" />}
                            color="red"
                            style={{
                                display: !item.download_url ? 'block' : 'none',
                            }}
                        >
                            <Tooltip
                                title={item.download_url ? t('Download') : t('No download link')}
                            >
                                <Image
                                    src={item.icon}
                                    alt={item.name}
                                    width={70}
                                    height={70}
                                    style={{
                                        objectFit: 'cover',
                                        borderRadius: '10px',
                                        cursor: 'pointer',
                                    }}
                                    preview={false}
                                    onClick={() =>
                                        item.download_url && window.open(item.download_url)
                                    }
                                />
                            </Tooltip>
                        </Badge.Ribbon>
                    </Space>
                    <Tooltip title={t('View post')} placement="bottom">
                        <Typography.Paragraph
                            style={{ maxWidth: '150px', wordWrap: 'break-word' }}
                            onClick={() => window.open(item.post_url)}
                        >
                            {item.name}
                        </Typography.Paragraph>
                    </Tooltip>
                </Space>
            </List.Item>
        );
    }, []);

    const downloadItem = useCallback((item: IGroupFile) => {
        return {
            url: item.download_url,
            name: item.name,
        };
    }, []);

    const getItemCursor = (item: IGroupFile) => {
        return item.cursor || '';
    };

    return (
        <Collection
            collectionName={target?.name + ' - Files'}
            fetchNext={fetchNext}
            renderItem={renderItem}
            downloadItem={downloadItem}
            getItemCursor={getItemCursor}
            rowKey={item => item.name}
        />
    );
}
