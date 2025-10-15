'use client'
import { cn } from '@/lib/utils'
import HintExpander from './HintExpander'
import InputRadio from './InputRadio'

export type InputRadioCardGroupProps = {
  label?: string
  error?: string
  className?: string
  options?: {
    value: string
    label: string
    description?: string
  }[]
  name?: string
  value?: string
  onChange?: (value: string) => void
  trailingLabel?: string
  labelClassName?: string
  hintExpander?: boolean
  hintText?: string
  hintContent?: string
  hintImage?: string
  hintLabel?: string
  hintTextSize?: 'small' | 'medium'
  labelSize?: 'base' | 'large' | 'h1'
  radioSize?: 'small' | 'large'
  radioAppearance?: 'bold' | 'regular'
} & React.InputHTMLAttributes<HTMLInputElement>

const InputRadioCardGroup = ({
  label,
  error,
  className = '',
  options = [],
  name,
  value,
  onChange,
  trailingLabel,
  labelClassName,
  hintExpander = false,
  hintText,
  hintContent,
  hintImage,
  hintLabel,
  hintTextSize = 'medium',
  labelSize = 'large',
  radioSize = 'large',
  radioAppearance = 'bold',
  ...props
}: InputRadioCardGroupProps) => {
  return (
    <div className={`flex w-full flex-col gap-6 ${className}`}>
      {label && (
        <div {...props}>
          <div className="flex items-center gap-2">
            <label
              className={cn(
                'text-so-color-neutral-950 font-raleway font-bold',
                {
                  'text-lg': labelSize === 'base',
                  'text-2xl': labelSize === 'large',
                  'text-3xl': labelSize === 'h1',
                },
                labelClassName
              )}
            >
              {label}
            </label>
            {trailingLabel && (
              <span className="text-so-color-neutral-600 font-open-sans text-base">
                {trailingLabel}
              </span>
            )}
          </div>

          {hintText && (
            <p
              className={cn('text-so-color-neutral-600 font-open-sans mt-2', {
                'text-sm': hintTextSize === 'small',
                'text-base': hintTextSize === 'medium',
              })}
            >
              {hintText}
            </p>
          )}

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
          <label
            key={option.value}
            className={cn(
              'group hover:bg-so-color-neutral-100 flex flex-col gap-6 rounded-lg border-2 p-6',
              value === option.value
                ? 'border-so-color-persona-general-600 bg-so-color-persona-general-50'
                : 'border-so-color-neutral-950 bg-white'
            )}
          >
            <InputRadio
              checked={value === option.value}
              label={option.label}
              name={name}
              value={option.value}
              onChange={onChange}
              {...props}
              size={radioSize}
              appearance={radioAppearance}
            />
            {option.description && (
              <p className="text-so-color-neutral-950 font-open-sans text-base">
                {option.description}
              </p>
            )}
          </label>
        ))}
        {hintExpander && hintLabel && (
          <HintExpander
            label={hintLabel}
            content={hintContent || hintLabel}
            image={
              (hintImage && { src: hintImage, alt: hintLabel }) || undefined
            }
          />
        )}
      </div>
    </div>
  )
}
export default InputRadioCardGroup
