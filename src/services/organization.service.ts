import {
  CreateOrganizationPayload,
  RejectPayload,
  RequestConfig,
  UpdateOrganizationPayload,
} from '@/types/services'
import BaseAPIService from './api.service'

class Organization extends BaseAPIService {
  private readonly basePath = '/organization'

  async getAllOrganization<T = unknown>(config?: RequestConfig) {
    return this.get<T>(`${this.basePath}/get`, config)
  }

  async getOrganizationDetails<T = unknown>(
    orgId: string,
    config?: RequestConfig
  ) {
    return this.get<T>(`${this.basePath}/get/${orgId}`, config)
  }

  async createOrganization<T = unknown>(
    data: CreateOrganizationPayload,
    config?: RequestConfig
  ) {
    return this.post<T>(`${this.basePath}/add`, data, config)
  }
  async updateOrganization<T = unknown>(
    orgId: string,
    data: UpdateOrganizationPayload,
    config?: RequestConfig
  ) {
    return this.put<T>(`${this.basePath}/edit/${orgId}`, data, config)
  }

  async approveOrganization<T = unknown>(
    orgId: string,
    userId: string,
    config?: RequestConfig
  ) {
    return this.put<T>(`${this.basePath}/approved/${orgId}/${userId}`, config)
  }

  async rejectOrganization<T = unknown>(
    orgId: string,
    data: RejectPayload,
    config?: RequestConfig
  ) {
    return this.put<T>(`${this.basePath}/rejected/${orgId}`, data, config)
  }

  async activeOrganization<T = unknown>(
    orgId: string,
    userId: string,
    config?: RequestConfig
  ) {
    return this.put<T>(`${this.basePath}/active/${orgId}/${userId}`, config)
  }
  async inactiveOrganization<T = unknown>(
    orgId: string,
    userId: string,
    config?: RequestConfig
  ) {
    return this.put<T>(`${this.basePath}/inactive/${orgId}/${userId}`, config)
  }
}

export const organizationService = new Organization()
