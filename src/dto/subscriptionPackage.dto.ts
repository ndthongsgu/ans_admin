import type { BaseDto } from "./base.dto";

export interface SubscriptionPackageDto extends BaseDto {
  name: string;
  description?: string;
  price: number;
  duration: number;
  max_stalls: number;
  max_audio_storage?: number;
  features?: string;
  is_deleted: boolean;
}

export interface SubscriptionPackageCreateDto {
  name: string;
  description?: string;
  price: number;
  duration: number;
  max_stalls: number;
  max_audio_storage?: number;
  features?: string;
  is_deleted?: boolean;
}

export interface SubscriptionPackageUpdateDto {
  name: string;
  description?: string;
  price: number;
  duration: number;
  max_stalls: number;
  max_audio_storage?: number;
  features?: string;
  is_deleted?: boolean;
}

export interface SubscriptionPackageFilter {
  name?: string;
  is_deleted?: boolean;
}

export interface SubscriptionPackagePageRequest extends SubscriptionPackageFilter {
  page: number;
  size: number;
  sortBy?: string;
  sortDirection?: string;
}

export interface SubscriptionPackageSelectOption {
  id: string;
  name: string;
  price: number;
}