import { RequestConfig } from '@/types/services'
import BaseAPIService from './api.service'

class Notification extends BaseAPIService {
  private readonly basePath = '/app_notification'

  async getAllNotifications<T = unknown>(
    userId: string,
    config?: RequestConfig
  ) {
    return this.get<T>(`${this.basePath}/get_user/${userId}`, config)
  }
  async setViewed<T = unknown>(notificationId: string, config?: RequestConfig) {
    return this.put<T>(`${this.basePath}/viewed/${notificationId}`, config)
  }
}
export const notificationService = new Notification()
