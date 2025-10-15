import { RequestConfig } from '@/types/services'
import BaseAPIService from './api.service'

class ApplicationRole extends BaseAPIService {
  private readonly basePath = '/application_role'

  async getApplicationRole<T = unknown>(config?: RequestConfig) {
    return this.get<T>(`${this.basePath}/get`, {
      ...config,
      ttl: 10 * 60 * 1000,
    })
  }
}

export const applicationRoleService = new ApplicationRole()
