import type { TableDto, OpenTableResponse } from "../models/table";
import apiClient from "./apiClient";

export const tableApi = {
  getAll: async (branchId?: string) => {
    const response = await apiClient.get<TableDto[]>("/tables", {
      params: branchId ? { branchId } : {},
    });
    return response.data;
  },

  // Mở bàn (Story 01)
  open: async (id: string) => {
    const response = await apiClient.post<OpenTableResponse>(
      `/tables/${id}/open`,
    );
    return response.data;
  },

  // Reset bàn (Debug/Test)
  reset: async (id: string) => {
    const response = await apiClient.post(`/tables/${id}/reset`);
    return response.data;
  },

  // Doi ban (chuyen don hang dang mo sang ban khac)
  transfer: async (fromTableId: string, toTableId: string) => {
    const response = await apiClient.post(
      `/tables/${fromTableId}/transfer/${toTableId}`,
    );
    return response.data as {
      orderId: string;
      fromTableId: string;
      toTableId: string;
      toTableName: string;
    };
  },

  createTable: async (data: {
    name: string;
    capacity: number;
    location: string;
    branchId?: string;
    areaId?: string;
  }) => {
    const response = await apiClient.post("/tables", data);
    return response.data;
  },

  updateTable: async (
    id: string,
    data: { name: string; capacity: number; location: string },
  ) => {
    const response = await apiClient.put(`/tables/${id}`, data);
    return response.data;
  },

  deleteTable: async (id: string) => {
    const response = await apiClient.delete(`/tables/${id}`);
    return response.data;
  },
};
