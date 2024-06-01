import { useState } from 'react';
import type { MenuProps } from 'antd';
import { Avatar, Button, Dropdown, Layout, Menu, Space, theme } from 'antd';
import { Link, Outlet } from 'react-router-dom';
import {
    OrderedListOutlined,
    ProductOutlined,
    UserOutlined,
    LogoutOutlined,
} from '@ant-design/icons';
import { BreadCrumbCustom } from '@/components';

const { Header, Content, Footer, Sider } = Layout;

type MenuItem = Required<MenuProps>['items'][number];

function getItem(
    label: React.ReactNode,
    key: React.Key,
    icon?: React.ReactNode,
    children?: MenuItem[],
): MenuItem {
    return {
        key,
        icon,
        children,
        label: (
            <Link className="w-full text-base font-bold ml-2" to={`${key}`}>
                {label}
            </Link>
        ),
    } as MenuItem;
}
function getItemDropdown(
    label: React.ReactNode,
    key: React.Key,
    icon?: React.ReactNode,
    func?: () => void,
    children?: MenuItem[],
): MenuItem {
    return {
        key,
        icon,
        children,
        label: (
            <Button onClick={() => func} className="w-full text-base font-bold ml-2" key={key}>
                {label}
            </Button>
        ),
    } as MenuItem;
}

const handleLogout = () => {
    console.log('LOGOUT');
};

const items: MenuItem[] = [
    getItem('Category', 'category', <OrderedListOutlined />, [
        getItem('Create category', 'category/form/0'),
    ]),
    getItem('Product', 'product', <ProductOutlined />),
    getItem('User Management', 'user', <UserOutlined />),
];

const itemss: MenuItem[] = [getItem('User Management', 'user', <UserOutlined />)];

const DefaultLayout = () => {
    const [collapsed, setCollapsed] = useState(false);
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();

    return (
        <Layout className="overflow-hidden h-screen">
            <Header className="sticky top-0 left-0 z-20"></Header>
            <Layout>
                <Sider
                    width={'15%'}
                    collapsible
                    collapsed={collapsed}
                    onCollapse={value => setCollapsed(value)}>
                    <div className="demo-logo-vertical" />
                    <Menu
                        theme="dark"
                        defaultSelectedKeys={['category']}
                        mode="inline"
                        items={items}
                    />
                </Sider>
                <Layout>
                    <Content className="overflow-y-scroll my-0 mx-4">
                        <BreadCrumbCustom />
                        <div
                            style={{
                                padding: 24,
                                minHeight: 360,
                                background: colorBgContainer,
                                borderRadius: borderRadiusLG,
                            }}>
                            <Outlet />
                        </div>
                    </Content>
                    <Footer style={{ textAlign: 'center' }}>
                        Ant Design ©{new Date().getFullYear()} Created by Ant UED
                    </Footer>
                </Layout>
            </Layout>
        </Layout>
    );
};

export default DefaultLayout;
