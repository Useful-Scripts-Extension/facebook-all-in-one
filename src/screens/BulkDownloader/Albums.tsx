import React from 'react';
import { TableProps, Image } from 'antd';
import MyTable from '../../components/MyTable';
import { IAlbum } from '../../utils/facebook';

export default function Albums({ albums }: { albums: IAlbum[] }) {
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
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            render: (text, record, index) => (
                <a href={record.link} target="_blank">
                    {text}
                </a>
            ),
            sorter: (a, b) => a.name.localeCompare(b.name),
        },
        {
            title: 'Count',
            dataIndex: 'count',
            key: 'count',
            sorter: (a, b) => a.count - b.count,
        },
        {
            title: 'Picture',
            dataIndex: 'picture',
            key: 'picture',
            render: (value, record, index) => (
                <Image
                    src={record?.picture?.data?.url}
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
            data={albums}
            columns={columns}
            searchable
            selectable
            keyExtractor={album => album.id}
        />
    );
}
