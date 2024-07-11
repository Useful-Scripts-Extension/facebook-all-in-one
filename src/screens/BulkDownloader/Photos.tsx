import React from 'react';
import { Image, List } from 'antd';
import { IUserPhoto } from '../../utils/facebook';

export default function Photos({ photos }: { photos: IUserPhoto[] }) {
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
                        style={{ objectFit: 'cover' }}
                    />
                </List.Item>
            )}
        />
    );
}
