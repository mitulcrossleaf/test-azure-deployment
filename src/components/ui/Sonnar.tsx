import { cn } from '@/lib'
import React from 'react'
import Button, { Theme } from './Button'

export type SonnarType =
  | 'success'
  | 'danger'
  | 'information'
  | 'warning'
  | 'discovery'
export type SonnarTheme = 'light' | 'dark'

export interface Link {
  label: string
  onClick: () => void
  semantic?: Theme
}

export interface SonnarProps {
  type?: SonnarType
  label: string
  message?: string | React.ReactNode
  validationErrors?: string[]
  links?: Link[]
  onClose?: () => void
  theme?: SonnarTheme
}

const lightTypeStyles: Record<SonnarType, string> = {
  success:
    'border-t-4 border-so-color-green-600 bg-so-color-green-50 text-so-color-neutral-950',
  danger:
    'border-t-4 border-so-color-red-700 bg-so-color-red-50 text-so-color-neutral-950',
  information:
    'border-t-4 border-so-color-sky-600 bg-so-color-sky-50 text-so-color-neutral-950',
  warning:
    'border-t-4 border-so-color-yellow-600 bg-so-color-yellow-50 text-so-color-neutral-950',
  discovery:
    'border-t-4 border-so-color-purple-600 bg-so-color-purple-50 text-so-color-neutral-950',
}

const darkTypeStyles: Record<SonnarType, string> = {
  success:
    'border-t-4 border-so-color-green-400 bg-so-color-green-950 text-so-color-neutral-50',
  danger:
    'border-t-4 border-so-color-red-300 bg-so-color-red-950 text-so-color-neutral-50',
  information:
    'border-t-4 border-so-color-sky-300 bg-color-sky-950 text-so-color-neutral-50',
  warning:
    'border-t-4 border-so-color-yellow-300 bg-so-color-yellow-950 text-so-color-neutral-50',
  discovery:
    'border-t-4 border-so-color-purple-300 bg-so-color-purple-950 text-so-color-neutral-50',
}

const renderIcon = (type: SonnarType, theme: SonnarTheme) => {
  const iconColorByType: Record<SonnarType, Record<SonnarTheme, string>> = {
    success: {
      light: 'text-so-color-green-600',
      dark: 'text-so-color-green-400 ',
    },
    danger: { light: 'text-so-color-red-700', dark: 'text-so-color-red-300' },
    information: {
      light: 'text-so-color-sky-600',
      dark: 'text-so-color-sky-300',
    },
    warning: {
      light: 'text-so-color-yellow-600',
      dark: 'text-so-color-yellow-300',
    },
    discovery: {
      light: 'text-so-color-purple-600',
      dark: 'text-so-color-purple-300',
    },
  }
  const iconClassName = iconColorByType[type][theme]
  switch (type) {
    case 'success':
      return (
        <i
          className={cn(
            'material-symbols-outlined !text-[26px]',
            iconClassName
          )}
        >
          check_circle
        </i>
      )
    case 'danger':
      return (
        <i
          className={cn(
            'material-symbols-outlined !text-[26px]',
            iconClassName
          )}
        >
          error
        </i>
      )
    case 'information':
      return (
        <i
          className={cn(
            'material-symbols-outlined !text-[26px]',
            iconClassName
          )}
        >
          info
        </i>
      )
    case 'warning':
      return (
        <i
          className={cn(
            'material-symbols-outlined !text-[26px]',
            iconClassName
          )}
        >
          warning
        </i>
      )
    case 'discovery':
      return (
        <i
          className={cn(
            'material-symbols-outlined !text-[26px]',
            iconClassName
          )}
        >
          help
        </i>
      )
    default:
      return (
        <i className={cn('material-symbols-outlined', iconClassName)}>
          check_circle
        </i>
      )
  }
}

const Sonnar: React.FC<SonnarProps> = ({
  type = 'success',
  label,
  message,
  validationErrors,
  links,
  onClose,
  theme = 'light',
}) => {
  return (
    <div
      className={`relative flex w-full max-w-[384px] flex-col gap-4 px-4 py-6 ${
        theme === 'dark' ? darkTypeStyles[type] : lightTypeStyles[type]
      }`}
    >
      <div className="flex w-full items-center justify-between">
        <div className="flex items-center gap-3">{renderIcon(type, theme)}</div>
        <div
          onClick={onClose}
          className="flex cursor-pointer items-center gap-3"
        >
          <i className="material-symbols-outlined">close</i>
        </div>
      </div>

      <h3
        className={`heading-h2-sm ${theme === 'dark' ? 'text-white' : 'text-so-color-neutral-950'} font-bold`}
      >
        {label}
      </h3>

      {message && (
        <p
          className={`body-base font-normal break-all ${
            theme === 'dark'
              ? 'text-so-color-neutral-50'
              : 'text-so-color-neutral-950'
          }`}
        >
          {message}
        </p>
      )}

      {validationErrors && validationErrors.length > 0 && (
        <ul
          className={`body-base flex list-inside list-disc flex-col gap-2 font-normal ${
            theme === 'dark' ? 'text-so-color-red-300' : 'text-so-color-red-700'
          }`}
        >
          {validationErrors.map((err, i) => (
            <li key={i}>{err}</li>
          ))}
        </ul>
      )}

      {links && (
        <div className="flex flex-col items-start gap-2">
          {links.map((link, i) => (
            <Button
              key={i}
              label={link?.label}
              appearance="ghost"
              semantic={link?.semantic || 'general'}
              onClick={link.onClick}
              size="base"
              theme={theme}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default Sonnar
