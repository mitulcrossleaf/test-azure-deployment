'use client'
import { PageTitle, SectionTitle, StandardCard } from '@/components/ui'
import {
  DASHBOARD_CARDS_ORG_ADMIN,
  DASHBOARD_CARDS_SO_ADMIN,
  DASHBOARD_CARDS_SO_SYSTEM_ADMIN,
  USER_ROLES,
} from '@/constants'
import { useAuth, useSonnar } from '@/context'
import { notificationService } from '@/services'
import { ApiError } from '@/types/services'
import { AppNotification } from '@/types/services/notification.type'
import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'
const Dashboard = () => {
  const { account, userRole, token, userId } = useAuth()
  const [notifications, setNotifications] = useState<AppNotification[]>([])
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { showSonnar } = useSonnar()
  const fetchNotifications = useCallback(async () => {
    if (!token || !userId) return
    try {
      setLoading(true)
      const response =
        await notificationService.getAllNotifications<AppNotification[]>(userId)
      setNotifications(response.data)
    } catch (error) {
      const APIError = error as ApiError
      showSonnar({
        type: 'danger',
        label: 'Error',
        message: APIError.message,
      })
    } finally {
      setLoading(false)
    }
  }, [token, userId, showSonnar])

  const handleNotificationClick = async (item: AppNotification) => {
    if (item.notificationType === 'organization_creation') {
      router.push(`/manage-organizations/${item.organizationId}`)
    } else {
      router.push(
        `/manage-organizations/${item.organizationId}/users/${item.userId}`
      )
    }
    try {
      await notificationService.setViewed(item.appNotificationId)
    } catch (error) {
      const APIError = error as ApiError
      showSonnar({
        type: 'danger',
        label: 'Error',
        message: APIError.message,
      })
    }
  }

  useEffect(() => {
    fetchNotifications()
  }, [fetchNotifications])
  return (
    <div className="bg-white sm:min-h-[calc(100vh-150px)]">
      <div className="space-y-8">
        <PageTitle
          title="Supply Ontario Dashboard"
          lead={`Hello, ${account?.name}`}
          breadcrumbs={true}
          variant="dashboard"
          crumbs={[
            {
              collapsed: false,
              active: true,
              crumb: 'Dashboard',
              href: '/',
            },
          ]}
          notifications={notifications}
          handleNotificationClick={handleNotificationClick}
          loading={loading}
        />
      </div>

      <div>
        <SectionTitle apperance="h2-lg" title="I want to" loading={loading} />
        <div className="container py-8">
          {userRole === USER_ROLES.SO_ADMIN && (
            <div className="grid w-full gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {DASHBOARD_CARDS_SO_ADMIN.map(card => (
                <StandardCard
                  key={card?.id}
                  apperance="clickable"
                  title={card.title}
                  description={card.description}
                  icon={card.icon}
                  id={card.id}
                  loading={loading}
                  href={card.href}
                />
              ))}
            </div>
          )}

          {userRole === USER_ROLES.ORG_ADMIN && (
            <div className="grid w-full gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {DASHBOARD_CARDS_ORG_ADMIN.map(card => (
                <StandardCard
                  key={card?.id}
                  apperance="clickable"
                  title={card.title}
                  description={card.description}
                  icon={card.icon}
                  id={card.id}
                  loading={loading}
                  href={card.href}
                />
              ))}
            </div>
          )}

          {userRole === USER_ROLES.SO_SYSTEM_ADMIN && (
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {DASHBOARD_CARDS_SO_SYSTEM_ADMIN.map(card => (
                <StandardCard
                  key={card?.id}
                  apperance="clickable"
                  title={card.title}
                  description={card.description}
                  icon={card.icon}
                  id={card.id}
                  loading={loading}
                  href={card.href}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Dashboard
