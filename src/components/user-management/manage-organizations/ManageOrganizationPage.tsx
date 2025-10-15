'use client'
import { Alert, ConfirmationModal, PageTitle, TabsGroup } from '@/components/ui'
import {
  TABS_MANAGE_ORGANIZATION,
  USER_ROLES,
  USER_STATUS,
  getManageOrganizationTabIndex,
  getManageOrganizationTabName,
} from '@/constants'
import { useAuth, useData, useSonnar } from '@/context'
import { organizationService } from '@/services'

import { ApiError, OrganizationType } from '@/types/services'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import {
  ReactNode,
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react'
import OrganizationAccessTab from './OrganizationAccessTab'
import OrganizationProfileTab from './OrganizationProfileTab'
import OrganizationUsersTab from './OrganizationUsersTab'
import { DeclinePendingModal } from './manage-user'

function ManageOrganizationContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const params = useParams()
  const { token, userId, userRole, userDetails } = useAuth()
  const orgId =
    userRole === USER_ROLES.ORG_ADMIN
      ? userDetails?.organizationId || ''
      : (params.orgId as string)
  const { showSonnar } = useSonnar()
  const { roles } = useData()

  const [organizationData, setOrganizationData] =
    useState<OrganizationType | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState(() => {
    const tabParam = searchParams.get('tab')
    return getManageOrganizationTabIndex(tabParam)
  })
  const [isDeclineModalOpen, setIsDeclineModalOpen] = useState(false)
  const [isApproving, setIsApproving] = useState(false)
  const [isInviteMode, setIsInviteMode] = useState(false)
  const [pageAlert, setPageAlert] = useState<{
    title: string
    description?: string | ReactNode
    validationErrors?: string[]
    variant?: 'information' | 'accent' | 'success' | 'warning' | 'destructive'
  } | null>(null)
  const [isDeclining, setIsDeclining] = useState<boolean>(false)
  const [isDeactivating, setIsDeactivating] = useState<boolean>(false)
  const [isActivating, setIsActivating] = useState<boolean>(false)
  const [isDeactivateModalOpen, setIsDeactivateModalOpen] =
    useState<boolean>(false)

  const handleTabChange = (newTab: number) => {
    if (userRole === USER_ROLES.ORG_ADMIN && newTab === 2) {
      return
    }

    setActiveTab(newTab)
    const tabName = getManageOrganizationTabName(newTab)
    if (userRole === USER_ROLES.ORG_ADMIN) {
      router.push(`/manage-organizations-details?tab=${tabName}`, {
        scroll: false,
      })
    } else {
      router.push(`/manage-organizations/${orgId}?tab=${tabName}`, {
        scroll: false,
      })
    }
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 0:
        return (
          <OrganizationProfileTab
            organizationData={organizationData}
            loading={loading}
            onUpdate={fetchOrganizationDetails}
          />
        )
      case 1:
        return (
          <OrganizationUsersTab
            organizationData={organizationData}
            fetchOrganizationDetails={fetchOrganizationDetails}
            orgId={orgId}
            roles={roles}
            isSkeletonLoading={loading}
          />
        )
      case 2:
        return <OrganizationAccessTab onAlert={setPageAlert} />
      default:
        return (
          <OrganizationProfileTab
            organizationData={organizationData}
            loading={loading}
            onUpdate={fetchOrganizationDetails}
          />
        )
    }
  }

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
        ]
      : []),
    {
      collapsed: false,
      active: true,
      crumb: 'Manage organization',
      href: `/manage-organizations/${orgId}`,
    },
  ]

  const fetchOrganizationDetails = useCallback(async () => {
    if (!orgId || !token) return
    try {
      setLoading(true)
      const response =
        await organizationService.getOrganizationDetails<OrganizationType>(
          orgId
        )
      setOrganizationData(response.data)
    } catch (error) {
      const APIError = error as ApiError
      setPageAlert({
        title: 'Error',
        description: APIError.message,
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }, [orgId, token])

  const handleCancelDecline = useCallback(() => {
    setIsDeclineModalOpen(false)
  }, [])

  const handleDeclineOrganization = useCallback(
    async (reason: string) => {
      if (!userId || !reason) {
        return
      }
      try {
        setIsDeclining(true)
        await organizationService.rejectOrganization(orgId, {
          rejectedNote: reason,
          loginUserId: userId,
        })
        setIsDeclineModalOpen(false)
        showSonnar({
          type: 'information',
          label: 'Organization declined',
          message: (
            <div>
              You&apos;ve declined{' '}
              <b>
                {organizationData?.displayName || organizationData?.legalName}.
              </b>{' '}
              <br /> <br />
              An email has been sent to the user with the decline reason.
            </div>
          ),
        })
        router.push('/manage-organizations?tab=pending')
      } catch (error) {
        const APIError = error as ApiError
        showSonnar({
          type: 'danger',
          label: 'Error',
          message:
            APIError.message || 'Failed to decline user. Please try again.',
        })
      } finally {
        setIsDeclining(false)
      }
    },
    [showSonnar, router, userId, orgId, organizationData]
  )

  const handleApproveOrganizationClick = async () => {
    if (!token || !organizationData || !userId) return
    setIsApproving(true)

    try {
      await organizationService.approveOrganization(orgId, userId)
      await fetchOrganizationDetails()

      showSonnar({
        type: 'success',
        label: 'Organization approved',
        message: (
          <div>
            You&apos;ve approved{' '}
            <b>{organizationData.displayName || organizationData?.legalName}</b>
            <br />
            <br /> You can now manage its details, users and access.
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

  const handleDectiveOrganization = useCallback(async () => {
    try {
      if (!token || !userId || !orgId) return
      setIsDeactivating(true)
      await organizationService.inactiveOrganization(orgId, userId)
      showSonnar({
        type: 'information',
        label: 'Organization deactivated',
        message: (
          <div>
            You&apos;ve deactivated{' '}
            <b>
              {organizationData?.displayName || organizationData?.legalName}
            </b>
            <br />
            <br /> An email has been sent to notify the user.
          </div>
        ),
      })
      setIsDeactivateModalOpen(false)
      await fetchOrganizationDetails()
    } catch (error) {
      const apiError = error as ApiError
      showSonnar({
        type: 'danger',
        label: 'Error',
        message:
          apiError.message ??
          `Failed to deactivate organization. Please try again.`,
      })
    } finally {
      setIsDeactivating(false)
    }
  }, [
    organizationData?.displayName,
    organizationData?.legalName,
    token,
    userId,
    orgId,
    fetchOrganizationDetails,
    showSonnar,
  ])

  const handleActivateOrganization = useCallback(async () => {
    try {
      if (!token || !userId || !orgId) return
      setIsActivating(true)
      await organizationService.activeOrganization(orgId, userId)
      showSonnar({
        type: 'success',
        label: 'Organization activated',
        message: (
          <div>
            You&apos;ve re-activated{' '}
            <b>
              {organizationData?.displayName || organizationData?.legalName}
            </b>
            <br />
            <br /> You can now manage its users and access.
          </div>
        ),
      })
      await fetchOrganizationDetails()
    } catch (error) {
      const apiError = error as ApiError
      showSonnar({
        type: 'danger',
        label: 'Error',
        message:
          apiError.message ??
          `Failed to deactivate organization. Please try again.`,
      })
    } finally {
      setIsActivating(false)
    }
  }, [
    organizationData?.displayName,
    organizationData?.legalName,
    token,
    userId,
    orgId,
    fetchOrganizationDetails,
    showSonnar,
  ])

  const tabsToShow = useMemo(() => {
    let tabs = TABS_MANAGE_ORGANIZATION

    if (
      (organizationData?.status === USER_STATUS.PENDINGAPPROVAL ||
        organizationData?.status === USER_STATUS.INACTIVE) &&
      TABS_MANAGE_ORGANIZATION.length > 0
    ) {
      tabs = [TABS_MANAGE_ORGANIZATION[0]!]
    } else if (userRole === USER_ROLES.ORG_ADMIN) {
      tabs = TABS_MANAGE_ORGANIZATION.filter((_, index) => index !== 2)
    }

    return tabs.filter(Boolean).map(tab => ({
      label: tab!.label,
      iconLeading: tab!.iconLeading,
    }))
  }, [organizationData?.status, userRole])

  useEffect(() => {
    const fetchData = async () => {
      try {
        await fetchOrganizationDetails()
      } catch (error) {
        console.log(error)
      }
    }
    fetchData()
  }, [fetchOrganizationDetails])

  useEffect(() => {
    const tabParam = searchParams.get('tab')
    const tabIndex = getManageOrganizationTabIndex(tabParam)

    if (userRole === USER_ROLES.ORG_ADMIN && tabIndex === 2) {
      setActiveTab(0)
      router.push(`/manage-organizations/${orgId}?tab=profile`, {
        scroll: false,
      })
      return
    }

    setActiveTab(tabIndex)
  }, [searchParams, userRole, orgId, router])

  return (
    <>
      <PageTitle
        title={
          isInviteMode
            ? 'Invite user'
            : organizationData?.displayName ||
              organizationData?.legalName ||
              'Loading...'
        }
        lead={
          isInviteMode
            ? `Invite a new user to ${organizationData?.displayName || organizationData?.legalName}`
            : 'Manage organization'
        }
        breadcrumbs={true}
        variant={isInviteMode ? 'standard' : 'profile'}
        crumbs={crumbs}
        status={
          organizationData
            ? organizationData?.status === USER_STATUS.PENDINGAPPROVAL
              ? USER_STATUS.PENDING_APPROVAL
              : organizationData?.status
            : ''
        }
        loading={loading}
        handleDective={() => setIsDeactivateModalOpen(true)}
        handleActivate={handleActivateOrganization}
        isActionBtnLoading={isDeactivating || isActivating}
      />
      {pageAlert && (
        <div className="container py-6">
          <Alert
            title={pageAlert.title}
            description={pageAlert.description}
            validationErrors={pageAlert.validationErrors}
            variant={pageAlert.variant || 'information'}
          />
        </div>
      )}

      <div className="container space-y-8 py-8">
        {userRole === USER_ROLES.ORG_ADMIN &&
          organizationData?.status === USER_STATUS.INACTIVE && (
            <Alert
              title="Organization is inactive"
              variant="information"
              description="Your organization’s is currently set to inactive. Please contact Supply Ontario for help."
              primaryAction={{
                label: 'Get help',
                appearance: 'ghost',
                onClick: () => {},
                loading: false,
                disabled: false,
                loadingText: 'Loading...',
              }}
              loading={loading}
            />
          )}
        {organizationData?.status === USER_STATUS.PENDINGAPPROVAL && (
          <Alert
            title="Organization pending approval"
            variant="warning"
            description="This organization’s is pending approval. Please review the details below and choose to either approve or decline the request."
            primaryAction={{
              label: 'Approve',
              appearance: 'primary',
              onClick: handleApproveOrganizationClick,
              className: 'px-6',
              loading: isApproving,
              disabled: isApproving,
              loadingText: 'Approving...',
            }}
            secondaryAction={{
              label: 'Decline',
              appearance: 'destructive-ghost',
              onClick: () => setIsDeclineModalOpen(true),
            }}
            loading={loading}
          />
        )}
        {!isInviteMode && (
          <TabsGroup
            tabs={tabsToShow}
            onTabChange={handleTabChange}
            defaultActiveTab={activeTab}
            loading={loading}
          />
        )}
        <div>
          {activeTab === 1 ? (
            <OrganizationUsersTab
              organizationData={organizationData}
              fetchOrganizationDetails={fetchOrganizationDetails}
              orgId={orgId}
              roles={roles}
              onInviteModeChange={setIsInviteMode}
              isSkeletonLoading={loading}
            />
          ) : (
            renderTabContent()
          )}
        </div>
      </div>
      <DeclinePendingModal
        isOpen={isDeclineModalOpen}
        onClose={handleCancelDecline}
        handleCancelDecline={handleCancelDecline}
        handleDecline={handleDeclineOrganization}
        declineText={organizationData?.legalName || 'organization'}
        title="Decline organization"
        isSubmitting={isDeclining}
      />
      <ConfirmationModal
        confirmButton={{
          label: 'Deactivate organization',
          onClick: () => handleDectiveOrganization(),
          appearance: 'destructive',
          isLoading: isDeactivating,
          loadingText: 'Loading...',
        }}
        cancelButton={{
          label: 'Cancel',
          onClick: () => setIsDeactivateModalOpen(false),
        }}
        isOpen={isDeactivateModalOpen}
        onClose={() => setIsDeactivateModalOpen(false)}
        headerClassName="gap-8"
        description={
          <>
            <p>
              Are you sure you want to deactivate{' '}
              <b>
                {organizationData?.displayName || organizationData?.legalName}
              </b>
              ?
            </p>
            <p className="mt-3">
              This will prevent users from logging in and accessing its
              resources.
            </p>
          </>
        }
        title="Deactivate organization"
        isclose={false}
      />
    </>
  )
}

export default function ManageOrganizationPage() {
  return (
    <Suspense>
      <ManageOrganizationContent />
    </Suspense>
  )
}
