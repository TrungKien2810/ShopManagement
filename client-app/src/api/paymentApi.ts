import apiClient from "./apiClient";

export const paymentApi = {
  createPayment: async (data: { orderId: string, amount: number, method?: string }) => {
    const response = await apiClient.post("/payments", data);
    return response.data;
  },
  getPaymentHistory: async (orderId: string) => {
    const response = await apiClient.get(`/payments/order/${orderId}`);
    return response.data;
  }
};
