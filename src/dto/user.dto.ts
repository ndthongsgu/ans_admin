import type { BaseDto } from "./base.dto";

export interface UserDto extends BaseDto {
  username: string;
  email: string;
  isActive: boolean;
}

export interface UserCreateDto {
  username: string;
  email: string;
  password?: string; // Required for Create
  isActive?: boolean;
}

export interface UserUpdateDto {
  email?: string;
  password?: string; // Optional
  isActive?: boolean;
}

export interface UserFilter {
  username?: string;
  email?: string;
  isActive?: boolean;
}

export interface UserPageRequest extends UserFilter {
  page: number;
  size: number;
  sortBy?: string;
  sortDirection?: string;
}
