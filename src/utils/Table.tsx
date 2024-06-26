import { Tag, Tooltip } from 'antd';
export const renderTooltipWithTag = (title: string, value: string | number, color: string = 'magenta') => {
    return (
        <Tooltip title={title}>
            <Tag color={color} className="font-bold">
                {value}
            </Tag>
        </Tooltip>
    );
};
