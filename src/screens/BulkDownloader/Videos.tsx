import React from 'react';
import { Badge, Card, Image, List } from 'antd';
import { IVideo } from '../../utils/facebook';
import { formatSeconds, limitString } from '../../utils/helper';

export default function Videos({ videos }: { videos: IVideo[] }) {
    return (
        <List
            pagination={{ showTotal: total => `Total ${total} videos`, defaultPageSize: 20 }}
            grid={{ gutter: 10 }}
            dataSource={videos}
            renderItem={item => (
                <List.Item>
                    <Card
                        hoverable={true}
                        style={{ width: 300 }}
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
                                    width={300}
                                    height={200}
                                    style={{ objectFit: 'cover' }}
                                />
                            </Badge.Ribbon>
                        }
                        actions={[
                            <a href={'https://fb.com/' + item.post_id} target="_blank">
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
