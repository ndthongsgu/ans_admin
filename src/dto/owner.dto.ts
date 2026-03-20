import type { BaseDto } from "./base.dto";

export interface OwnerDto extends BaseDto {
  name: string;
  email: string;
  phone?: string;
  business_name?: string;
  business_address?: string;
  is_deleted: boolean;
  roles?: string[];
  created_at?: number;
}

export interface OwnerCreateDto {
  full_name: string;
  email: string;
  phone?: string;
  password: string;
  subscription_package_id?: string;
  business_name?: string;
  business_address?: string;
}

export interface OwnerUpdateDto {
  full_name: string;
  email: string;
  phone?: string;
  subscription_package_id?: string;
  business_name?: string;
  business_address?: string;
}

export interface OwnerFilter {
  full_name?: string;
  phone?: string;
  business_name?: string;
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
  full_name: string;
  phone?: string;
  user_id: string;
}
