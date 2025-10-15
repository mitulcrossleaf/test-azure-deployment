'use client'

import { cn } from '@/lib/utils'

import { useRef, useState } from 'react'
import DatePicker from './DatePicker'
import Popup from './Popup'

export type InputDateProps = {
  name?: string
  value?: string
  onChange?: (value: string) => void
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void
  label?: string
  trailingLabel?: string
  error?: string
  hintText?: string
  className?: string
  inputClassName?: string
  icon?: React.ReactNode
  leadingIcon?: React.ReactNode
  trailingIcon?: React.ReactNode
  disablePastDates?: boolean
}

export default function InputDate({
  name,
  value,
  onChange,
  onBlur,
  label,
  trailingLabel,
  error,
  hintText,
  className = '',
  inputClassName,
  leadingIcon,
  trailingIcon,
  icon,
  disablePastDates = false,
}: InputDateProps) {
  const [open, setOpen] = useState(false)
  const triggerRef = useRef<HTMLDivElement | null>(null)
  const popupRef = useRef<HTMLDivElement | null>(null)

  const handleDateChange = (v: string) => {
    onChange?.(v)
    setOpen(false)
  }

  return (
    <div className={cn('flex w-full flex-col gap-4', className)}>
      {label && (
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <label className="text-so-color-neutral-950 text-lg font-bold">
              {label}
            </label>
            {trailingLabel && (
              <span className="text-so-color-neutral-600 text-base">
                {trailingLabel}
              </span>
            )}
          </div>
          {hintText && (
            <span className="text-so-color-neutral-600 font-open-sans text-base">
              {hintText}
            </span>
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

      <div className="relative">
        <div
          ref={triggerRef}
          className={cn(
            'group flex h-12 cursor-pointer items-center rounded-lg border-2 bg-white px-4 py-3',
            leadingIcon || trailingIcon ? 'gap-3' : 'gap-6',
            error ? 'border-so-color-red-700' : 'border-so-color-neutral-950'
          )}
          onMouseDown={e => {
            // Prevent blur event from firing when clicking to open
            e.preventDefault()
          }}
          onClick={() => setOpen(true)}
        >
          {leadingIcon && (
            <div className="text-so-color-neutral-600 flex-shrink-0 cursor-pointer">
              {icon}
            </div>
          )}
          <input
            name={name}
            readOnly
            value={value ?? ''}
            onBlur={onBlur}
            className={cn(
              'font-open-sans w-full cursor-pointer focus:outline-none disabled:cursor-not-allowed',
              inputClassName
            )}
            placeholder="MM-DD-YYYY"
          />
          {trailingIcon && (
            <div className="text-so-color-neutral-600 flex-shrink-0 cursor-pointer">
              {icon}
            </div>
          )}
        </div>

        <Popup
          isOpen={open}
          onClose={() => setOpen(false)}
          position="bottom-right"
          triggerRef={triggerRef}
          className="mt-2 w-full max-w-[380px]"
        >
          <div
            ref={popupRef}
            onMouseDown={e => {
              e.preventDefault()
            }}
          >
            <DatePicker
              value={value}
              onChange={handleDateChange}
              disablePastDates={disablePastDates}
            />
          </div>
        </Popup>
      </div>
    </div>
  )
}
