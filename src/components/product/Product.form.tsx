import {
    Upload,
    UploadFile,
    Image,
    message,
    UploadProps,
    GetProp,
    Form,
    Input,
    InputNumber,
    Button,
    Select,
} from 'antd';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { storage } from '@/configuration';
import { useEffect, useState } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { CategoryInterface } from '@/shared';
import { BrandInterface } from '@/shared/brand.interface';
import { useMutation } from '@tanstack/react-query';
import { CreateProductInterface, UpdateProductInterface } from '@/shared/product.interface';
import { postProduct, updateProduct } from '@/services';
import { notificationError, notificationSuccess } from '../notification';
import { useNavigate } from 'react-router-dom';

type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

const getBase64 = (file: FileType): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = error => reject(error);
    });
};

const uploadButton = (
    <button style={{ border: 0, background: 'none' }} type="button">
        <PlusOutlined />
        <div style={{ marginTop: 8 }}>Upload</div>
    </button>
);
const validationSchema = Yup.object().shape({
    productName: Yup.string().required('Product Name is required'),
    price: Yup.number().required('Price is required').min(50000, 'Stock Quantity must be at least 50000'),
    stockQuantity: Yup.number()
        .required('Stock Quantity is required')
        .min(50, 'Stock Quantity must be at least 50')
        .integer('Stock Quantity must be an integer'),
    description: Yup.string().required('Description is required'),
    categoryId: Yup.number().required('Category ID is required').integer('Category ID must be an integer'),
    brandId: Yup.number().required('Brand ID is required').integer('Brand ID must be an integer'),
});
const initialValues = {
    productName: '',
    price: 0,
    stockQuantity: 0,
    isFeatured: false,
    description: '',
    categoryId: 0,
    brandId: 0,
    productImageUrls: [],
};

export const ProductForm = ({
    productId,
    categories,
    brands,
    product,
    productImages,
}: {
    productId: number;
    categories: CategoryInterface[];
    brands: BrandInterface[];
    product: UpdateProductInterface;
    productImages: any;
}) => {
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [fileList, setFileList] = useState<UploadFile[]>([]);
    const navigate = useNavigate();
    useEffect(() => {
        if (productImages && productImages.length > 0) {
            const listImage = productImages.map((item: any) => {
                const prefix = item.imagePath.split('/')[1];
                const targetString = prefix.split('_');
                return {
                    uid: targetString[0],
                    lastModified: targetString[1],
                    url: item.url,
                };
            });
            setFileList([...listImage]);
        }
    }, [productImages]);
    const handlePreview = async (file: UploadFile) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj as FileType);
        }

        setPreviewImage(file.url || (file.preview as string));
        setPreviewOpen(true);
    };

    const handleChange: UploadProps['onChange'] = ({ fileList: newFileList }) => {
        // console.log(fileList);
        setFileList(newFileList);
    };

    const customRequest = ({ file, onSuccess, onError, onProgress }: any) => {
        const storageRef = ref(storage, formatImageString(file.uid, file.lastModified?.toString()));
        const uploadTask = uploadBytesResumable(storageRef, file);

        uploadTask.on(
            'state_changed',
            snapshot => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                onProgress({ percent: progress });
            },
            error => {
                onError(error);
                message.error('Upload failed');
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then(downloadURL => {
                    onSuccess(null, file);
                    setFileList(prevList =>
                        prevList.map(item => (item.uid === file.uid ? { ...item, url: downloadURL } : item)),
                    );
                    message.success('Upload successfully');
                });
            },
        );
    };
    useEffect(() => {
        if (product) {
            const { productName, stockQuantity, price, isFeatured, description, brandId, categoryId } = product;

            formik.setFieldValue('productName', productName);
            formik.setFieldValue('price', price);
            formik.setFieldValue('stockQuantity', stockQuantity);
            formik.setFieldValue('description', description);
            formik.setFieldValue('brandId', brandId);
            formik.setFieldValue('categoryId', categoryId);
            formik.setFieldValue('isFeatured', isFeatured);
        }
        return () => {
            formik.resetForm();
            formik.setValues(initialValues); // This ensures the values are cleared when the component unmounts
        };
    }, [product]);

    const beforeUpload = (file: FileType) => {
        const isImage = file.type.startsWith('image/');
        if (!isImage) {
            message.error('You can only upload image files!');
        }

        const isLt5M = file.size / 1024 / 1024 < 5;
        if (!isLt5M) {
            message.error('Image must be smaller than 5MB!');
        }

        return isImage && isLt5M;
    };

    const handleRemove = async (file: UploadFile) => {
        try {
            // const id = formatImageString(file.uid, file.lastModified?.toString());
            setFileList(prevList => prevList.filter(item => item.uid !== file.uid));
            message.success('Image removed successfully');
        } catch (error) {
            message.error('Failed to remove image');
        }
    };

    const mutationCreateProduct = useMutation({
        mutationFn: (data: CreateProductInterface) => postProduct(data),
        onSuccess: () => {
            notificationSuccess('Create product successfully');
            navigate('/product');
        },
        onError: error => {
            notificationError(error.message);
        },
    });

    const mutationEditProduct = useMutation({
        mutationFn: (data: UpdateProductInterface) => updateProduct(data),
        onSuccess: message => {
            notificationSuccess(message);
            navigate('/product');
        },
    });

    const formatImageString = (uid: string, lastModified: string | undefined) => {
        return `images/${uid + '_' + lastModified}`;
    };

    const formik = useFormik({
        initialValues,
        validationSchema,
        onSubmit: values => {
            if (productId === 0) {
                const productImageUrls = fileList.map(file =>
                    formatImageString(file.uid, file.lastModified?.toString()),
                );
                const payload = {
                    ...values,
                    productImageUrls,
                };
                mutationCreateProduct.mutate(payload);
            } else {
                const productImageUrls = fileList.map(file =>
                    formatImageString(file.uid, file.lastModified?.toString()),
                );
                const payload = {
                    ...values,
                    productImageUrls,
                    id: productId,
                };
                mutationEditProduct.mutate(payload);
            }
        },
    });

    return (
        <Form
            onFinish={formik.handleSubmit}
            labelWrap
            labelCol={{ flex: '11rem' }}
            wrapperCol={{ flex: 1 }}
            colon={false}>
            <Form.Item label="Images" valuePropName="fileList">
                <Upload
                    customRequest={customRequest}
                    listType="picture-card"
                    fileList={fileList}
                    multiple
                    onRemove={handleRemove}
                    beforeUpload={beforeUpload}
                    onPreview={handlePreview}
                    onChange={handleChange}>
                    {fileList.length >= 8 ? null : uploadButton}
                </Upload>
                {previewImage && (
                    <Image
                        wrapperStyle={{ display: 'none' }}
                        preview={{
                            visible: previewOpen,
                            onVisibleChange: visible => setPreviewOpen(visible),
                            afterOpenChange: visible => !visible && setPreviewImage(''),
                        }}
                        src={previewImage}
                    />
                )}
            </Form.Item>
            <Form.Item
                label="Category Name"
                validateStatus={formik.errors.productName && formik.touched.productName ? 'error' : ''}
                help={formik.errors.productName && formik.touched.productName ? formik.errors.productName : null}>
                <Input
                    name="productName"
                    value={formik.values.productName}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                />
            </Form.Item>
            <Form.Item
                label="Price"
                validateStatus={formik.errors.price && formik.touched.price ? 'error' : ''}
                help={formik.errors.price && formik.touched.price ? formik.errors.price : null}>
                <InputNumber
                    value={formik.values.price}
                    className="w-full"
                    onChange={value => formik.setFieldValue('price', value)}
                    onBlur={() => formik.setFieldTouched('price', true)}
                />
            </Form.Item>
            <Form.Item
                label="Stock Quantity"
                validateStatus={formik.errors.stockQuantity && formik.touched.stockQuantity ? 'error' : ''}
                help={formik.errors.stockQuantity && formik.touched.stockQuantity ? formik.errors.stockQuantity : null}>
                <InputNumber
                    value={formik.values.stockQuantity}
                    className="w-full"
                    onChange={value => formik.setFieldValue('stockQuantity', value)}
                    onBlur={() => formik.setFieldTouched('stockQuantity', true)}
                />
            </Form.Item>
            <Form.Item
                label="Is Feature ?"
                validateStatus={formik.errors.isFeatured && formik.touched.isFeatured ? 'error' : ''}
                help={formik.errors.isFeatured && formik.touched.isFeatured ? formik.errors.isFeatured : null}>
                <Select
                    value={formik.values.isFeatured}
                    onChange={value => formik.setFieldValue('isFeatured', value)}
                    onBlur={() => formik.setFieldTouched('isFeatured', true)}>
                    <Select.Option value={true}>TRUE</Select.Option>
                    <Select.Option value={false}>FALSE</Select.Option>
                </Select>
            </Form.Item>
            <Form.Item
                label="Description"
                validateStatus={formik.errors.description && formik.touched.description ? 'error' : ''}
                help={formik.errors.description && formik.touched.description ? formik.errors.description : null}>
                <Input.TextArea
                    name="description"
                    value={formik.values.description}
                    onChange={formik.handleChange}
                    onBlur={() => formik.setFieldTouched('description', true)}
                />
            </Form.Item>
            <Form.Item
                label="Category"
                rules={[{ required: true, message: 'Please select the category!' }]}
                validateStatus={formik.errors.categoryId && formik.touched.categoryId ? 'error' : ''}
                help={formik.errors.categoryId && formik.touched.categoryId ? formik.errors.categoryId : null}>
                <Select
                    placeholder="Select category"
                    value={formik.values.categoryId}
                    onChange={value => formik.setFieldValue('categoryId', value)}
                    onBlur={() => formik.setFieldTouched('categoryId', true)}>
                    {categories.map(category => (
                        <Select.Option key={category.id} value={category.id}>
                            {category.categoryName}
                        </Select.Option>
                    ))}
                </Select>
            </Form.Item>
            <Form.Item
                label="Brand"
                validateStatus={formik.errors.brandId && formik.touched.brandId ? 'error' : ''}
                help={formik.errors.brandId && formik.touched.brandId ? formik.errors.brandId : null}>
                <Select
                    placeholder="Select brand"
                    value={formik.values.brandId}
                    onChange={value => formik.setFieldValue('brandId', value)}
                    onBlur={() => formik.setFieldTouched('brandId', true)}>
                    {brands.map(brand => (
                        <Select.Option key={brand.id} value={brand.id}>
                            {brand.name}
                        </Select.Option>
                    ))}
                </Select>
            </Form.Item>

            <Form.Item label=" ">
                <Button type="primary" htmlType="submit" disabled={!formik.isValid || !formik.dirty}>
                    {productId === 0 ? 'Create' : 'Update'}
                </Button>
            </Form.Item>
        </Form>
    );
};
