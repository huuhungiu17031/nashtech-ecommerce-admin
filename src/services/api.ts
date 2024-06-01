import { CategoryInterface, autoFetch } from '@/shared';
import { CreateProductInterface } from '@/shared/product.interface';

export const getCategoriesBackOffice = async () => {
    return (await autoFetch.get('category/backoffice')).data;
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

export const getProduct = async (field: string, dir: string, brandId: string, page: string, size: string) => {
    return (
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
};

export const postProduct = async (data: CreateProductInterface) => {
    return (await autoFetch.post('product', data)).data;
};

export const getBrands = async () => {
    return (await autoFetch.get('brand')).data;
};

export const login = async ({ email, password }: { email: string; password: string }) => {
    const response = await autoFetch.post(`user/login`, { email, password });
    return response.data;
};
