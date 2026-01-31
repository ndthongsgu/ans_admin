import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { message } from "antd";
import { ownerService } from "@/services";

export const ownerKeys = {
    all: ["owners"] as const,
    lists: () => [...ownerKeys.all, "list"] as const,
    list: (filters: any) => [...ownerKeys.lists(), filters] as const,
    details: () => [...ownerKeys.all, "detail"] as const,
    detail: (id: string) => [...ownerKeys.details(), id] as const,
};

export const useOwners = (skip: number = 0, limit: number = 100) => {
    return useQuery({
        queryKey: ownerKeys.list({ skip, limit }),
        queryFn: () => ownerService.getOwners(skip, limit),
    });
};

export const useOwner = (id: string) => {
    return useQuery({
        queryKey: ownerKeys.detail(id),
        queryFn: () => ownerService.getOwnerById(id),
        enabled: !!id,
    });
};

export const useCreateOwner = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (owner: any) => ownerService.createOwner(owner),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ownerKeys.lists() });
            message.success("Tạo chủ quán thành công!");
        },
        onError: (error: any) => {
            message.error(error.message || "Tạo chủ quán thất bại!");
        },
    });
};

export const useUpdateOwner = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, owner }: { id: string; owner: any }) =>
            ownerService.updateOwner(id, owner),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ownerKeys.lists() });
            queryClient.invalidateQueries({ queryKey: ownerKeys.detail(variables.id) });
            message.success("Cập nhật chủ quán thành công!");
        },
        onError: (error: any) => {
            message.error(error.message || "Cập nhật chủ quán thất bại!");
        },
    });
};

export const useDeleteOwner = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => ownerService.deleteOwner(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ownerKeys.lists() });
            message.success("Xóa chủ quán thành công!");
        },
        onError: (error: any) => {
            message.error(error.message || "Xóa chủ quán thất bại!");
        },
    });
};
