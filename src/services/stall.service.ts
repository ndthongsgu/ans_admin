import http from "@/services/api.service";
import type { StallCreateDto, StallDto, StallUpdateDto } from "@/dto/stall.dto";

// Methods for Owner (default)
export const stallService = {
    getAll: async (params?: any) => {
        return http.get<StallDto[]>("/owner/stalls/", { params });
    },

    getById: async (id: string) => {
        return http.get<StallDto>(`/owner/stalls/${id}`);
    },

    create: async (data: StallCreateDto) => {
        return http.post<StallDto>("/owner/stalls/", data);
    },

    update: async (id: string, data: StallUpdateDto) => {
        return http.put<StallDto>(`/owner/stalls/${id}`, data);
    },

    delete: async (id: string) => {
        return http.delete<{ detail: string }>(`/owner/stalls/${id}`);
    },

    // Admin methods (explicit)
    admin: {
        getAll: async (params?: any) => http.get<StallDto[]>("/admin/stalls/", { params }),
        getById: async (id: string) => http.get<StallDto>(`/admin/stalls/${id}`),
        create: async (data: StallCreateDto) => http.post<StallDto>("/admin/stalls/", data),
        update: async (id: string, data: StallUpdateDto) => http.put<StallDto>(`/admin/stalls/${id}`, data),
        delete: async (id: string) => http.delete<{ detail: string }>(`/admin/stalls/${id}`),
    }
};
