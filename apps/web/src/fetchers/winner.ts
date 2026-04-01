import { api } from "@/lib/api";
import { Winner } from "@/types/winner";

export const winnerFetchers = {
  list: () => api.get<Winner[]>("winners"),
  mine: () => api.get<Winner[]>("winners/mine"),
  uploadProof: (id: string, proofUrl: string) => api.post(`winners/${id}/proof`, { proofUrl }),
  verify: (id: string) => api.patch(`winners/${id}/verify`),
  pay: (id: string) => api.patch(`winners/${id}/pay`),
};
