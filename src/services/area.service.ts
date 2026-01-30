import http from "@/services/api.service";
import type { AreaDto } from "@/dto/area.dto";

export const areaService = {
    getAll: async (params?: any) => {
        // Try admin endpoint
        return http.get<AreaDto[]>("/admin/areas/", { params });
    },

    getById: async (id: string) => {
        return http.get<AreaDto>(`/admin/areas/${id}`);
    }
};
