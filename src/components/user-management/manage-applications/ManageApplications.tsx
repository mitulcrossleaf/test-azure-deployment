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
} from '@/components/ui'
import { useAuth, useSonnar } from '@/context'
import { formatNumber } from '@/helper'
import { applicationService } from '@/services'
import { ApiError, ApplicationType } from '@/types/services'
import { ColumnDef } from '@tanstack/react-table'
import { useRouter } from 'next/navigation'
import {
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'

const columns: ColumnDef<ApplicationType>[] = [
  { header: 'Application name', accessorKey: 'name' },
  { header: 'Type', accessorKey: 'applictaionTypeName' },
  {
    header: 'Status',
    accessorKey: 'status',
    cell: ({ row }) => (
      <Badge
        label={row.original.status}
        appearance={
          row.original.status.toLowerCase() === 'active'
            ? 'success'
            : 'default-subtle'
        }
        size="medium"
      />
    ),
  },
]

const ManageApplicationsContent = () => {
  const router = useRouter()
  const { token } = useAuth()
  const { showSonnar } = useSonnar()

  const [applications, setApplications] = useState<ApplicationType[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [showActionsDropdown, setShowActionsDropdown] = useState<number | null>(
    null
  )
  const actionsRefs = useRef<{ [key: number]: HTMLDivElement | null }>({})
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [inputValue, setInputValue] = useState<string>('')

  const fetchAllApplications = useCallback(async () => {
    if (!token) return
    try {
      setLoading(true)
      const response =
        await applicationService.getAllApplication<ApplicationType[]>()
      setApplications(response?.data || [])
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

  // Filter applications based on search query
  const filteredApplications = useMemo(() => {
    if (!searchQuery.trim()) return applications
    const query = searchQuery.toLowerCase()
    return applications.filter(
      app =>
        app.name.toLowerCase().includes(query) ||
        app.applictaionTypeName.toLowerCase().includes(query) ||
        app.status.toLowerCase().includes(query)
    )
  }, [applications, searchQuery])

  useEffect(() => {
    fetchAllApplications()
  }, [fetchAllApplications])

  return (
    <>
      <PageTitle
        title="Manage applications"
        lead="View and manage system enterprise applications"
        breadcrumbs={true}
        variant="standard"
        crumbs={[
          { crumb: 'Dashboard', href: '/', active: false, collapsed: false },
          {
            crumb: 'Manage enterprise applications',
            href: '/manage-enterprise-applications',
            active: true,
            collapsed: false,
          },
        ]}
        loading={loading}
      />

      <div className="container space-y-8 py-8">
        <div className="flex flex-col gap-8">
          <div className="flex items-end justify-between gap-5">
            <SearchField
              label={`${filteredApplications.length ? formatNumber(filteredApplications.length) : 'No'} Application${filteredApplications.length === 1 ? '' : 's'} found`}
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
              label="Create application"
              appearance="primary"
              onClick={() => router.push('/manage-applications/add')}
              className="px-6 font-bold text-nowrap"
              disabled={loading}
              isSkeletonLoading={loading}
            />
          </div>
        </div>
        {!loading && filteredApplications.length === 0 ? (
          <div className="bg-so-color-neutral-100 space-y-8 rounded-2xl p-6">
            <p className="text-so-color-neutral-950 font-raleway text-xl font-bold">
              No results
            </p>
            {searchQuery ? (
              <p className="text-so-color-neutral-950 font-open-sans text-base">
                No results found for{' '}
                <span className="font-bold break-all">{searchQuery}</span>.
                Please try adjusting your search criteria or{' '}
                <button
                  onClick={() => router.push('/manage-applications/add')}
                  className="text-so-color-persona-general-600 underline"
                >
                  creating an application.
                </button>
              </p>
            ) : (
              <p className="text-so-color-neutral-950 font-open-sans text-base">
                No applications found. Please try{' '}
                <button
                  onClick={() => router.push('/manage-applications/add')}
                  className="text-so-color-persona-general-600 underline"
                >
                  creating an application.
                </button>
              </p>
            )}
          </div>
        ) : (
          <Table<ApplicationType>
            columns={columns}
            data={filteredApplications}
            enableSorting={true}
            sortableColumnIds={['name', 'applictaionTypeName', 'status']}
            loading={loading}
            renderRowActions={(row, rowIndex: number) => (
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
                        // Handle edit action
                      }}
                      className="text-nowrap"
                    >
                      Edit application
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => {
                        setShowActionsDropdown(null)
                        // Handle delete action
                      }}
                      className="text-so-color-red-700 text-nowrap"
                    >
                      Delete application
                    </DropdownMenuItem>
                  </DropdownMenu>
                </Popup>
              </div>
            )}
          />
        )}
      </div>
    </>
  )
}

const ManageApplications = () => {
  return (
    <Suspense>
      <ManageApplicationsContent />
    </Suspense>
  )
}

export default ManageApplications
