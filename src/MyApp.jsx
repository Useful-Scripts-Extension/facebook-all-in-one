import React, { useEffect } from 'react';
import { App, Layout, Menu, Space } from 'antd';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import useStore, { selectors } from './store';
import { getFbDtsg, getMyUid, getUserInfoFromUid, trackEvent } from './utils/facebook';
import logo from './assets/logo.png';
import {
    LanguagePicker,
    LoadingFullScreen,
    ProfileHeader,
    ThemeSwitcher,
    ComingSoon,
} from './components';

const { Header, Sider, Content, Footer } = Layout;

const AllMessages = React.lazy(() => import('./screens/Messages/AllMessages'));
const FirstMessages = React.lazy(() => import('./screens/Messages/FirstMessages'));
const AllFriends = React.lazy(() => import('./screens/Friends/AllFriends'));

function convertMenuItemToAntd(items) {
    return items.map(item => {
        return {
            key: item.path || item.label,
            label: item.path ? <Link to={item.path}>{item.label}</Link> : item.label,
            icon: item.icon,
            children: item.children ? convertMenuItemToAntd(item.children) : null,
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

export default function MyApp() {
    const { message, notification } = App.useApp();
    const { t } = useTranslation();
    const location = useLocation();
    const hydrated = useStore(selectors.hydrated);

    const profile = useStore(selectors.profile);
    const setProfile = useStore(selectors.setProfile);

    console.log(profile);

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

    const menuItems = [
        {
            label: t('Dashboard'),
            icon: <i className="fa-solid fa-house"></i>,
            path: '/',
            element: <ComingSoon name="Dashboard" />,
        },
        {
            label: t('Messages'),
            icon: <i className="fa-brands fa-facebook-messenger"></i>,
            children: [
                {
                    label: t('All messages'),
                    icon: <i className="fa-solid fa-comments"></i>,
                    path: '/messages/all',
                    element: <AllMessages />,
                },
                {
                    label: t('First messages'),
                    icon: <i className="fa-solid fa-clock-rotate-left"></i>,
                    path: '/messages/first',
                    element: <FirstMessages />,
                },
            ],
        },
        {
            label: t('Friends'),
            icon: <i className="fa-solid fa-user-group"></i>,
            children: [
                {
                    label: t('All friends'),
                    icon: <i className="fa-solid fa-users"></i>,
                    path: '/friends/all',
                    element: <AllFriends />,
                },
                {
                    label: t('Friend requests'),
                    icon: <i className="fa-solid fa-user-plus"></i>,
                    path: '/friends/requests',
                    element: <ComingSoon name="Friend requests" />,
                },
                {
                    label: t('Follow'),
                    icon: <i className="fa-solid fa-person-walking-arrow-right"></i>,
                    path: '/friends/follow',
                    element: <ComingSoon name="Followings / Followers" />,
                },
            ],
        },
        {
            label: t('Groups'),
            icon: <i className="fa-solid fa-users-line"></i>,
            path: '/groups',
            element: <ComingSoon name="Groups" />,
        },
        {
            label: t('Pages'),
            icon: <i className="fa-solid fa-flag"></i>,
            path: '/pages',
            element: <ComingSoon name="Pages" />,
        },
    ];

    const antdMenuItems = convertMenuItemToAntd(menuItems);
    const routes = convertMenuItemToRoute(menuItems);

    return (
        <Layout style={{ minHeight: '100vh' }}>
            {!hydrated && <LoadingFullScreen />}
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
                    {!profile ? (
                        <LoadingFullScreen onlyFillContainer />
                    ) : (
                        <React.Suspense fallback={<LoadingFullScreen onlyFillContainer />}>
                            <Routes>
                                {routes.map(route => {
                                    return (
                                        <Route
                                            key={route.path}
                                            path={route.path}
                                            element={route.element}
                                        />
                                    );
                                })}
                            </Routes>
                        </React.Suspense>
                    )}
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
