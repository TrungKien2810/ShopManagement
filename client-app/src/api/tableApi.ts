import type { TableDto, OpenTableResponse } from "../models/table";
import apiClient from "./apiClient";

export const tableApi = {
  // Lấy danh sách bàn
  getAll: async () => {
    // Tạm thời giả lập lấy danh sách vì Story 02 mới làm API Get Tables
    // Nhưng mình sẽ gọi thật để xem Backend có trả về không (nếu đã làm)
    try {
      const response = await apiClient.get<TableDto[]>("/tables");
      return response.data;
    } catch (error) {
       // Nếu chưa có API GET /tables, trả về dữ liệu giả để test UI Mở bàn
       return [
         { id: "11111111-1111-1111-1111-111111111111", name: "Bàn VIP 01", capacity: 10, status: 0, location: "Tầng 1" },
         { id: "22222222-2222-2222-2222-222222222222", name: "Bàn VIP 02", capacity: 5, status: 0, location: "Tầng 1" },
         { id: "33333333-3333-3333-3333-333333333333", name: "Bàn Thường 05", capacity: 4, status: 1, location: "Sân vườn" }
       ] as TableDto[];
    }
  },

  // Mở bàn (Story 01)
  open: async (id: string) => {
    const response = await apiClient.post<OpenTableResponse>(`/tables/${id}/open`);
    return response.data;
  },

  // Reset bàn (Debug/Test)
  reset: async (id: string) => {
    const response = await apiClient.post(`/tables/${id}/reset`);
    return response.data;
  },

  // Thanh toán bàn (Story 05)
  checkout: async (id: string) => {
    const response = await apiClient.post(`/tables/${id}/checkout`);
    return response.data;
  }
};
