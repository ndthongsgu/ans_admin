import { useQuery } from "@tanstack/react-query";
import { areaService } from "@/services/area.service";

export const useAreas = (params?: any) => {
    return useQuery({
        queryKey: ["areas", params],
        queryFn: () => areaService.getAll(params),
    });
};

export const useArea = (id: string) => {
    return useQuery({
        queryKey: ["area", id],
        queryFn: () => areaService.getById(id),
        enabled: !!id,
    });
};
