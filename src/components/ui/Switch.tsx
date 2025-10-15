import { cn } from '@/lib/utils'
import React from 'react'
export interface SwitchProps {
  label?: string
  enabled: boolean
  onChange: (enabled: boolean) => void
  disabled?: boolean
  className?: string
  theme?: 'light' | 'dark'
}

const Switch: React.FC<SwitchProps> = ({
  label,
  enabled = false,
  onChange,
  disabled = false,
  className,
  theme = 'light',
}) => {
  const handleToggle = () => {
    if (disabled) return
    onChange?.(!enabled)
  }

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <button
        type="button"
        role="switch"
        aria-checked={enabled}
        aria-label={label}
        disabled={disabled}
        tabIndex={0}
        onClick={handleToggle}
        onKeyDown={e => {
          if ((e.key === ' ' || e.key === 'Enter') && !disabled) {
            e.preventDefault()
            handleToggle()
          }
        }}
        className={cn(
          'relative inline-flex w-16 items-center rounded-full px-1 py-1 transition-colors duration-300 ease-in-out',
          enabled
            ? theme === 'dark'
              ? 'bg-so-color-green-400'
              : 'bg-so-color-green-600'
            : theme === 'dark'
              ? 'bg-so-color-neutral-400'
              : 'bg-so-color-neutral-950',
          disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
        )}
      >
        <span
          className={cn(
            'inline-block h-6 w-6 rounded-full shadow-lg transition-transform duration-300 ease-in-out',
            theme === 'dark' ? 'bg-so-color-neutral-950' : 'bg-white',
            enabled ? 'translate-x-8' : 'translate-x-0'
          )}
        />
      </button>

      {label && (
        <label
          className={cn(
            'button-label-base font-bold select-none',
            disabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer',
            theme === 'dark' ? 'text-white' : 'text-so-color-neutral-600'
          )}
        >
          {label}
        </label>
      )}
    </div>
  )
}

export default Switch
