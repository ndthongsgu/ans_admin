import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { customerService } from "@/services/customer.service";
import type { CustomerDto, CustomerCreateDto, CustomerUpdateDto } from "@/dto/customer.dto";
import { message } from "antd";

export const customerKeys = {
    all: ["customers"] as const,
    lists: () => [...customerKeys.all, "list"] as const,
    list: (filters: any) => [...customerKeys.lists(), filters] as const,
    details: () => [...customerKeys.all, "detail"] as const,
    detail: (id: string) => [...customerKeys.details(), id] as const,
};

export const useCustomers = (skip: number = 0, limit: number = 100) => {
    return useQuery({
        queryKey: customerKeys.list({ skip, limit }),
        queryFn: () => customerService.getCustomers(skip, limit),
    });
};

export const useCustomer = (id: string) => {
    return useQuery({
        queryKey: customerKeys.detail(id),
        queryFn: () => customerService.getCustomerById(id),
        enabled: !!id,
    });
};

export const useCreateCustomer = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (customer: CustomerCreateDto) => customerService.createCustomer(customer),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: customerKeys.lists() });
            message.success("Tạo khách hàng thành công!");
        },
        onError: (error: any) => {
            message.error(error.message || "Tạo khách hàng thất bại!");
        },
    });
};

export const useUpdateCustomer = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, customer }: { id: string; customer: CustomerUpdateDto }) =>
            customerService.updateCustomer(id, customer),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: customerKeys.lists() });
            queryClient.invalidateQueries({ queryKey: customerKeys.detail(variables.id) });
            message.success("Cập nhật khách hàng thành công!");
        },
        onError: (error: any) => {
            message.error(error.message || "Cập nhật khách hàng thất bại!");
        },
    });
};

export const useDeleteCustomer = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => customerService.deleteCustomer(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: customerKeys.lists() });
            message.success("Xóa khách hàng thành công!");
        },
        onError: (error: any) => {
            message.error(error.message || "Xóa khách hàng thất bại!");
        },
    });
};
