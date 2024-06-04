import { formatPage } from './../utils/formatPage';
import { QUERY_KEY } from '@/shared';
import { useQuery } from '@tanstack/react-query';
import {
    getBrands,
    getCategories,
    getCategoriesBackOffice,
    getCategory,
    getProducts,
    getUsers,
    getProduct,
    getProductGalleryByProductId,
} from './api';

export function useGetCategoriesBackOffice(page: string) {
    const p = formatPage(page);
    return useQuery({
        queryKey: [QUERY_KEY.categoriesBackoffice, { p }],
        queryFn: () => getCategoriesBackOffice(p),
    });
}
export function useGetCategories() {
    return useQuery({
        queryKey: [QUERY_KEY.category],
        queryFn: getCategories,
    });
}

export function useGetCategory(id: number) {
    return useQuery({
        queryKey: [QUERY_KEY.category, { id }],
        queryFn: () => getCategory(id),
        enabled: !!id && id !== 0,
    });
}

export function useGetProducts(field: string, dir: string, brandId: string, page: string, size: string) {
    const p = formatPage(page);
    return useQuery({
        queryKey: [QUERY_KEY.product, { field, dir, brandId, p, size }],
        queryFn: () => getProducts(field, dir, brandId, p, size),
    });
}
export function useGetProduct(id: number) {
    return useQuery({
        queryKey: [QUERY_KEY.product, { id }],
        queryFn: () => getProduct(id),
        enabled: !!id && id !== 0,
    });
}
export function useGetBrands() {
    return useQuery({
        queryKey: [QUERY_KEY.brand],
        queryFn: getBrands,
    });
}

export function useGetUsers(page: string) {
    const p = formatPage(page);
    return useQuery({
        queryKey: [QUERY_KEY.user, { p }],
        queryFn: () => getUsers(p),
    });
}

export function useGetProductGalleryByProductId(productId: number) {
    return useQuery({
        queryKey: [QUERY_KEY.productGallery, productId],
        queryFn: () => getProductGalleryByProductId(productId),
        enabled: !!productId && productId !== 0,
    });
}
