import { AxiosRequestConfig } from 'axios'
import { CacheRequestConfig } from 'axios-cache-interceptor'

export interface ApiResponse<T = unknown> {
  data: T
  message?: string
  status: number
}

export interface ApiError {
  message: string
  status: number
  details?: unknown
}

export interface RequestConfig extends AxiosRequestConfig, CacheRequestConfig {
  skipErrorHandling?: boolean
  skipSuccessTransform?: boolean
  ttl?: number
}

export interface BaseAPIConfig {
  baseURL: string
  timeout?: number
  headers?: Record<string, string>
}
