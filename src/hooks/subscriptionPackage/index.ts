import type { PaginationDto } from "@/dto/base.dto";

import type {
  SubscriptionPackageCreateDto,
  SubscriptionPackageDto,
  SubscriptionPackageFilter,
  SubscriptionPackagePageRequest,
  SubscriptionPackageSelectOption,
  SubscriptionPackageUpdateDto,
} from "@/dto/subscriptionPackage.dto";
import type { PaginationResponse, SuccessResponse } from "@/dto/pagination.dto";
import { useRouter } from "@/routes/hooks";
import { API_ENDPOINTS } from "@/services";
import rootApiService from "@/services/api.service";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "../layout/useToast";

export const usePaginationSubscriptionPackage = (
  params: PaginationDto<SubscriptionPackageFilter>
) => {
  const requestParams: SubscriptionPackagePageRequest = {
    page: Math.floor(params.skip / params.take),
    size: params.take,
    sortBy: "createdDate",
    sortDirection: "DESC",
    ...params.where,
  };

  const { data, isLoading, refetch, error } = useQuery({
    queryKey: [API_ENDPOINTS.SUBSCRIPTION_PACKAGE.PAGINATION, params],
    queryFn: () =>
      rootApiService.post<PaginationResponse<SubscriptionPackageDto>>(
        API_ENDPOINTS.SUBSCRIPTION_PACKAGE.PAGINATION,
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

export const useAllSubscriptionPackages = () => {
  const { data, isLoading, refetch } = useQuery({
    queryKey: [API_ENDPOINTS.SUBSCRIPTION_PACKAGE.GET_ALL],
    queryFn: () =>
      rootApiService.get<SubscriptionPackageDto[]>(API_ENDPOINTS.SUBSCRIPTION_PACKAGE.GET_ALL),
  });

  return {
    data: data || [],
    isLoading,
    refetch,
  };
};

export const useSelectSubscriptionPackages = () => {
  const { data, isLoading, refetch } = useQuery({
    queryKey: [API_ENDPOINTS.SUBSCRIPTION_PACKAGE.SELECT],
    queryFn: () =>
      rootApiService.get<SubscriptionPackageSelectOption[]>(API_ENDPOINTS.SUBSCRIPTION_PACKAGE.SELECT),
  });

  return {
    data: data || [],
    isLoading,
    refetch,
  };
};

export const useDetailSubscriptionPackage = (id: string) => {
  const url = API_ENDPOINTS.SUBSCRIPTION_PACKAGE.FIND_BY_ID(id);
  const { data, isLoading, refetch, error } = useQuery({
    queryKey: [url],
    queryFn: () => rootApiService.get<SubscriptionPackageDto>(url),
    enabled: !!id,
  });

  return {
    data: data,
    isLoading,
    refetch,
    error,
  };
};

export const useCreateSubscriptionPackage = () => {
  const queryClient = useQueryClient();
  const showToast = useToast();
  const router = useRouter();
  const { mutateAsync: onCreateSubscriptionPackage, isPending: isLoading } = useMutation({
    mutationFn: (body: SubscriptionPackageCreateDto) =>
      rootApiService.post<SuccessResponse>(API_ENDPOINTS.SUBSCRIPTION_PACKAGE.CREATE, body),
    onSuccess: (res: SuccessResponse) => {
      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.SUBSCRIPTION_PACKAGE.PAGINATION],
      });
      showToast({
        type: "success",
        message: res.message || "Tạo gói đăng ký thành công!",
        title: "Thành công",
      });
      router.back();
    },
    onError: (error: any) => {
      showToast({
        type: "error",
        message: error?.message || "Tạo gói đăng ký thất bại!",
        title: "Thất bại",
      });
    },
  });

  return { onCreateSubscriptionPackage, isLoading };
};

export const useUpdateSubscriptionPackage = (id: string) => {
  const queryClient = useQueryClient();
  const url = API_ENDPOINTS.SUBSCRIPTION_PACKAGE.UPDATE(id);
  const router = useRouter();
  const showToast = useToast();
  const { mutateAsync: onUpdateSubscriptionPackage, isPending: isLoading } = useMutation({
    mutationFn: (body: SubscriptionPackageUpdateDto) =>
      rootApiService.put<SuccessResponse>(url, body),
    onSuccess: (res: SuccessResponse) => {
      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.SUBSCRIPTION_PACKAGE.PAGINATION],
      });
      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.SUBSCRIPTION_PACKAGE.FIND_BY_ID(id)],
      });
      showToast({
        type: "success",
        message: res.message || "Cập nhật gói đăng ký thành công!",
        title: "Thành công",
      });
      router.back();
    },
    onError: (error: any) => {
      showToast({
        type: "error",
        message: error?.message || "Cập nhật gói đăng ký thất bại!",
        title: "Thất bại",
      });
    },
  });

  return { onUpdateSubscriptionPackage, isLoading };
};

export const useDeActivateSubscriptionPackage = () => {
  const queryClient = useQueryClient();
  const showToast = useToast();

  const { mutateAsync: onDeActivateSubscriptionPackage, isPending: isLoading } =
    useMutation({
      mutationFn: (id: string) =>
        rootApiService.post<PaginationResponse<SubscriptionPackageDto>>(
          API_ENDPOINTS.SUBSCRIPTION_PACKAGE.DEACTIVATE(id)
        ),
      onSuccess: (res) => {
        queryClient.invalidateQueries({
          queryKey: [API_ENDPOINTS.SUBSCRIPTION_PACKAGE.PAGINATION],
        });
        showToast({
          type: "success",
          title: "Thành công",
          message: res.message || "Ngưng hoạt động gói đăng ký thành công!",
        });
      },
      onError: (error: any) => {
        showToast({
          type: "error",
          title: "Lỗi",
          message: error?.message || "Ngưng hoạt động gói đăng ký thất bại!",
        });
      },
    });

  return { onDeActivateSubscriptionPackage, isLoading };
};

export const useActivateSubscriptionPackage = () => {
  const queryClient = useQueryClient();
  const showToast = useToast();

  const { mutateAsync: onActivateSubscriptionPackage, isPending: isLoading } = useMutation(
    {
      mutationFn: (id: string) =>
        rootApiService.post<PaginationResponse<SubscriptionPackageDto>>(
          API_ENDPOINTS.SUBSCRIPTION_PACKAGE.ACTIVATE(id)
        ),
      onSuccess: (res) => {
        queryClient.invalidateQueries({
          queryKey: [API_ENDPOINTS.SUBSCRIPTION_PACKAGE.PAGINATION],
        });
        showToast({
          type: "success",
          title: "Thành công",
          message: res.message || "Kích hoạt gói đăng ký thành công!",
        });
      },
      onError: (error: any) => {
        showToast({
          type: "error",
          title: "Lỗi",
          message: error?.message || "Kích hoạt gói đăng ký thất bại!",
        });
      },
    }
  );

  return { onActivateSubscriptionPackage, isLoading };
};