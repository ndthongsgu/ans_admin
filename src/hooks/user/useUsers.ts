import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { userService } from "@/services/user.service";
import type { UserDto, UserCreateDto, UserUpdateDto } from "@/dto/user.dto";
import { message } from "antd";

// Query key factory
export const userKeys = {
    all: ["users"] as const,
    lists: () => [...userKeys.all, "list"] as const,
    list: (filters: any) => [...userKeys.lists(), filters] as const,
    details: () => [...userKeys.all, "detail"] as const,
    detail: (id: string) => [...userKeys.details(), id] as const,
};

// Get all users
export const useUsers = (skip: number = 0, limit: number = 100) => {
    return useQuery({
        queryKey: userKeys.list({ skip, limit }),
        queryFn: () => userService.getUsers(skip, limit),
    });
};

// Get user by ID
export const useUser = (id: string) => {
    return useQuery({
        queryKey: userKeys.detail(id),
        queryFn: () => userService.getUserById(id),
        enabled: !!id,
    });
};

// Create user
export const useCreateUser = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (user: UserCreateDto) => userService.createUser(user),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: userKeys.lists() });
            message.success("Tạo người dùng thành công!");
        },
        onError: (error: any) => {
            message.error(error.message || "Tạo người dùng thất bại!");
        },
    });
};

// Update user
export const useUpdateUser = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, user }: { id: string; user: UserUpdateDto }) =>
            userService.updateUser(id, user),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: userKeys.lists() });
            queryClient.invalidateQueries({ queryKey: userKeys.detail(variables.id) });
            message.success("Cập nhật người dùng thành công!");
        },
        onError: (error: any) => {
            message.error(error.message || "Cập nhật người dùng thất bại!");
        },
    });
};

// Delete user
export const useDeleteUser = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => userService.deleteUser(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: userKeys.lists() });
            message.success("Xóa người dùng thành công!");
        },
        onError: (error: any) => {
            message.error(error.message || "Xóa người dùng thất bại!");
        },
    });
};
