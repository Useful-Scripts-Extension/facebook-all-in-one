import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import MyTable from '../../components/MyTable';
import useForceStop from '../../hooks/useForceStop';
import {
    getGroupMemberCount,
    getGroupMembers,
    IEntityAbout,
    IGroupMember,
} from '../../utils/facebook';
import { Avatar, Button, Image, Row, TableProps } from 'antd';
import { formatNumberWithCommas, sleep } from '../../utils/helper';

export default function GroupMembers({ target }: { readonly target: IEntityAbout | null }) {
    const { t } = useTranslation();
    const forceStop = useForceStop();

    const [loading, setLoading] = useState(false);
    const [count, setCount] = useState(0);
    const [data, setData] = useState<IGroupMember[]>([]);
    const dataWithRecent = useMemo<IGroupMember[]>(() => {
        return data.map((d, index) => ({ ...d, recent: index }));
    }, [data]);

    useEffect(() => {
        if (!target?.id || !target?.type) return;
        // setData([]);
        // fetchAll([]);

        getGroupMemberCount({ groupId: target?.id }).then(res => {
            setCount(res);
        });
    }, [target]);

    const fetchAll = async (_data = data) => {
        const currentData = [..._data];

        const f = forceStop.start();
        while (!f.value()) {
            const lastItem = currentData?.[currentData?.length - 1];
            const res = await getGroupMembers({
                groupId: target?.id || '',
                cursor: lastItem?.cursor || '',
            });
            console.log(res);
            if (res.length) {
                currentData.push(...res);
                setData([...currentData]);
            } else {
                break;
            }
            await sleep(2000);
        }
    };

    const renderTitle = dataSelected => {
        return (
            <>
                <Button
                    type="primary"
                    icon={
                        loading ? (
                            <i className="fa-solid fa-rotate-right fa-spin"></i>
                        ) : (
                            <i className="fa-solid fa-rotate-right"></i>
                        )
                    }
                    // onClick={onClickReload}
                >
                    {t('Fetch all') + ' ' + formatNumberWithCommas(count)}
                </Button>
            </>
        );
    };

    const columns: TableProps<IGroupMember>['columns'] = [
        {
            title: '#',
            dataIndex: 'recent',
            key: 'recent',
            render: (text, record, index) => (record.recent || 0) + 1,
        },
        {
            title: t('Name'),
            key: 'name',
            dataIndex: 'name',
            sorter: (a, b) => a.name.localeCompare(b.name),
            render: (text, record, index) => {
                return (
                    <Row align="middle">
                        <Avatar shape="square" src={<Image src={record.avatar} />} size={50} />
                        <a href={record.url} target="_blank" style={{ marginLeft: '10px' }}>
                            <b>{record.name}</b>
                        </a>
                    </Row>
                );
            },
            width: 'auto',
        },
        {
            title: 'Uid',
            dataIndex: 'id',
            key: 'id',
            sorter: (a, b) => a.id.localeCompare(b.id),
            width: 150,
        },
        {
            title: t('Joined'),
            dataIndex: 'joinedTime',
            key: 'joinedTime',
            sorter: (a, b) => a.joinedTime.localeCompare(b.joinedTime),
        },
        {
            title: t('Last Active'),
            dataIndex: 'lastActiveTime',
            key: 'lastActiveTime',
            sorter: (a, b) => a.lastActiveTime.localeCompare(b.lastActiveTime),
        },
    ];

    return (
        <MyTable
            columns={columns}
            data={dataWithRecent}
            keyExtractor={item => item.id}
            searchable
            renderTitle={renderTitle}
        />
    );
}
