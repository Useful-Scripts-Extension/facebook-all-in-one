import React from 'react';
import { Space, Tabs, TabsProps } from 'antd';

const items: TabsProps['items'] = [
    {
        key: '1',
        label: 'Tab 1',
        children: 'Content of Tab Pane 1',
    },
    {
        key: '2',
        label: 'Tab 2',
        children: 'Content of Tab Pane 2',
    },
    {
        key: '3',
        label: 'Tab 3',
        children: 'Content of Tab Pane 3',
    },
];

export default function BulkDownloader() {
    const onChange = () => {};

    return (
        <Space style={{ width: '100%', height: '100%' }} direction="vertical">
            <h1>Bulk downloader</h1>
            <Tabs defaultActiveKey="1" centered items={items} onChange={onChange} />
        </Space>
    );
}
