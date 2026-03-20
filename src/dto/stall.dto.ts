import type { BaseDto } from "./base.dto";

export interface StallDto extends BaseDto {
  owner_id: string;
  name: string;
  latitude: number;
  longitude: number;
  radius?: number;
  cover_image?: string;
  category?: string;
  price_range?: string;
  opening_hours?: string;
  contact_phone?: string;
  website?: string;
  average_rating?: number;
  total_reviews?: number;
  created_at: number;
  updated_at?: number;
  is_deleted: boolean;
  owner?: {
    id: string;
    full_name: string;
  };
}

export interface StallCreateDto {
  owner_id: string;
  name: string;
  latitude: number;
  longitude: number;
  radius?: number;
  cover_image?: string;
  status?: boolean;
  category?: string;
  price_range?: string;
  opening_hours?: string;
  contact_phone?: string;
  website?: string;
}

export interface StallUpdateDto {
  owner_id?: string;
  name: string;
  latitude: number;
  longitude: number;
  radius?: number;
  cover_image?: string;
  status?: boolean;
  category?: string;
  price_range?: string;
  opening_hours?: string;
  contact_phone?: string;
  website?: string;
}

export interface StallFilter {
  name?: string;
  category?: string;
  owner_id?: string;
  status?: boolean;
  is_deleted?: boolean;
}

export interface StallPageRequest extends StallFilter {
  page: number;
  size: number;
  sortBy?: string;
  sortDirection?: string;
}

export interface StallSelectOption {
  id: string;
  name: string;
  owner_id: string;
}
