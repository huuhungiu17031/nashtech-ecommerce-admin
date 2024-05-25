import { Layout, theme } from 'antd';
import { Outlet } from 'react-router-dom';
const { Content, Sider } = Layout;

export const DashboardLayout = ({ children }: any) => {
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();
    return <Layout
        className='py-6 h-[45rem]'
        style={{ background: colorBgContainer, borderRadius: borderRadiusLG }}
    >
        <Sider style={{ background: colorBgContainer }} width={250}>
            {children}
        </Sider>
        <Content className='px-6'>
            <Outlet />
        </Content>
    </Layout>
}
