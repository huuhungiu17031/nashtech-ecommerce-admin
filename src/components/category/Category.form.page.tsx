import { Form, Input, Button, Select } from 'antd';
import { useFormik } from 'formik';
import { useEffect } from 'react';
import * as Yup from 'yup';
import { CategoryInterface } from '@/shared';
const { Option } = Select;

const validationSchema = Yup.object({
    categoryName: Yup.string().required('Category name is required'),
    categoryDescription: Yup.string()
        .required('Description is required')
        .min(5, 'Description must be at least 10 characters'),
    icon: Yup.string().required('Icon is required'),
});
const initialValues = {
    categoryName: '',
    icon: '',
    categoryDescription: '',
    isPublished: true,
};

const FormCategory = ({
    categoryId,
    data,
    handleCreateCategory,
    handleUpdateCategory,
}: {
    categoryId: number;
    data: CategoryInterface;
    handleCreateCategory: (formValue: CategoryInterface) => void;
    handleUpdateCategory: (formValue: CategoryInterface) => void;
}) => {
    useEffect(() => {
        if (data) {
            const { categoryName, categoryDescription, icon, isPublished } = data;
            formik.setFieldValue('categoryName', categoryName);
            formik.setFieldValue('categoryDescription', categoryDescription);
            formik.setFieldValue('icon', icon);
            formik.setFieldValue('isPublished', isPublished);
        }
        return () => {
            formik.resetForm();
            formik.setValues(initialValues); // This ensures the values are cleared when the component unmounts
        };
    }, [data]);

    const formik = useFormik({
        initialValues,
        validationSchema,
        onSubmit: values => {
            if (categoryId === 0) {
                handleCreateCategory({ ...values, id: 0 });
            } else {
                handleUpdateCategory({ ...values, id: categoryId });
            }
            console.log(values);
        },
    });

    return (
        <>
            <Form
                onFinish={formik.handleSubmit}
                labelWrap
                labelCol={{ flex: '10rem' }}
                wrapperCol={{ flex: 1 }}
                colon={false}>
                <Form.Item
                    label="Category Name"
                    validateStatus={formik.errors.categoryName && formik.touched.categoryName ? 'error' : ''}
                    help={
                        formik.errors.categoryName && formik.touched.categoryName ? formik.errors.categoryName : null
                    }>
                    <Input
                        name="categoryName"
                        value={formik.values.categoryName}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                </Form.Item>
                <Form.Item
                    label="Description"
                    validateStatus={
                        formik.errors.categoryDescription && formik.touched.categoryDescription ? 'error' : ''
                    }
                    help={
                        formik.errors.categoryDescription && formik.touched.categoryDescription
                            ? formik.errors.categoryDescription
                            : null
                    }>
                    <Input
                        name="categoryDescription"
                        value={formik.values.categoryDescription}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                </Form.Item>
                <Form.Item
                    label="Icon URL"
                    validateStatus={formik.errors.icon && formik.touched.icon ? 'error' : ''}
                    help={formik.errors.icon && formik.touched.icon ? formik.errors.icon : null}>
                    <Input
                        name="icon"
                        value={formik.values.icon}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                </Form.Item>
                <Form.Item
                    label="Active Status"
                    validateStatus={formik.errors.isPublished && formik.touched.isPublished ? 'error' : ''}
                    help={formik.errors.isPublished && formik.touched.isPublished ? formik.errors.isPublished : null}>
                    <Select
                        value={formik.values.isPublished}
                        onChange={value => formik.setFieldValue('isPublished', value)}
                        onBlur={formik.handleBlur}>
                        <Option value={true}>true</Option>
                        <Option value={false}>false</Option>
                    </Select>
                </Form.Item>
                <Form.Item label=" ">
                    <Button
                        type="primary"
                        htmlType="submit"
                        disabled={!formik.isValid || !formik.dirty}
                        loading={formik.isSubmitting}>
                        {categoryId === 0 ? 'Create Category' : 'Update Category'}
                    </Button>
                </Form.Item>
            </Form>
        </>
    );
};

export default FormCategory;
