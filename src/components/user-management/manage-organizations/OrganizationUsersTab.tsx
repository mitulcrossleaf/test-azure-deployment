'use client'
import {
  Badge,
  Button,
  ConfirmationModal,
  DropdownMenu,
  DropdownMenuItem,
  Popup,
  SearchField,
  SectionTitle,
  Table,
} from '@/components/ui'
import { USER_ROLES, USER_STATUS } from '@/constants'

import { useAuth, useSonnar } from '@/context'
import { formatNumber } from '@/helper'
import { userService } from '@/services'
import { OrganizationUsersTabProps } from '@/types/component'
import { ApiError, UserType } from '@/types/services'
import { ColumnDef } from '@tanstack/react-table'
import { useRouter } from 'next/navigation'
import { useCallback, useMemo, useRef, useState } from 'react'
import Skeleton from 'react-loading-skeleton'
import InviteUserToOrg from './InviteUserToOrg'
import DeclinePendingModal from './manage-user/DeclinePendingModal'

const OrganizationUsersTab = ({
  organizationData,
  orgId,
  roles,
  onInviteModeChange,
  isSkeletonLoading,
  fetchOrganizationDetails,
}: OrganizationUsersTabProps) => {
  const { userId, token, userRole } = useAuth()
  const { showSonnar } = useSonnar()

  const [isInviteMode, setIsInviteMode] = useState(false)
  const [showActionsDropdown, setShowActionsDropdown] = useState<number | null>(
    null
  )
  const actionsRefs = useRef<{ [key: number]: HTMLDivElement | null }>({})
  const [isCancelInviteModalOpen, setIsCancelInviteModalOpen] = useState(false)
  const [selectedUserForCancel, setSelectedUserForCancel] =
    useState<UserType | null>(null)
  const [isCancelingInvite, setIsCancelingInvite] = useState(false)
  const [isDeactivateModalOpen, setIsDeactivateModalOpen] = useState(false)
  const [selectedUserForDeactivate, setSelectedUserForDeactivate] =
    useState<UserType | null>(null)
  const [isDeactivatingUser, setIsDeactivatingUser] = useState(false)
  const [isDeclineModalOpen, setIsDeclineModalOpen] = useState(false)

  const [selectedUserForDecline, setSelectedUserForDecline] =
    useState<UserType | null>(null)
  const [isDeclining, setIsDeclining] = useState(false)

  const router = useRouter()
  const [inputValue, setInputValue] = useState<string>('')
  const [searchQuery, setSearchQuery] = useState<string>('')

  const filteredUsers = useMemo(() => {
    let users = organizationData?.users || []

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      users = users.filter(user => {
        return (
          user.firstName?.toLowerCase().includes(query) ||
          user.lastName?.toLowerCase().includes(query) ||
          user.email?.toLowerCase().includes(query) ||
          `${user.firstName || ''} ${user.lastName || ''}`
            .toLowerCase()
            .includes(query)
        )
      })
    }

    // Apply date-based sorting (newest first)
    return users.sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime()
      const dateB = new Date(b.createdAt).getTime()
      return dateB - dateA // Descending order (newest first)
    })
  }, [searchQuery, organizationData?.users])

  const handleInviteClick = () => {
    setIsInviteMode(true)
    if (onInviteModeChange) onInviteModeChange(true)
  }

  const handleCancelInvite = () => {
    setIsInviteMode(false)
    if (onInviteModeChange) onInviteModeChange(false)
  }

  const handleInviteSuccess = () => {
    setIsInviteMode(false)
    if (onInviteModeChange) onInviteModeChange(false)
  }

  const handleCancelInviteClick = (user: UserType) => {
    setSelectedUserForCancel(user)
    setIsCancelInviteModalOpen(true)
    setShowActionsDropdown(null)
  }

  const handleCancelInviteModal = async () => {
    if (!selectedUserForCancel) return

    setIsCancelingInvite(true)
    try {
      // TODO: Implement cancel invitation API call
      console.log(
        'Canceling invitation for user:',
        selectedUserForCancel.userId
      )

      // Close modal and reset state
      setIsCancelInviteModalOpen(false)
      setSelectedUserForCancel(null)
    } catch (error) {
      console.error('Error canceling invitation:', error)
    } finally {
      setIsCancelingInvite(false)
    }
  }

  const handleDeactivateUserClick = (user: UserType) => {
    setSelectedUserForDeactivate(user)
    setIsDeactivateModalOpen(true)
    setShowActionsDropdown(null)
  }
  const handleDeactivateUserModal = useCallback(async () => {
    if (!selectedUserForDeactivate || !token || !userId) return

    setIsDeactivatingUser(true)
    try {
      // deactivate (inactive) user API call
      await userService.inactiveUser(selectedUserForDeactivate.userId, userId)

      showSonnar({
        type: 'information',
        label: 'User deactivated',
        message: (
          <div>
            You&apos;ve deactivated <b>{selectedUserForDeactivate.email}</b>
            <br />
            <br /> An email has been sent to notify the user.
          </div>
        ),
      })
      // Close modal and reset selection
      setIsDeactivateModalOpen(false)
      setSelectedUserForDeactivate(null)
      await fetchOrganizationDetails()
    } catch (error) {
      const apiErr = error as ApiError
      showSonnar({
        type: 'danger',
        label: 'Error',
        message:
          apiErr?.message ?? 'Failed to deactivate user. Please try again.',
      })
      console.error('Deactivate user error:', error)
    } finally {
      setIsDeactivatingUser(false)
    }
  }, [
    token,
    userId,
    selectedUserForDeactivate,
    showSonnar,
    fetchOrganizationDetails,
  ])
  const handleDeclineUserClick = (user: UserType) => {
    setSelectedUserForDecline(user)
    setIsDeclineModalOpen(true)
    setShowActionsDropdown(null)
  }

  const handleCancelDecline = () => {
    setIsDeclineModalOpen(false)
    setSelectedUserForDecline(null)
  }

  const handleDeclineUser = useCallback(
    async (reason: string) => {
      if (!userId || !reason || !token || !selectedUserForDecline) {
        return
      }
      try {
        setIsDeclining(true)
        await userService.rejectUser(selectedUserForDecline?.userId, {
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
        await fetchOrganizationDetails()
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
    [
      showSonnar,
      userId,
      selectedUserForDecline,
      token,
      fetchOrganizationDetails,
    ]
  )

  const columns: ColumnDef<UserType>[] = [
    {
      header: 'Name',
      accessorFn: row => `${row.firstName} ${row.lastName}`,
      id: 'fullName',
    },
    { header: 'Email address', accessorKey: 'email' },
    {
      header: 'Role',
      accessorKey: 'role',
      cell: ({ row }) => row.original.userRoleName || '-',
    },
    {
      header: 'Status',
      accessorKey: 'status',
      cell: ({ row }) => {
        const value = row.original.status
        const appearance =
          value === USER_STATUS.PENDINGAPPROVAL
            ? 'warning'
            : value === USER_STATUS.ACTIVE
              ? 'success'
              : value === USER_STATUS.INVITED
                ? 'success-subtle'
                : 'default-subtle'

        return (
          <Badge
            appearance={appearance}
            size="medium"
            label={
              value === USER_STATUS.PENDINGAPPROVAL
                ? USER_STATUS.PENDING_APPROVAL
                : value
            }
          />
        )
      },
    },
  ]

  if (isInviteMode) {
    return (
      <InviteUserToOrg
        onCancel={handleCancelInvite}
        onSuccess={handleInviteSuccess}
        roles={roles}
        orgId={orgId}
      />
    )
  }

  return (
    <div className="flex flex-col gap-8">
      {organizationData?.users.length === 0 &&
        (isSkeletonLoading ? (
          <Skeleton width={'50%'} height={60} />
        ) : (
          <div className="text-so-color-neutral-950">
            <h2 className="heading-h2-base font-bold">Organization users</h2>
            <p className="text-xl">
              Review and manage this organization&apos;s users
            </p>
          </div>
        ))}

      {organizationData?.users.length === 0 ? (
        isSkeletonLoading ? (
          <Skeleton width={'50%'} height={96} />
        ) : (
          <div className="bg-so-color-neutral-100 my-4 max-w-[594px] rounded-lg p-6">
            <p className="text-so-color-neutral-950 text-base">
              <span className="font-bold">
                {organizationData?.displayName || organizationData?.legalName}
              </span>{' '}
              does not have any assigned users. Please invite a new user to see
              them appear in this pane.
            </p>
          </div>
        )
      ) : (
        <div className="flex flex-col gap-8">
          <SectionTitle
            title="Organization users"
            apperance="h2-md"
            lead
            leadLabel="Review and manage this organization’s users"
            mainClassName="!p-0 !m-0 !max-w-none"
            loading={isSkeletonLoading}
          />

          <div className="flex items-end justify-between gap-5">
            <SearchField
              label={`${filteredUsers.length ? formatNumber(filteredUsers.length) : 'No'} users found`}
              className="max-w-[448px]"
              loading={isSkeletonLoading}
              value={inputValue}
              onChange={(
                value: string | React.ChangeEvent<HTMLInputElement>
              ) => {
                const searchValue =
                  typeof value === 'string' ? value : value.target.value
                setInputValue(searchValue)
                if (!searchValue) setSearchQuery('')
              }}
              onSearch={(value: string) => {
                setSearchQuery(value.toLowerCase())
              }}
            />
            <Button
              label="Invite user"
              appearance="primary"
              className="px-6 font-bold text-nowrap"
              onClick={handleInviteClick}
              isSkeletonLoading={isSkeletonLoading}
            />
          </div>
          {searchQuery && filteredUsers.length === 0 ? (
            <div className="bg-so-color-neutral-100 space-y-8 rounded-2xl p-6">
              <p className="text-so-color-neutral-950 font-raleway text-xl font-bold">
                No results
              </p>
              <p className="text-so-color-neutral-950 font-open-sans text-base">
                No results found for{' '}
                <span className="font-bold break-all">{searchQuery}</span>.
                Please try adjusting your search criteria
              </p>
            </div>
          ) : (
            <Table<UserType>
              columns={columns}
              data={filteredUsers}
              enableSorting={true}
              sortableColumnIds={['fullName', 'status']}
              renderRowActions={(row: UserType, rowIndex: number) => (
                <div
                  ref={el => {
                    actionsRefs.current[rowIndex] = el
                  }}
                  className="relative flex flex-col gap-1"
                >
                  <Button
                    appearance="ghost"
                    label="Actions"
                    semantic="general"
                    iconTrailing={true}
                    className="font-bold"
                    icon={
                      <i className="material-symbols-outlined">
                        keyboard_arrow_down
                      </i>
                    }
                    onClick={() =>
                      setShowActionsDropdown(
                        showActionsDropdown === rowIndex ? null : rowIndex
                      )
                    }
                  />

                  <Popup
                    isOpen={showActionsDropdown === rowIndex}
                    onClose={() => setShowActionsDropdown(null)}
                    position="bottom-left"
                    className="max-w-fit min-w-[200px] border-0 shadow-none"
                    triggerRef={{
                      current: actionsRefs.current[rowIndex] || null,
                    }}
                  >
                    <DropdownMenu>
                      {row?.status === USER_STATUS.INVITED ? (
                        <>
                          <DropdownMenuItem
                            onClick={() => {
                              setShowActionsDropdown(null)
                              // TODO: Implement resend invitation logic
                            }}
                          >
                            Resend invitation
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-so-color-red-700"
                            onClick={() => handleCancelInviteClick(row)}
                          >
                            Cancel invitation
                          </DropdownMenuItem>
                        </>
                      ) : row?.status === USER_STATUS.ACTIVE ? (
                        <>
                          <DropdownMenuItem
                            onClick={() => {
                              setShowActionsDropdown(null)
                              if (userRole === USER_ROLES.ORG_ADMIN) {
                                router.push(
                                  `/manage-organizations-details/users/${row?.userId}`
                                )
                              } else {
                                router.push(
                                  `${row?.organizationId}/users/${row?.userId}`
                                )
                              }
                            }}
                          >
                            Manage user
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-so-color-red-700"
                            onClick={() => handleDeactivateUserClick(row)}
                          >
                            Deactivate user
                          </DropdownMenuItem>
                        </>
                      ) : row?.status === USER_STATUS.PENDINGAPPROVAL ? (
                        <>
                          <DropdownMenuItem
                            onClick={() => {
                              if (userRole === USER_ROLES.ORG_ADMIN) {
                                router.push(
                                  `/manage-organizations-details/users/${row?.userId}`
                                )
                              } else {
                                router.push(
                                  `${row?.organizationId}/users/${row?.userId}`
                                )
                              }
                            }}
                          >
                            Review user
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-so-color-red-700"
                            onClick={() => handleDeclineUserClick(row)}
                          >
                            Decline user
                          </DropdownMenuItem>
                        </>
                      ) : row?.status === USER_STATUS.INACTIVE ? (
                        <DropdownMenuItem
                          onClick={() => {
                            setShowActionsDropdown(null)
                            if (userRole === USER_ROLES.ORG_ADMIN) {
                              router.push(
                                `/manage-organizations-details/users/${row?.userId}`
                              )
                            } else {
                              router.push(
                                `${row?.organizationId}/users/${row?.userId}`
                              )
                            }
                          }}
                        >
                          Manage user
                        </DropdownMenuItem>
                      ) : (
                        <DropdownMenuItem
                          onClick={() => {
                            setShowActionsDropdown(null)
                            if (userRole === USER_ROLES.ORG_ADMIN) {
                              router.push(
                                `/manage-organizations-details/users/${row?.userId}`
                              )
                            } else {
                              router.push(
                                `${row?.organizationId}/users/${row?.userId}`
                              )
                            }
                          }}
                        >
                          Manage user
                        </DropdownMenuItem>
                      )}
                    </DropdownMenu>
                  </Popup>
                </div>
              )}
              loading={isSkeletonLoading}
            />
          )}
        </div>
      )}
      {organizationData?.users && organizationData?.users?.length <= 0 && (
        <Button
          label="Invite user"
          appearance="primary"
          className="w-fit px-6 font-bold text-nowrap"
          onClick={handleInviteClick}
          isSkeletonLoading={isSkeletonLoading}
        />
      )}

      <ConfirmationModal
        confirmButton={{
          label: 'Cancel invite',
          onClick: handleCancelInviteModal,
          appearance: 'destructive',
          isLoading: isCancelingInvite,
          loadingText: 'Canceling...',
        }}
        cancelButton={{
          label: 'Keep invite',
          onClick: () => setIsCancelInviteModalOpen(false),
        }}
        isOpen={isCancelInviteModalOpen}
        onClose={() => setIsCancelInviteModalOpen(false)}
        headerClassName="gap-8"
        description={
          <>
            <p>
              Are you sure you want to cancel the invite for{' '}
              <b>{selectedUserForCancel?.email}</b>?
            </p>
            <p className="mt-3">
              This will invalidate any existing invites sent to this user. If
              you change your mind, you&apos;ll need to send a new invitation
              from scratch.
            </p>
          </>
        }
        title="Cancel invitation"
        isclose={false}
      />

      <ConfirmationModal
        confirmButton={{
          label: 'Deactivate user',
          onClick: handleDeactivateUserModal,
          appearance: 'destructive',
          isLoading: isDeactivatingUser,
          loadingText: 'Deactivating...',
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
              <b>{selectedUserForDeactivate?.email}</b>?
            </p>
            <p className="mt-6">
              This will prevent the user from logging in and accessing Supply
              Ontario applications.
            </p>
          </>
        }
        title="Deactivate user"
        isclose={false}
      />
      {/* <DeclinePendingModal
        isOpen={isDeclineModalOpen}
        onClose={handleCancelDecline}
        handleCancelDecline={handleCancelDecline}
        handleDecline={handleDeclineUser}
        declineText={'user'}
        title="Decline user"
        isSubmitting={isDeclining}
      /> */}
      <DeclinePendingModal
        isOpen={isDeclineModalOpen}
        onClose={handleCancelDecline}
        handleCancelDecline={handleCancelDecline}
        handleDecline={handleDeclineUser}
        declineText={selectedUserForDecline?.email || 'user'}
        title="Decline user"
        isSubmitting={isDeclining}
      />
    </div>
  )
}

export default OrganizationUsersTab
