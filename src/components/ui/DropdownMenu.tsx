import { cn } from '@/lib/utils'
import { Mode } from '@/types/global'

export interface DropdownMenuProps {
  children: React.ReactNode
  className?: string
  theme?: Mode
  scrollable?: boolean
}

export interface DropdownMenuItemProps {
  children: React.ReactNode
  className?: string
  onClick?: () => void
  isActive?: boolean
  disabled?: boolean
  onMouseDown?: (e: React.MouseEvent) => void
}

export interface DropdownSectionProps {
  title?: string
  children: React.ReactNode
  className?: string
}

export interface DropdownDividerProps {
  className?: string
}

export interface DropdownMenuItemExtendedProps extends DropdownMenuItemProps {
  iconLeading?: boolean
  iconTrailing?: boolean
  icon?: React.ReactNode
  theme?: Mode
}

const DropdownMenu = ({
  children,
  className,
  theme = 'light',
  scrollable = true,
}: DropdownMenuProps & { theme?: Mode }) => {
  return (
    <div
      className={cn(
        'flex flex-col rounded-2xl border p-3',
        'shadow-[0px_4px_6px_-1px_#0A0A0A1A,0px_2px_4px_-2px_#0A0A0A40]',
        'space-y-2',
        theme === 'light'
          ? 'border-so-color-neutral-300 bg-white'
          : 'border-so-color-neutral-700 bg-so-color-neutral-950',
        scrollable && 'max-h-80 overflow-y-auto',
        className
      )}
    >
      {children}
    </div>
  )
}

const DropdownMenuItem = ({
  children,
  className,
  onClick,
  isActive = false,
  disabled = false,
  iconLeading = false,
  iconTrailing = false,
  icon,
  theme = 'light',
  ...rest
}: DropdownMenuItemExtendedProps) => {
  return (
    <div
      className={cn(
        'group flex items-center rounded-md px-3 py-2 text-base font-normal transition-colors',
        !disabled && 'cursor-pointer',
        isActive &&
          (theme === 'light'
            ? 'bg-so-color-persona-general-200 text-so-color-persona-general-950'
            : 'bg-so-color-neutral-800'),
        theme === 'light'
          ? disabled
            ? 'text-so-color-neutral-400'
            : 'text-so-color-persona-general-600 hover:text-so-color-persona-general-800 focus:text-so-color-persona-general-800 active:text-so-color-persona-general-950 hover:bg-so-color-persona-general-100 focus:bg-so-color-persona-general-100 active:bg-so-color-persona-general-200 focus:ring-so-color-sky-500 focus:right-5 focus:rounded-lg'
          : disabled
            ? 'text-so-color-neutral-600'
            : 'text-so-color-persona-general-400 hover:bg-so-color-neutral-800',
        disabled && 'cursor-not-allowed',
        className
      )}
      onClick={!disabled ? onClick : undefined}
      {...rest}
    >
      {iconLeading && icon && (
        <span className="mr-2 flex-shrink-0">{icon}</span>
      )}
      <span className="flex-1">{children}</span>
      {iconTrailing && icon && (
        <span className="ml-2 flex-shrink-0">{icon}</span>
      )}
    </div>
  )
}

const DropdownSection = ({
  title,
  children,
  className,
  theme = 'light',
}: DropdownSectionProps & { theme?: Mode }) => {
  return (
    <div className={cn('flex flex-col', className)}>
      {title && (
        <div
          className={cn(
            'p-2 text-base font-bold capitalize',
            theme === 'light' ? 'text-so-color-neutral-950' : 'text-white'
          )}
        >
          {title}
        </div>
      )}
      {children}
    </div>
  )
}

const DropdownDivider = ({
  className,
  theme = 'light',
}: DropdownDividerProps & { theme?: Mode }) => {
  return (
    <div
      className={cn(
        'my-4 h-0.5 w-full',
        theme === 'light'
          ? 'bg-so-color-neutral-300'
          : 'bg-so-color-neutral-700',
        className
      )}
    />
  )
}

export default DropdownMenu
export { DropdownDivider, DropdownMenuItem, DropdownSection }
