import type { CustomerDto, CustomerCreateDto, CustomerUpdateDto } from "@/dto/customer.dto";
import { API_ENDPOINTS } from "./api-route";
import rootApiService from "./api.service";

export const customerService = {
    getCustomers: async (skip: number = 0, limit: number = 100): Promise<CustomerDto[]> => {
        const response = await rootApiService.get<CustomerDto[]>(
            API_ENDPOINTS.CUSTOMER.GET_ALL,
            { skip, limit }
        );
        return response;
    },

    getCustomerById: async (id: string): Promise<CustomerDto> => {
        const response = await rootApiService.get<CustomerDto>(
            API_ENDPOINTS.CUSTOMER.FIND_BY_ID(id)
        );
        return response;
    },

    createCustomer: async (customer: CustomerCreateDto): Promise<CustomerDto> => {
        const response = await rootApiService.post<CustomerDto>(
            API_ENDPOINTS.CUSTOMER.CREATE,
            customer
        );
        return response;
    },

    updateCustomer: async (id: string, customer: CustomerUpdateDto): Promise<CustomerDto> => {
        const response = await rootApiService.put<CustomerDto>(
            API_ENDPOINTS.CUSTOMER.UPDATE(id),
            customer
        );
        return response;
    },

    deleteCustomer: async (id: string): Promise<void> => {
        await rootApiService.delete(API_ENDPOINTS.CUSTOMER.UPDATE(id));
    },
};

export default customerService;
