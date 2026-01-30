export interface AreaDto {
    id: string;
    name: string;
    description?: string;
    imageUrl?: string;
    centerLat: number;
    centerLong: number;
    radius?: number;
}
