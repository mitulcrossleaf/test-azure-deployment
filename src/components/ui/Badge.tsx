import { Mode } from '@/types/global'

export type BadgeAppearance =
  | 'primary'
  | 'success'
  | 'warning'
  | 'destructive'
  | 'default'
  | 'default-subtle'
  | 'primary-subtle'
  | 'success-subtle'
  | 'warning-subtle'
  | 'destructive-subtle'

export type BadgeSize = 'small' | 'medium' | 'large'

export interface BadgeProps {
  appearance?: BadgeAppearance
  theme?: Mode
  size?: BadgeSize
  label?: string
  icon?: React.ReactNode
  iconLeading?: boolean
  iconTrailing?: boolean
  className?: string
}

const Badge = ({
  appearance = 'default',
  theme = 'light',
  size = 'medium',
  label = 'Badge',
  icon,
  iconLeading = false,
  iconTrailing = false,
  className,
}: BadgeProps) => {
  const typographyStyles = {
    small:
      'font-normal text-sm leading-tight tracking-normal w-fit align-middle',
    medium:
      'font-bold text-base leading-normal tracking-normal w-fit align-middle',
    large:
      'font-bold text-2xl leading-tight tracking-normal w-fit align-middle',
  }

  const textColors: Record<Mode, Record<BadgeAppearance, string>> = {
    light: {
      default: 'text-white',
      primary: 'text-white',
      success: 'text-white',
      warning: 'text-so-color-neutral-950',
      destructive: 'text-white',
      'default-subtle': 'text-so-color-neutral-700',
      'primary-subtle': 'text-so-color-persona-general-700',
      'success-subtle': 'text-so-color-green-700',
      'warning-subtle': 'text-so-color-yellow-700',
      'destructive-subtle': 'text-so-color-red-700',
    },
    dark: {
      default: 'text-so-color-neutral-950',
      primary: 'text-so-color-neutral-950',
      success: 'text-so-color-neutral-950',
      warning: 'text-white',
      destructive: 'text-so-color-neutral-950',
      'default-subtle': 'text-white',
      'primary-subtle': 'text-so-color-persona-general-50',
      'success-subtle': 'text-so-color-green-300',
      'warning-subtle': 'text-so-color-yellow-300',
      'destructive-subtle': 'text-so-color-red-300',
    },
  }

  const backgroundStyles: Record<Mode, Record<BadgeAppearance, string>> = {
    light: {
      default: 'bg-so-color-neutral-950',
      primary: 'bg-so-color-persona-general-600',
      success: 'bg-so-color-green-600',
      warning: 'bg-so-color-yellow-400',
      destructive: 'bg-so-color-red-600',
      'default-subtle': 'bg-so-color-neutral-200',
      'primary-subtle': 'bg-so-color-persona-general-50',
      'success-subtle': 'bg-so-color-green-50',
      'warning-subtle': 'bg-so-color-yellow-50',
      'destructive-subtle': 'bg-so-color-red-50',
    },
    dark: {
      default: 'bg-so-color-neutral-50',
      primary: 'bg-so-color-persona-general-400',
      success: 'bg-so-color-green-400',
      warning: 'bg-so-color-yellow-600',
      destructive: 'bg-so-color-red-400',
      'default-subtle': 'bg-so-color-neutral-800',
      'primary-subtle': 'bg-so-color-persona-general-950',
      'success-subtle': 'bg-so-color-green-800',
      'warning-subtle': 'bg-so-color-yellow-800',
      'destructive-subtle': 'bg-so-color-red-800',
    },
  }

  const paddingStyles = {
    small: 'px-2 py-1',
    medium: 'px-2 py-1',
    large: 'px-4 py-2',
  }

  const isSubtleVariant = appearance.includes('-subtle')
  const isValidSizeForSubtle = size === 'small' || size === 'medium'

  const effectiveAppearance =
    isSubtleVariant && !isValidSizeForSubtle
      ? (appearance.replace('-subtle', '') as BadgeAppearance)
      : appearance

  const baseClasses = `inline-flex text-nowrap items-center gap-1 rounded-full ${typographyStyles[size]} ${paddingStyles[size]}  ${backgroundStyles[theme][effectiveAppearance]} ${textColors[theme][effectiveAppearance]} ${className}`

  return (
    <span className={`${baseClasses}`}>
      {iconLeading && icon}
      {label}
      {iconTrailing && icon}
    </span>
  )
}

export default Badge
