import { Mode } from '@/types/global'
import Skeleton from 'react-loading-skeleton'
export type ButtonAppearance =
  | 'primary'
  | 'neutral'
  | 'outline'
  | 'ghost'
  | 'secondary'
  | 'start'
  | 'destructive'
  | 'destructive-outline'
  | 'destructive-ghost'
  | 'link'

export type Theme = 'general' | 'buyer' | 'vendor'

export interface ButtonProps {
  appearance?: ButtonAppearance
  theme?: Mode
  iconOnly?: boolean
  iconSize?: number | string
  iconLeading?: boolean
  labelClassName?: string
  iconTrailing?: boolean
  label?: string
  icon?: React.ReactNode
  onClick?: () => void
  size?: 'sm' | 'base' | 'lg'
  semantic?: Theme
  className?: string
  type?: 'button' | 'submit' | 'reset'
  disabled?: boolean
  loading?: boolean
  loadingText?: string
  isSkeletonLoading?: boolean
}

const Button = ({
  appearance = 'ghost',
  semantic = 'general',
  iconOnly = false,
  iconSize = 24,
  iconLeading = false,
  iconTrailing = false,
  label = 'Button',
  labelClassName,
  icon,
  onClick,
  size = 'base',
  theme = 'light',
  className,
  type = 'button',
  disabled = false,
  loading = false,
  loadingText,
  isSkeletonLoading = false,
}: ButtonProps) => {
  const textSizeClasses = {
    sm: 'button-label-sm',
    base: 'button-label-base',
    lg: 'button-label-lg',
  }

  const textColors: Record<Theme, Record<ButtonAppearance, string>> = {
    general: {
      primary: theme === 'light' ? 'text-white' : 'text-so-color-neutral-950',
      secondary: theme === 'light' ? 'text-so-color-neutral-950' : 'text-white',
      ghost:
        theme === 'light'
          ? 'text-so-color-persona-general-600 hover:text-so-color-persona-general-900 active:text-so-color-persona-general-900 focus:text-so-color-persona-general-900'
          : 'text-so-color-persona-general-400 active:text-so-color-persona-general-100 hover:text-so-color-persona-general-100 focus:text-so-color-persona-general-100',
      outline:
        theme === 'light'
          ? 'text-so-color-persona-general-600 hover:text-so-color-persona-general-900 active:text-so-color-persona-general-900 focus:text-so-color-persona-general-900'
          : 'text-so-color-persona-general-400 active:text-so-color-persona-general-100 hover:text-so-color-persona-general-100 focus:text-so-color-persona-general-100',
      link: 'text-so-color-persona-general-600 hover:text-so-color-persona-general-800 focus:text-so-color-persona-general-800 active:text-so-color-purple-600 underline underline-offset-auto',
      'destructive-ghost':
        'text-so-color-red-700 hover:text-so-color-red-900 active:text-so-color-red-900 focus:text-so-color-red-900',
      'destructive-outline':
        'text-so-color-red-700 hover:text-so-color-red-900 active:text-so-color-red-900 focus:text-so-color-red-900',
      destructive:
        theme === 'light' ? 'text-white' : 'text-so-color-neutral-950',
      neutral:
        theme === 'light'
          ? 'text-white hover:text-so-color-neutral-900 focus:text-so-color-neutral-900 active:text-so-color-neutral-800'
          : 'text-so-color-neutral-700 hover:text-so-color-neutral-900  focus:text-so-color-neutral-900 active:text-so-color-neutral-800',
      start: theme === 'light' ? 'text-white' : 'text-white',
    },
    buyer: {
      primary:
        'text-white hover:text-so-color-persona-buyer-900 focus:text-so-color-persona-buyer-900 active:text-so-color-persona-buyer-800',
      neutral:
        'text-so-color-neutral-700 hover:text-so-color-neutral-900 focus:text-so-color-neutral-900 active:text-so-color-neutral-800',
      outline:
        'text-so-color-neutral-700 hover:text-so-color-neutral-900 focus:text-so-color-neutral-900 active:text-so-color-neutral-800',
      ghost:
        'text-so-color-persona-buyer-600 hover:text-so-color-persona-buyer-600 focus:text-so-color-persona-buyer-600 active:text-so-color-persona-buyer-600',
      secondary:
        'text-so-color-secondary-700 hover:text-so-color-secondary-900 focus:text-so-color-secondary-900 active:text-so-color-secondary-800',
      start:
        'text-so-color-start-700 hover:text-so-color-start-900 focus:text-so-color-start-900 active:text-so-color-start-800',
      destructive:
        'text-so-color-destructive-700 hover:text-so-color-destructive-900 focus:text-so-color-destructive-900 active:text-so-color-destructive-800',
      'destructive-outline':
        'text-so-color-destructive-700 hover:text-so-color-destructive-900 focus:text-so-color-destructive-900 active:text-so-color-destructive-800',
      'destructive-ghost':
        'text-so-color-destructive-700 hover:text-so-color-destructive-900 focus:text-so-color-destructive-900 active:text-so-color-destructive-800',
      link: 'text-so-color-link-600 hover:text-so-color-link-700 focus:text-so-color-link-700 active:text-so-color-link-800',
    },
    vendor: {
      primary:
        'text-white hover:text-so-color-persona-vendor-900 focus:text-so-color-persona-vendor-900 active:text-so-color-persona-vendor-800',
      neutral:
        'text-so-color-neutral-700 hover:text-so-color-neutral-900 focus:text-so-color-neutral-900 active:text-so-color-neutral-800',
      outline:
        'text-so-color-neutral-700 hover:text-so-color-neutral-900 focus:text-so-color-neutral-900 active:text-so-color-neutral-800',
      ghost:
        'text-so-color-persona-vendor-600 hover:text-so-color-persona-vendor-600 focus:text-so-color-persona-vendor-600 active:text-so-color-persona-vendor-600',
      secondary:
        'text-so-color-secondary-700 hover:text-so-color-secondary-900 focus:text-so-color-secondary-900 active:text-so-color-secondary-800',
      start:
        'text-so-color-start-700 hover:text-so-color-start-900 focus:text-so-color-start-900 active:text-so-color-start-800',
      destructive:
        'text-so-color-destructive-700 hover:text-so-color-destructive-900 focus:text-so-color-destructive-900 active:text-so-color-destructive-800',
      'destructive-outline':
        'text-so-color-destructive-700 hover:text-so-color-destructive-900 focus:text-so-color-destructive-900 active:text-so-color-destructive-800',
      'destructive-ghost':
        'text-so-color-destructive-700 hover:text-so-color-destructive-900 focus:text-so-color-destructive-900 active:text-so-color-destructive-800',
      link: 'text-so-color-link-600 hover:text-so-color-link-700 focus:text-so-color-link-700 active:text-so-color-link-800',
    },
  }

  const backgroundStyles: Record<Theme, Record<ButtonAppearance, string>> = {
    general: {
      primary:
        theme === 'light'
          ? 'bg-so-color-persona-general-600 hover:bg-so-color-persona-general-800 focus:bg-so-color-persona-general-800 active:bg-so-color-persona-general-950'
          : 'bg-so-color-persona-general-400 hover:bg-so-color-persona-general-200 focus:bg-so-color-persona-general-200 active:bg-so-color-persona-general-50',
      ghost:
        theme === 'light'
          ? 'bg-transparent hover:bg-so-color-persona-general-100 focus:bg-so-color-persona-general-100 active:bg-so-color-persona-general-200'
          : 'bg-transparent hover:bg-so-color-persona-general-900 focus:bg-so-color-persona-general-900 active:bg-so-color-persona-general-800',
      secondary:
        theme === 'light'
          ? 'bg-so-color-neutral-100 hover:bg-so-color-neutral-200 focus:bg-so-color-neutral-200 active:bg-so-color-neutral-300'
          : 'bg-so-color-neutral-900 hover:bg-so-color-neutral-800 focus:bg-so-color-neutral-800 active:bg-so-color-neutral-700',
      outline:
        theme === 'light'
          ? 'bg-transparent hover:bg-so-color-persona-general-100 focus:bg-so-color-persona-general-100 active:bg-so-color-persona-general-200 border-2 border-so-color-persona-general-600'
          : 'bg-transparent hover:bg-so-color-persona-general-900 focus:bg-so-color-persona-general-900 active:bg-so-color-persona-general-800 border-2 border-so-color-persona-general-400',
      link: 'bg-transparent',
      'destructive-ghost':
        'bg-transparent hover:bg-so-color-red-100 focus:bg-so-color-red-100 active:bg-so-color-red-200',
      'destructive-outline':
        'bg-transparent hover:bg-so-color-red-100 focus:bg-so-color-red-100 active:bg-so-color-red-200 border-2 border-so-color-red-700',
      destructive:
        theme === 'light'
          ? 'bg-so-color-red-600 hover:bg-so-color-red-800 focus:bg-so-color-red-800 active:bg-so-color-red-950'
          : 'bg-so-color-red-400 hover:bg-so-color-red-200 focus:bg-so-color-red-200 active:bg-so-color-red-50',
      neutral:
        theme === 'light'
          ? 'bg-so-color-neutral-950 hover:bg-so-color-neutral-700 focus:bg-so-color-neutral-700 active:bg-so-color-neutral-500'
          : 'bg-so-color-neutral-50 hover:bg-so-color-neutral-300 focus:bg-so-color-neutral-300 active:bg-so-color-neutral-500',
      start:
        theme === 'light'
          ? 'bg-so-color-green-600 hover:bg-so-color-green-600 focus:bg-so-color-green-600 active:bg-so-color-green-950'
          : 'bg-so-color-green-400 hover:bg-so-color-green-200 focus:bg-so-color-green-200 active:bg-so-color-green-50',
    },
    buyer: {
      primary:
        ' bg-so-color-persona-buyer-600 hover:bg-so-color-persona-buyer-200 focus:bg-so-color-persona-buyer-200 active:bg-so-color-persona-buyer-300',
      ghost:
        'bg-transparent hover:bg-so-color-persona-buyer-100 focus:bg-so-color-persona-buyer-100 active:bg-so-color-persona-buyer-200',
      secondary:
        'bg-so-color-secondary-100 hover:bg-so-color-secondary-200 focus:bg-so-color-secondary-200 active:bg-so-color-secondary-300',
      outline:
        'bg-transparent hover:bg-so-color-persona-buyer-100 focus:bg-so-color-persona-buyer-100 active:bg-so-color-persona-buyer-200 border-2 border-so-color-persona-buyer-700',
      link: 'bg-transparent',
      'destructive-ghost':
        'bg-transparent hover:bg-so-color-destructive-100 focus:bg-so-color-destructive-100 active:bg-so-color-destructive-200',
      'destructive-outline':
        'bg-transparent hover:bg-so-color-destructive-100 focus:bg-so-color-destructive-100 active:bg-so-color-destructive-200 border-2 border-so-color-destructive-700',
      destructive:
        'bg-so-color-destructive-100 hover:bg-so-color-destructive-200 focus:bg-so-color-destructive-200 active:bg-so-color-destructive-300',
      neutral:
        'bg-so-color-neutral-100 hover:bg-so-color-neutral-200 focus:bg-so-color-neutral-200 active:bg-so-color-neutral-300',
      start:
        'bg-so-color-start-100 hover:bg-so-color-start-200 focus:bg-so-color-start-200 active:bg-so-color-start-300',
    },
    vendor: {
      primary:
        'bg-so-color-persona-vendor-600  hover:bg-so-color-persona-vendor-200 focus:bg-so-color-persona-vendor-200 active:bg-so-color-persona-vendor-300',
      ghost:
        'bg-transparent hover:bg-so-color-persona-vendor-100 focus:bg-so-color-persona-vendor-100 active:bg-so-color-persona-vendor-200',
      secondary:
        'bg-so-color-secondary-100 hover:bg-so-color-secondary-200 focus:bg-so-color-secondary-200 active:bg-so-color-secondary-300',
      outline:
        'bg-transparent hover:bg-so-color-persona-vendor-100 focus:bg-so-color-persona-vendor-100 active:bg-so-color-persona-vendor-200 border-2 border-so-color-persona-vendor-700',
      link: 'bg-transparent',
      'destructive-ghost':
        'bg-transparent hover:bg-so-color-destructive-100 focus:bg-so-color-destructive-100 active:bg-so-color-destructive-200',
      'destructive-outline':
        'bg-transparent hover:bg-so-color-destructive-100 focus:bg-so-color-destructive-100 active:bg-so-color-destructive-200 border-2 border-so-color-destructive-700',
      destructive:
        'bg-so-color-destructive-100 hover:bg-so-color-destructive-200 focus:bg-so-color-destructive-200 active:bg-so-color-destructive-300',
      neutral:
        'bg-so-color-neutral-100 hover:bg-so-color-neutral-200 focus:bg-so-color-neutral-200 active:bg-so-color-neutral-300',
      start:
        'bg-so-color-start-100 hover:bg-so-color-start-200 focus:bg-so-color-start-200 active:bg-so-color-start-300',
    },
  }

  const baseClasses = `font-open-sans min-h-12 flex justify-center items-center gap-2 p-3 rounded-lg cursor-pointer focus:ring-5 focus:ring-so-color-sky-500 focus:outline-none ring-offset-2 font-bold disabled:opacity-80 disabled:cursor-not-allowed`

  return (
    <>
      {isSkeletonLoading ? (
        <Skeleton width={207} height={48} />
      ) : (
        <button
          type={type}
          onClick={onClick}
          disabled={disabled || loading}
          className={`${baseClasses} ${backgroundStyles[semantic][appearance]} ${textColors[semantic][appearance]} ${className}`}
        >
          {iconOnly ? (
            <div
              style={{ fontSize: iconSize }}
              className="flex items-center justify-center"
            >
              {icon}
            </div>
          ) : (
            <>
              {iconLeading && icon && (
                <div
                  style={{ fontSize: iconSize }}
                  className="flex items-center"
                >
                  {icon}
                </div>
              )}
              <span className={`${textSizeClasses[size]} ${labelClassName}`}>
                {loading ? loadingText : label}
              </span>
              {iconTrailing && icon && (
                <div
                  style={{ fontSize: iconSize }}
                  className="flex items-center"
                >
                  {icon}
                </div>
              )}
            </>
          )}
        </button>
      )}
    </>
  )
}

export default Button
