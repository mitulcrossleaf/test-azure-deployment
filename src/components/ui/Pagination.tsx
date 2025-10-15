'use client'
import { useScreenWidth } from '@/hooks'
import { cn } from '@/lib'
import { Mode } from '@/types/global'
import Button from './Button'

export type PaginationProps = {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  labelPrevious?: string
  labelNext?: string
  semantic?: Mode
  className?: string
}

const MAX_NEIGHBOURS = 1

const buildPageList = (currentPage: number, totalPages: number) => {
  const pages: Array<number | 'dots'> = []
  const startPage = Math.max(2, currentPage - MAX_NEIGHBOURS)
  const endPage = Math.min(totalPages - 1, currentPage + MAX_NEIGHBOURS)

  pages.push(1)
  if (startPage > 2) pages.push('dots')
  for (let page = startPage; page <= endPage; page += 1) pages.push(page)
  if (endPage < totalPages - 1) pages.push('dots')
  if (totalPages > 1) pages.push(totalPages)

  return pages.filter((value, index, self) => self.indexOf(value) === index)
}

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  labelPrevious = 'Previous',
  labelNext = 'Next',
  semantic = 'light',
  className = '',
}: PaginationProps) => {
  const screenWidth = useScreenWidth()

  const linkClasses =
    semantic === 'dark'
      ? 'body-link !text-so-color-persona-general-400 hover:text-so-color-persona-general-300 focus:text-so-color-persona-general-300'
      : 'body-link !text-so-color-persona-general-600 hover:text-so-color-persona-general-800 focus:text-so-color-persona-general-800'
  const activeClasses =
    semantic === 'dark'
      ? '!text-so-color-neutral-950 !bg-so-color-neutral-50 hover:!bg-so-color-neutral-400 focus:!bg-so-color-neutral-400 active:!bg-so-color-neutral-300'
      : '!text-so-color-neutral-50 !bg-so-color-neutral-950 hover:!bg-so-color-neutral-700 focus:!bg-so-color-neutral-700 active:!bg-so-color-neutral-500'

  const goToPage = (page: number) => {
    if (page < 1 || page > totalPages || page === currentPage) return
    onPageChange(page)
  }

  const pagesToRender = buildPageList(currentPage, totalPages)

  return (
    <nav
      className={`${semantic === 'dark' ? 'bg-so-color-neutral-700 py-10' : 'bg-transparent'} flex h-10 items-center gap-4 select-none ${className}`}
      aria-label="pagination"
    >
      <Button
        type="button"
        onClick={() => goToPage(currentPage - 1)}
        label={screenWidth < 640 ? '' : labelPrevious}
        iconLeading={true}
        icon={<i className="material-symbols-outlined">keyboard_arrow_left</i>}
        size="sm"
        disabled={currentPage <= 1}
        className="!min-h-8 !p-1 !px-2 !ring-offset-2 focus:!ring-2 disabled:cursor-not-allowed disabled:opacity-50"
        labelClassName={cn(linkClasses, 'underline')}
      />

      <div className="flex items-center gap-2">
        {pagesToRender.map((page, index) => {
          if (page === 'dots') {
            return (
              <span
                key={`dots-${index}`}
                className="text-so-color-persona-general-600 flex size-10 items-center justify-center text-2xl"
              >
                <i className="material-symbols-outlined">more_horiz</i>
              </span>
            )
          }

          const isActive = page === currentPage

          return (
            <Button
              key={page}
              type="button"
              aria-current={isActive ? 'page' : undefined}
              onClick={() => goToPage(page)}
              label={String(page)}
              className={`flex !min-h-10 !min-w-10 items-center justify-center !p-0 underline !ring-offset-2 focus:!ring-2 disabled:cursor-not-allowed disabled:opacity-50 ${
                isActive ? activeClasses : linkClasses
              } }`}
            />
          )
        })}
      </div>

      <Button
        type="button"
        onClick={() => goToPage(currentPage + 1)}
        label={screenWidth < 640 ? '' : labelNext}
        iconTrailing={true}
        icon={<i className="material-symbols-outlined">keyboard_arrow_right</i>}
        size="sm"
        disabled={currentPage >= totalPages}
        className="!min-h-8 !p-1 !px-2 !ring-offset-2 focus:!ring-2 disabled:cursor-not-allowed disabled:opacity-50"
        labelClassName={cn(linkClasses, 'underline')}
      />
    </nav>
  )
}

export default Pagination
