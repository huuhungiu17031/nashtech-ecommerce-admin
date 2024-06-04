import { Avatar, Dropdown } from 'antd';
import { ItemType } from 'antd/es/menu/interface';

export const DropdownCustom = ({ items }: { items: ItemType[] }) => {
    return (
        <Dropdown menu={{ items }} placement="bottom" arrow>
            <Avatar style={{ backgroundColor: '#fde3cf', color: '#f56a00' }}>U</Avatar>
        </Dropdown>
    );
};
