export interface ShopDto {
    id: string;
    name: string;
    address: string;
    phoneNumber: string;
    createdAt: string;
}

export interface CreateShopDto {
    name: string;
    address: string;
    phoneNumber: string;
}
