import { RequestConfig } from '@/types/services'
import BaseAPIService from './api.service'

class ApplicationType extends BaseAPIService {
  private readonly basePath = '/application_type'

  async getAllApplicationType<T = unknown>(config?: RequestConfig) {
    return this.get<T>(`${this.basePath}/get`, config)
  }
}
export const applicationTypeService = new ApplicationType()
