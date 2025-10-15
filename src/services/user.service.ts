import {
  InviteUserPayload,
  RejectPayload,
  RequestConfig,
  UpdateUserPayload,
} from '@/types/services'
import BaseAPIService from './api.service'

class User extends BaseAPIService {
  private readonly basePath = '/user'

  async inviteUser<T = unknown>(
    body: InviteUserPayload,
    config?: RequestConfig
  ) {
    return this.post<T>(`${this.basePath}/add`, body, config)
  }

  async getUserByEmail<T = unknown>(email: string, config?: RequestConfig) {
    const encodedEmail = encodeURIComponent(email)
    return this.get<T>(`${this.basePath}/getbyemail/${encodedEmail}`, config)
  }

  async approveUser<T = unknown>(
    userId: string,
    loginUserId: string,
    config?: RequestConfig
  ) {
    return this.put<T>(
      `${this.basePath}/approved/${userId}/${loginUserId}`,
      config
    )
  }

  async rejectUser<T = unknown>(
    userId: string,
    data: RejectPayload,
    config?: RequestConfig
  ) {
    return this.put<T>(`${this.basePath}/rejected/${userId}`, data, config)
  }

  async getUserById<T = unknown>(userId: string, config?: RequestConfig) {
    return this.get<T>(`${this.basePath}/get/${userId}`, config)
  }
  async updateUser<T = unknown>(
    userId: string,
    data: UpdateUserPayload,
    config?: RequestConfig
  ) {
    return this.put<T>(`${this.basePath}/edit/${userId}`, data, config)
  }

  async activeUser<T = unknown>(
    userId: string,
    loginUserId: string,
    config?: RequestConfig
  ) {
    return this.put<T>(
      `${this.basePath}/active/${userId}/${loginUserId}`,
      config
    )
  }

  async inactiveUser<T = unknown>(
    userId: string,
    loginUserId: string,
    config?: RequestConfig
  ) {
    return this.put<T>(
      `${this.basePath}/inactive/${userId}/${loginUserId}`,
      config
    )
  }
}

export const userService = new User()
