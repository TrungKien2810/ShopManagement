import apiClient from "./apiClient";

export const orderApi = {
  getActiveOrder: async (tableId: string) => {
    const response = await apiClient.get(`/Order/active/${tableId}`);
    return response.data;
  },
  addItem: async (orderId: string, request: { productId: string, quantity: number, note?: string, idempotencyKey?: string }) => {
    await apiClient.post(`/Order/${orderId}/items`, request);
  },
  approveItem: async (orderId: string, productId: string) => {
    await apiClient.post(`/Order/${orderId}/approve/${productId}`);
  }
};
