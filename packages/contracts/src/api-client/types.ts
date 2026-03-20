export interface ClientConfig {
  baseUrl: string;
  token?: string;
  defaultHeaders?: Record<string, string>;
}

export interface RequestOptions {
  params?: Record<string, string | number | boolean | undefined>;
  headers?: Record<string, string>;
  body?: unknown;
}
