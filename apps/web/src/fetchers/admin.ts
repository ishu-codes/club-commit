import { api } from "@/lib/api";
import { PlatformStats } from "@/types/admin";

export const adminFetchers = {
  stats: () => api.get<PlatformStats>("admin/stats"),
  users: () => api.get<any[]>("admin/users"),
  updateUserRole: (id: string, role: string) => api.patch(`admin/users/${id}/role`, { role }),
};
