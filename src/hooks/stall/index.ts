import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { stallService } from "@/services/stall.service";
import type { StallCreateDto, StallUpdateDto } from "@/dto/stall.dto";
import { useUserInfo } from "../auth/useUserInfo";
import { isAdmin } from "@/common/helpers/permissions";

// Hook to switch between Admin/Owner service based on Role
const useService = () => {
    const userInfo = useUserInfo();
    if (isAdmin(userInfo as any)) {
        return stallService.admin;
    }
    return stallService;
};

export const useStalls = (params?: any) => {
    const service = useService();
    return useQuery({
        queryKey: ["stalls", params],
        queryFn: () => service.getAll(params),
    });
};

export const useStall = (id: string) => {
    const service = useService();
    return useQuery({
        queryKey: ["stall", id],
        queryFn: () => service.getById(id),
        enabled: !!id,
    });
};

export const useCreateStall = () => {
    const queryClient = useQueryClient();
    const service = useService();
    return useMutation({
        mutationFn: (data: StallCreateDto) => service.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["stalls"] });
        },
    });
};

export const useUpdateStall = () => {
    const queryClient = useQueryClient();
    const service = useService();
    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: StallUpdateDto }) =>
            service.update(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["stalls"] });
            queryClient.invalidateQueries({ queryKey: ["stall"] });
        },
    });
};

export const useDeleteStall = () => {
    const queryClient = useQueryClient();
    const service = useService();
    return useMutation({
        mutationFn: (id: string) => service.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["stalls"] });
        },
    });
};
