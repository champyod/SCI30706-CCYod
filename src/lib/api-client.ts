import type { ApiResponse, ApiError } from "@/types";

type RequestOptions = {
  headers?: Record<string, string>;
  params?: Record<string, string | number | boolean>;
  cache?: RequestCache;
  next?: NextFetchRequestConfig;
};

type RequestBody = Record<string, unknown> | FormData;

class ApiClientError extends Error {
  status: number;
  errors?: Record<string, string[]>;

  constructor({ message, status, errors }: ApiError) {
    super(message);
    this.name = "ApiClientError";
    this.status = status;
    this.errors = errors;
  }
}

async function handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
  if (!response.ok) {
    const error: ApiError = await response.json().catch(() => ({
      message: "An unexpected error occurred",
      status: response.status,
    }));
    throw new ApiClientError(error);
  }
  const data = await response.json();
  return { data, status: response.status };
}

function buildUrl(path: string, params?: RequestOptions["params"]): string {
  if (!params) return path;
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    searchParams.append(key, String(value));
  });
  return `${path}?${searchParams.toString()}`;
}

export const apiClient = {
  async get<T>(path: string, options?: RequestOptions): Promise<ApiResponse<T>> {
    const url = buildUrl(path, options?.params);
    const response = await fetch(url, {
      method: "GET",
      headers: { "Content-Type": "application/json", ...options?.headers },
      cache: options?.cache,
      next: options?.next,
    });
    return handleResponse<T>(response);
  },

  async post<T>(
    path: string,
    body?: RequestBody,
    options?: RequestOptions,
  ): Promise<ApiResponse<T>> {
    const isFormData = body instanceof FormData;
    const response = await fetch(path, {
      method: "POST",
      headers: isFormData
        ? options?.headers
        : { "Content-Type": "application/json", ...options?.headers },
      body: isFormData ? body : body ? JSON.stringify(body) : undefined,
    });
    return handleResponse<T>(response);
  },

  async put<T>(
    path: string,
    body?: RequestBody,
    options?: RequestOptions,
  ): Promise<ApiResponse<T>> {
    const response = await fetch(path, {
      method: "PUT",
      headers: { "Content-Type": "application/json", ...options?.headers },
      body: body ? JSON.stringify(body) : undefined,
    });
    return handleResponse<T>(response);
  },

  async delete<T>(path: string, options?: RequestOptions): Promise<ApiResponse<T>> {
    const response = await fetch(path, {
      method: "DELETE",
      headers: { "Content-Type": "application/json", ...options?.headers },
    });
    return handleResponse<T>(response);
  },
};

export { ApiClientError };
