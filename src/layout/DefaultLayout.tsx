import { BreadCrumbCustom } from '@/components';
import type { MenuProps } from 'antd';
import { Layout, Menu, theme } from 'antd';
import { Link, Outlet } from 'react-router-dom';
const { Header, Content, Footer } = Layout;
const items: MenuProps['items'] = [
    {
        label: 'Product',
        key: 'product',
    },
    {
        label: 'Category',
        key: 'Category',
    },
    {
        label: 'User',
        key: 'User',
    },
];

export const DefaultLayout = () => {
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();
    return (
        <Layout>
            <Header>
                <div className="demo-logo" />
                <Menu
                    theme="dark"
                    mode="horizontal"
                    defaultSelectedKeys={['product']}
                    items={items.map((item: any) => ({
                        key: item.key,
                        label: <Link to={`/${item.key.toLowerCase()}`}>{item.label}</Link>,
                    }))}
                    style={{ flex: 1, minWidth: 0 }}
                />
            </Header>
            <Content className='px-12 mt-5' >
                <BreadCrumbCustom />
                <Layout
                    style={{ background: colorBgContainer, borderRadius: borderRadiusLG }}
                >
                    <Outlet />
                </Layout>
            </Content>
            <Footer className='text-center'>
                Ant Design ©{new Date().getFullYear()} Created by Ant UED
            </Footer>
        </Layout>
    )
}
