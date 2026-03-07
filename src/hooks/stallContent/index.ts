import type { PaginationDto } from "@/dto/base.dto";

import type {
  StallContentCreateDto,
  StallContentDto,
  StallContentFilter,
  StallContentPageRequest,
  StallContentSelectOption,
  StallContentUpdateDto,
} from "@/dto/stallContent.dto";
import type { PaginationResponse, SuccessResponse } from "@/dto/pagination.dto";
import { useRouter } from "@/routes/hooks";
import { API_ENDPOINTS } from "@/services";
import rootApiService from "@/services/api.service";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "../layout/useToast";

export const usePaginationStallContent = (
  params: PaginationDto<StallContentFilter>
) => {
  const requestParams: StallContentPageRequest = {
    page: Math.floor(params.skip / params.take),
    size: params.take,
    sortBy: "createdDate",
    sortDirection: "DESC",
    ...params.where,
  };

  const { data, isLoading, refetch, error } = useQuery({
    queryKey: [API_ENDPOINTS.STALL_CONTENT.PAGINATION, params],
    queryFn: () =>
      rootApiService.post<PaginationResponse<StallContentDto>>(
        API_ENDPOINTS.STALL_CONTENT.PAGINATION,
        requestParams
      ),
  });

  return {
    data: data?.content || [],
    total: data?.totalElements || 0,
    isLoading,
    refetch,
    error,
  };
};

export const useAllStallContents = () => {
  const { data, isLoading, refetch } = useQuery({
    queryKey: [API_ENDPOINTS.STALL_CONTENT.GET_ALL],
    queryFn: () =>
      rootApiService.get<StallContentDto[]>(API_ENDPOINTS.STALL_CONTENT.GET_ALL),
  });

  return {
    data: data || [],
    isLoading,
    refetch,
  };
};

export const useSelectStallContents = () => {
  const { data, isLoading, refetch } = useQuery({
    queryKey: [API_ENDPOINTS.STALL_CONTENT.SELECT],
    queryFn: () =>
      rootApiService.get<StallContentSelectOption[]>(API_ENDPOINTS.STALL_CONTENT.SELECT),
  });

  return {
    data: data || [],
    isLoading,
    refetch,
  };
};

export const useDetailStallContent = (id: string) => {
  const url = API_ENDPOINTS.STALL_CONTENT.FIND_BY_ID(id);
  const { data, isLoading, refetch, error } = useQuery({
    queryKey: [url],
    queryFn: () => rootApiService.get<StallContentDto>(url),
    enabled: !!id,
  });

  return {
    data: data,
    isLoading,
    refetch,
    error,
  };
};

export const useCreateStallContent = () => {
  const queryClient = useQueryClient();
  const showToast = useToast();
  const router = useRouter();
  const { mutateAsync: onCreateStallContent, isPending: isLoading } = useMutation({
    mutationFn: (body: StallContentCreateDto) =>
      rootApiService.post<SuccessResponse>(API_ENDPOINTS.STALL_CONTENT.CREATE, body),
    onSuccess: (res: SuccessResponse) => {
      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.STALL_CONTENT.PAGINATION],
      });
      showToast({
        type: "success",
        message: res.message || "Tạo nội dung thuyết minh thành công!",
        title: "Thành công",
      });
      router.back();
    },
    onError: (error: any) => {
      showToast({
        type: "error",
        message: error?.message || "Tạo nội dung thuyết minh thất bại!",
        title: "Thất bại",
      });
    },
  });

  return { onCreateStallContent, isLoading };
};

export const useUpdateStallContent = (id: string) => {
  const queryClient = useQueryClient();
  const url = API_ENDPOINTS.STALL_CONTENT.UPDATE(id);
  const router = useRouter();
  const showToast = useToast();
  const { mutateAsync: onUpdateStallContent, isPending: isLoading } = useMutation({
    mutationFn: (body: StallContentUpdateDto) =>
      rootApiService.put<SuccessResponse>(url, body),
    onSuccess: (res: SuccessResponse) => {
      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.STALL_CONTENT.PAGINATION],
      });
      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.STALL_CONTENT.FIND_BY_ID(id)],
      });
      showToast({
        type: "success",
        message: res.message || "Cập nhật nội dung thuyết minh thành công!",
        title: "Thành công",
      });
      router.back();
    },
    onError: (error: any) => {
      showToast({
        type: "error",
        message: error?.message || "Cập nhật nội dung thuyết minh thất bại!",
        title: "Thất bại",
      });
    },
  });

  return { onUpdateStallContent, isLoading };
};

export const useDeActivateStallContent = () => {
  const queryClient = useQueryClient();
  const showToast = useToast();

  const { mutateAsync: onDeActivateStallContent, isPending: isLoading } =
    useMutation({
      mutationFn: (id: string) =>
        rootApiService.post<PaginationResponse<StallContentDto>>(
          API_ENDPOINTS.STALL_CONTENT.DEACTIVATE(id)
        ),
      onSuccess: (res) => {
        queryClient.invalidateQueries({
          queryKey: [API_ENDPOINTS.STALL_CONTENT.PAGINATION],
        });
        showToast({
          type: "success",
          title: "Thành công",
          message: res.message || "Ngưng hoạt động nội dung thuyết minh thành công!",
        });
      },
      onError: (error: any) => {
        showToast({
          type: "error",
          title: "Lỗi",
          message: error?.message || "Ngưng hoạt động nội dung thuyết minh thất bại!",
        });
      },
    });

  return { onDeActivateStallContent, isLoading };
};

export const useActivateStallContent = () => {
  const queryClient = useQueryClient();
  const showToast = useToast();

  const { mutateAsync: onActivateStallContent, isPending: isLoading } = useMutation(
    {
      mutationFn: (id: string) =>
        rootApiService.post<PaginationResponse<StallContentDto>>(
          API_ENDPOINTS.STALL_CONTENT.ACTIVATE(id)
        ),
      onSuccess: (res) => {
        queryClient.invalidateQueries({
          queryKey: [API_ENDPOINTS.STALL_CONTENT.PAGINATION],
        });
        showToast({
          type: "success",
          title: "Thành công",
          message: res.message || "Kích hoạt nội dung thuyết minh thành công!",
        });
      },
      onError: (error: any) => {
        showToast({
          type: "error",
          title: "Lỗi",
          message: error?.message || "Kích hoạt nội dung thuyết minh thất bại!",
        });
      },
    }
  );

  return { onActivateStallContent, isLoading };
};