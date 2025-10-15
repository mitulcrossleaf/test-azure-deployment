'use client'
import { Alert, ConfirmationModal, PageTitle, TabsGroup } from '@/components/ui'

import {
  TABS_MANAGE_ORGANIZATION_MANAGE_USER_ORG_ADMIN,
  USER_ROLES,
  USER_STATUS,
  getManageUserTabIndex,
  getManageUserTabName,
} from '@/constants'
import { useAuth, useSonnar } from '@/context'
import { userService } from '@/services'
import { ApiError, UserType } from '@/types/services'
import dynamic from 'next/dynamic'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import { useCallback, useEffect, useMemo, useState } from 'react'
import OrganizationUserAccessTab from './OrganizationUserAccessTab'
import OrganizationUserProfileSkeleton from './OrganizationUserProfileSkeleton'
import OrganizationUserProfileTab from './OrganizationUserProfileTab'

const DeclinePendingModal = dynamic(() => import('./DeclinePendingModal'), {
  ssr: false,
})

function ManageUserContent() {
  const params = useParams()
  const currentUserId = params.id as string
  const router = useRouter()
  const searchParams = useSearchParams()
  const { showSonnar } = useSonnar()
  const { userId, token, userRole } = useAuth()
  const [activeTab, setActiveTab] = useState(() => {
    const tabParam = searchParams.get('tab')
    return getManageUserTabIndex(tabParam)
  })
  const [isDeclining, setIsDeclining] = useState(false)
  const [isDeclineModalOpen, setIsDeclineModalOpen] = useState(false)
  const [userData, setUserData] = useState<UserType | null>()
  const [loading, setLoading] = useState(true)
  const [isApproving, setIsApproving] = useState(false)
  const [isDeactivating, setIsDeactivating] = useState<boolean>(false)
  const [isActivating, setIsActivating] = useState<boolean>(false)
  const [isDeactivateUserModal, setIsDeactivateUserModal] =
    useState<boolean>(false)

  const crumbs = [
    {
      collapsed: false,
      active: false,
      crumb: 'Dashboard',
      href: '/',
    },
    ...(userRole !== USER_ROLES.ORG_ADMIN
      ? [
          {
            collapsed: false,
            active: false,
            crumb: 'Manage organizations',
            href: '/manage-organizations',
          },
          {
            collapsed: false,
            active: false,
            crumb: 'Manage organization',
            href: `/manage-organizations/${userData?.organizationId}`,
          },
        ]
      : [
          {
            collapsed: false,
            active: false,
            crumb: 'Manage organization',
            href: '/manage-organizations-details',
          },
        ]),
    {
      collapsed: false,
      active: true,
      crumb: 'Manage user',
      href: `/manage-organizations/${userData?.organizationId}/users/${currentUserId}`,
    },
  ]

  const handleTabChange = (newTab: number) => {
    setActiveTab(newTab)
    const tabName = getManageUserTabName(newTab)
    if (userRole === USER_ROLES.ORG_ADMIN) {
      router.push(
        `/manage-organizations-details/users/${currentUserId}?tab=${tabName}`,
        {
          scroll: false,
        }
      )
    } else {
      router.push(
        `/manage-organizations/${userData?.organizationId}/users/${currentUserId}?tab=${tabName}`,
        {
          scroll: false,
        }
      )
    }
  }
  const renderTabContent = () => {
    return activeTab === 0 ? (
      <>
        {loading ? (
          <OrganizationUserProfileSkeleton />
        ) : (
          <OrganizationUserProfileTab
            key="profile"
            userData={userData}
            onUpdate={() => fetchUserDetails()}
          />
        )}
      </>
    ) : (
      <OrganizationUserAccessTab key="access" userData={userData!} />
    )
  }

  const tabsToShow = useMemo(() => {
    const tabs =
      (userData?.status === USER_STATUS.PENDINGAPPROVAL ||
        userData?.status === USER_STATUS.INACTIVE) &&
      TABS_MANAGE_ORGANIZATION_MANAGE_USER_ORG_ADMIN.length > 0
        ? [TABS_MANAGE_ORGANIZATION_MANAGE_USER_ORG_ADMIN[0]]
        : TABS_MANAGE_ORGANIZATION_MANAGE_USER_ORG_ADMIN

    return tabs
      .map((tab, index) => {
        if (!tab) return null
        return {
          label: tab.label,
          iconLeading: tab.iconLeading,
          onClick: () => setActiveTab(index),
        }
      })
      .filter(Boolean) as Array<{
      label: string
      iconLeading: React.ReactNode
      onClick: () => void
    }>
  }, [userData?.status])

  const handleApproveUserClick = async () => {
    if (!token || !userData || !userId) return
    setIsApproving(true)

    try {
      await userService.approveUser(userData?.userId, userId)
      await fetchUserDetails()

      showSonnar({
        type: 'success',
        label: 'User approved',
        message: (
          <div>
            You&apos;ve approved <b>{userData?.email}.</b> <br /> <br /> The
            user will receive an email with instructions to get started. You can
            now continue to manage user access.
          </div>
        ),
      })
    } catch (error) {
      const APIError = error as ApiError
      showSonnar({
        type: 'danger',
        label: 'Error',
        message: APIError.message,
      })
    } finally {
      setIsApproving(false)
    }
  }

  const handleUsePendingDecline = useCallback(() => {
    setIsDeclineModalOpen(true)
  }, [])

  const handleCancelDecline = useCallback(() => {
    setIsDeclineModalOpen(false)
  }, [])

  const handleDeclineUser = useCallback(
    async (reason: string) => {
      if (!userId || !reason || !token) {
        return
      }
      try {
        setIsDeclining(true)

        await userService.rejectUser(currentUserId, {
          rejectedNote: reason,
          loginUserId: userId,
        })

        setIsDeclineModalOpen(false)
        showSonnar({
          label: 'User declined',
          type: 'information',
          message: (
            <div>
              You&apos;ve declined <b>madelyn@sickkids.ca.</b> <br /> <br />
              An email has been sent to the user with the decline reason.
            </div>
          ),
        })
        router.push(
          `/manage-organizations/${userData?.organizationId}?tab=users`
        )
      } catch (error) {
        const APIError = error as ApiError
        showSonnar({
          type: 'danger',
          label: 'Error',
          message: APIError.message,
        })
      } finally {
        setIsDeclining(false)
      }
    },
    [showSonnar, router, userId, userData, token, currentUserId]
  )

  const fetchUserDetails = useCallback(async () => {
    if (!currentUserId || !token) return
    try {
      setLoading(true)
      const response = await userService.getUserById<UserType>(currentUserId)
      setUserData(response.data)
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
  }, [currentUserId, token, showSonnar])

  const handleDectiveUser = useCallback(async () => {
    try {
      if (!token || !userData || !userId) return
      setIsDeactivating(true)
      await userService.inactiveUser(userData?.userId, userId)
      showSonnar({
        type: 'information',
        label: 'User deactivated',
        message: (
          <div>
            You&apos;ve deactivated <b>{userData?.email}</b>
            <br />
            <br /> An email has been sent to notify the user.
          </div>
        ),
      })
      setIsDeactivateUserModal(false)
      await fetchUserDetails()
    } catch (error) {
      const APIError = error as ApiError
      showSonnar({
        type: 'danger',
        label: 'Error',
        message:
          APIError?.message ?? 'Failed to deactivate user. Please try again.',
      })
    } finally {
      setIsDeactivating(false)
    }
  }, [fetchUserDetails, token, userData, userId, showSonnar])

  const handleActivateUser = useCallback(async () => {
    try {
      if (!token || !userData || !userId) return
      setIsActivating(true)
      await userService.activeUser(userData?.userId, userId)
      showSonnar({
        type: 'success',
        label: 'User activated',
        message: (
          <div>
            You&apos;ve activated <b>{userData?.email}</b>
            <br />
            <br /> You can now manage its details and access.
          </div>
        ),
      })
      setIsDeactivateUserModal(false)
      await fetchUserDetails()
    } catch (error) {
      const APIError = error as ApiError
      showSonnar({
        type: 'danger',
        label: 'Error',
        message:
          APIError?.message ?? 'Failed to activate user. Please try again.',
      })
    } finally {
      setIsActivating(false)
    }
  }, [fetchUserDetails, token, userData, userId, showSonnar])

  useEffect(() => {
    fetchUserDetails()
  }, [fetchUserDetails])

  useEffect(() => {
    const tabParam = searchParams.get('tab')
    if (tabParam) {
      const tabIndex = getManageUserTabIndex(tabParam)
      setActiveTab(tabIndex)
    }
  }, [searchParams])
  return (
    <div>
      <PageTitle
        title={`${userData?.firstName} ${userData?.lastName}`}
        lead={userData?.userRoleName}
        breadcrumbs={true}
        variant={'profile'}
        crumbs={crumbs}
        status={
          userData?.status === USER_STATUS.PENDINGAPPROVAL
            ? USER_STATUS.PENDING_APPROVAL
            : userData?.status
        }
        loading={loading}
        entityType="user"
        handleDective={() => setIsDeactivateUserModal(true)}
        handleActivate={handleActivateUser}
        isActionBtnLoading={isDeactivating || isActivating}
      />
      <div className="container space-y-8 py-8">
        {userRole === USER_ROLES.ORG_ADMIN && userData?.isOnlyAContact && (
          <Alert
            title="Contact only"
            variant="information"
            description={
              <p>
                This user is set as a contact only. To manage their access, turn
                off the <b>“Contact only”</b> setting first.
              </p>
            }
            loading={loading}
          />
        )}
        {userData?.status === USER_STATUS.PENDINGAPPROVAL && (
          <Alert
            title="User pending approval"
            variant="warning"
            description="This organization's is pending approval. Please review the details below and choose to either approve or decline the request."
            primaryAction={{
              label: 'Approve',
              appearance: 'primary',
              onClick: handleApproveUserClick,
              className: 'px-6',
              loading: isApproving,
              disabled: isApproving,
              loadingText: 'Approving...',
            }}
            secondaryAction={{
              label: 'Decline',
              appearance: 'destructive-ghost',
              onClick: handleUsePendingDecline,
            }}
            loading={loading}
          />
        )}
        <div className="space-y-6">
          <TabsGroup
            tabs={tabsToShow}
            onTabChange={handleTabChange}
            defaultActiveTab={activeTab}
            loading={loading}
          />
          {renderTabContent()}
        </div>

        <DeclinePendingModal
          isOpen={isDeclineModalOpen}
          onClose={handleCancelDecline}
          handleCancelDecline={handleCancelDecline}
          handleDecline={handleDeclineUser}
          declineText={userData?.email || 'user'}
          title="Decline user"
          isSubmitting={isDeclining}
        />
        <ConfirmationModal
          confirmButton={{
            label: 'Deactivate user',
            onClick: () => handleDectiveUser(),
            appearance: 'destructive',
            isLoading: isDeactivating,
            loadingText: 'Loading...',
          }}
          cancelButton={{
            label: 'Cancel',
            onClick: () => setIsDeactivateUserModal(false),
          }}
          isOpen={isDeactivateUserModal}
          onClose={() => setIsDeactivateUserModal(false)}
          headerClassName="gap-8"
          description={
            <>
              <p>
                Are you sure you want to deactivate <b>{userData?.email}</b>?
              </p>
              <p className="mt-3">
                This will prevent the user from logging in and accessing Supply
                Ontario applications.
              </p>
            </>
          }
          title="Deactivate user"
          isclose={false}
        />
      </div>
    </div>
  )
}

export default ManageUserContent
