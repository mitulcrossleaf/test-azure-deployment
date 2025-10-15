'use client'
import {
  Badge,
  Button,
  ConfirmationModal,
  DropdownMenu,
  DropdownMenuItem,
  PageTitle,
  Popup,
  SearchField,
  Table,
  TabsGroup,
} from '@/components/ui'
import {
  MANAGE_ORGANIZATIONS_TAB_NAMES,
  TABS_MANAGE_ORGANIZATIONS,
  USER_STATUS,
  getManageOrganizationsTabIndex,
  getManageOrganizationsTabName,
} from '@/constants'
import { useAuth, useSonnar } from '@/context'
import { formatNumber, transformAllOrg } from '@/helper'
import { organizationService } from '@/services'
import { AllOrgType, ApiError, OrganizationType } from '@/types/services'
import { ColumnDef } from '@tanstack/react-table'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import {
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'

const getColumns = (isPendingTab: boolean): ColumnDef<AllOrgType>[] => {
  const baseColumns: ColumnDef<AllOrgType>[] = [
    { header: 'Organization name', accessorKey: 'name' },
    { header: 'Type', accessorKey: 'type' },
  ]

  if (isPendingTab) {
    baseColumns.push({
      id: 'submittedDate',
      header: 'Submitted',
      accessorKey: 'createdAt',
      cell: ({ getValue }) => {
        const date = new Date(getValue() as string)
        return date.toLocaleDateString()
      },
    })
  }

  baseColumns.push({
    header: 'Status',
    accessorKey: 'status',
    cell: ({ getValue }) => {
      const value = String(getValue()) as AllOrgType['status']
      const appearance =
        value === USER_STATUS.ACTIVE
          ? 'success'
          : value === USER_STATUS.INVITED
            ? 'success-subtle'
            : value === USER_STATUS.PENDING_APPROVAL
              ? 'warning'
              : 'default-subtle'
      return (
        <Badge
          appearance={appearance}
          size="medium"
          label={value}
          className="text-nowrap"
        />
      )
    },
  })

  baseColumns.push({
    id: 'actions',
    cell: () => <div className="w-0"></div>,
  })

  return baseColumns
}

const ManageOrganizationsContent = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { token, userId } = useAuth()
  const { showSonnar } = useSonnar()

  const [activeTab, setActiveTab] = useState(() => {
    const tabParam = searchParams.get('tab')
    return getManageOrganizationsTabIndex(tabParam)
  })

  const [allOrganizations, setAllOrganizations] = useState<AllOrgType[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [inputValue, setInputValue] = useState<string>('')

  const [showActionsDropdown, setShowActionsDropdown] = useState<number | null>(
    null
  )
  const [loadingRowId, setLoadingRowId] = useState<string | null>(null)
  const actionsRefs = useRef<{ [key: number]: HTMLDivElement | null }>({})
  const [isDeactivating, setIsDeactivating] = useState<boolean>(false)
  const [selectedOrganization, setSelectedOganization] =
    useState<AllOrgType | null>(null)

  const isPendingTab = useMemo(
    () =>
      getManageOrganizationsTabName(activeTab) ===
      MANAGE_ORGANIZATIONS_TAB_NAMES.PENDING,
    [activeTab]
  )

  const columns = useMemo(() => getColumns(isPendingTab), [isPendingTab])

  const fetchAllOrganizations = useCallback(async () => {
    if (!token) return
    try {
      setLoading(true)
      const response =
        await organizationService.getAllOrganization<OrganizationType[]>()
      const allOrgData = transformAllOrg(response?.data)
      setAllOrganizations(allOrgData)
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
  }, [token, showSonnar])

  const handleReactivate = useCallback(
    async (orgId: string) => {
      if (!token || !userId) return
      try {
        setLoadingRowId(orgId)
        await organizationService.activeOrganization(orgId, userId)
        await fetchAllOrganizations()
        showSonnar({
          type: 'success',
          label: 'Organization reactivated',
          message: 'The organization has been reactivated successfully.',
        })
      } catch (error) {
        const APIError = error as ApiError
        showSonnar({
          type: 'danger',
          label: 'Error',
          message: APIError.message,
        })
      } finally {
        setLoadingRowId(null)
      }
    },
    [token, userId, fetchAllOrganizations, showSonnar]
  )

  // Filtered organizations (based on active tab + search)
  const filteredOrganizations = useMemo(() => {
    let data = [...allOrganizations]

    // Tab filter
    if (activeTab === 1) {
      data = data.filter(item => item.status === USER_STATUS.INACTIVE)
    } else if (activeTab === 2) {
      data = data.filter(item => item.status === USER_STATUS.PENDING_APPROVAL)
    }

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      data = data.filter(item => item.name.toLowerCase().includes(query))
    }

    // Sort by creation date (newest first)
    data.sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime()
      const dateB = new Date(b.createdAt).getTime()
      return dateB - dateA // Descending order (newest first)
    })

    return data
  }, [allOrganizations, activeTab, searchQuery])

  const tabsWithCounts = useMemo(() => {
    return TABS_MANAGE_ORGANIZATIONS.map((tab, idx) => ({
      ...tab,
      count:
        idx === 0
          ? allOrganizations.length.toString()
          : idx === 1
            ? allOrganizations
                .filter(data => data.status === USER_STATUS.INACTIVE)
                .length.toString()
            : allOrganizations
                .filter(data => data.status === USER_STATUS.PENDING_APPROVAL)
                .length.toString(),
    }))
  }, [allOrganizations])

  const handleTabChange = (newTab: number) => {
    setActiveTab(newTab)
    const tabName = getManageOrganizationsTabName(newTab)
    router.push(`/manage-organizations?tab=${tabName}`, {
      scroll: false,
    })
  }

  const handleDectiveOrganization = useCallback(async () => {
    try {
      if (!token || !userId || !selectedOrganization) return
      setIsDeactivating(true)
      await organizationService.inactiveOrganization(
        selectedOrganization.organizationId,
        userId
      )
      showSonnar({
        type: 'information',
        label: 'Organization deactivated',
        message: (
          <div>
            You&apos;ve deactivated <b>{selectedOrganization?.name}</b>
            <br />
            <br /> An email has been sent to notify the user.
          </div>
        ),
      })
      setSelectedOganization(null)
      await fetchAllOrganizations()
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
  }, [token, userId, fetchAllOrganizations, showSonnar, selectedOrganization])

  useEffect(() => {
    const tabParam = searchParams.get('tab')
    const tabIndex = getManageOrganizationsTabIndex(tabParam)
    setActiveTab(tabIndex)
  }, [searchParams])

  useEffect(() => {
    fetchAllOrganizations()
  }, [fetchAllOrganizations])
  return (
    <div>
      <PageTitle
        title="Manage organizations"
        lead="View and manage organizational accounts"
        breadcrumbs={true}
        variant="standard"
        crumbs={[
          { crumb: 'Dashboard', href: '/', active: false, collapsed: false },
          {
            crumb: 'Manage organizations',
            href: '/manage-organizations',
            active: true,
            collapsed: false,
          },
        ]}
        loading={loading}
      />

      <div className="container space-y-8 pb-8 sm:py-8">
        <TabsGroup
          tabs={tabsWithCounts}
          onTabChange={handleTabChange}
          defaultActiveTab={activeTab}
          loading={loading}
        />

        <div className="flex flex-col gap-8">
          <div className="flex flex-wrap items-end justify-between gap-5">
            <SearchField
              label={`${filteredOrganizations.length ? formatNumber(filteredOrganizations.length) : 'No'} Organization${filteredOrganizations.length === 1 ? '' : 's'} found`}
              className="max-w-[448px]"
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
                setSearchQuery(value)
              }}
              disabled={loading}
              loading={loading}
            />
            <Button
              label="Create organization"
              appearance="primary"
              className="px-6 font-bold text-nowrap"
              disabled={loading}
              onClick={() =>
                router.push('/manage-organizations/create?step=type')
              }
              isSkeletonLoading={loading}
            />
          </div>
        </div>

        {!loading && filteredOrganizations.length === 0 ? (
          <div className="bg-so-color-neutral-100 space-y-8 rounded-2xl p-6">
            <p className="text-so-color-neutral-950 font-raleway text-xl font-bold">
              No results
            </p>
            {searchQuery ? (
              <p className="text-so-color-neutral-950 font-open-sans text-base">
                No results found for{' '}
                <span className="font-bold break-all">{searchQuery}</span>.
                Please try adjusting your search criteria or{' '}
                <Link
                  href="/manage-organizations/create?step=type"
                  className="text-so-color-persona-general-600 underline"
                >
                  creating an organization.
                </Link>
              </p>
            ) : (
              <p className="text-so-color-neutral-950 font-open-sans text-base">
                No result found. Please try{' '}
                <Link
                  href="/manage-organizations/create?step=type"
                  className="text-so-color-persona-general-600 underline"
                >
                  creating an organization.
                </Link>
              </p>
            )}
          </div>
        ) : (
          <Table<AllOrgType>
            columns={columns}
            data={filteredOrganizations}
            enableSorting={true}
            sortableColumnIds={['name', 'status', 'type', 'submittedDate']}
            loading={loading}
            renderRowActions={(row, rowIndex) => (
              <div
                ref={el => {
                  actionsRefs.current[rowIndex] = el
                }}
                className="relative flex flex-col gap-1"
              >
                <Button
                  appearance="ghost"
                  label={
                    // loadingRowId === row.organizationId
                    //   ? 'Loading...' :
                    'Actions'
                  }
                  semantic="general"
                  iconTrailing
                  className="font-bold"
                  icon={
                    <i className="material-symbols-outlined">
                      keyboard_arrow_down
                    </i>
                  }
                  onClick={() =>
                    loadingRowId === row.organizationId
                      ? undefined
                      : setShowActionsDropdown(
                          showActionsDropdown === rowIndex ? null : rowIndex
                        )
                  }
                  disabled={loadingRowId === row.organizationId}
                />

                <Popup
                  isOpen={showActionsDropdown === rowIndex}
                  onClose={() => setShowActionsDropdown(null)}
                  position="bottom-left"
                  className="max-w-fit border-0 shadow-none"
                  triggerRef={{
                    current: actionsRefs.current[rowIndex] || null,
                  }}
                >
                  <DropdownMenu>
                    <DropdownMenuItem
                      onClick={() => {
                        setShowActionsDropdown(null)
                        router.push(
                          `/manage-organizations/${row.organizationId}`
                        )
                      }}
                      className="text-nowrap"
                    >
                      {row?.status === USER_STATUS.PENDING_APPROVAL
                        ? 'Review Organization'
                        : 'Manage organization'}
                    </DropdownMenuItem>
                    {row.status === USER_STATUS.ACTIVE && (
                      <DropdownMenuItem
                        onClick={() => {
                          setShowActionsDropdown(null)
                          setSelectedOganization(row)
                        }}
                        className="text-so-color-red-700 text-nowrap"
                      >
                        Deactivate organization
                      </DropdownMenuItem>
                    )}
                    {row.status === USER_STATUS.INACTIVE && (
                      <DropdownMenuItem
                        onClick={() => {
                          setShowActionsDropdown(null)
                          handleReactivate(row.organizationId)
                        }}
                        className="text-nowrap"
                      >
                        {loadingRowId === row.organizationId
                          ? 'Reactivating...'
                          : 'Reactivate organization'}
                      </DropdownMenuItem>
                    )}
                  </DropdownMenu>
                </Popup>
              </div>
            )}
          />
        )}
      </div>
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
          onClick: () => setSelectedOganization(null),
        }}
        isOpen={Boolean(selectedOrganization)}
        onClose={() => setSelectedOganization(null)}
        headerClassName="gap-8"
        description={
          <>
            <p>
              Are you sure you want to deactivate{' '}
              <b>{selectedOrganization?.name}</b>?
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
    </div>
  )
}

export default function ManageOrganizationsPage() {
  return (
    <Suspense>
      <ManageOrganizationsContent />
    </Suspense>
  )
}
