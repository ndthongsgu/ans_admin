import type { OwnerDto } from "@/dto/owner.dto";
import { API_ENDPOINTS } from "./api-route";
import rootApiService from "./api.service";

export const ownerService = {
    // Get all owners with pagination
    getOwners: async (skip: number = 0, limit: number = 100): Promise<OwnerDto[]> => {
        const response = await rootApiService.get<OwnerDto[]>(
            API_ENDPOINTS.OWNER.GET_ALL,
            { skip, limit }
        );
        return response;
    },

    // Get owner by ID
    getOwnerById: async (id: string): Promise<OwnerDto> => {
        const response = await rootApiService.get<OwnerDto>(
            API_ENDPOINTS.OWNER.FIND_BY_ID(id)
        );
        return response;
    },

    // Create new owner
    createOwner: async (owner: any): Promise<OwnerDto> => {
        const response = await rootApiService.post<OwnerDto>(
            API_ENDPOINTS.OWNER.CREATE,
            owner
        );
        return response;
    },

    // Update owner
    updateOwner: async (id: string, owner: any): Promise<OwnerDto> => {
        const response = await rootApiService.put<OwnerDto>(
            API_ENDPOINTS.OWNER.UPDATE(id),
            owner
        );
        return response;
    },

    // Delete owner
    deleteOwner: async (id: string): Promise<void> => {
        await rootApiService.delete(API_ENDPOINTS.OWNER.UPDATE(id));
    },
};

export default ownerService;
