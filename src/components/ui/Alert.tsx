import { cn } from '@/lib/utils'
import { ReactElement } from 'react'
import Skeleton from 'react-loading-skeleton'
import Button, { ButtonProps } from './Button'

import { ReactNode } from 'react'

export type AlertVariant =
  | 'information'
  | 'accent'
  | 'success'
  | 'warning'
  | 'destructive'

export type AlertAction = Omit<ButtonProps, 'label'> & {
  label: string
}

export type AlertProps = {
  variant?: AlertVariant
  title: string
  description?: string | ReactNode
  className?: string
  primaryAction?: AlertAction
  secondaryAction?: AlertAction
  icon?: ReactNode
  validationErrors?: string[]
  theme?: 'light' | 'dark'
  loading?: boolean
  validationErrorsClassName?: string
}

const lightVariantStyles: Record<
  AlertVariant,
  { bg: string; border: string; icon: string; text: string }
> = {
  information: {
    bg: 'bg-so-color-sky-50',
    border: 'border-l-[4px] border-so-color-sky-600',
    icon: 'text-so-color-sky-600',
    text: 'text-so-color-neutral-950',
  },
  accent: {
    bg: 'bg-so-color-purple-50',
    border: 'border-l-[4px] border-so-color-purple-600',
    icon: 'text-so-color-purple-600',
    text: 'text-so-color-neutral-950',
  },
  success: {
    bg: 'bg-so-color-green-50',
    border: 'border-l-[4px] border-so-color-green-600',
    icon: 'text-so-color-green-600',
    text: 'text-so-color-neutral-950',
  },
  warning: {
    bg: 'bg-so-color-yellow-50',
    border: 'border-l-[4px] border-so-color-yellow-600',
    icon: 'text-so-color-yellow-600',
    text: 'text-so-color-neutral-950',
  },
  destructive: {
    bg: 'bg-so-color-red-50',
    border: 'border-l-[4px] border-so-color-red-700',
    icon: 'text-so-color-red-700',
    text: 'text-so-color-neutral-950',
  },
}

const darkVariantStyles: Record<
  AlertVariant,
  { bg: string; border: string; icon: string; text: string }
> = {
  information: {
    bg: 'bg-so-color-sky-950',
    border: 'border-l-[4px] border-so-color-sky-300',
    icon: 'text-so-color-sky-300',
    text: 'text-so-color-neutral-50',
  },
  accent: {
    bg: 'bg-so-color-purple-950',
    border: 'border-l-[4px] border-so-color-purple-300',
    icon: 'text-so-color-purple-300',
    text: 'text-so-color-neutral-50',
  },
  success: {
    bg: 'bg-so-color-green-950',
    border: 'border-l-[4px] border-so-color-green-400',
    icon: 'text-so-color-green-400',
    text: 'text-so-color-neutral-50',
  },
  warning: {
    bg: 'bg-so-color-yellow-950',
    border: 'border-l-[4px] border-so-color-yellow-300',
    icon: 'text-so-color-yellow-300',
    text: 'text-so-color-neutral-50',
  },
  destructive: {
    bg: 'bg-so-color-red-950',
    border: 'border-l-[4px] border-so-color-red-300',
    icon: 'text-so-color-red-300',
    text: 'text-so-color-neutral-50',
  },
}

const defaultIconByVariant: Record<
  AlertVariant,
  (props: { className?: string }) => ReactElement
> = {
  information: ({ className }) => (
    <i className={cn('material-symbols-outlined', className)}>info</i>
  ),
  accent: ({ className }) => (
    <i className={cn('material-symbols-outlined', className)}>help</i>
  ),
  success: ({ className }) => (
    <i className={cn('material-symbols-outlined', className)}>check_circle</i>
  ),
  warning: ({ className }) => (
    <i className={cn('material-symbols-outlined', className)}>warning</i>
  ),
  destructive: ({ className }) => (
    <i className={cn('material-symbols-outlined', className)}>error</i>
  ),
}

export default function Alert(props: AlertProps) {
  const {
    variant = 'information',
    title,
    description,
    className,
    primaryAction,
    secondaryAction,
    icon,
    validationErrors,
    theme = 'light',
    loading = false,
    validationErrorsClassName,
  } = props

  const styles =
    theme === 'dark' ? darkVariantStyles[variant] : lightVariantStyles[variant]
  const Icon = defaultIconByVariant[variant]

  return (
    <>
      {loading ? (
        <Skeleton width={'100%'} height={180} />
      ) : (
        <div
          role="status"
          className={cn(
            'relative w-full p-6',
            'flex items-start gap-4',
            styles.bg,
            styles.border,
            styles.text,
            className
          )}
        >
          <div className="shrink-0">
            {icon ? (
              <div className={cn('mt-1 size-6', styles.icon)}>{icon}</div>
            ) : (
              <Icon className={cn('mt-1 size-6', styles.icon)} />
            )}
          </div>
          <div className="flex min-w-0 flex-col gap-4">
            <h3 className="font-raleway heading-h3-base font-bold">{title}</h3>
            {description ? (
              typeof description === 'string' ? (
                <p className="body-base">{description}</p>
              ) : (
                description
              )
            ) : null}

            {validationErrors && validationErrors.length > 0 && (
              <ul
                className={`body-base flex list-inside list-disc flex-col gap-2 font-normal ${
                  theme === 'dark'
                    ? 'text-so-color-red-300'
                    : 'text-so-color-red-700'
                }`}
              >
                {validationErrors.map((err, i) => (
                  <li key={i} className={validationErrorsClassName}>
                    {err}
                  </li>
                ))}
              </ul>
            )}
            {(primaryAction || secondaryAction) && (
              <div className="flex items-center gap-4">
                {primaryAction ? (
                  <Button
                    {...primaryAction}
                    appearance={primaryAction.appearance}
                    semantic={primaryAction.semantic || 'general'}
                    size={primaryAction.size || 'base'}
                  />
                ) : null}
                {secondaryAction ? (
                  <Button
                    {...secondaryAction}
                    appearance={secondaryAction.appearance || 'ghost'}
                    semantic={secondaryAction.semantic || 'general'}
                    size={secondaryAction.size || 'base'}
                  />
                ) : null}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}
