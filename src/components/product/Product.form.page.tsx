import { Row, Col } from 'antd';
import { useParams } from 'react-router-dom';
import { ProductForm } from './Product.form';
import { useGetBrands, useGetCategories, useGetProduct, useGetProductGalleryByProductId } from '@/services';
import { ProductDetailPage } from './ProductDetail.page';

export const ProductFormPage = () => {
    const { id } = useParams();
    // @ts-ignore
    const productId = parseInt(id, 10);
    const { data: categories } = useGetCategories();
    const { data: brands } = useGetBrands();
    const { data: product } = useGetProduct(productId);
    const { data: productImages } = useGetProductGalleryByProductId(productId);

    return (
        <Row>
            <Col span={12}>
                {categories && brands && (
                    <ProductForm
                        productId={productId}
                        categories={categories}
                        brands={brands}
                        product={product}
                        productImages={productImages}
                    />
                )}
            </Col>
            <Col span={12}>{productId !== 0 && <ProductDetailPage />}</Col>
        </Row>
    );
};
