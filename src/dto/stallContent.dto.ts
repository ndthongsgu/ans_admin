import type { BaseDto } from "./base.dto";

export interface StallContentTranslationDto {
  id?: string;
  stall_content_id?: string;
  language_code: string;
  audio_url: string; // Per-language audio URL
  tts_script?: string; // Per-language TTS script
  created_at?: number;
  updated_at?: number;
}

export interface StallContentDto extends BaseDto {
  stall_id: string;
  language_code?: string;
  audio_url?: string; // From vi translation
  audio_duration?: number;
  audio_file_size?: number;
  tts_script?: string; // From vi translation
  is_deleted: boolean;
  created_at: number;
  updated_at?: number;
  stall?: any; // Assuming StallDto
  translations?: StallContentTranslationDto[]; // All language translations
  vi_trans?: StallContentTranslationDto; // Vietnamese translation
}

export interface StallContentCreateDto {
  stall_id: string;
  language_code?: string;
  audio_url?: string; // Optional if tts_script is provided
  audio_duration?: number;
  audio_file_size?: number;
  tts_script?: string; // Optional TTS script for auto audio generation
  version?: number;
  is_deleted?: boolean;
}

export interface StallContentUpdateDto {
  stall_id: string;
  language_code?: string;
  audio_url?: string; // Optional if tts_script is provided
  audio_duration?: number;
  audio_file_size?: number;
  tts_script?: string; // Optional TTS script for auto audio generation
  version?: number;
  is_deleted?: boolean;
}

export interface StallContentFilter {
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
