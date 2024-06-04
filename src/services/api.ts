import { UpdateProductInterface } from './../shared/product.interface';
import { UserInterface } from './../shared/user.interface';
import { storage } from '@/configuration';
import { CategoryInterface, autoFetch } from '@/shared';
import { CreateProductInterface, ProductGallery } from '@/shared/product.interface';
import { getDownloadURL, ref } from 'firebase/storage';

export const getCategoriesBackOffice = async (page: string) => {
    return (
        await autoFetch.get('category/backoffice', {
            params: {
                page,
            },
        })
    ).data;
};

export const getCategory = async (id: number) => {
    return (await autoFetch.get(`category/${id}`)).data;
};

export const getCategories = async () => {
    return (await autoFetch.get('category')).data;
};

export const postCategory = async (data: CategoryInterface) => {
    const listCategory = [data];
    return (await autoFetch.post(`category`, listCategory)).data;
};

export const updateCategory = async (data: CategoryInterface) => {
    return (await autoFetch.put(`category`, data)).data;
};

export const getProducts = async (field: string, dir: string, brandId: string, page: string, size: string) => {
    const response = (
        await autoFetch.get('product/backoffice', {
            params: {
                field,
                dir,
                brandId,
                page,
                size,
            },
        })
    ).data;

    const content = await Promise.all(
        { ...response }.content.map(async (item: any) => {
            const thumbnail = await getImageFromFireBase(item.thumbnail);
            return { ...item, thumbnail };
        }),
    );
    return { ...response, content };
};

export const getProduct = async (productId: number) => {
    return (await autoFetch.get(`product/backoffice/product-detail/${productId}`)).data;
};

export const postProduct = async (data: CreateProductInterface) => {
    return (await autoFetch.post('product', data)).data;
};

export const updateProduct = async (data: UpdateProductInterface) => {
    return (await autoFetch.put('product', data)).data;
};

export const getBrands = async () => {
    return (await autoFetch.get('brand')).data;
};

export const postBrand = async (data: any) => {
    const listBrands = [data];
    return await autoFetch.post('brand', listBrands);
};

export const getUsers = async (page: string) => {
    return (
        await autoFetch.get('user', {
            params: {
                page,
            },
        })
    ).data;
};

export const login = async ({ email, password }: { email: string; password: string }) => {
    const response = await autoFetch.post(`user/login/backoffice`, { email, password });
    return response.data;
};

export const getImageFromFireBase = async (path: string) => {
    try {
        const imageUrl = await getDownloadURL(ref(storage, path));
        return imageUrl;
    } catch (error) {
        return null;
    }
};

export const updateUser = async (user: UserInterface) => {
    return (await autoFetch.put('user', user)).data;
};

export const getProductGalleryByProductId = async (id: number) => {
    const response = await autoFetch.get(`product-gallery/${id}`);
    const data = await Promise.all(
        response.data.map(async (image: ProductGallery) => {
            const url = await getImageFromFireBase(image.imagePath);
            return {
                ...image,
                imagePath: image.imagePath,
                url: url,
            };
        }),
    );
    return data;
};

export const deleteProductGallery = async (id: string) => {
    return (await autoFetch.delete(`product-gallery/${id}`)).data;
};
