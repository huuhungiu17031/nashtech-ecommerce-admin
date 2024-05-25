import { OrderedListOutlined, ShopOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Menu } from 'antd';
import { useState } from 'react';
import { Link } from 'react-router-dom';

type MenuItem = Required<MenuProps>['items'][number];

const items: MenuItem[] = [
    {
        label: 'List Category',
        key: 'list',
        icon: <OrderedListOutlined />,
    },
    {
        label: 'Brand',
        key: 'brand',
        icon: <ShopOutlined />,
    },

];
export const Category = () => {
    const [current, setCurrent] = useState('list');

    const onClick: MenuProps['onClick'] = (e) => {
        setCurrent(e.key);
    };    return <Menu
        mode="inline"
        defaultSelectedKeys={[current]}
        className='h-full'
        onClick={onClick}
        items={items.map((item: any) => ({
            key: item.key,
            label: <Link to={`${item.key.toLowerCase()}`}>{item.label}</Link>,
            icon: item.icon
        }))}
    />
}
