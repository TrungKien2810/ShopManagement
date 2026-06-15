import apiClient from "./apiClient";

export const orderApi = {
  getActiveOrder: async (tableId: string) => {
    const response = await apiClient.get(`/Order/active/${tableId}`);
    return response.data;
  },
  addItem: async (
    orderId: string,
    request: {
      productId: string;
      quantity: number;
      note?: string;
      idempotencyKey?: string;
    },
  ) => {
    await apiClient.post(`/Order/${orderId}/items`, request);
  },
  approveItem: async (orderId: string, productId: string) => {
    await apiClient.post(`/Order/${orderId}/approve/${productId}`);
  },
  addOrderItems: async (
    orderId: string,
    items: { menuItemId: string; quantity: number }[],
  ) => {
    await apiClient.post(`/Order/${orderId}/items`, { items });
  },
  updateOrderItem: async (
    orderId: string,
    itemId: string,
    quantity: number,
  ) => {
    await apiClient.put(`/Order/${orderId}/items/${itemId}`, { quantity });
  },
  deleteOrderItem: async (orderId: string, itemId: string) => {
    await apiClient.delete(`/Order/${orderId}/items/${itemId}`);
  },
};
