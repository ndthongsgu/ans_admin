import type { BaseDto } from "./base.dto";

export interface EmployeeDto extends BaseDto {
  userId: string;
  fullName: string;
  phone?: string;
  position?: string;
  user?: {
    username: string;
    email: string;
    isActive: boolean;
  };
}

export interface EmployeeCreateDto {
  userId: string;
  fullName: string;
  phone?: string;
  position?: string;
}

export interface EmployeeUpdateDto {
  fullName: string;
  phone?: string;
  position?: string;
}

export interface EmployeeFilter {
  fullName?: string;
  phone?: string;
  position?: string;
  isDeleted?: boolean;
}

export interface EmployeePageRequest extends EmployeeFilter {
  page: number;
  size: number;
  sortBy?: string;
  sortDirection?: string;
}

export interface EmployeeSelectOption {
  id: string;
  fullName: string;
  phone: string;
  position: string;
}
