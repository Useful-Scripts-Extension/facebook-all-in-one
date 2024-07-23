import React, { useCallback } from 'react';
import { getGroupMembers, IEntityAbout, IGroupMember } from '../../utils/facebook';
import { Image, List, Space, Tooltip, Typography } from 'antd';
import Collection from '../../components/Collection';
import { useTranslation } from 'react-i18next';
import MyTable from '../../components/MyTable';

export default function GroupMembers({ target }: { readonly target: IEntityAbout | null }) {
    const { t } = useTranslation();

    const fetchNext = useCallback(
        async (currentData: IGroupMember[] = []) => {
            if (!target?.id || !target?.type) return;
            const lastItem = currentData?.[currentData?.length - 1];
            const res = await getGroupMembers({
                groupId: target?.id,
                cursor: lastItem?.cursor || '',
            });
            return res;
        },
        [target]
    );

    return null;
    // return <MyTable columns={} />;
}
