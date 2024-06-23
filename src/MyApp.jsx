import { useEffect } from 'react';
import { App, Layout, Menu, Space } from 'antd';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { LanguagePicker, LoadingFullScreen, ProfileHeader, ThemeSwitcher } from './components';
import useStore, { selectors } from './store';
import logo from './assets/logo.png';
import { connectExtension } from './utils/extesion';
import { getUserInfoFromUid } from './utils/facebook';
import { AllMessages, FirstMessages } from './screens/Messages';
import { AllFriends } from './screens/Friends';

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
            icon: <i className="fa-brands fa-facebook-messenger fa-lg"></i>,
            children: [
                {
                    label: t('All messages'),
                    icon: <i className="fa-solid fa-comments fa-lg"></i>,
                    path: '/messages/all',
                    element: <AllMessages />,
                },
                {
                    label: t('First messages'),
                    icon: <i className="fa-solid fa-clock-rotate-left fa-lg"></i>,
                    path: '/messages/first',
                    element: <FirstMessages />,
                },
            ],
        },
        {
            label: t('Friends'),
            icon: <i className="fa-solid fa-user-group fa-lg"></i>,
            children: [
                {
                    label: t('All friends'),
                    icon: <i className="fa-solid fa-users fa-lg"></i>,
                    path: '/friends/all',
                    element: <AllFriends />,
                },
                {
                    label: t('Friend requests'),
                    icon: <i className="fa-solid fa-user-plus fa-lg"></i>,
                    path: '/friends/requests',
                    element: <PlaceHolder name="Friend requests" />,
                },
                {
                    label: t('Follow'),
                    icon: <i className="fa-solid fa-person-walking-arrow-right fa-lg"></i>,
                    path: '/friends/follow',
                    element: <PlaceHolder name="Followings / Followers" />,
                },
            ],
        },
        {
            label: t('Groups'),
            icon: <i className="fa-solid fa-users-line fa-lg"></i>,
            path: '/groups',
            element: <PlaceHolder name="Groups" />,
        },
        {
            label: t('Pages'),
            icon: <i className="fa-solid fa-flag fa-lg"></i>,
            path: '/pages',
            element: <PlaceHolder name="Pages" />,
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
                    Facebook All In One ©{new Date().getFullYear()} - Cretead by{' '}
                    <a href="https://github.com/Useful-Scripts-Extension" target="_blank">
                        Useful-Scripts
                    </a>
                </Footer>
            </Layout>
        </Layout>
    );
}
