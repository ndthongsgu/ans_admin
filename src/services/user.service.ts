import type { UserDto as User, UserCreateDto as UserCreate, UserUpdateDto as UserUpdate } from "@/dto/user.dto";
import { API_ENDPOINTS } from "./api-route";
import rootApiService from "./api.service";

export const userService = {
    // Get all users with pagination
    getUsers: async (skip: number = 0, limit: number = 100): Promise<User[]> => {
        const response = await rootApiService.get<User[]>(
            API_ENDPOINTS.USER.GET_ALL,
            { skip, limit }
        );
        return response;
    },

    // Get user by ID
    getUserById: async (id: string): Promise<User> => {
        const response = await rootApiService.get<User>(
            API_ENDPOINTS.USER.FIND_BY_ID(id)
        );
        return response;
    },

    // Create new user
    createUser: async (user: UserCreate): Promise<User> => {
        const response = await rootApiService.post<User>(
            API_ENDPOINTS.USER.CREATE,
            user
        );
        return response;
    },

    // Update user
    updateUser: async (id: string, user: UserUpdate): Promise<User> => {
        const response = await rootApiService.put<User>(
            API_ENDPOINTS.USER.UPDATE(id),
            user
        );
        return response;
    },

    // Delete user
    deleteUser: async (id: string): Promise<void> => {
        await rootApiService.delete(API_ENDPOINTS.USER.UPDATE(id));
    },
};

export default userService;
