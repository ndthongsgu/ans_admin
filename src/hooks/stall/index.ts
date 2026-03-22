import type { PaginationDto } from "@/dto/base.dto";

import type {
  StallCreateDto,
  StallDto,
  StallFilter,
  StallPageRequest,
  StallUpdateDto,
} from "@/dto/stall.dto";
import type { PaginationResponse, SuccessResponse } from "@/dto/pagination.dto";
import { useRouter } from "@/routes/hooks";
import { API_ENDPOINTS } from "@/services";
import rootApiService from "@/services/api.service";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "../layout/useToast";

export const usePaginationStall = (params: PaginationDto<StallFilter>) => {
  const requestParams: StallPageRequest = {
    page: Math.floor(params.skip / params.take),
    size: params.take,
    sortBy: "createdDate",
    sortDirection: "DESC",
    ...params.where,
  };

  const { data, isLoading, refetch, error } = useQuery({
    queryKey: [API_ENDPOINTS.STALL.PAGINATION, params],
    queryFn: () =>
      rootApiService.post<PaginationResponse<StallDto>>(
        API_ENDPOINTS.STALL.PAGINATION,
        requestParams
      ),
  });

  return {
    data: data?.data?.content || [],
    total: data?.data?.totalElements || 0,
    isLoading,
    refetch,
    error,
  };
};

export const useAllStalls = () => {
  const { data, isLoading, refetch } = useQuery({
    queryKey: [API_ENDPOINTS.STALL.GET_ALL],
    queryFn: () => rootApiService.get<SuccessResponse>(API_ENDPOINTS.STALL.GET_ALL),
  });

  return {
    data: data?.data || [],
    isLoading,
    refetch,
  };
};

export const useSelectStalls = () => {
  const { data, isLoading, refetch } = useQuery({
    queryKey: [API_ENDPOINTS.STALL.SELECT],
    queryFn: () => rootApiService.get<SuccessResponse>(API_ENDPOINTS.STALL.SELECT),
  });

  return {
    data: data?.data || [],
    isLoading,
    refetch,
  };
};

export const useDetailStall = (id: string) => {
  const url = API_ENDPOINTS.STALL.FIND_BY_ID(id);
  const { data, isLoading, refetch, error } = useQuery({
    queryKey: [url],
    queryFn: () => rootApiService.get<SuccessResponse>(url),
    enabled: !!id,
  });

  const result = data?.data
    ? {
        ...data.data,
        cover_image: data.data?.cover_image
          ? import.meta.env.VITE_BE_API + data.data.cover_image
          : "",
      }
    : undefined;

  console.log("Stall details:", result); // Debug log for stall details

  return {
    data: result,
    isLoading,
    refetch,
    error,
  };
};

export const useCreateStall = () => {
  const queryClient = useQueryClient();
  const showToast = useToast();
  const router = useRouter();
  const { mutateAsync: onCreateStall, isPending: isLoading } = useMutation({
    mutationFn: (body: StallCreateDto) =>
      rootApiService.post<SuccessResponse>(API_ENDPOINTS.STALL.CREATE, body),
    onSuccess: (res: SuccessResponse) => {
      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.STALL.PAGINATION],
      });
      showToast({
        type: "success",
        message: res.message || "Tạo quán ăn thành công!",
        title: "Thành công",
      });
      router.back();
    },
    onError: (error: any) => {
      showToast({
        type: "error",
        message: error?.message || "Tạo quán ăn thất bại!",
        title: "Thất bại",
      });
    },
  });

  return { onCreateStall, isLoading };
};

export const useUpdateStall = (id: string) => {
  const queryClient = useQueryClient();
  const url = API_ENDPOINTS.STALL.UPDATE(id);
  const router = useRouter();
  const showToast = useToast();
  const { mutateAsync: onUpdateStall, isPending: isLoading } = useMutation({
    mutationFn: (body: StallUpdateDto) => rootApiService.put<SuccessResponse>(url, body),
    onSuccess: (res: SuccessResponse) => {
      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.STALL.PAGINATION],
      });
      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.STALL.FIND_BY_ID(id)],
      });
      showToast({
        type: "success",
        message: res.message || "Cập nhật quán ăn thành công!",
        title: "Thành công",
      });
      router.back();
    },
    onError: (error: any) => {
      showToast({
        type: "error",
        message: error?.message || "Cập nhật quán ăn thất bại!",
        title: "Thất bại",
      });
    },
  });

  return { onUpdateStall, isLoading };
};

export const useDeActivateStall = () => {
  const queryClient = useQueryClient();
  const showToast = useToast();

  const { mutateAsync: onDeActivateStall, isPending: isLoading } = useMutation({
    mutationFn: (id: string) =>
      rootApiService.post<PaginationResponse<StallDto>>(API_ENDPOINTS.STALL.DEACTIVATE(id)),
    onSuccess: (res) => {
      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.STALL.PAGINATION],
      });
      showToast({
        type: "success",
        title: "Thành công",
        message: res.message || "Ngưng hoạt động quán ăn thành công!",
      });
    },
    onError: (error: any) => {
      showToast({
        type: "error",
        title: "Lỗi",
        message: error?.message || "Ngưng hoạt động quán ăn thất bại!",
      });
    },
  });

  return { onDeActivateStall, isLoading };
};

export const useActivateStall = () => {
  const queryClient = useQueryClient();
  const showToast = useToast();

  const { mutateAsync: onActivateStall, isPending: isLoading } = useMutation({
    mutationFn: (id: string) =>
      rootApiService.post<PaginationResponse<StallDto>>(API_ENDPOINTS.STALL.ACTIVATE(id)),
    onSuccess: (res) => {
      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.STALL.PAGINATION],
      });
      showToast({
        type: "success",
        title: "Thành công",
        message: res.message || "Kích hoạt quán ăn thành công!",
      });
    },
    onError: (error: any) => {
      showToast({
        type: "error",
        title: "Lỗi",
        message: error?.message || "Kích hoạt quán ăn thất bại!",
      });
    },
  });

  return { onActivateStall, isLoading };
};
