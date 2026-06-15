import apiClient from "./apiClient";

export const menuManagementApi = {
  createCategory: async (request: { name: string; description?: string; isActive?: boolean }) => {
    const response = await apiClient.post("/categories", request);
    return response.data;
  },
  updateCategory: async (id: string, request: { name?: string; description?: string; isActive?: boolean }) => {
    const response = await apiClient.put(`/categories/${id}`, request);
    return response.data;
  },
  deleteCategory: async (id: string, force = false) => {
    const url = `/categories/${id}` + (force ? "?force=true" : "");
    await apiClient.delete(url);
  },
  createProduct: async (request: {
    name: string;
    price: number;
    description?: string;
    categoryId: string;
    imageUrl?: string;
    isAvailable?: boolean;
  }) => {
    const response = await apiClient.post("/menuitems", request);
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
    const response = await apiClient.put(`/menuitems/${id}`, request);
    return response.data;
  },
  deleteProduct: async (id: string, force = false) => {
    const url = `/menuitems/${id}` + (force ? "?force=true" : "");
    await apiClient.delete(url);
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
