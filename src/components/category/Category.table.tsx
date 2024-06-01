import { updateCategory, useGetCategoriesBackOffice } from '@/services';
import { AUDIT_PROPERTIES, CategoryInterface, CategoryTableInterface, QUERY_KEY } from '@/shared';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Button, Space, Statistic, Table, TableProps, Tag, Col, Row } from 'antd';
import { useNavigate } from 'react-router-dom';
import { notificationError, notificationSuccess } from '../notification';
import { renderTooltipWithTag } from '@/utils';

export const CategoryTable = () => {
    const { data: dataSource, isLoading } = useGetCategoriesBackOffice();
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    const handleChangeCategory = (id: number) => navigate(`/category/form/${id}`);

    const handleUpdateCategory = useMutation({
        mutationFn: (category: CategoryInterface) => updateCategory(category),
        onSuccess: () => {
            notificationSuccess('Update category successfully');
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEY.categoriesBackoffice],
            });
        },
        onError: error => {
            notificationError(error.message);
            navigate('/category');
        },
    });

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
            render: time => time && renderTooltipWithTag('Created Date', new Date(time).toLocaleString(), '#87d068'),
        },
        {
            title: 'Created By',
            dataIndex: AUDIT_PROPERTIES.CREATED_BY,
            render: email => email && renderTooltipWithTag('Created By', email),
        },
        {
            title: 'Last Modified Date',
            dataIndex: AUDIT_PROPERTIES.UPDATED_AT,
            render: time => time && renderTooltipWithTag('Last Modified Date', new Date(time).toLocaleString()),
        },
        {
            title: 'Last Modified By',
            dataIndex: AUDIT_PROPERTIES.UPDATED_BY,
            render: email => email && renderTooltipWithTag('Last Modified By', email),
        },
        {
            title: 'Status',
            dataIndex: 'isPublished',
            render: isPublished => {
                let color = isPublished ? 'geekblue' : 'green';
                return <Tag color={color}>{isPublished.toString().toUpperCase()}</Tag>;
            },
        },
        {
            title: 'Action',
            render: (_, record) => (
                <Space size="middle">
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
                    <Button onClick={() => navigate(`/category/form/${record.id}`)}>Edit</Button>
                </Space>
            ),
        },
    ];
    return (
        <div>
            {dataSource && dataSource.length > 0 && (
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
                                value={dataSource.filter((item: CategoryInterface) => item.isPublished).length}
                            />
                        </Col>
                        <Col span={8}>
                            <Statistic
                                title="Active Categories"
                                value={dataSource.filter((item: CategoryInterface) => !item.isPublished).length}
                            />
                        </Col>
                    </Row>

                    <Table columns={columns} dataSource={dataSource} rowKey={record => record.id} loading={isLoading} />
                </>
            )}
        </div>
    );
};
