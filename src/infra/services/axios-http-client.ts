/* eslint-disable @typescript-eslint/no-explicit-any */

import axios, { AxiosInstance } from 'axios'
import { IHttpClientService } from '../interfaces/ihttp-client-service'
import { env } from '@/env'

export class AxiosHttpClient implements IHttpClientService {
  private axiosInstance: AxiosInstance
  private token?: string
  private internal: boolean = false

  constructor(baseURL: string) {
    this.axiosInstance = axios.create({ baseURL })

    this.axiosInstance.interceptors.request.use(
      (config) => {
        // Exemplo: Adicionar headers dinâmicos
        if (this.internal) {
          config.headers.Authorization = env.INTERNAL_SERVICE_TOKEN
        }
        if (this.token) {
          config.headers.Authorization = this.token
        }
        return config
      },
      (error) => {
        return Promise.reject(error)
      },
    )

    this.axiosInstance.interceptors.response.use(
      (response) => response,
      (error) => {
        console.error(
          'Intercepted error:',
          error.message,
          error.response.data.message,
        )
        return Promise.reject(error)
      },
    )
  }

  setToken(token: string): void {
    this.token = token
  }

  setInternal(internal: boolean): void {
    this.internal = internal
  }

  private handleError(err: any, url: string): void {
    if (err.response && err.response.data && err.response.data.message) {
      console.error(err.response.data.message)
    } else {
      console.error('Erro inesperado:', err.message)
    }
    console.error(
      'Axios error: Url',
      err,
      `${this.axiosInstance.defaults.baseURL}${url}`,
    )
    return undefined
  }

  async get<T>(
    url: string,
    params?: Record<string, unknown>,
  ): Promise<T | undefined> {
    try {
      const response = await this.axiosInstance.get<T>(url, { params })

      return response.data
    } catch (err: any) {
      this.handleError(err, url)
    }
  }

  async post<T>(url: string, data?: unknown): Promise<T | undefined> {
    try {
      const response = await this.axiosInstance.post<T>(url, data)
      return response.data
    } catch (err: any) {
      this.handleError(err, url)
    }
  }

  async put<T>(
    url: string,
    data?: unknown,
    params?: Record<string, unknown>,
  ): Promise<T | undefined> {
    try {
      const response = await this.axiosInstance.put<T>(url, data, { params })
      return response.data
    } catch (err: any) {
      this.handleError(err, url)
    }
  }

  async delete<T>(
    url: string,
    params?: Record<string, unknown>,
  ): Promise<T | undefined> {
    try {
      const response = await this.axiosInstance.delete<T>(url, { params })
      return response.data
    } catch (err: any) {
      this.handleError(err, url)
    }
  }
}
