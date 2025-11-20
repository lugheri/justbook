export interface IHttpClientService {
  get<T>(url: string, params?: unknown): Promise<T | undefined>
  post<T>(url: string, data: unknown): Promise<T | undefined>
  put<T>(url: string, data: unknown, params?: unknown): Promise<T | undefined>
  delete<T>(url: string, params?: unknown): Promise<T | undefined>
  setToken(token: string): void
  setInternal(internal: boolean): void
}
