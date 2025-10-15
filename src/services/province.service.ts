import { RequestConfig } from '@/types/services'
import BaseAPIService from './api.service'

class Province extends BaseAPIService {
  private readonly basePath = '/province'

  async getProvinces<T = unknown>(config?: RequestConfig) {
    return this.get<T>(`${this.basePath}/get`, {
      ...config,
      ttl: 10 * 60 * 1000,
    })
  }
}

export const provinceService = new Province()
