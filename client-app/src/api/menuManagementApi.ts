import apiClient from "./apiClient";

export const menuManagementApi = {
  createCategory: async (request: { name: string; description?: string; isActive?: boolean }) => {
    const response = await apiClient.post("/menu/categories", request);
    return response.data;
  },
  updateCategory: async (id: string, request: { name?: string; description?: string; isActive?: boolean }) => {
    const response = await apiClient.put(`/menu/categories/${id}`, request);
    return response.data;
  },
  deleteCategory: async (id: string) => {
    await apiClient.delete(`/menu/categories/${id}`);
  },
  createProduct: async (request: {
    name: string;
    price: number;
    description?: string;
    categoryId: string;
    imageUrl?: string;
    isAvailable?: boolean;
  }) => {
    const response = await apiClient.post("/menu/products", request);
    return response.data;
  },
  updateProduct: async (
    id: string,
    request: {
      name?: string;
      price?: number;
      description?: string;
      categoryId?: string;
      imageUrl?: string;
      isAvailable?: boolean;
    },
  ) => {
    const response = await apiClient.put(`/menu/products/${id}`, request);
    return response.data;
  },
  deleteProduct: async (id: string) => {
    await apiClient.delete(`/menu/products/${id}`);
  },
  uploadPhoto: async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    const response = await apiClient.post("/photos", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data as { url: string };
  },
};
