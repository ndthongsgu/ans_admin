import type { BaseDto } from "./base.dto";

export interface SubscriptionPackageDto extends BaseDto {
  name: string;
  code: string;
  price: number;
  max_stalls: number;
  description?: string;
  created_at: number;
  updated_at?: number;
  is_deleted: boolean;
}

export interface SubscriptionPackageCreateDto {
  name: string;
  code: string;
  price: number;
  max_stalls: number;
  description?: string;
}

export interface SubscriptionPackageUpdateDto {
  name?: string;
  code?: string;
  price?: number;
  max_stalls?: number;
  description?: string;
}

export interface SubscriptionPackageFilter {
  name?: string;
  code?: string;
  is_deleted?: boolean;
}

export interface SubscriptionPackagePageRequest extends SubscriptionPackageFilter {
  page: number;
  size: number;
  sortBy?: string;
  sortDirection?: string;
}
