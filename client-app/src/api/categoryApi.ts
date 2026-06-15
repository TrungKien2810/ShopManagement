import apiClient from "./apiClient";

export const categoryApi = {
  getCategories: async (branchId?: string) => {
    const response = await apiClient.get("/categories", {
      params: branchId ? { branchId } : {},
    });
    return response.data;
  },

  createCategory: async (data: {
    name: string;
    description?: string;
    isActive?: boolean;
    branchId?: string | null;
  }) => {
    const response = await apiClient.post("/categories", data);
    return response.data;
  },

  updateCategory: async (
    id: string,
    data: { name?: string; description?: string; isActive?: boolean; branchId?: string | null },
  ) => {
    const response = await apiClient.put(`/categories/${id}`, data);
    return response.data;
  },

  deleteCategory: async (id: string, force = false) => {
    await apiClient.delete(`/categories/${id}`, { params: { force } });
  },
};
