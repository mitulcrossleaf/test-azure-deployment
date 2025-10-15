import {
  clearUserLocalStorage,
  deleteCookie,
  localStorageAdapter,
  STORAGE_KEYS,
} from '@/helper'
import { AppConfig } from '@/lib'
import {
  ApiError,
  ApiResponse,
  BaseAPIConfig,
  RequestConfig,
} from '@/types/services'
import axios, {
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios'
import { AxiosCacheInstance, setupCache } from 'axios-cache-interceptor'
import { AuthService } from './auth.service'

// Types for API responses

// Default configuration
const DEFAULT_CONFIG: BaseAPIConfig = {
  baseURL: AppConfig.API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
}

class BaseAPIService {
  private axiosInstance: AxiosCacheInstance
  private baseURL: string
  private authService: AuthService

  constructor(config?: Partial<BaseAPIConfig>) {
    this.authService = new AuthService()
    // Merge provided config with default config
    const finalConfig = { ...DEFAULT_CONFIG, ...config }
    this.baseURL = finalConfig.baseURL

    // Initialize Axios instance
    this.axiosInstance = setupCache(
      axios.create({
        baseURL: finalConfig.baseURL,
        timeout: finalConfig.timeout || 10000,
        headers: {
          'Content-Type': 'application/json',
          ...finalConfig.headers,
        },
      }),
      { storage: localStorageAdapter }
    )

    this.setupInterceptors()
  }

  /**
   * Setup request and response interceptors
   */
  private setupInterceptors(): void {
    // Request interceptor
    this.axiosInstance.interceptors.request.use(
      async (config: InternalAxiosRequestConfig) => {
        // Add auth token if available
        const token = await this.getAuthToken()
        if (token) {
          config.headers.Authorization = `Bearer ${token}`
        }
        return config
      },
      (error: AxiosError) => {
        return Promise.reject(this.transformError(error))
      }
    )

    // Response interceptor
    this.axiosInstance.interceptors.response.use(
      (response: AxiosResponse) => {
        return response
      },
      async (error: AxiosError) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & {
          _retry?: boolean
        }

        // If error is 401 and we haven't retried yet
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true

          try {
            // Get a fresh token from auth service
            const newToken = await this.authService.getAccessToken()

            if (newToken) {
              // Update the authorization header with the new token
              originalRequest.headers.Authorization = `Bearer ${newToken}`

              // Retry the original request with the new token
              return this.axiosInstance.request(originalRequest)
            } else {
              this.authService.clearAccountCache()
              this.clearAuthToken()
              await this.clearCache()
              await deleteCookie(STORAGE_KEYS.SO_AUTH)

              // Clear all localStorage data
              clearUserLocalStorage()

              await this.authService.logoutPopup()
            }
          } catch {
            // If token refresh fails, reject with the original error
            return Promise.reject(this.transformError(error))
          }
        }

        return Promise.reject(this.transformError(error))
      }
    )
  }

  /**
   * Get authentication token from context or fallback to storage
   */
  private async getAuthToken(): Promise<string | null> {
    if (typeof window !== 'undefined') {
      // Check if we have a token in the default headers
      const authHeader = this.axiosInstance.defaults.headers
        .Authorization as string
      if (authHeader && authHeader.startsWith('Bearer ')) {
        return authHeader.substring(7)
      } else {
        return await this.authService.getAccessToken()
      }
    }
    return null
  }

  /**
   * Transform successful response
   */
  private transformSuccess<T>(response: AxiosResponse): ApiResponse<T> {
    return {
      data: response.data,
      message: response.data?.message || 'Success',
      status: response.status,
    }
  }

  /**
   * Transform error response
   */
  private transformError(error: AxiosError): ApiError {
    console.log('error:-', error)
    const apiError: ApiError = {
      message: error?.message ?? 'An unexpected error occurred',
      status: error.status ?? 500,
    }

    if (error.response) {
      // Server responded with error status
      const errorData = error.response.data as any
      apiError.status = error.response.status
      apiError.message = errorData?.message || errorData?.error || error.message
      // apiError.details = errorData?.details
    } else if (error.request) {
      // Request was made but no response received
      apiError.message = 'Network error - please check your connection'
      apiError.status = 0
    } else {
      // Something else happened
      apiError.message = error.message
    }

    return apiError
  }

  /**
   * Generic request method
   */
  private async request<T = unknown>(
    config: RequestConfig
  ): Promise<ApiResponse<T>> {
    try {
      if (config.method?.toUpperCase() === 'GET' && config.ttl) {
        config.cache = { ttl: config.ttl }
      } else {
        config.cache = false // default: no cache
      }
      const response = await this.axiosInstance.request(config)

      if (config.skipSuccessTransform) {
        return response.data
      }

      return this.transformSuccess<T>(response)
    } catch (error) {
      if (config.skipErrorHandling) {
        throw error
      }
      throw this.transformError(error as AxiosError)
    }
  }

  /**
   * GET request
   */
  async get<T = unknown>(
    url: string,
    config?: RequestConfig
  ): Promise<ApiResponse<T>> {
    return this.request<T>({
      method: 'GET',
      url,
      ...config,
    })
  }

  /**
   * POST request
   */
  async post<T = unknown>(
    url: string,
    data?: unknown,
    config?: RequestConfig
  ): Promise<ApiResponse<T>> {
    return this.request<T>({
      method: 'POST',
      url,
      data,
      ...config,
    })
  }

  /**
   * PUT request
   */
  async put<T = unknown>(
    url: string,
    data?: unknown,
    config?: RequestConfig
  ): Promise<ApiResponse<T>> {
    return this.request<T>({
      method: 'PUT',
      url,
      data,
      ...config,
    })
  }

  /**
   * PATCH request
   */
  async patch<T = unknown>(
    url: string,
    data?: unknown,
    config?: RequestConfig
  ): Promise<ApiResponse<T>> {
    return this.request<T>({
      method: 'PATCH',
      url,
      data,
      ...config,
    })
  }

  /**
   * DELETE request
   */
  async delete<T = unknown>(
    url: string,
    config?: RequestConfig
  ): Promise<ApiResponse<T>> {
    return this.request<T>({
      method: 'DELETE',
      url,
      ...config,
    })
  }

  /**
   * Upload file
   */
  async upload<T = unknown>(
    url: string,
    file: File | FormData,
    config?: RequestConfig
  ): Promise<ApiResponse<T>> {
    const formData = file instanceof FormData ? file : new FormData()
    if (file instanceof File) {
      formData.append('file', file)
    }

    return this.request<T>({
      method: 'POST',
      url,
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      ...config,
    })
  }

  /**
   * Download file
   */
  async download(url: string, config?: RequestConfig): Promise<Blob> {
    const response = await this.axiosInstance.request({
      method: 'GET',
      url,
      responseType: 'blob',
      ...config,
    })
    return response.data
  }

  /**
   * Get the underlying Axios instance for advanced usage
   */
  getAxiosInstance(): AxiosCacheInstance {
    return this.axiosInstance
  }

  /**
   * Update base URL
   */
  setBaseURL(baseURL: string): void {
    this.baseURL = baseURL
    this.axiosInstance.defaults.baseURL = baseURL
  }

  /**
   * Update default headers
   */
  setDefaultHeaders(headers: Record<string, string>): void {
    this.axiosInstance.defaults.headers = {
      ...this.axiosInstance.defaults.headers,
      ...headers,
    }
  }

  /**
   * Set authentication token
   */
  setAuthToken(token: string): void {
    this.axiosInstance.defaults.headers.Authorization = `Bearer ${token}`
  }

  /**
   * Clear authentication token
   */
  clearAuthToken(): void {
    delete this.axiosInstance.defaults.headers.Authorization
  }

  /** Clear all cached GET requests (use on logout) */
  async clearCache(): Promise<void> {
    if (this.axiosInstance.storage?.clear) {
      await this.axiosInstance.storage.clear()
    }
  }
}

// Export a default instance (you can create multiple instances for different APIs)
export const createAPIService = (config?: Partial<BaseAPIConfig>) =>
  new BaseAPIService(config)

// Create a default API service instance
export const apiService = new BaseAPIService()

// Export the class for custom instances
export default BaseAPIService
