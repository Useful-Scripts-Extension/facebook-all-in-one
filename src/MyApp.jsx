import { useEffect, useState } from 'react';
import { App, Layout, Menu, Space } from 'antd';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { LanguagePicker, LoadingFullScreen, ProfileHeader, ThemeSwitcher } from './components';
import logo from './assets/logo.png';

import useStore, { selectors } from './store';
import { AllMessages, FirstMessages } from './screens/Messages';
import { connectExtension } from './utils/extesion';
import { getUserInfoFromUid } from './utils/facebook';
import Friends from './screens/Friends';

const { Header, Sider, Content, Footer } = Layout;

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

function PlaceHolder({ name }) {
    return <div>{name}</div>;
}

export default function MyApp() {
    const { message } = App.useApp();
    const { t } = useTranslation();
    const location = useLocation();
    const hydrated = useStore(selectors.hydrated);

    const [collapsed, setCollapsed] = useState(false);

    const profile = useStore(selectors.profile);
    const setProfile = useStore(selectors.setProfile);

    useEffect(() => {
        console.log('init');
        connectExtension()
            .then(data => {
                console.log(data);
                getUserInfoFromUid(data.uid).then(info => {
                    setProfile(info);
                });
            })
            .catch(e => {
                message.error(e.message);
            });
    }, [setProfile, message]);

    const menuItems = [
        {
            label: t('Dashboard'),
            icon: <i className="fa-solid fa-house"></i>,
            path: '/',
            element: <PlaceHolder name="Dashboard" />,
        },
        {
            label: t('Messages'),
            icon: <i className="fa-brands fa-facebook-messenger"></i>,
            // path: "/messages",
            // element: <Messages />,
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
            path: '/friends',
            element: <Friends />,
        },
        {
            label: t('Groups'),
            icon: <i className="fa-solid fa-users-line"></i>,
            path: '/groups',
            element: <PlaceHolder name="Groups" />,
        },
        {
            label: t('Pages'),
            icon: <i className="fa-solid fa-flag"></i>,
            path: '/pages',
            element: <PlaceHolder name="Pages" />,
        },
    ];

    const antdMenuItems = convertMenuItemToAntd(menuItems);
    const routes = convertMenuItemToRoute(menuItems);

    const handleMenuClick = () => {
        setCollapsed(!collapsed);
    };

    return (
        <Layout style={{ minHeight: '100vh' }}>
            {!hydrated && <LoadingFullScreen />}
            <Sider collapsible collapsed={collapsed} onCollapse={handleMenuClick} width={250}>
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

                <Content style={{ padding: '10px', position: 'relative' }}>
                    {!profile ? (
                        <LoadingFullScreen onlyFillContainer />
                    ) : (
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
                    )}
                </Content>

                <Footer style={{ textAlign: 'center' }}>
                    Useful Script - Facebook All In One @2024
                </Footer>
            </Layout>
        </Layout>
    );
}
