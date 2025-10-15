import { cn } from '@/lib/utils'
export type DropdownSearchResultProps = {
  title?: string
  showDetails?: boolean
  showAddress?: boolean
  address?: string
  showUrl?: boolean
  url?: string
  className?: string
  onClick?: () => void
}

const baseContainer =
  'w-full rounded-lg px-4 py-2 flex flex-col gap-2 justify-center items-start'

const DropdownSearchResult = ({
  title = 'Result title',
  showDetails = true,
  showAddress = true,
  address = '700 King St, Toronto, Ontario, M5V 0V3',
  showUrl = true,
  url = 'Company legal name',
  className,
  onClick,
}: DropdownSearchResultProps) => {
  const onKeyDown: React.KeyboardEventHandler<HTMLDivElement> = e => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      onClick?.()
    }
  }
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={onKeyDown}
      className={cn(
        baseContainer,
        'hover:bg-so-color-neutral-200 focus:bg-so-color-neutral-200 active:bg-so-color-neutral-300 bg-transparent',
        'focus:ring-so-color-sky-500 focus:ring-4 focus:ring-offset-2 focus:outline-none',
        className
      )}
      data-name="DropdownSearchResult"
    >
      <div className="text-so-color-neutral-950 font-open-sans w-full text-base leading-6 font-bold">
        {title}
      </div>
      {showDetails && (
        <div className="text-so-color-neutral-600 font-open-sans w-full space-y-0.5 text-base leading-6">
          {showAddress && <p>{address}</p>}
          {showUrl && <p>{url}</p>}
        </div>
      )}
    </div>
  )
}

export default DropdownSearchResult
