import { RequestConfig } from '@/types/services'
import BaseAPIService from './api.service'

class UserRole extends BaseAPIService {
  private readonly basePath = '/user/role'

  async getUserRoles<T = unknown>(config?: RequestConfig) {
    return this.get<T>(`${this.basePath}/get`, {
      ...config,
      ttl: 10 * 60 * 1000,
    })
  }
  async getUserRoleById<T = unknown>(id: string, config?: RequestConfig) {
    return this.get<T>(`${this.basePath}/get/${id}`, {
      ...config,
    })
  }
}

export const userRoleService = new UserRole()
