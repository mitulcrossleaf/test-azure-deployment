'use client'
import { cn } from '@/lib'
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from '@tanstack/react-table'
import React from 'react'
import Skeleton from 'react-loading-skeleton'
import { Tooltip } from 'react-tooltip'
import 'react-tooltip/dist/react-tooltip.css'
import Pagination from './Pagination'

export type TableProps<TData> = {
  columns: ColumnDef<TData, unknown>[]
  data: TData[]
  className?: string
  tableClassName?: string
  headerClassName?: string
  rowClassName?: string
  cellClassName?: string
  pageSizeOptions?: number[]
  initialPageSize?: number
  enableSorting?: boolean
  sortableColumnIds?: string[] | ((columnId: string) => boolean)
  getRowId?: (originalRow: TData, index: number, parent?: unknown) => string
  renderRowActions?: (row: TData, rowIndex: number) => React.ReactNode
  isCheckbox?: boolean
  onSelectionChange?: (selectedRows: TData[]) => void
  semantic?: 'light' | 'dark'
  loading?: boolean
}

function Table<TData>({
  columns,
  data,
  className = '',
  tableClassName = '',
  headerClassName = '',
  rowClassName = '',
  cellClassName = '',
  initialPageSize = 10,
  enableSorting = false,
  sortableColumnIds,
  getRowId,
  renderRowActions,
  isCheckbox = false,
  onSelectionChange,
  semantic = 'light',
  loading = false,
}: TableProps<TData>) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [selectedRows, setSelectedRows] = React.useState<Set<string>>(new Set())

  const themeStyles = {
    light: {
      table: 'bg-white',
      header: 'text-so-color-neutral-950',
      cell: 'text-so-color-neutral-950',
      row: 'even:bg-so-color-neutral-100 odd:bg-white',
      border: 'border-so-color-neutral-300',
      checkbox: `border-so-color-neutral-950 border-2 appearance-none checked:after:text-sm checked:after:text-black checked:after:content-['✔'] disabled:cursor-not-allowed disabled:opacity-50 `,
      tooltip: 'so-tooltip-light',
    },
    dark: {
      table: 'bg-so-color-neutral-950',
      header: 'text-white border-b border-b-so-color-neutral-50',
      cell: 'text-white ',
      row: 'bg-so-color-neutral-950',
      border: 'border-b-so-color-neutral-700 border-b',
      checkbox: `border-so-color-neutral-50 border-2 appearance-none checked:after:text-sm checked:after:text-white checked:after:content-['✔'] hover:border-gray-600 disabled:cursor-not-allowed disabled:opacity-50 `,
      tooltip: 'so-tooltip-dark',
    },
  }

  const currentTheme = themeStyles[semantic]

  const table = useReactTable({
    data,
    columns,
    state: { sorting },
    onSortingChange: enableSorting ? setSorting : undefined,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: initialPageSize,
      },
    },
    getRowId,
  })

  const canColumnSort = (columnId: string) => {
    if (!enableSorting) return false
    if (!sortableColumnIds) return true
    return Array.isArray(sortableColumnIds)
      ? sortableColumnIds.includes(columnId)
      : Boolean(sortableColumnIds(columnId))
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const currentPageRowIds = new Set(
        data.map((row, index) =>
          getRowId ? getRowId(row, index) : index.toString()
        )
      )
      const newSelectedRows = new Set([...selectedRows, ...currentPageRowIds])
      setSelectedRows(newSelectedRows)

      const allSelectedData = data.filter((_, index) =>
        newSelectedRows.has(getRowId ? getRowId(_, index) : index.toString())
      )
      onSelectionChange?.(allSelectedData)
    } else {
      const currentPageRowIds = new Set(
        data.map((row, index) =>
          getRowId ? getRowId(row, index) : index.toString()
        )
      )
      const newSelectedRows = new Set(
        Array.from(selectedRows).filter(id => !currentPageRowIds.has(id))
      )
      setSelectedRows(newSelectedRows)

      const remainingSelectedData = data.filter((_, index) =>
        newSelectedRows.has(getRowId ? getRowId(_, index) : index.toString())
      )
      onSelectionChange?.(remainingSelectedData)
    }
  }

  const handleSelectRow = (rowId: string, row: TData, checked: boolean) => {
    const newSelectedRows = new Set(selectedRows)
    if (checked) {
      newSelectedRows.add(rowId)
    } else {
      newSelectedRows.delete(rowId)
    }
    setSelectedRows(newSelectedRows)

    const currentPageSelectedData = data.filter((_, index) =>
      newSelectedRows.has(getRowId ? getRowId(_, index) : index.toString())
    )
    onSelectionChange?.(currentPageSelectedData)
  }

  const currentPageRowIds = new Set(
    data.map((row, index) =>
      getRowId ? getRowId(row, index) : index.toString()
    )
  )
  const currentPageSelectedCount = Array.from(selectedRows).filter(id =>
    currentPageRowIds.has(id)
  ).length

  const isAllSelected =
    data.length > 0 && currentPageSelectedCount === data.length
  const isIndeterminate =
    currentPageSelectedCount > 0 && currentPageSelectedCount < data.length

  return (
    <div className={cn('w-full', className)}>
      <div className="overflow-x-auto">
        <table
          className={cn('w-full text-left', currentTheme.table, tableClassName)}
        >
          <thead
            className={cn(
              'border-b-so-color-neutral-900 border-b',
              headerClassName
            )}
          >
            {loading
              ? Array.from({ length: 10 }).map((_, i) => (
                  <tr
                    key={i}
                    className={cn(
                      currentTheme.border,
                      currentTheme.row,
                      'border-b'
                    )}
                  >
                    {isCheckbox && (
                      <th
                        className={cn(
                          'body-2xl px-4',
                          currentTheme.cell,
                          cellClassName
                        )}
                      >
                        <Skeleton width="100%" height="100%" />
                      </th>
                    )}
                    {columns.map((_, colIndex) => (
                      <th
                        key={colIndex}
                        className={cn(
                          'body-2xl px-4 py-3',
                          currentTheme.cell,
                          cellClassName
                        )}
                      >
                        <Skeleton width="100%" height="100%" />
                      </th>
                    ))}
                    {renderRowActions && (
                      <th
                        className={cn(
                          'body-2xl px-4 py-3',
                          currentTheme.cell,
                          cellClassName
                        )}
                      >
                        <Skeleton width="100%" height="100%" />
                      </th>
                    )}
                  </tr>
                ))
              : table.getHeaderGroups().map(headerGroup => (
                  <tr key={headerGroup.id} className={cn(currentTheme.header)}>
                    {isCheckbox && (
                      <th
                        className={cn(
                          'body-base px-4 whitespace-nowrap select-none',
                          currentTheme.header
                        )}
                      >
                        <input
                          type="checkbox"
                          checked={isAllSelected}
                          ref={el => {
                            if (el) el.indeterminate = isIndeterminate
                          }}
                          onChange={e => handleSelectAll(e.target.checked)}
                          className={cn(
                            'flex size-8 cursor-pointer items-center justify-center rounded',
                            currentTheme.checkbox
                          )}
                        />
                      </th>
                    )}
                    {headerGroup.headers.map(header => (
                      <th
                        key={header.id}
                        colSpan={header.colSpan}
                        className={cn(
                          'body-base px-4 py-6 whitespace-nowrap select-none',
                          currentTheme.header,
                          canColumnSort(header.column.id) && 'cursor-pointer'
                        )}
                        onClick={
                          canColumnSort(header.column.id)
                            ? header.column.getToggleSortingHandler()
                            : undefined
                        }
                      >
                        {header.isPlaceholder ? null : (
                          <div className="body-base flex items-center gap-4">
                            {flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                            {canColumnSort(header.column.id) && (
                              <SortIndicator
                                direction={header.column.getIsSorted()}
                              />
                            )}
                          </div>
                        )}
                      </th>
                    ))}
                  </tr>
                ))}
          </thead>
          <tbody>
            {loading ? (
              Array.from({ length: 10 }).map((_, i) => (
                <tr
                  key={i}
                  className={cn(
                    currentTheme.border,
                    currentTheme.row,
                    'border-b'
                  )}
                >
                  {isCheckbox && (
                    <td
                      className={cn(
                        'body-2xl px-4',
                        currentTheme.cell,
                        cellClassName
                      )}
                    >
                      <Skeleton width="100%" height="100%" />
                    </td>
                  )}
                  {columns.map((_, colIndex) => (
                    <td
                      key={colIndex}
                      className={cn(
                        'body-2xl px-4 py-3',
                        currentTheme.cell,
                        cellClassName
                      )}
                    >
                      <Skeleton width="100%" height="100%" />
                    </td>
                  ))}
                  {renderRowActions && (
                    <td
                      className={cn(
                        'body-2xl px-4 py-3',
                        currentTheme.cell,
                        cellClassName
                      )}
                    >
                      <Skeleton width="100%" height="100%" />
                    </td>
                  )}
                </tr>
              ))
            ) : data.length === 0 ? (
              <tr>
                <td
                  colSpan={
                    columns.length +
                    (renderRowActions ? 1 : 0) +
                    (isCheckbox ? 1 : 0)
                  }
                  className={cn('px-4 py-8 text-center', currentTheme.cell)}
                >
                  No data
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map((row, rowIndex) => {
                const rowId = getRowId
                  ? getRowId(row.original, rowIndex)
                  : rowIndex.toString()
                const isRowSelected = selectedRows.has(rowId)

                return (
                  <tr
                    key={row.id}
                    className={cn(
                      currentTheme.border,
                      currentTheme.row,
                      'border-b',
                      rowClassName
                    )}
                  >
                    {isCheckbox && (
                      <td
                        className={cn(
                          'body-base px-4',
                          currentTheme.cell,
                          cellClassName
                        )}
                      >
                        <input
                          type="checkbox"
                          checked={isRowSelected}
                          onChange={e =>
                            handleSelectRow(
                              rowId,
                              row.original,
                              e.target.checked
                            )
                          }
                          className={cn(
                            'flex size-8 cursor-pointer items-center justify-center rounded',
                            currentTheme.checkbox
                          )}
                        />
                      </td>
                    )}
                    {row.getVisibleCells().map(cell => {
                      const cellContent = flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )

                      // Get the raw value for tooltip
                      const cellValue = cell.getValue()
                      const tooltipText =
                        cellValue != null ? String(cellValue) : ''

                      return (
                        <td
                          key={cell.id}
                          className={cn(
                            'body-base align-center relative px-4 py-3',
                            currentTheme.cell,
                            cellClassName
                          )}
                        >
                          <div
                            ref={el => {
                              if (el) {
                                if (el.scrollWidth > el.clientWidth) {
                                  el.setAttribute(
                                    'data-tooltip-id',
                                    'table-cell-tooltip'
                                  )
                                  el.setAttribute(
                                    'data-tooltip-content',
                                    tooltipText
                                  )
                                } else {
                                  el.removeAttribute('data-tooltip-id')
                                  el.removeAttribute('data-tooltip-content')
                                }
                              }
                            }}
                            className="max-w-xs truncate"
                          >
                            {cellContent}
                          </div>
                        </td>
                      )
                    })}
                    {renderRowActions && (
                      <td
                        className={cn(
                          'body-base align-center relative px-4 py-3',
                          currentTheme.cell,
                          cellClassName
                        )}
                      >
                        {renderRowActions(row.original, rowIndex)}
                      </td>
                    )}
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>

      {data.length > initialPageSize && (
        <div className="flex items-center justify-center gap-4 pt-8">
          <Pagination
            currentPage={table.getState().pagination.pageIndex + 1}
            totalPages={table.getPageCount()}
            onPageChange={page => table.setPageIndex(page - 1)}
            semantic={semantic}
          />
        </div>
      )}

      <Tooltip
        id="table-cell-tooltip"
        className={cn(
          'z-50 flex w-full max-w-sm justify-start rounded border px-3 py-2 text-sm break-words whitespace-normal shadow-lg md:max-w-max md:min-w-fit'
        )}
      />
    </div>
  )
}

function SortIndicator({ direction }: { direction: false | 'asc' | 'desc' }) {
  if (!direction)
    return (
      <i className="material-symbols-outlined !text-xl !leading-none">
        swap_vert
      </i>
    )
  if (direction === 'asc')
    return <i className="material-symbols-outlined !text-base">arrow_upward</i>
  return <i className="material-symbols-outlined !text-base">arrow_downward</i>
}

const TypedTable = Table as unknown as <TData>(
  props: TableProps<TData>
) => React.ReactElement

export default TypedTable
