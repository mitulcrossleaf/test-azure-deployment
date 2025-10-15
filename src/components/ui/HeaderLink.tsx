import { cn } from '@/lib/utils'
import { Mode } from '@/types/global'
import Link from 'next/link'

export type Semantic = 'general' | 'buyer' | 'vendor'
export interface HeaderLinkProps {
  appearance: 'general' | 'buyer' | 'vendor'
  label: string
  link: string
  isActive?: boolean
  isOpenUserMenu?: boolean
  isIconTrailing?: boolean
  semantic?: Semantic
  theme?: Mode
  className?: string
}

const appearanceBg: Record<string, string> = {
  general: 'bg-transparent',
  buyer: 'bg-so-color-persona-buyer-100',
  vendor: 'bg-so-color-persona-vendor-100',
}

const semanticBar: Record<string, string> = {
  general: 'bg-so-color-persona-general-600 ',
  buyer: 'bg-so-color-persona-buyer-600',
  vendor: 'bg-so-color-persona-vendor-600',
}
const HeaderLink = ({
  appearance = 'general',
  label,
  isActive = false,
  isIconTrailing = false,
  isOpenUserMenu = false,
  semantic = 'general',
  theme = 'light',
  link,
  className,
}: HeaderLinkProps & { className?: string }) => {
  return (
    <Link
      href={link}
      aria-current={isActive ? 'page' : undefined}
      className={cn(
        'relative',
        isOpenUserMenu ? appearanceBg[appearance] : '',
        'flex items-center gap-1 p-6',
        className
      )}
    >
      {isActive && (
        <div
          className={cn(
            'absolute top-0 left-0 h-1 w-full',
            semanticBar[semantic]
          )}
        />
      )}
      <span
        className={cn(
          theme === 'light' ? 'text-so-color-neutral-black' : 'text-white',
          'text-xl leading-7 font-bold'
        )}
      >
        {label}
      </span>
      {isIconTrailing && (
        <div
          className={cn(
            theme === 'light' ? 'text-so-color-neutral-950' : 'text-white',
            'flex aspect-square size-6 items-center justify-center'
          )}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
          >
            <path
              d="M12 15.4L6 9.4L7.4 8L12 12.6L16.6 8L18 9.4L12 15.4Z"
              fill="currentColor"
            />
          </svg>
        </div>
      )}
    </Link>
  )
}
export default HeaderLink
