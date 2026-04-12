import type { ShopDto, CreateShopDto } from "../models/shop";
import apiClient from "./apiClient";

// Các hàm gọi API cho Shop
export const shopApi = {
  // Lấy danh sách quán
  getAll: async () => {
    const response = await apiClient.get<ShopDto[]>("/shop/my-shops");
    return response.data;
  },
  // Lấy chi tiết 1 quán
  getById: async (id: string) => {
    const response = await apiClient.get<ShopDto>(`/shop/${id}`);
    return response.data;
  },
  // Tạo mới quán
  create: async (data: CreateShopDto) => {
    const response = await apiClient.post<ShopDto>("/shop", data);
    return response.data;
  },
  // Cập nhật quán
  update: async (id: string, data: CreateShopDto) => {
    await apiClient.put(`/shop/${id}`, data);
  },
  // Xóa quán
  delete: async (id: string) => {
    await apiClient.delete(`/shop/${id}`);
  },
  // Mời thành viên
  invite: async (shopId: string, data: { username: string; role: number }) => {
    await apiClient.post(`/shop/${shopId}/invite`, data);
  },
};
