import apiClient from "./apiClient";

export type DailyRevenue = {
  date: string; // yyyy-MM-dd
  revenue: number;
  orderCount: number;
};

export type RevenueSummary = {
  todayRevenue: number;
  todayOrderCount: number;
  weekRevenue: number;
  weekOrderCount: number;
  averageOrderValue: number;
  dailySeries: DailyRevenue[];
};

export const reportApi = {
  getRevenueSummary: async () => {
    const response = await apiClient.get<RevenueSummary>("/reports/revenue");
    return response.data;
  },
};
