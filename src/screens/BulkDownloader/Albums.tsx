import React from 'react';
import { Card, Image, List } from 'antd';
import { IAlbum } from '../../utils/facebook';
import { formatNumberWithCommas } from '../../utils/helper';

export default function Albums({ albums }: { albums: IAlbum[] }) {
    return (
        <List
            pagination={{ showTotal: total => `Total ${total} albums`, defaultPageSize: 30 }}
            grid={{ gutter: 10 }}
            dataSource={albums}
            renderItem={item => (
                <List.Item>
                    <Card
                        hoverable
                        style={{ width: 200 }}
                        cover={
                            <Image
                                src={item.picture?.data?.url}
                                // preview={{ src: item.image }}
                                alt={item.name}
                                width={200}
                                height={200}
                                style={{ objectFit: 'cover' }}
                            />
                        }
                        actions={[
                            <a href={item.link} target="_blank">
                                <i className="fa-solid fa-up-right-from-square"></i>
                            </a>,
                        ]}
                    >
                        <Card.Meta
                            title={item.name}
                            description={formatNumberWithCommas(item.count) + ' items'}
                        />
                    </Card>
                </List.Item>
            )}
        />
    );
}
