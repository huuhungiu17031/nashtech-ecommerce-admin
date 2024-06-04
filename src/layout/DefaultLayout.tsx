import { useState } from 'react';
import type { MenuProps } from 'antd';
import { Button, Layout, Menu, theme } from 'antd';
import { Link, Outlet } from 'react-router-dom';
import { OrderedListOutlined, ProductOutlined, UserOutlined } from '@ant-design/icons';
import { BreadCrumbCustom, DropdownCustom } from '@/components';
import { ItemType } from 'antd/es/menu/interface';
import useSignOut from 'react-auth-kit/hooks/useSignOut';
import { autoFetch } from '@/shared';

const { Header, Content, Footer, Sider } = Layout;

type MenuItem = Required<MenuProps>['items'][number];

function getItem(label: React.ReactNode, key: React.Key, icon?: React.ReactNode, children?: MenuItem[]): MenuItem {
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

const items: MenuItem[] = [
    getItem('Category', 'category', <OrderedListOutlined />, [getItem('Create category', 'category/form/0')]),
    getItem('Product', 'product', <ProductOutlined />),
    getItem('User Management', 'user', <UserOutlined />),
];

const DefaultLayout = () => {
    const [collapsed, setCollapsed] = useState(false);
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();
    const signOut = useSignOut();
    const handleLogout = async () => {
        try {
            await autoFetch.post('user/logout');
            signOut();
            window.location.reload();
        } catch (error) {
            console.log('ERROR LOGOUT');
        }
    };
    const dropdownItems: ItemType[] = [
        {
            key: '1',
            label: <Button onClick={handleLogout}>Logout</Button>,
        },
    ];
    return (
        <Layout className="overflow-hidden h-screen">
            <Header className="sticky top-0 left-0 z-20">
                <DropdownCustom items={dropdownItems}></DropdownCustom>
            </Header>
            <Layout>
                <Sider width={'15%'} collapsible collapsed={collapsed} onCollapse={value => setCollapsed(value)}>
                    <div className="demo-logo-vertical" />
                    <Menu theme="dark" defaultSelectedKeys={['category']} mode="inline" items={items} />
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
                    <Footer style={{ textAlign: 'center' }}>©{new Date().getFullYear()} Created by Hung Nguyen</Footer>
                </Layout>
            </Layout>
        </Layout>
    );
};

export default DefaultLayout;
