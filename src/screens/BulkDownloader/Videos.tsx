import React from 'react';
import { TableProps, Image } from 'antd';
import MyTable from '../../components/MyTable';
import { IVideo } from '../../utils/facebook';

export default function Videos({ videos }: { videos: IVideo[] }) {
    const columns: TableProps['columns'] = [
        {
            title: '#',
            dataIndex: 'recent',
            key: 'recent',
            render: (value, record, index) => record.recent + 1,
            sorter: (a, b) => a.recent - b.recent,
        },
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
            sorter: (a, b) => a.id - b.id,
        },
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
            render: (text, record, index) => (
                <a href={'https:/fb.com/' + record.post_id} target="_blank">
                    {text}
                </a>
            ),
            sorter: (a, b) => a.name.localeCompare(b.name),
        },
        {
            title: 'Length',
            dataIndex: 'length',
            key: 'length',
            sorter: (a, b) => a.length - b.length,
        },
        {
            title: 'Video',
            dataIndex: 'picture',
            key: 'picture',
            render: (value, record, index) => (
                <Image
                    src={record?.picture}
                    style={{
                        height: 100,
                        width: 100,
                        objectFit: 'cover',
                    }}
                />
            ),
        },
        {
            title: 'Action',
            dataIndex: 'action',
            key: 'action',
            render: (value, record, index) => (
                <a href={record.link} target="_blank">
                    Download
                </a>
            ),
        },
    ];

    return (
        <MyTable
            data={videos}
            columns={columns}
            searchable
            selectable
            keyExtractor={video => video.id}
        />
    );
}
