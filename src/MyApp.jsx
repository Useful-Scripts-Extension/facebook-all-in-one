import React, { useEffect } from 'react';
import { App, Layout, Menu, Space, Spin } from 'antd';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import useStore, { selectors } from './store';
import { getFbDtsg, getMyUid, getUserInfoFromUid, trackEvent } from './utils/facebook';
import logo from './assets/logo.png';
import { LanguagePicker, ProfileHeader, ThemeSwitcher, ComingSoon } from './components';

const { Header, Sider, Content, Footer } = Layout;

const AllMessages = React.lazy(() => import('./screens/Messages/AllMessages'));
const FirstMessages = React.lazy(() => import('./screens/Messages/FirstMessages'));
const AllFriends = React.lazy(() => import('./screens/Friends/AllFriends'));
const BulkDownloader = React.lazy(() => import('./screens/BulkDownloader'));

function convertMenuItemToAntd(items, t) {
    return items.map(item => {
        return {
            key: item.path || item.label,
            label: item.path ? <Link to={item.path}>{t(item.label)}</Link> : t(item.label),
            icon: item.icon,
            children: item.children ? convertMenuItemToAntd(item.children, t) : null,
        };
    });
}

function convertMenuItemToRoute(items) {
    let routes = [];
    items.forEach(item => {
        if (item.path) {
            routes.push({
                path: item.path,
                element: item.element,
            });
        }
        if (item.children) {
            routes = routes.concat(convertMenuItemToRoute(item.children));
        }
    });
    return routes;
}

const menuItems = [
    {
        label: 'Dashboard',
        icon: <i className="fa-solid fa-house"></i>,
        path: '/',
        element: <ComingSoon name="Dashboard" />,
    },
    {
        label: 'Messages',
        icon: <i className="fa-brands fa-facebook-messenger"></i>,
        children: [
            {
                label: 'All messages',
                icon: <i className="fa-solid fa-comments"></i>,
                path: '/messages/all',
                element: <AllMessages />,
            },
            {
                label: 'First messages',
                icon: <i className="fa-solid fa-clock-rotate-left"></i>,
                path: '/messages/first',
                element: <FirstMessages />,
            },
        ],
    },
    {
        label: 'Friends',
        icon: <i className="fa-solid fa-user-group"></i>,
        children: [
            {
                label: 'All friends',
                icon: <i className="fa-solid fa-users"></i>,
                path: '/friends/all',
                element: <AllFriends />,
            },
            // {
            //     label: ('Find friends'),
            //     icon: <i className="fa-solid fa-magnifying-glass"></i>,
            //     path: '/friends/find',
            //     element: <FindFriends />,
            // },
            {
                label: 'Friend requests',
                icon: <i className="fa-solid fa-user-plus"></i>,
                path: '/friends/requests',
                element: <ComingSoon name="Friend requests" />,
            },
            {
                label: 'Follow',
                icon: <i className="fa-solid fa-person-walking-arrow-right"></i>,
                path: '/friends/follow',
                element: <ComingSoon name="Followings / Followers" />,
            },
        ],
    },
    {
        label: 'Bulk Downloader',
        icon: <i className="fa-solid fa-download"></i>,
        path: '/bulk-downloader',
        element: <BulkDownloader />,
    },
    {
        label: 'Groups',
        icon: <i className="fa-solid fa-users-line"></i>,
        path: '/groups',
        element: <ComingSoon name="Groups" />,
    },
    {
        label: 'Pages',
        icon: <i className="fa-solid fa-flag"></i>,
        path: '/pages',
        element: <ComingSoon name="Pages" />,
    },
];

export default function MyApp() {
    const { notification } = App.useApp();
    const { t } = useTranslation();
    const location = useLocation();
    const hydrated = useStore(selectors.hydrated);

    const profile = useStore(selectors.profile);
    const setProfile = useStore(selectors.setProfile);

    useEffect(() => {
        (async () => {
            try {
                const uid = await getMyUid();
                const profileInfo = await getUserInfoFromUid(uid);
                if (!profileInfo) throw new Error('Server reponse empty');
                profileInfo.fb_dtsg = await getFbDtsg();
                setProfile(profileInfo);
                console.log(profileInfo);
                trackEvent('MyApp:loadProfile');
            } catch (err) {
                notification.error({
                    message: t('Error'),
                    description: t('Failed to get your profile data') + ': ' + err.message,
                    duration: 0,
                });
            }
        })();
    }, []);

    const antdMenuItems = convertMenuItemToAntd(menuItems, t);
    const routes = convertMenuItemToRoute(menuItems);

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Spin spinning={!hydrated || !profile} fullscreen />

            <Sider collapsible width={250} breakpoint="lg">
                <div
                    style={{
                        height: 64,
                        padding: 10,
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >
                    <img src={logo} style={{ height: '100%' }} alt="Useful Script logo" />
                </div>
                <Menu
                    theme="dark"
                    mode="inline"
                    items={antdMenuItems}
                    selectedKeys={[location.pathname]}
                />
            </Sider>

            <Layout className="site-layout">
                <Header style={{ padding: 0 }}>
                    <Space style={{ float: 'right', marginRight: 16 }}>
                        <ProfileHeader />
                        <LanguagePicker />
                        <ThemeSwitcher />
                    </Space>
                </Header>

                <Content style={{ padding: '18px', position: 'relative' }}>
                    {profile ? (
                        <React.Suspense fallback={<Spin fullscreen spinning />}>
                            <Routes>
                                {routes.map(route => (
                                    <Route
                                        key={route.path}
                                        path={route.path}
                                        element={route.element}
                                    />
                                ))}
                            </Routes>
                        </React.Suspense>
                    ) : null}
                </Content>

                <Footer style={{ textAlign: 'center' }}>
                    Facebook All In One ©{new Date().getFullYear()} - Cretead by{' '}
                    <a href="https://github.com/Useful-Scripts-Extension" target="_blank">
                        Useful-Scripts
                    </a>
                </Footer>
            </Layout>
        </Layout>
    );
}
