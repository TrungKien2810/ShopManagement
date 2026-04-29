import apiClient from "./apiClient";

export const menuApi = {
  getMenu: async () => {
    const response = await apiClient.get("/menu");
    return response.data;
  }
};
