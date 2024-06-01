import { Row, Col } from 'antd';
import { useParams } from 'react-router-dom';
import { ProductForm } from './Product.form';
import { useGetBrands, useGetCategories } from '@/services';

export const ProductFormPage = () => {
    const { id } = useParams();
    // @ts-ignore
    const productId = parseInt(id, 10);
    const { data: categories } = useGetCategories();
    const { data: brands } = useGetBrands();
    return (
        <Row>
            <Col span={12}>
                {categories && brands && <ProductForm id={productId} categories={categories} brands={brands} />}
            </Col>
            <Col span={12}></Col>
        </Row>
    );
};
