import { ProductOutlined, AreaChartOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Menu } from 'antd';
import { useState } from 'react';
import { Link } from 'react-router-dom';

type MenuItem = Required<MenuProps>['items'][number];

const items: MenuItem[] = [
    {
        label: 'List Product',
        key: 'list',
        icon: <ProductOutlined />,
    },
    {
        label: 'Chart',
        key: 'chart',
        icon: <AreaChartOutlined />,
    },
];
export const Product = () => {
    const [current, setCurrent] = useState('list');

    const onClick: MenuProps['onClick'] = (e) => {
        setCurrent(e.key);
    };

    return <Menu
        mode="inline"
        defaultSelectedKeys={[current]}
        defaultOpenKeys={['list']}
        onClick={onClick}
        className='h-full'
        items={items.map((item: any) => ({
            key: item.key,
            label: <Link to={`${item.key.toLowerCase()}`}>{item.label}</Link>,
            icon: item.icon
        }))}
    />
}
