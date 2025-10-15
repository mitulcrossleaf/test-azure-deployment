'use client'
import { USER_ROLES } from '@/constants'
import { useAuth } from '@/context'
import { getDayDifferenceLabel } from '@/helper'
import { cn } from '@/lib/utils'
import { AppNotification } from '@/types/services/notification.type'
import { useRouter } from 'next/navigation'
import { useMemo, useRef, useState } from 'react'
import Skeleton from 'react-loading-skeleton'
import Badge from './Badge'
import BreadCrumbs from './BreadCrumbs'
import Button from './Button'
import DropdownMenu, { DropdownMenuItem } from './DropdownMenu'
import Popup from './Popup'

export type PageTitleProps = {
  breadcrumbs?: boolean
  backButton?: boolean
  title: string
  className?: string
  lead?: string | null
  variant: 'dashboard' | 'standard' | 'profile'
  semantic?: 'general' | 'buyer' | 'vendor'
  crumbs?: Array<{
    collapsed: boolean
    active: boolean
    crumb: string
    href: string
  }>
  status?: string
  loading?: boolean
  entityType?: 'organization' | 'user'
  handleDective?: () => Promise<void> | void
  handleActivate?: () => Promise<void> | void
  isActionBtnLoading?: boolean
  notifications?: AppNotification[]
  handleNotificationClick?: (item: AppNotification) => Promise<void> | void
}

const PageTitle = ({
  breadcrumbs = false,
  backButton = false,
  title,
  lead,
  variant = 'standard',
  crumbs = [],
  className,
  semantic,
  status,
  loading = false,
  entityType = 'organization',
  handleDective,
  handleActivate,
  isActionBtnLoading,
  notifications = [],
  handleNotificationClick,
}: PageTitleProps) => {
  const { userRole } = useAuth()
  const router = useRouter()
  const [showNotifications, setShowNotifications] = useState(false)
  const [showActionsDropdown, setShowActionsDropdown] = useState(false)

  const notificationRef = useRef<HTMLDivElement | null>(null)
  const actionsRef = useRef<HTMLDivElement | null>(null)

  const ACTIONS_ITEMS = [
    {
      label: 'Profile',
      onClick: () => {
        setShowActionsDropdown(false)
      },
    },
    {
      label: 'Account Settings',
      onClick: () => {
        setShowActionsDropdown(false)
      },
    },
    {
      label: 'Reporting',
      onClick: () => {
        setShowActionsDropdown(false)
      },
    },
    {
      label: 'Catalogue',
      onClick: () => {
        setShowActionsDropdown(false)
      },
    },
  ]
  const ACTIONS_ITEMS_ACTIVE = [
    {
      label: `Deactivate ${entityType === 'user' ? 'User' : 'Organization'}`,
      onClick: async () => {
        setShowActionsDropdown(false)
        // await handleInactiveEntityClick()
        if (handleDective) await handleDective()
      },
    },
  ]
  const ACTIONS_ITEMS_INACTIVE = [
    {
      label: `Reactivate ${entityType === 'user' ? 'User' : 'Organization'}`,
      onClick: async () => {
        setShowActionsDropdown(false)
        // await handleActiveEntityClick()
        if (handleActivate) await handleActivate()
      },
    },
  ]

  const textColorClass = useMemo(
    () =>
      semantic === 'buyer' || semantic === 'vendor' || semantic === 'general'
        ? 'text-white'
        : 'text-neutral-950',
    [semantic]
  )

  return (
    <div className={cn('container space-y-8 py-8', className)}>
      {backButton && (
        <Button
          appearance="ghost"
          semantic="general"
          label="Back"
          iconLeading={true}
          className={cn('font-bold', textColorClass)}
          onClick={() => {
            if (backButton) {
              router.back()
            }
          }}
          icon={
            <i className="material-symbols-outlined !text-2xl">arrow_back</i>
          }
          isSkeletonLoading={loading}
        />
      )}
      {breadcrumbs && (
        <BreadCrumbs
          appearance="default"
          crumbs={crumbs}
          semantic={semantic}
          loading={loading}
        />
      )}
      <div className="flex flex-wrap items-center justify-between gap-5">
        <div className={cn('flex-1 space-y-2', textColorClass)}>
          <h1 className="font-raleway text-3xl font-bold sm:text-4xl">
            {loading ? (
              <Skeleton className="w-[80%] sm:w-[40%]" height={40} />
            ) : (
              title
            )}
          </h1>
          {lead && (
            <p className="body-2xl font-open-sans">
              {loading ? <Skeleton width="60%" height={32} /> : lead}
            </p>
          )}
          {loading ? (
            <Skeleton className="!w-[40%] sm:!w-[10%]" height={32} />
          ) : (
            status && (
              <Badge
                appearance={
                  status.toLowerCase() === 'active'
                    ? 'success'
                    : status.toLowerCase() === 'inactive'
                      ? 'default-subtle'
                      : 'warning'
                }
                label={status}
              />
            )
          )}
        </div>
        {variant === 'dashboard' ? (
          <div ref={notificationRef} className="relative flex flex-col gap-1">
            <Button
              appearance="ghost"
              label={`${notifications.length} Notifications`}
              semantic="general"
              iconLeading={true}
              onClick={() => setShowNotifications(!showNotifications)}
              icon={
                <i className="material-symbols-outlined">
                  notifications_unread
                </i>
              }
              isSkeletonLoading={loading}
            />

            <Popup
              isOpen={showNotifications}
              onClose={() => setShowNotifications(false)}
              position="bottom-left"
              className="w-[560px] space-y-6 p-6 pb-0"
              triggerRef={notificationRef}
            >
              <div className="flex items-center justify-between">
                <h3 className="text-so-color-neutral-950 text-xl font-bold">
                  Notifications
                </h3>
              </div>
              <div className="custom-scrollbar h-[464px] overflow-y-auto pr-6">
                <div className="space-y-6">
                  {notifications.reverse().map((item, index) => (
                    <div
                      key={index}
                      className={cn(
                        'border-so-color-neutral-200 flex items-center justify-between gap-2 pb-6',
                        index === notifications.length - 1
                          ? 'border-b-0'
                          : 'border-b'
                      )}
                    >
                      <div className="space-y-2">
                        <p className="text-so-color-neutral-600 font-open-sans flex items-center gap-2 text-base">
                          <span
                            className={cn(
                              'bg-so-color-persona-general-600 size-2 rounded-full',
                              item?.isViewed && 'bg-so-color-neutral-200'
                            )}
                          />
                          {getDayDifferenceLabel(item?.createdAt)}
                        </p>
                        <div>
                          <p className="text-so-color-neutral-950 text-lg font-bold">
                            {item?.notificationType === 'organization_creation'
                              ? 'New organization request'
                              : 'New user request'}
                          </p>
                          <p
                            className="text-so-color-neutral-950 font-open-sans [&_span]:text-so-color-persona-general-600 text-base font-normal [&_span]:underline"
                            dangerouslySetInnerHTML={{
                              __html: item?.inAppMessage?.replace(
                                /\(([^)]+)\)/,
                                '<span>$1</span>'
                              ),
                            }}
                          />
                        </div>
                      </div>

                      <Button
                        appearance="outline"
                        semantic="general"
                        label="Review"
                        className="px-6"
                        onClick={() => handleNotificationClick?.(item)}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </Popup>
          </div>
        ) : (
          userRole !== USER_ROLES.ORG_ADMIN &&
          variant === 'profile' &&
          status !== 'Pending approval' && (
            <div ref={actionsRef} className="relative flex flex-col gap-1">
              {loading ? (
                <Skeleton width={116} height={48} />
              ) : (
                <Button
                  appearance="ghost"
                  label={'Actions'}
                  semantic="general"
                  iconTrailing={true}
                  className="font-bold"
                  icon={
                    <i className="material-symbols-outlined">
                      keyboard_arrow_down
                    </i>
                  }
                  onClick={() =>
                    !isActionBtnLoading &&
                    setShowActionsDropdown(!showActionsDropdown)
                  }
                  disabled={isActionBtnLoading}
                />
              )}
              <Popup
                isOpen={showActionsDropdown}
                onClose={() => setShowActionsDropdown(false)}
                position="bottom-left"
                className="w-full max-w-[280px] border-0 shadow-none"
                triggerRef={actionsRef}
              >
                <DropdownMenu>
                  {status?.toLowerCase() === 'active'
                    ? ACTIONS_ITEMS_ACTIVE.map(item => (
                        <DropdownMenuItem
                          key={item.label}
                          onClick={item.onClick}
                        >
                          {item.label}
                        </DropdownMenuItem>
                      ))
                    : status?.toLowerCase() === 'inactive'
                      ? ACTIONS_ITEMS_INACTIVE.map(item => (
                          <DropdownMenuItem
                            key={item.label}
                            onClick={item.onClick}
                          >
                            {item.label}
                          </DropdownMenuItem>
                        ))
                      : ACTIONS_ITEMS.map(item => (
                          <DropdownMenuItem
                            key={item.label}
                            onClick={item.onClick}
                          >
                            {item.label}
                          </DropdownMenuItem>
                        ))}
                </DropdownMenu>
              </Popup>
            </div>
          )
        )}
      </div>
    </div>
  )
}

export default PageTitle
