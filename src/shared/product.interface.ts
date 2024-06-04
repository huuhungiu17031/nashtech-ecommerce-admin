import { AuditInterface } from '.';

export interface ProductInterFace {
    id: number;
    productName: string;
    price: number;
    type: string;
    stockQuantity: number;
    description: string;
    available: boolean;
    isFeatured: boolean;
}
export interface ProductFormInteraface {
    handleSubmit: (value: any) => void;
}
export interface ProductTableInterface extends ProductInterFace, AuditInterface {}

export interface UpdateProductInterface extends CreateProductInterface {
    id: number;
}

export interface CreateProductInterface {
    productName: string;
    price: number;
    stockQuantity: number;
    isFeatured: boolean;
    productImageUrls: string[];
    description: string;
    categoryId: number;
    brandId: number;
}

export interface ProductGallery {
    id: number;
    imagePath: string;
    thumbnail: boolean;
}
