import type { BaseDto } from "./base.dto";

export interface OwnerDto extends BaseDto {
  user_id: string;
  full_name: string;
  phone?: string;
  subscription_package_id?: string;
  subscription_expires_at?: number;
  business_name?: string;
  business_address?: string;
  user?: any; // Assuming UserDto
  subscription_package?: any; // Assuming SubscriptionPackageDto
}

export interface OwnerCreateDto {
  user_id: string;
  full_name: string;
  phone?: string;
  subscription_package_id?: string;
  subscription_expires_at?: number;
  business_name?: string;
  business_address?: string;
}

export interface OwnerUpdateDto {
  user_id: string;
  full_name: string;
  phone?: string;
  subscription_package_id?: string;
  subscription_expires_at?: number;
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