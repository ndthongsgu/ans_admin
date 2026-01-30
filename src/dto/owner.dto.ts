import type { BaseDto } from "./base.dto";

export interface OwnerDto extends BaseDto {
    userId: string;
    fullName: string;
    phone?: string;
    subscriptionPackageId?: string;
    subscriptionPackageName?: string;
    user?: {
        username: string;
        email: string;
        isActive: boolean;
    };
}

export interface OwnerCreateDto {
    userId: string;
    fullName: string;
    phone?: string;
    subscriptionPackageId?: string;
}

export interface OwnerUpdateDto {
    fullName: string;
    phone?: string;
    subscriptionPackageId?: string;
}

export interface OwnerFilter {
    fullName?: string;
    phone?: string;
    subscriptionPackageId?: string;
    isDeleted?: boolean;
}

export interface OwnerPageRequest extends OwnerFilter {
    page: number;
    size: number;
    sortBy?: string;
    sortDirection?: string;
}

export interface OwnerSelectOption {
    id: string;
    fullName: string;
    phone: string;
    userId: string;
}
