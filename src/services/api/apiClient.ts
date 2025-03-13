"use client";

type ErrorBody = string | Record<string, string>;

export class FetchError extends Error {
  statusCode: number;
  errorBody: ErrorBody;

  constructor(message: string, statusCode: number, errorBody: ErrorBody) {
    super(message);
    this.statusCode = statusCode;
    this.name = "FetchError";
    this.errorBody = errorBody;
  }
}

export interface ApiClientOptions {
  method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  headers?: Record<string, string>;
  body?: Record<string, unknown> | string | null;
  queryParams?: QueryParams;
}

export type Headers = Record<string, string>;
export type QueryParams = Record<string, string | number | boolean>;

export class ApiClient {
  private baseUrl: string;
  private _headers: Headers;

  constructor(baseUrl: string, headers: Headers = {}) {
    this.baseUrl = baseUrl;
    this._headers = headers;
  }

  private buildQueryString(queryParams?: QueryParams): string {
    if (!queryParams) return "";
    return (
      "?" +
      new URLSearchParams(queryParams as Record<string, string>).toString()
    );
  }

  async request<T>(
    endpoint: string,
    {
      method = "GET",
      headers = {},
      body = null,
      queryParams,
    }: ApiClientOptions = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}${this.buildQueryString(
      queryParams
    )}`;
    const options: RequestInit = {
      method,
      headers: {
        "Content-Type": "application/json",
        ...this._headers,
        ...headers,
      },
      body: body
        ? typeof body === "string"
          ? body
          : JSON.stringify(body)
        : null,
    };

    try {
      const response = await fetch(url, options);

      if (!response.ok) {
        const errorBody = await response.text();

        if (response.status === 401) {
          window.location.href = "/login";
        }

        throw new FetchError(
          `Fetch-Error: ${response.status} - ${response.statusText}\n${errorBody}`,
          response.status,
          errorBody
        );
      }

      return response.json() as Promise<T>;
    } catch (error) {
      console.error("API Request Failed:", error);
      throw error;
    }
  }

  get<T>(endpoint: string, queryParams?: QueryParams): Promise<T> {
    return this.request<T>(endpoint, { method: "GET", queryParams });
  }

  post<T>(
    endpoint: string,
    body?: Record<string, unknown> | string,
    queryParams?: QueryParams
  ): Promise<T> {
    return this.request<T>(endpoint, { method: "POST", body, queryParams });
  }

  put<T>(
    endpoint: string,
    body?: Record<string, unknown> | string,
    queryParams?: QueryParams
  ): Promise<T> {
    return this.request<T>(endpoint, { method: "PUT", body, queryParams });
  }

  delete<T>(endpoint: string, queryParams?: QueryParams): Promise<T> {
    return this.request<T>(endpoint, { method: "DELETE", queryParams });
  }

  patch<T>(
    endpoint: string,
    body?: Record<string, unknown> | string,
    queryParams?: QueryParams
  ): Promise<T> {
    return this.request<T>(endpoint, { method: "PATCH", body, queryParams });
  }
}
