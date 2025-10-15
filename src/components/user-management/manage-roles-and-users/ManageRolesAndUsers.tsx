'use client'
import {
  Badge,
  Button,
  DropdownMenu,
  DropdownMenuItem,
  PageTitle,
  Popup,
  SearchField,
  Table,
  TabsGroup,
} from '@/components/ui'
import {
  getManageRolesAndUsersTabIndex,
  getManageRolesAndUsersTabName,
} from '@/constants'
import { formatNumber } from '@/helper'
import { SystemUserType, UserRoleType } from '@/types/component'
import { ColumnDef } from '@tanstack/react-table'
import { useRouter, useSearchParams } from 'next/navigation'
import {
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'

// Mock data types

const mockUserRoles: UserRoleType[] = [
  {
    id: '1',
    userRole: 'System Admin',
    segmentType: 'Internal',
    organizationType: 'Supply Ontario',
  },
  {
    id: '2',
    userRole: 'Supply Ontario Admin',
    segmentType: 'Internal',
    organizationType: 'Supply Ontario',
  },
  {
    id: '3',
    userRole: 'Organization Admin',
    segmentType: 'External',
    organizationType: 'BPS, Vendor',
  },
  {
    id: '4',
    userRole: 'Standard User',
    segmentType: 'External',
    organizationType: 'BPS, Vendor',
  },
  {
    id: '5',
    userRole: 'Read Only User',
    segmentType: 'External',
    organizationType: 'Audit',
  },
]

const mockSystemUsers: SystemUserType[] = [
  {
    id: '1',
    name: 'Lindsey Geidt',
    email: 'lindsey@supplyontario.ca',
    role: 'System Admin',
    status: 'Active',
  },
  {
    id: '2',
    name: 'Nolan Bergson',
    email: 'nolan@supplyontario.ca',
    role: 'Organization Admin',
    status: 'Invited',
  },
  {
    id: '3',
    name: 'Cheyenne George',
    email: 'cheyenne@supplyontario.ca',
    role: 'Organization Admin',
    status: 'Invited',
  },
  {
    id: '4',
    name: 'Marilyn Septimus',
    email: 'marilyn@supplyontario.ca',
    role: 'Standard User',
    status: 'Active',
  },
  {
    id: '5',
    name: 'Jakob Passaquindici Arcand',
    email: 'jakob@supplyontario.ca',
    role: 'System Admin',
    status: 'Active',
  },
  {
    id: '6',
    name: 'Madelyn Botosh',
    email: 'madelyn@supplyontario.ca',
    role: 'Standard User',
    status: 'Active',
  },
  {
    id: '7',
    name: 'Madelyn Workman',
    email: 'madelyn@supplyontario.ca',
    role: 'Standard User',
    status: 'Pending approval',
  },
  {
    id: '8',
    name: 'Lincoln Mango',
    email: 'lincoln@supplyontario.ca',
    role: 'Standard User',
    status: 'Pending approval',
  },
  {
    id: '9',
    name: 'Justin Franci',
    email: 'justin@supplyontario.ca',
    role: 'Standard User',
    status: 'Active',
  },
  {
    id: '10',
    name: 'Kadin Rosser',
    email: 'kadin@supplyontario.ca',
    role: 'Standard User',
    status: 'Active',
  },
]

const rolesColumns: ColumnDef<UserRoleType>[] = [
  { header: 'User role', accessorKey: 'userRole' },
  { header: 'Segment type', accessorKey: 'segmentType' },
  { header: 'Organization type', accessorKey: 'organizationType' },
]

const MANAGE_ROLES_AND_USERS_TAB = [
  { label: 'System roles', count: '1' },
  { label: 'System users', count: '2' },
]

const usersColumns: ColumnDef<SystemUserType>[] = [
  { header: 'Name', accessorKey: 'name' },
  { header: 'Email address', accessorKey: 'email' },
  { header: 'Role', accessorKey: 'role' },
  {
    header: 'Status',
    accessorKey: 'status',
    cell: ({ row }) => {
      const status = row.getValue('status') as string
      const getBadgeAppearance = () => {
        switch (status) {
          case 'Active':
            return 'success'
          case 'Invited':
            return 'success-subtle'
          case 'Pending approval':
            return 'warning'
          default:
            return 'default-subtle'
        }
      }
      return (
        <Badge appearance={getBadgeAppearance()} size="medium" label={status} />
      )
    },
  },
]

const ManageRolesAndUsersContent = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [activeTab, setActiveTab] = useState(() => {
    const tabParam = searchParams.get('tab')
    return getManageRolesAndUsersTabIndex(tabParam)
  })

  const [showActionsDropdown, setShowActionsDropdown] = useState<number | null>(
    null
  )
  const actionsRefs = useRef<{ [key: number]: HTMLDivElement | null }>({})
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [inputValue, setInputValue] = useState<string>('')

  // Filter data based on search query
  const filteredUserRoles = useMemo(() => {
    if (!searchQuery.trim()) return mockUserRoles
    const query = searchQuery.toLowerCase()
    return mockUserRoles.filter(
      role =>
        role.userRole.toLowerCase().includes(query) ||
        role.segmentType.toLowerCase().includes(query) ||
        role.organizationType.toLowerCase().includes(query)
    )
  }, [searchQuery])

  const filteredSystemUsers = useMemo(() => {
    if (!searchQuery.trim()) return mockSystemUsers
    const query = searchQuery.toLowerCase()
    return mockSystemUsers.filter(
      user =>
        user.name.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query) ||
        user.role.toLowerCase().includes(query) ||
        user.status.toLowerCase().includes(query)
    )
  }, [searchQuery])

  const tabsWithCount = useMemo(
    () =>
      MANAGE_ROLES_AND_USERS_TAB.map((tab, idx) => ({
        ...tab,
        count:
          idx === 0
            ? filteredUserRoles.length.toString()
            : filteredSystemUsers.length.toString(),
      })),
    [filteredUserRoles.length, filteredSystemUsers.length]
  )

  const handleTabChange = useCallback(
    (newTab: number) => {
      setActiveTab(newTab)
      const tabIndex = getManageRolesAndUsersTabName(newTab)
      router.push(`/manage-roles-and-users?tab=${tabIndex}`, {
        scroll: false,
      })
    },
    [router]
  )

  useEffect(() => {
    const tabParam = searchParams.get('tab')
    const tabIndex = getManageRolesAndUsersTabIndex(tabParam)
    setActiveTab(tabIndex)
  }, [searchParams])

  return (
    <>
      <PageTitle
        title="Manage roles and users"
        lead="View and manage system roles and users"
        breadcrumbs={true}
        variant="standard"
        crumbs={[
          { crumb: 'Dashboard', href: '/', active: false, collapsed: false },
          {
            crumb: 'Manage roles and users',
            href: '/manage-roles-and-user',
            active: true,
            collapsed: false,
          },
        ]}
      />

      <div className="container space-y-8 py-8">
        <TabsGroup
          tabs={tabsWithCount}
          onTabChange={handleTabChange}
          defaultActiveTab={activeTab}
        />

        <div className="flex flex-col gap-8">
          {activeTab === 0 && (
            <>
              <div className="flex items-end justify-between gap-5">
                <SearchField
                  label={`${filteredUserRoles.length ? formatNumber(filteredUserRoles.length) : 'No'} User Role${filteredUserRoles.length === 1 ? '' : 's'} found`}
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
                />
                <Button
                  label="Create role"
                  appearance="primary"
                  onClick={() =>
                    router.push('/manage-roles-and-users/system-roles/create')
                  }
                  className="px-6 font-bold text-nowrap"
                />
              </div>
            </>
          )}

          {activeTab === 1 && (
            <>
              <div className="flex items-end justify-between gap-5">
                <SearchField
                  label={`${filteredSystemUsers.length ? formatNumber(filteredSystemUsers.length) : 'No'} User${filteredSystemUsers.length === 1 ? '' : 's'} found`}
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
                />
                <Button
                  label="Invite user"
                  appearance="primary"
                  onClick={() =>
                    router.push('/manage-roles-and-users/system-users/invite')
                  }
                  className="px-6 font-bold text-nowrap"
                />
              </div>
            </>
          )}
        </div>
        {/* <div className="bg-so-color-neutral-100 space-y-8 rounded-2xl p-6">
          <p className="text-so-color-neutral-950 font-raleway text-xl font-bold">
            No results
          </p>
          <p className="text-so-color-neutral-950 font-open-sans text-base">
            No results found for{' '}
            <span className="font-bold">{'searchQuery'}</span>. Please try
            adjusting your search criteria or{' '}
            <Link
              href="#"
              className="text-so-color-persona-general-600 underline"
            >
              creating an role.
            </Link>
          </p>
        </div> */}

        {activeTab === 0 && filteredUserRoles.length === 0 && searchQuery ? (
          <div className="bg-so-color-neutral-100 space-y-8 rounded-2xl p-6">
            <p className="text-so-color-neutral-950 font-raleway text-xl font-bold">
              No results
            </p>
            <p className="text-so-color-neutral-950 font-open-sans text-base">
              No results found for{' '}
              <span className="font-bold break-all">{searchQuery}</span>. Please
              try adjusting your search criteria or{' '}
              <button
                onClick={() =>
                  router.push('/manage-roles-and-users/system-roles/create')
                }
                className="text-so-color-persona-general-600 underline"
              >
                creating a role.
              </button>
            </p>
          </div>
        ) : (
          activeTab === 0 && (
            <Table<UserRoleType>
              columns={rolesColumns}
              data={filteredUserRoles}
              enableSorting={true}
              sortableColumnIds={[
                'userRole',
                'segmentType',
                'organizationType',
              ]}
              renderRowActions={(row, rowIndex) => (
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
                    iconTrailing
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
                    className="max-w-fit border-0 shadow-none"
                    triggerRef={{
                      current: actionsRefs.current[rowIndex] || null,
                    }}
                  >
                    <DropdownMenu>
                      <DropdownMenuItem
                        onClick={() => {
                          setShowActionsDropdown(null)
                          router.push('/manage-roles-and-users/system-roles/1')
                          // Handle edit action
                        }}
                        className="text-nowrap"
                      >
                        Edit role
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => {
                          setShowActionsDropdown(null)
                          // Handle delete action
                        }}
                        className="text-so-color-red-700 text-nowrap"
                      >
                        Delete role
                      </DropdownMenuItem>
                    </DropdownMenu>
                  </Popup>
                </div>
              )}
            />
          )
        )}

        {activeTab === 1 && filteredSystemUsers.length === 0 && searchQuery ? (
          <div className="bg-so-color-neutral-100 space-y-8 rounded-2xl p-6">
            <p className="text-so-color-neutral-950 font-raleway text-xl font-bold">
              No results
            </p>
            <p className="text-so-color-neutral-950 font-open-sans text-base">
              No results found for{' '}
              <span className="font-bold break-all">{searchQuery}</span>. Please
              try adjusting your search criteria or{' '}
              <button
                onClick={() =>
                  router.push('/manage-roles-and-users/system-users/invite')
                }
                className="text-so-color-persona-general-600 underline"
              >
                inviting a user.
              </button>
            </p>
          </div>
        ) : (
          activeTab === 1 && (
            <Table<SystemUserType>
              columns={usersColumns}
              data={filteredSystemUsers}
              enableSorting={true}
              sortableColumnIds={['name', 'email', 'role', 'status']}
              renderRowActions={(row, rowIndex) => (
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
                    iconTrailing
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
                    className="max-w-fit border-0 shadow-none"
                    triggerRef={{
                      current: actionsRefs.current[rowIndex] || null,
                    }}
                  >
                    <DropdownMenu>
                      <DropdownMenuItem
                        onClick={() => {
                          setShowActionsDropdown(null)
                          router.push('/manage-roles-and-users/system-users/1')
                          // Handle deactivate/activate action
                        }}
                        className="text-nowrap"
                      >
                        Manage User
                      </DropdownMenuItem>
                    </DropdownMenu>
                  </Popup>
                </div>
              )}
            />
          )
        )}
      </div>
    </>
  )
}

const ManageRolesAndUsers = () => {
  return (
    <Suspense>
      <ManageRolesAndUsersContent />
    </Suspense>
  )
}

export default ManageRolesAndUsers
