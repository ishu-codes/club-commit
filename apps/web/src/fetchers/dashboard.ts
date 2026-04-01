import { api } from "@/lib/api";
import { DashboardData } from "@/types/dashboard";

export const dashboardFetchers = {
  get: () => api.get<DashboardData>("dashboard"),
};
