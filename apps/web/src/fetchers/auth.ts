import { api } from "@/lib/api";

export interface User {
    id: string;
    email: string;
    name: string;
    role: string;
}

export const authFetchers = {
    me: () => api.get<User>("auth/me"),
};
