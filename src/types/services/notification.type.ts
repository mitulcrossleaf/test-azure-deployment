export type AppNotification = {
  appNotificationId: string
  notificationType: 'organization_creation'
  notificationFor: 'In App'
  notificationTo: string
  userId: string
  userRole: string
  recordId: string
  organizationId: string
  isViewed: boolean
  emailSubject: string | null
  emailText: string | null
  inAppMessage: string
  recordCreatedAt: string
  createdAt: string
  createdBy: string
  modifiedAt: string
  modifiedBy: string | null
}
