export interface StallDto {
    id: string;
    areaId: string;
    ownerId: string;
    name: string;
    latitude: number;
    longitude: number;
    radius: number;
    coverImage?: string;
    status: boolean;
    area?: {
        id: string;
        name: string;
    }
    owner?: {
        id: string;
        fullName: string;
        phone: string;
    }
}

export interface StallCreateDto {
    area_id: string;
    owner_id: string;
    name: string;
    latitude: number;
    longitude: number;
    radius?: number;
    cover_image?: string;
    status?: boolean;
}

export interface StallUpdateDto {
    name?: string;
    area_id?: string;
    latitude?: number;
    longitude?: number;
    radius?: number;
    cover_image?: string;
    status?: boolean;
}

export interface StallFilter {
    name?: string;
    ownerId?: string;
    areaId?: string;
}
