import { updateCategory, useGetCategoriesBackOffice } from '@/services';
import { AUDIT_PROPERTIES, CategoryInterface, CategoryTableInterface, QUERY_KEY } from '@/shared';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Button, Statistic, Table, TableProps, Col, Row, Pagination, PaginationProps, Tooltip } from 'antd';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { notificationError, notificationSuccess } from '../notification';
import { formatPage, renderTooltipWithTag } from '@/utils';
import { EditOutlined } from '@ant-design/icons';

const searchParamsInit = {
    page: '0',
    // size: '10',
};
export const CategoryTable = () => {
    const [searchParams, setSearchParams] = useSearchParams(searchParamsInit);
    const params = Object.fromEntries(searchParams.entries());
    const handleChangeCategory = (id: number) => navigate(`/category/form/${id}`);
    const { page } = params;
    const { data: dataSource, isLoading } = useGetCategoriesBackOffice(page);
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    const handleUpdateCategory = useMutation({
        mutationFn: (category: CategoryInterface) => updateCategory(category),
        onSuccess: () => {
            notificationSuccess('Update category successfully');
            const p = formatPage(page);
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEY.categoriesBackoffice, { p }],
            });
        },
        onError: error => {
            notificationError(error.message);
            navigate('/category');
        },
    });

    const onChange: PaginationProps['onChange'] = pageNumber => {
        setSearchParams({ ...params, page: pageNumber.toString() });
    };

    const columns: TableProps<CategoryTableInterface>['columns'] = [
        {
            title: 'Id',
            dataIndex: 'id',
            sorter: (a, b) => b.id - a.id,
        },
        {
            title: 'Name',
            dataIndex: 'categoryName',
        },
        {
            title: 'Description',
            dataIndex: 'categoryDescription',
        },
        {
            title: 'Created Date',
            dataIndex: AUDIT_PROPERTIES.CREATED_AT,
            render: time => time && renderTooltipWithTag('Created Date', new Date(time).toLocaleString()),
        },
        {
            title: 'Last Modified Date',
            dataIndex: AUDIT_PROPERTIES.UPDATED_AT,
            render: time => time && renderTooltipWithTag('Last Modified Date', new Date(time).toLocaleString()),
        },
        {
            title: 'Action',
            render: (_, record) => (
                <Row>
                    <Col span={12}>
                        {record.isPublished ? (
                            <Button
                                type="primary"
                                danger
                                onClick={() => {
                                    const { id, categoryDescription, categoryName, icon } = record;
                                    handleUpdateCategory.mutate({
                                        id,
                                        categoryDescription,
                                        categoryName,
                                        isPublished: false,
                                        icon,
                                    });
                                }}>
                                DeList
                            </Button>
                        ) : (
                            <Button
                                type="primary"
                                onClick={() => {
                                    const { id, categoryDescription, categoryName, icon } = record;
                                    handleUpdateCategory.mutate({
                                        id,
                                        categoryDescription,
                                        categoryName,
                                        isPublished: true,
                                        icon,
                                    });
                                }}>
                                Publish
                            </Button>
                        )}
                    </Col>
                    <Col span={12}>
                        <Tooltip title="edit">
                            <Button
                                onClick={() => navigate(`/category/form/${record.id}`)}
                                type="primary"
                                shape="circle"
                                icon={<EditOutlined />}
                            />
                        </Tooltip>
                    </Col>
                </Row>
            ),
        },
    ];
    return (
        <div>
            {dataSource && dataSource.content.length > 0 && (
                <>
                    <Row gutter={16}>
                        <Col span={8}>
                            <Button onClick={() => handleChangeCategory(0)} className="my-5">
                                Create Category
                            </Button>
                        </Col>
                        <Col span={8}>
                            <Statistic
                                title="Active Categories"
                                value={dataSource.content.filter((item: CategoryInterface) => item.isPublished).length}
                            />
                        </Col>
                        <Col span={8}>
                            <Statistic
                                title="None Active Categories"
                                value={dataSource.content.filter((item: CategoryInterface) => !item.isPublished).length}
                            />
                        </Col>
                    </Row>

                    <Table
                        pagination={false}
                        columns={columns}
                        dataSource={dataSource.content}
                        rowKey={record => record.id}
                        loading={isLoading}
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
        </div>
    );
};
