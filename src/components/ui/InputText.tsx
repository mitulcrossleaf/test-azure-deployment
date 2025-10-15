'use client'
import { cn } from '@/lib/utils'
import React, { useState } from 'react'
import HintExpander from './HintExpander'

export type InputTextProps = {
  label?: string
  required?: boolean
  className?: string
  options?: {
    value: string
    label: string
    description?: string
  }[]
  name?: string
  value?: string
  error?: string
  iconLeading?: boolean
  iconTrailing?: boolean
  icon?: React.ReactNode
  inputClassName?: string
  inputParentClassName?: string
  showOptional?: boolean
  labelClassName?: string
  hintText?: string
  hintExpander?: boolean
  hintExpanderLabel?: string
  hintExpanderContent?: string
  hintExpanderimageSrc?: string
  hintExpanderimageAlt?: string

  onChange?: (value: string) => void
  trailingLabel?: string

  hintExpanderDefaultExpanded?: boolean
  onHintExpanderToggle?: (expanded: boolean) => void
  inputFilter?: RegExp // Regex pattern to filter input characters
} & React.InputHTMLAttributes<HTMLInputElement>

const InputText = ({
  label,
  error,
  className = '',
  iconLeading,
  iconTrailing,
  icon,
  inputClassName,
  trailingLabel,
  type,
  labelClassName,
  hintText,
  hintExpander = false,
  hintExpanderLabel = "Why can't I edit this?",
  hintExpanderContent = 'A driver’s licence number is 15 characters in length; the first character is a letter and the next 14 are numbers. The last two characters must be a number from 01 to 31.',
  hintExpanderimageSrc,
  hintExpanderimageAlt,
  hintExpanderDefaultExpanded = false,
  onHintExpanderToggle,
  inputParentClassName,
  inputFilter,
  ...props
}: InputTextProps) => {
  const inputId = React.useId()
  const [showPassword, setShowPassword] = useState(false)
  const inputType = type === 'password' && showPassword ? 'text' : type

  // Handle input filtering based on regex pattern
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (inputFilter && e.key.length === 1) {
      // Allow keyboard shortcuts with modifier keys (Cmd, Ctrl, Alt)
      const hasModifier = e.metaKey || e.ctrlKey || e.altKey

      if (!hasModifier && !inputFilter.test(e.key)) {
        e.preventDefault()
      }
    }
    // Call original onKeyDown if provided
    if (props.onKeyDown) {
      props.onKeyDown(e)
    }
  }

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    if (inputFilter) {
      const pastedText = e.clipboardData.getData('text')
      const filteredText = pastedText
        .split('')
        .filter(char => inputFilter.test(char))
        .join('')

      if (filteredText !== pastedText) {
        e.preventDefault()
        // Update the input value with filtered text
        const target = e.target as HTMLInputElement
        const currentValue = target.value
        const selectionStart = target.selectionStart || 0
        const selectionEnd = target.selectionEnd || 0
        const newValue =
          currentValue.slice(0, selectionStart) +
          filteredText +
          currentValue.slice(selectionEnd)

        // Trigger onChange if provided
        if (props.onChange) {
          const syntheticEvent = {
            ...e,
            target: { ...target, value: newValue },
          } as React.ChangeEvent<HTMLInputElement>
          props.onChange(syntheticEvent)
        }
      }
    }
    // Call original onPaste if provided
    if (props.onPaste) {
      props.onPaste(e)
    }
  }

  return (
    <div className={`flex w-full flex-col gap-4 ${className}`}>
      {label && (
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <label
              htmlFor={inputId}
              className={cn(
                'text-so-color-neutral-950 text-lg font-bold',
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

      <div className="space-y-4">
        {type === 'area' ? (
          <div
            className={cn(
              'group rounded-lg border-2 bg-white px-4 py-2',
              error ? 'border-so-color-red-700' : 'border-so-color-neutral-950',
              props.disabled && 'bg-so-color-neutral-200 cursor-not-allowed'
            )}
          >
            <textarea
              id={inputId}
              className={cn(
                'font-open-sans min-h-[144px] w-full resize-y focus:outline-none disabled:cursor-not-allowed',
                inputClassName
              )}
              {...(props as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
            />
          </div>
        ) : (
          <div
            className={cn(
              'group flex h-12 items-center gap-6 rounded-lg border-2 bg-white px-4 py-3',
              error ? 'border-so-color-red-700' : 'border-so-color-neutral-950',
              props.disabled && 'bg-so-color-neutral-200 cursor-not-allowed',
              inputParentClassName
            )}
          >
            {iconLeading && <span className="flex-shrink-0">{icon}</span>}
            <input
              id={inputId}
              type={inputType}
              className={cn(
                'font-open-sans w-full focus:outline-none disabled:cursor-not-allowed',
                inputClassName
              )}
              {...props}
              onKeyDown={handleKeyDown}
              onPaste={handlePaste}
            />
            {type === 'password' ? (
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="flex-shrink-0 !leading-none focus:outline-none"
                tabIndex={-1}
              >
                <i className="material-symbols-outlined text-so-color-neutral-950 !leading-none">
                  {showPassword ? 'visibility_off' : 'visibility'}
                </i>
              </button>
            ) : iconTrailing ? (
              <span className="flex-shrink-0">{icon}</span>
            ) : null}
          </div>
        )}
        {hintExpander && hintExpanderContent && (
          <HintExpander
            label={hintExpanderLabel}
            content={hintExpanderContent}
            defaultExpanded={hintExpanderDefaultExpanded}
            onToggle={onHintExpanderToggle}
            image={{
              src: hintExpanderimageSrc ?? '',
              alt: hintExpanderimageAlt ?? '',
            }}
          />
        )}
      </div>
    </div>
  )
}

export default InputText
