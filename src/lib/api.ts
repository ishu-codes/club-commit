import { authClient } from "./auth-client";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
const API_VERSION = process.env.NEXT_PUBLIC_API_VERSION || "v1";

type FetchOptions = RequestInit & {
  params?: Record<string, string>;
};

export async function apiFetch<T>(endpoint: string, options: FetchOptions = {}): Promise<T> {
  const { params, ...init } = options;

  let url = `${API_BASE_URL}/api/${API_VERSION}/${endpoint}`;
  if (params) {
    const searchParams = new URLSearchParams(params);
    url += `?${searchParams.toString()}`;
  }

  // Get session headers from better-auth client
  const session = await authClient.getSession();
  const headers = new Headers(init.headers);

  if (!headers.has("Content-Type") && !(init.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(url, {
    ...init,
    headers,
  });

  const body = await response.json();

  if (!response.ok) {
    throw new Error(body.error || body.message || "An error occurred");
  }

  return body.data as T;
}

export const api = {
  get: <T>(endpoint: string, options?: FetchOptions) => apiFetch<T>(endpoint, { ...options, method: "GET" }),
  post: <T>(endpoint: string, body?: any, options?: FetchOptions) =>
    apiFetch<T>(endpoint, { ...options, method: "POST", body: body instanceof FormData ? body : JSON.stringify(body) }),
  patch: <T>(endpoint: string, body?: any, options?: FetchOptions) =>
    apiFetch<T>(endpoint, {
      ...options,
      method: "PATCH",
      body: body instanceof FormData ? body : JSON.stringify(body),
    }),
  delete: <T>(endpoint: string, options?: FetchOptions) => apiFetch<T>(endpoint, { ...options, method: "DELETE" }),
};
