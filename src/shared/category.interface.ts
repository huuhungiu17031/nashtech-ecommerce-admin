import { AuditInterface } from '.';

export interface CategoryInterface {
    id: number;
    categoryName: string;
    categoryDescription: string;
    icon: string;
    isPublished: boolean;
}

export interface CategoryTableInterface extends CategoryInterface, AuditInterface {}

export interface CategoryFormProps {
    categoryId?: number;
    initialValues?: {
        categoryName?: string;
        description?: string;
        icon?: string;
    };
    onSubmit: (values: { categoryName: string; categoryDescription: string; icon: string }) => void;
}
