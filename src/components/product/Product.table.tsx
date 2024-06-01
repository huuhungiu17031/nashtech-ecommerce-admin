import { useGetProduct } from '@/services';
import { ProductTableInterface } from '@/shared/product.interface';
import { renderTooltipWithTag } from '@/utils';
import { Button, Space, Table } from 'antd';
import type { PaginationProps, TableProps } from 'antd';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Pagination } from 'antd';

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
        },
        {
            title: 'Price',
            dataIndex: 'stockQuantity',
        },
        {
            title: 'Is Featured',
            dataIndex: 'isFeatured',
            render: isFeatured => renderTooltipWithTag('Price', isFeatured ? 'No' : 'Yes'),
        },
        {
            title: 'Price',
            dataIndex: 'price',
            render: price => renderTooltipWithTag('Price', price, '#87d068'),
        },
        {
            title: 'Action',
            render: (_, record) => (
                <Space size="middle">
                    <Button onClick={() => handleChangeProduct(record.id)}>Edit</Button>
                </Space>
            ),
        },
    ];
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams(searchParamsInit);
    const params = Object.fromEntries(searchParams.entries());
    const { field, dir, page, size, brandId } = params;
    const { isLoading, data: dataSource } = useGetProduct(
        field,
        dir || '',
        brandId || '',
        page || '0',
        size || '10',
    );

    const handleChangeProduct = (id: number) => navigate(`/product/form/${id}`);

    const onChange: PaginationProps['onChange'] = pageNumber => {
        setSearchParams({ ...params, page: pageNumber.toString() });
    };

    return (
        dataSource &&
        dataSource.content.length > 0 && (
            <>
                <Button className="mb-2" onClick={() => handleChangeProduct(0)}>
                    Create Product
                </Button>

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
        )
    );
};
