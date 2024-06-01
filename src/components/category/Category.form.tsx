import { postCategory, updateCategory, useGetCategory } from '@/services';
import { useNavigate, useParams } from 'react-router-dom';
import FormCategory from './Category.form.page';
import { CategoryInterface } from '@/shared';
import { useMutation } from '@tanstack/react-query';
import { notificationError, notificationSuccess } from '../notification';
import { Col, Row } from 'antd';

export const CategoryForm = () => {
    const { id } = useParams();
    let categoryId = parseInt(id, 10);

    let { data } = useGetCategory(categoryId);
    const navigate = useNavigate();
    const mutationCreateCategory = useMutation({
        mutationFn: (category: CategoryInterface) => postCategory(category),
        onSuccess: () => {
            notificationSuccess('Create category successfully');
            navigate('/category');
        },
        onError: error => {
            notificationError(error.message);
            navigate('/category');
        },
    });

    const mutationUpdateCategory = useMutation({
        mutationFn: (category: CategoryInterface) => updateCategory(category),
        onSuccess: () => {
            notificationSuccess('Update category successfully');
            navigate('/category');
        },
        onError: error => {
            notificationError(error.message);
            navigate('/category');
        },
    });

    const handleCreateCategory = (category: CategoryInterface) => {
        mutationCreateCategory.mutate(category);
    };

    const handleUpdateCategory = (category: CategoryInterface) => {
        mutationUpdateCategory.mutate(category);
    };
    if (categoryId === 0) data = null;
    return (
        <>
            <Row>
                <Col span={12}>
                    <FormCategory
                        categoryId={categoryId}
                        data={data}
                        handleCreateCategory={handleCreateCategory}
                        handleUpdateCategory={handleUpdateCategory}
                    />
                </Col>
                <Col span={12}></Col>
            </Row>
        </>
    );
};
