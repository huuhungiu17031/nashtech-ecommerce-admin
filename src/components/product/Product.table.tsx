import { useGetProducts } from '@/services';
import { ProductTableInterface } from '@/shared/product.interface';
import { formatPrice, renderTooltipWithTag } from '@/utils';
import { Button, Space, Table, Image, Tooltip } from 'antd';
import type { PaginationProps, TableProps } from 'antd';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Pagination } from 'antd';
import { CircularLoading } from '../loading';
import { EditOutlined } from '@ant-design/icons';

const searchParamsInit = {
    field: 'price',
    dir: 'desc',
    page: '0',
    size: '10',
};

export const ProductTable = () => {
    const columns: TableProps<ProductTableInterface>['columns'] = [
        {
            title: 'Id',
            dataIndex: 'id',
            sorter: (a, b) => b.id - a.id,
        },
        {
            title: 'Name',
            dataIndex: 'productName',
            render: (name, record) => (
                <a onClick={() => handleChangeProduct(record.id)} className="font-bold">
                    {name}
                </a>
            ),
        },
        {
            title: 'Stock Quantity',
            dataIndex: 'stockQuantity',
        },
        {
            title: 'Is Featured',
            dataIndex: 'isFeatured',
            render: isFeatured => renderTooltipWithTag('Is Featured', isFeatured ? 'YES' : 'NO'),
        },
        {
            title: 'Price',
            dataIndex: 'price',
            render: (price: number) => price && formatPrice({ price }),
        },
        {
            title: 'Thumbnail',
            dataIndex: 'thumbnail',
            render: thumbnail => <Image width={80} src={thumbnail} />,
        },
        {
            title: 'Action',
            render: (_, record) => (
                <Space size="middle">
                    <Tooltip title="edit">
                        <Button
                            onClick={() => handleChangeProduct(record.id)}
                            type="primary"
                            shape="circle"
                            icon={<EditOutlined />}
                        />
                    </Tooltip>
                </Space>
            ),
        },
    ];

    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams(searchParamsInit);
    const params = Object.fromEntries(searchParams.entries());
    const { field, dir, page, size, brandId } = params;
    const { isLoading, data: dataSource } = useGetProducts(field, dir || '', brandId || '', page || '0', size || '10');

    const handleChangeProduct = (id: number) => navigate(`/product/form/${id}`);

    const onChange: PaginationProps['onChange'] = pageNumber => {
        setSearchParams({ ...params, page: pageNumber.toString() });
    };

    if (isLoading) return <CircularLoading />;
    return (
        <>
            <Button className="mb-2" onClick={() => handleChangeProduct(0)}>
                Create Product
            </Button>
            {dataSource && dataSource.content.length >= 0 && (
                <>
                    <Table
                        columns={columns}
                        rowKey={record => record.id}
                        loading={isLoading}
                        pagination={false}
                        dataSource={dataSource.content}
                    />

                    <Pagination
                        className="mt-10 flex justify-end"
                        defaultCurrent={parseInt(page)}
                        total={dataSource.totalElements}
                        onChange={onChange}
                        showTotal={total => `Total ${total} items`}
                    />
                </>
            )}
        </>
    );
};
