'use client'
import { cn } from '@/lib'
import {
  ChangeEvent,
  FC,
  KeyboardEvent,
  useCallback,
  useMemo,
  useState,
} from 'react'
export interface CheckBoxProps {
  label?: string
  checked: boolean
  onChange: (checked: boolean) => void
  appearance?: 'regular' | 'bold'
  size?: 'medium' | 'large'
  error?: boolean
  required?: boolean
  disabled?: boolean
  theme?: 'light' | 'dark'
  className?: string
  id?: string
  name?: string
  'data-testid'?: string
}

const THEME_CONFIGS = {
  light: {
    background: {
      checked: 'bg-so-color-neutral-black',
      unchecked: 'bg-so-color-neutral-white',
    },
    icon: 'text-so-color-neutral-white',
    border: 'border-so-color-neutral-950',
    hover: 'hover:border-so-color-neutral-700',
    label: 'text-so-color-neutral-black',
  },
  dark: {
    background: {
      checked: 'bg-so-color-neutral-white',
      unchecked: 'bg-so-color-neutral-black',
    },
    icon: 'text-so-color-neutral-black',
    border: 'border-so-color-neutral-white',
    hover: 'hover:border-so-color-neutral-300',
    label: 'text-so-color-neutral-white',
  },
} as const

const SIZE_CONFIGS = {
  medium: {
    checkbox: 'w-8 h-8',
    text: 'text-sm leading-5',
    icon: { width: 19, height: 14 },
  },
  large: {
    checkbox: 'w-10 h-10',
    text: 'text-base leading-6',
    icon: { width: 22, height: 17 },
  },
} as const

const APPEARANCE_CONFIGS = {
  regular: {
    label: 'font-normal',
    checkbox: 'font-normal',
  },
  bold: {
    label: 'font-bold',
    checkbox: 'font-bold',
  },
} as const

const CheckBox: FC<CheckBoxProps> = ({
  label = '',
  checked = false,
  onChange,
  appearance = 'regular',
  size = 'medium',
  error = false,
  required = false,
  disabled = false,
  theme = 'light',
  className = '',
  id,
  name,
  'data-testid': dataTestId,
}) => {
  const [focused, setFocused] = useState(false)

  const sizeConfig = useMemo(() => SIZE_CONFIGS[size], [size])
  const appearanceConfig = useMemo(
    () => APPEARANCE_CONFIGS[appearance],
    [appearance]
  )
  const themeConfig = useMemo(() => THEME_CONFIGS[theme], [theme])

  const handleChange = useCallback(
    (newChecked: boolean) => {
      if (disabled) return
      onChange?.(newChecked)
    },
    [onChange, disabled]
  )

  const handleInputChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      handleChange(e.target.checked)
    },
    [handleChange]
  )

  const handleClick = useCallback(() => {
    handleChange(!checked)
  }, [handleChange, checked])

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLDivElement>) => {
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault()
        handleChange(!checked)
      }
    },
    [handleChange, checked]
  )

  const handleFocus = useCallback(() => setFocused(true), [])
  const handleBlur = useCallback(() => setFocused(false), [])

  const checkboxClasses = useMemo(() => {
    const baseClasses = [
      sizeConfig.checkbox,
      'border-2',
      'rounded',
      'flex cursor-pointer items-center justify-center',
      'transition-all duration-200',
      appearanceConfig.checkbox,
    ]

    const stateClasses = [
      error ? 'border-so-color-red-500' : themeConfig.border,
      focused ? 'ring-4 ring-so-color-persona-general-500' : '',
      checked
        ? themeConfig.background.checked
        : themeConfig.background.unchecked,
      !error && !disabled ? themeConfig.hover : '',
      disabled ? 'opacity-50 cursor-not-allowed' : '',
    ]

    return [...baseClasses, ...stateClasses].filter(Boolean).join(' ')
  }, [
    sizeConfig,
    appearanceConfig,
    themeConfig,
    error,
    focused,
    checked,
    disabled,
  ])

  const labelClasses = useMemo(
    () =>
      [
        sizeConfig.text,
        appearanceConfig.label,
        themeConfig.label,
        'select-none',
        disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer',
      ].join(' '),
    [sizeConfig, appearanceConfig, themeConfig, disabled]
  )

  const containerClasses = useMemo(
    () => ['flex items-center gap-3', className].join(' '),
    [className]
  )

  const checkboxId = useMemo(
    () => id || `checkbox-${Math.random().toString(36).substr(2, 9)}`,
    [id]
  )

  return (
    <div className={containerClasses}>
      <div className="relative">
        <input
          id={checkboxId}
          name={name}
          type="checkbox"
          checked={checked}
          onChange={handleInputChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          required={required}
          disabled={disabled}
          className="sr-only"
          data-testid={dataTestId}
        />

        <div
          className={checkboxClasses}
          onClick={handleClick}
          onKeyDown={handleKeyDown}
          tabIndex={disabled ? -1 : 0}
          role="checkbox"
          aria-checked={checked}
          aria-labelledby={label ? `${checkboxId}-label` : undefined}
          aria-required={required}
          aria-invalid={error}
          aria-disabled={disabled}
        >
          {checked && (
            <i
              className={cn(themeConfig.icon, 'material-symbols-outlined')}
              aria-hidden="true"
            >
              check
            </i>
          )}
        </div>
      </div>

      {label && (
        <label
          id={`${checkboxId}-label`}
          htmlFor={checkboxId}
          className={labelClasses}
        >
          {label}
          {required && (
            <span className="text-so-color-red-500 ml-1" aria-label="required">
              *
            </span>
          )}
        </label>
      )}
    </div>
  )
}

export default CheckBox
