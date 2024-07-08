import { Input, Space } from 'antd';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { findUserByEmailOrPhone } from '../../utils/facebook';

const { Search } = Input;

// 0979416693
// gaumap1605@gmail.com

export default function FindFriends() {
    const { t } = useTranslation();

    useEffect(() => {}, []);

    const onSearch = value => {
        findUserByEmailOrPhone(value).catch(e => {
            alert('Error: ' + e.message);
            console.log(e);
        });
    };

    return (
        <Space
            direction="vertical"
            style={{
                width: '100%',
                height: '100%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
            }}
        >
            <h1>{t('Find friends')}</h1>
            <Search
                // value={'gaumap1605@gmail.com'}
                placeholder={t('Enter email or phone number')}
                size="large"
                addonBefore={
                    <Space>
                        <i className="fa-solid fa-at"></i>
                        <i className="fa-solid fa-phone"></i>
                    </Space>
                }
                styles={{ width: '100%' }}
                onSearch={onSearch}
                enterButton
            />
        </Space>
    );
}
