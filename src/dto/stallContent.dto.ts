import type { BaseDto } from "./base.dto";

export interface StallContentDto extends BaseDto {
  stall_id: string;
  language_code?: string;
  title: string;
  description?: string;
  short_description?: string;
  audio_url: string;
  audio_duration?: number;
  audio_file_size?: number;
  tts_script?: string;
  is_deleted: boolean;
  created_at: number;
  updated_at?: number;
  stall?: any; // Assuming StallDto
}

export interface StallContentCreateDto {
  stall_id: string;
  language_code?: string;
  title: string;
  description?: string;
  short_description?: string;
  audio_url: string;
  audio_duration?: number;
  audio_file_size?: number;
  tts_script?: string;
  version?: number;
  is_deleted?: boolean;
}

export interface StallContentUpdateDto {
  stall_id: string;
  language_code?: string;
  title: string;
  description?: string;
  short_description?: string;
  audio_url: string;
  audio_duration?: number;
  audio_file_size?: number;
  tts_script?: string;
  version?: number;
  is_deleted?: boolean;
}

export interface StallContentFilter {
  title?: string;
  stall_id?: string;
  language_code?: string;
  is_deleted?: boolean;
}

export interface StallContentPageRequest extends StallContentFilter {
  page: number;
  size: number;
  sortBy?: string;
  sortDirection?: string;
}

export interface StallContentSelectOption {
  id: string;
  title: string;
  stall_id: string;
}
