import { RequestConfig } from '@/types/services'
import { CreateApplicationPayload } from '@/types/services/application.type'
import BaseAPIService from './api.service'

class Application extends BaseAPIService {
  private readonly basePath = '/application'

  async getAllApplication<T = unknown>(config?: RequestConfig) {
    return this.get<T>(`${this.basePath}/get`, config)
  }

  async getApplicationDetails<T = unknown>(
    appId: string,
    config?: RequestConfig
  ) {
    return this.get<T>(`${this.basePath}/getbyid/${appId}`, config)
  }

  async createApplication<T = unknown>(
    data: CreateApplicationPayload,
    config?: RequestConfig
  ) {
    return this.post<T>(`${this.basePath}/add`, data, config)
  }
}
export const applicationService = new Application()
