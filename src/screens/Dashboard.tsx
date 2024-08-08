import React from 'react';
import { useTranslation } from 'react-i18next';

const updates = [
    {
        time: '2024-08-08',
        text: {
            vi: (
                <>
                    Hỗ trơ tải tất cả <u>Highlight Instagram</u> trong 1 click
                </>
            ),
            en: (
                <>
                    Support download all <u>Highlight Instagram</u> in 1 click
                </>
            ),
        },
        link: 'https://www.facebook.com/groups/1154059318582088/posts/1461600941161256',
    },
    {
        time: '2024-08-05',
        text: {
            vi: (
                <>
                    Hỗ trợ tải <u>Instagram</u>: Bài đăng (Ảnh/Video) / Reels
                </>
            ),
            en: (
                <>
                    Support download media on <u>Instagram</u>: Posts (Photos/Videos) / Reels
                </>
            ),
        },
        link: 'https://www.facebook.com/groups/1154059318582088/posts/1460960064558677',
    },
    {
        time: '2024-07-22',
        text: {
            vi: (
                <>
                    <u>Phím tắt Tải hàng loạt</u> từ bạn bè ngay trong trang Quản lý bạn bè
                </>
            ),
            en: (
                <>
                    <b>Shortcut bulk downloader</b> for your friends in Friends Manager
                </>
            ),
        },
        link: 'https://www.facebook.com/groups/1154059318582088/posts/1452419068746110',
    },
    {
        time: '2024-07-21',
        text: {
            vi: (
                <>
                    Hỗ trợ tải tất cả <u>Facebook Reels</u> của user/page
                </>
            ),
            en: (
                <>
                    Support download all <u>Facebook Reels</u> of user/page
                </>
            ),
        },
        link: 'https://www.facebook.com/groups/1154059318582088/posts/1451949155459768',
    },
    {
        time: '2024-07-21',
        text: {
            vi: (
                <>
                    Hỗ trợ tải tất cả <u>Files của Group</u> trên Facebook
                </>
            ),
            en: (
                <>
                    Support download all <u>Group's Files</u> on Facebook
                </>
            ),
        },
        link: 'https://www.facebook.com/groups/1154059318582088/posts/1451908458797171',
    },
    {
        time: '2024-07-21',
        text: {
            vi: (
                <>
                    Ra mắt chức năng <u>Tải hàng loạt</u>
                </>
            ),
            en: (
                <>
                    Introduce feature <u>Bulk downloader</u>
                </>
            ),
        },
        link: 'https://www.facebook.com/groups/1154059318582088/posts/1451735578814459',
    },
    {
        time: '2024-07-20',
        text: {
            vi: (
                <>
                    Ra mắt chức năng <u>Xem tin nhắn tại thời điểm bất kỳ</u>
                </>
            ),
            en: (
                <>
                    Introduce feature <u>View old messages at any time</u>
                </>
            ),
        },
        link: 'https://www.facebook.com/groups/1154059318582088/posts/1434276953893655',
    },
    {
        time: '2024-06-18',
        text: {
            vi: <>Bắt đầu code + Tìm người code chung</>,
            en: <>Start project + Finding dev collaboration</>,
        },
        link: 'https://www.facebook.com/groups/1154059318582088/posts/1433398573981493',
    },
];

export default function Dashboard() {
    const { i18n } = useTranslation();

    const t = data => {
        if (typeof data === 'string') return data;
        if (typeof data === 'object') return data[i18n.language] || '';
    };

    return (
        <div>
            <h1>Facebook all in one</h1>
            <br />
            {t({
                vi: (
                    <>
                        <h2>⭐ Giới thiệu</h2>
                        <h3>
                            Là 1 công cụ chứa rất nhiều chức năng hữu ích dành cho Facebook /
                            Instagram
                        </h3>
                        <h3>Xem danh sách chức năng ở Menu bên trái nhé.</h3>
                        <br />
                        <h3>
                            Tham gia{' '}
                            <a
                                target="_blank"
                                href="https://www.facebook.com/groups/1154059318582088"
                            >
                                Group Facebook
                            </a>{' '}
                            để được hỗ trợ
                        </h3>
                        <br />
                        <h2>⭐ Cập nhật mới</h2>
                    </>
                ),
                en: (
                    <>
                        <h2>⭐ What is this?</h2>
                        <h3>This website is a All in one tools for Facebook / Instagram</h3>
                        <h3>All features are show in the left Menu</h3>
                        <br />
                        <h3>
                            Plese join{' '}
                            <a
                                target="_blank"
                                href="https://www.facebook.com/groups/1154059318582088"
                            >
                                Group Facebook
                            </a>{' '}
                            if you need help
                        </h3>
                        <br />
                        <h2>⭐ Lastest updates</h2>
                    </>
                ),
            })}

            {updates.map((u, i) => (
                <h3 key={'update' + i}>
                    <i>{u.time}:</i> {t(u.text)}{' '}
                    {u.link ? (
                        <>
                            -{' '}
                            <a href={u.link} target="_blank">
                                {t({ vi: 'Xem thêm', en: 'More info' })}
                            </a>
                        </>
                    ) : (
                        ''
                    )}
                </h3>
            ))}
        </div>
    );
}
