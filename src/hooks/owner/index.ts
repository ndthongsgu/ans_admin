import type { PaginationDto } from "@/dto/base.dto";

import type {
  OwnerCreateDto,
  OwnerDto,
  OwnerFilter,
  OwnerPageRequest,
  OwnerSelectOption,
  OwnerUpdateDto,
} from "@/dto/owner.dto";
import type { PaginationResponse, SuccessResponse } from "@/dto/pagination.dto";
import { useRouter } from "@/routes/hooks";
import { API_ENDPOINTS } from "@/services";
import rootApiService from "@/services/api.service";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "../layout/useToast";

export const usePaginationOwner = (
  params: PaginationDto<OwnerFilter>
) => {
  const requestParams: OwnerPageRequest = {
    page: Math.floor(params.skip / params.take),
    size: params.take,
    sortBy: "createdDate",
    sortDirection: "DESC",
    ...params.where,
  };

  const { data, isLoading, refetch, error } = useQuery({
    queryKey: [API_ENDPOINTS.OWNER.PAGINATION, params],
    queryFn: () =>
      rootApiService.post<PaginationResponse<OwnerDto>>(
        API_ENDPOINTS.OWNER.PAGINATION,
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

export const useAllOwners = () => {
  const { data, isLoading, refetch } = useQuery({
    queryKey: [API_ENDPOINTS.OWNER.GET_ALL],
    queryFn: () =>
      rootApiService.get<OwnerDto[]>(API_ENDPOINTS.OWNER.GET_ALL),
  });

  return {
    data: data || [],
    isLoading,
    refetch,
  };
};

export const useSelectOwners = () => {
  const { data, isLoading, refetch } = useQuery({
    queryKey: [API_ENDPOINTS.OWNER.SELECT],
    queryFn: () =>
      rootApiService.get<OwnerSelectOption[]>(API_ENDPOINTS.OWNER.SELECT),
  });

  return {
    data: data || [],
    isLoading,
    refetch,
  };
};

export const useDetailOwner = (id: string) => {
  const url = API_ENDPOINTS.OWNER.FIND_BY_ID(id);
  const { data, isLoading, refetch, error } = useQuery({
    queryKey: [url],
    queryFn: () => rootApiService.get<OwnerDto>(url),
    enabled: !!id,
  });

  return {
    data: data,
    isLoading,
    refetch,
    error,
  };
};

export const useCreateOwner = () => {
  const queryClient = useQueryClient();
  const showToast = useToast();
  const router = useRouter();
  const { mutateAsync: onCreateOwner, isPending: isLoading } = useMutation({
    mutationFn: (body: OwnerCreateDto) =>
      rootApiService.post<SuccessResponse>(API_ENDPOINTS.OWNER.CREATE, body),
    onSuccess: (res: SuccessResponse) => {
      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.OWNER.PAGINATION],
      });
      showToast({
        type: "success",
        message: res.message || "Tạo chủ quán thành công!",
        title: "Thành công",
      });
      router.back();
    },
    onError: (error: any) => {
      showToast({
        type: "error",
        message: error?.message || "Tạo chủ quán thất bại!",
        title: "Thất bại",
      });
    },
  });

  return { onCreateOwner, isLoading };
};

export const useUpdateOwner = (id: string) => {
  const queryClient = useQueryClient();
  const url = API_ENDPOINTS.OWNER.UPDATE(id);
  const router = useRouter();
  const showToast = useToast();
  const { mutateAsync: onUpdateOwner, isPending: isLoading } = useMutation({
    mutationFn: (body: OwnerUpdateDto) =>
      rootApiService.put<SuccessResponse>(url, body),
    onSuccess: (res: SuccessResponse) => {
      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.OWNER.PAGINATION],
      });
      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.OWNER.FIND_BY_ID(id)],
      });
      showToast({
        type: "success",
        message: res.message || "Cập nhật chủ quán thành công!",
        title: "Thành công",
      });
      router.back();
    },
    onError: (error: any) => {
      showToast({
        type: "error",
        message: error?.message || "Cập nhật chủ quán thất bại!",
        title: "Thất bại",
      });
    },
  });

  return { onUpdateOwner, isLoading };
};

export const useDeActivateOwner = () => {
  const queryClient = useQueryClient();
  const showToast = useToast();

  const { mutateAsync: onDeActivateOwner, isPending: isLoading } =
    useMutation({
      mutationFn: (id: string) =>
        rootApiService.post<PaginationResponse<OwnerDto>>(
          API_ENDPOINTS.OWNER.DEACTIVATE(id)
        ),
      onSuccess: (res) => {
        queryClient.invalidateQueries({
          queryKey: [API_ENDPOINTS.OWNER.PAGINATION],
        });
        showToast({
          type: "success",
          title: "Thành công",
          message: res.message || "Ngưng hoạt động chủ quán thành công!",
        });
      },
      onError: (error: any) => {
        showToast({
          type: "error",
          title: "Lỗi",
          message: error?.message || "Ngưng hoạt động chủ quán thất bại!",
        });
      },
    });

  return { onDeActivateOwner, isLoading };
};

export const useActivateOwner = () => {
  const queryClient = useQueryClient();
  const showToast = useToast();

  const { mutateAsync: onActivateOwner, isPending: isLoading } = useMutation(
    {
      mutationFn: (id: string) =>
        rootApiService.post<PaginationResponse<OwnerDto>>(
          API_ENDPOINTS.OWNER.ACTIVATE(id)
        ),
      onSuccess: (res) => {
        queryClient.invalidateQueries({
          queryKey: [API_ENDPOINTS.OWNER.PAGINATION],
        });
        showToast({
          type: "success",
          title: "Thành công",
          message: res.message || "Kích hoạt chủ quán thành công!",
        });
      },
      onError: (error: any) => {
        showToast({
          type: "error",
          title: "Lỗi",
          message: error?.message || "Kích hoạt chủ quán thất bại!",
        });
      },
    }
  );

  return { onActivateOwner, isLoading };
};