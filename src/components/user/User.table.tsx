import { updateUser, useGetUsers } from '@/services';
import { Button, Pagination, PaginationProps, Space, Table, TableProps, Tag } from 'antd';
import { CircularLoading, notificationError, notificationSuccess } from '..';
import { QUERY_KEY, UserInterface, UserTableInterface } from '@/shared';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import { AxiosError } from 'axios';

export const UserTable = () => {
    const columns: TableProps<UserTableInterface>['columns'] = [
        {
            title: 'Id',
            dataIndex: 'id',
            sorter: (a, b) => b.id - a.id,
        },
        {
            title: 'Email',
            dataIndex: 'email',
        },
        {
            title: 'Role',
            dataIndex: 'roles',
            render: (roles: string[]) => roles.map((role, index) => <Tag key={index}>{role}</Tag>),
        },
        {
            title: 'Action',
            render: (_, record) => {
                return (
                    !record.action && (
                        <Space size="middle">
                            <Button onClick={() => handleBlockUser(record)}>
                                {record.isBlock ? 'UnBlock' : 'Block'}
                            </Button>
                        </Space>
                    )
                );
            },
        },
    ];
    const queryClient = useQueryClient();
    const handleUpdateUser = useMutation({
        mutationFn: (user: UserInterface) => updateUser(user),
        onSuccess: (response: any) => {
            notificationSuccess(response);
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEY.user],
            });
        },
        onError: (error: AxiosError) => {
            // @ts-ignore
            notificationError(error.response?.data.detail);
        },
    });

    const handleBlockUser = (user: UserInterface) => {
        handleUpdateUser.mutate({ ...user, action: !user.isBlock });
    };

    const rowClassName = (record: UserTableInterface) => {
        return record.action ? 'bg-gray-100 text-gray-400 pointer-events-none' : '';
    };
    const searchParamsInit = {
        page: '0',
        size: '10',
    };
    const [searchParams, setSearchParams] = useSearchParams(searchParamsInit);
    const params = Object.fromEntries(searchParams.entries());

    const onChange: PaginationProps['onChange'] = pageNumber => {
        setSearchParams({ ...params, page: pageNumber.toString() });
    };
    const { page } = params;

    const { data: dataSource, isLoading } = useGetUsers(page);
    if (isLoading) return <CircularLoading />;
    if (dataSource.content && dataSource.content.length >= 0) {
        return (
            <>
                <Table
                    columns={columns}
                    rowKey={record => record.id}
                    loading={isLoading}
                    rowClassName={rowClassName}
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
        );
    }
};
