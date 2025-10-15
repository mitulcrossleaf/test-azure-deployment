'use client'
import { cn } from '@/lib/utils'

import CheckBox from './CheckBox'
import HintExpander from './HintExpander'

export type InputCheckboxGroupProps = {
  label?: string
  error?: string
  className?: string
  options?: {
    value: string
    label: string
    description?: string
  }[]
  name?: string
  value?: string[]
  onChange?: (value: string[]) => void
  trailingLabel?: string
  labelClassName?: string
  hintExpander?: boolean
  hintText?: string
  hintContent?: string
  hintImage?: string
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange'>

const InputCheckboxGroup = ({
  label,
  error,
  className = '',
  options = [],
  name,
  value = [],
  onChange,
  trailingLabel,
  labelClassName,
  hintExpander = false,
  hintText,
  hintContent,
  hintImage,
  ...props
}: InputCheckboxGroupProps) => {
  const handleCheckboxChange = (optionValue: string, isChecked: boolean) => {
    const currentValues = Array.isArray(value) ? [...value] : []
    const newValues = isChecked
      ? [...currentValues, optionValue]
      : currentValues.filter(val => val !== optionValue)

    onChange?.(newValues)
  }

  return (
    <div className={`flex w-full flex-col gap-6 ${className}`}>
      {label && (
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <label
              className={cn(
                'text-so-color-neutral-950 font-raleway text-lg font-bold',
                labelClassName
              )}
            >
              {label}
            </label>
            {trailingLabel && (
              <span className="text-so-color-neutral-600 text-base">
                {trailingLabel}
              </span>
            )}
          </div>
          {error && (
            <div className="text-so-color-red-700 flex items-center gap-2">
              <i className="material-symbols-outlined flex-shrink-0 !leading-none">
                info
              </i>
              <p className="font-open-sans text-base">{error}</p>
            </div>
          )}
        </div>
      )}
      <div className="space-y-4">
        {options.map(option => (
          <div key={option.value} className={cn('group flex flex-col gap-6')}>
            <CheckBox
              checked={value?.includes(option.value) || false}
              label={option.label}
              name={name}
              onChange={checked => handleCheckboxChange(option.value, checked)}
              {...props}
              size="medium"
              appearance="regular"
              className="max-w-[544px]"
            />
          </div>
        ))}
        {hintExpander && hintText && (
          <HintExpander
            label={hintText}
            content={hintContent || hintText}
            image={
              (hintImage && { src: hintImage, alt: hintText }) || undefined
            }
          />
        )}
      </div>
    </div>
  )
}

export default InputCheckboxGroup
