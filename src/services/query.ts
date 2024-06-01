import { QUERY_KEY } from '@/shared';
import { useQuery } from '@tanstack/react-query';
import { getBrands, getCategories, getCategoriesBackOffice, getCategory, getProduct } from './api';

export function useGetCategoriesBackOffice() {
    return useQuery({
        queryKey: [QUERY_KEY.categoriesBackoffice],
        queryFn: getCategoriesBackOffice,
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

export function useGetProduct(
    field: string,
    dir: string,
    brandId: string,
    page: string,
    size: string,
) {
    const formatPage = parseInt(page, 10) >= 1 ? (parseInt(page, 10) - 1).toString() : '0';
    console.log(size);
    return useQuery({
        queryKey: [QUERY_KEY.product, { field, dir, brandId, formatPage, size }],
        queryFn: () => getProduct(field, dir, brandId, formatPage, size),
    });
}

export function useGetBrands() {
    return useQuery({
        queryKey: [QUERY_KEY.brand],
        queryFn: getBrands,
    });
}
