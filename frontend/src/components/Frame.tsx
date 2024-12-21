import {Link, Outlet, useLocation} from "react-router-dom";
import React from "react";
import {routes} from "../routes/routes";
import {Button, Layout, Menu, MenuProps, theme, Tooltip} from "antd";
import {LogoutOutlined} from "@ant-design/icons";
import { ProtectedRoute } from "./ProtectedRoute";
import { UserInfo } from "../api/ApiTypes";

const {Header, Content, Footer} = Layout;

type MenuItem = Required<MenuProps>['items'][number];

export const Frame: React.FC = () => {
    const location = useLocation();
    const userInfo: UserInfo = JSON.parse(localStorage.getItem('user') || '{}');

    const {
        token: {colorBgContainer, borderRadiusLG, colorBgBase},
    } = theme.useToken();

    const items: MenuItem[] = [
        {
            key: 'home',
            label: <Link to={routes.home.link}>Home</Link>,
        },
        {
            key: 'test',
            label: <Link to={routes.test.link}>Test Page</Link>,
        },
    ];
    if (userInfo && userInfo.roles && userInfo.roles.indexOf('admin') !== -1) {
        items.push({
            key: 'admin',
            label: <Link to={routes.admin.link}>Admin</Link>,
        })
    }

    const logout = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        window.location.reload();
    };

    let selectedKey = Object.values(routes).filter(e => e.link === location.pathname)[0]?.pattern || 'home';
    if (selectedKey === '/') {
        selectedKey = 'home';
    }

    return (
        <ProtectedRoute>
            <Layout>
                <Header style={{display: 'flex', alignItems: 'center'}}>
                    <div className="demo-logo"/>
                    <Menu
                        theme="dark"
                        mode="horizontal"
                        defaultSelectedKeys={[selectedKey]}
                        items={items}
                        style={{flex: 1, minWidth: 0}}
                    />
                    <div className="user-info">
                        <Tooltip title="Profile">
                            <Link to={routes.profile.link} style={{ color: colorBgBase }}>
                                {userInfo.username}
                            </Link>
                        </Tooltip>
                        <Tooltip title="Logout">
                            <Button type="link" icon={<LogoutOutlined/>} onClick={logout} />
                        </Tooltip>
                    </div>
                </Header>
                <Content style={{padding: '0 48px'}}>
                    <div
                        style={{
                            background: colorBgContainer,
                            minHeight: 280,
                            minWidth: 300,
                            padding: 24,
                            marginTop: 48,
                            borderRadius: borderRadiusLG,
                        }}
                    >
                        <Outlet/>
                    </div>
                </Content>
                <Footer style={{textAlign: 'center'}}>
                    Ant Design ©{new Date().getFullYear()} Created by Ant UED
                </Footer>
            </Layout>
        </ProtectedRoute>
    )
}