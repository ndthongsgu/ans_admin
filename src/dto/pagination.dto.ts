export interface PaginationDto<T> {
  skip: number;
  take: number;
  where: T;
}

/**
 * Pagination data structure - the inner data from API response
 * This is what comes inside the "data" field of the API response
 */
export interface PaginationData<T> {
  content: T[];
  totalElements: number;
}

/**
 * Full API response for pagination requests
 * This is what the API endpoint returns
 */
export interface PaginationResponse<T> {
  success: boolean;
  message: string;
  data: PaginationData<T>;
  error: null | string;
  statusCode: number;
}

export interface PaginationParams {
  skip: number;
  take: number;
  [key: string]: any;
}

/**
 * Full API response for non-pagination requests
 */
export interface SuccessResponse {
  success: boolean;
  message?: string;
  data?: any;
  error: null | string;
  statusCode?: number;
}

export interface ErrorResponse {
  message: string;
  statusCode?: number;
}
