'use client'
import { cn } from '@/lib/utils'
import React from 'react'
import HintExpander from './HintExpander'

export interface InputAreaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
  className?: string
  inputClassName?: string
  trailingLabel?: string
  labelClassName?: string
  hintText?: string
  hintExpander?: boolean
  hintExpanderLabel?: string
  hintExpanderContent?: string
  hintExpanderimageSrc?: string
  hintExpanderimageAlt?: string
  hintExpanderDefaultExpanded?: boolean
  onHintExpanderToggle?: (expanded: boolean) => void
}

const InputArea = ({
  label,
  error,
  className = '',
  inputClassName,
  trailingLabel,
  labelClassName,
  hintText,
  hintExpander = false,
  hintExpanderLabel = "Why can't I edit this?",
  hintExpanderContent = '',
  hintExpanderimageSrc,
  hintExpanderimageAlt,
  hintExpanderDefaultExpanded = false,
  onHintExpanderToggle,
  ...props
}: InputAreaProps) => {
  const inputId = React.useId()

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
            {...props}
          />
        </div>
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

export default InputArea
