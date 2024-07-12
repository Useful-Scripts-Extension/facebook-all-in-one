import React, { useEffect, useRef, useState } from 'react';
import { Badge, Card, Image, List } from 'antd';
import { ACCESS_TOKEN_TYPE, getAccessToken, getAllAlbums, IAlbum } from '../../utils/facebook';
import { formatNumberWithCommas } from '../../utils/helper';

export default function Albums({ targetId }: { targetId: string | undefined }) {
    const [albums, setAlbums] = useState([] as IAlbum[]);

    const stopLoadRef = useRef(false);

    useEffect(() => {
        if (targetId)
            getAccessToken(ACCESS_TOKEN_TYPE.EAAB).then(accessToken =>
                getAllAlbums({
                    id: targetId,
                    accessToken,
                    onProgress: _albums => {
                        setAlbums([..._albums]);
                        return stopLoadRef.current;
                    },
                }).then(setAlbums)
            );
    }, [targetId]);

    return (
        <List
            pagination={{ showTotal: total => `Total ${total} albums`, defaultPageSize: 20 }}
            grid={{ gutter: 10 }}
            dataSource={albums}
            renderItem={item => (
                <List.Item>
                    <Card
                        hoverable={true}
                        style={{ width: 200 }}
                        cover={
                            <Badge.Ribbon text={formatNumberWithCommas(item.count)}>
                                <Image
                                    src={item.picture}
                                    alt={item.name}
                                    width={200}
                                    height={200}
                                    style={{ objectFit: 'cover' }}
                                />
                            </Badge.Ribbon>
                        }
                        actions={[
                            <a href={item.link} target="_blank">
                                <i className="fa-solid fa-up-right-from-square"></i>
                            </a>,
                        ]}
                    >
                        <Card.Meta title={item.name} />
                    </Card>
                </List.Item>
            )}
        />
    );
}
