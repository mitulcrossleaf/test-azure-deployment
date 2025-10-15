'use client'
import React, { useEffect, useRef, useState } from 'react'

import { cn } from '@/lib/utils'
import { Mode } from '@/types/global'
import DropdownMenu, {
  DropdownDivider,
  DropdownMenuItem,
  DropdownSection,
} from './DropdownMenu'

export interface BaseOption {
  iconLeading?: boolean
  iconTrailing?: boolean
  icon?: React.ReactNode
}

export interface Option extends BaseOption {
  value: string
  label: string
  type?: 'option'
}

export interface DropdownDivider {
  type: 'divider'
}

export interface DropdownSection {
  type: 'section'
  title: string
  items: Option[]
  divider?: boolean // If true, shows a divider below the title
}

export type DropdownItem = Option | DropdownDivider | DropdownSection

export type InputSelectProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  'onChange' | 'value'
> & {
  label?: string
  error?: string
  inputClassName?: string
  labelClassName?: string
  hintText?: string
  hintExpander?: boolean
  items: DropdownItem[]
  options?: DropdownItem[]
  value?: string
  onChange?: (value: string) => void
  iconLeading?: React.ReactNode
  iconTrailing?: React.ReactNode
  trailingLabel?: string
}

const InputSelect = ({
  label,
  error,
  className = '',
  inputClassName,
  labelClassName,
  hintText,
  hintExpander = false,
  items = [],
  options = [],
  value = '',
  onChange,
  theme = 'light',
  iconLeading,
  iconTrailing,
  trailingLabel,
  ...props
}: InputSelectProps & { theme?: Mode }) => {
  // For backward compatibility, if items is empty but options is provided, use options as items
  const dropdownItems =
    items.length > 0 ? items : options.length > 0 ? options : []

  // Find the selected label from the items
  const findSelectedLabel = (): string => {
    let selectedLabel = ''

    const findInItems = (items: DropdownItem[]): boolean => {
      for (const item of items) {
        if ('type' in item) {
          if (item.type === 'section') {
            if (findInItems(item.items)) return true
          }
        } else if ('value' in item && item.value === value) {
          selectedLabel = item.label
          return true
        }
      }
      return false
    }

    findInItems(dropdownItems)
    return selectedLabel
  }

  const selectedLabel = findSelectedLabel()
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const inputId = React.useId()

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  // Handle item click with mousedown to prevent blur from firing first
  const handleItemClick = (itemValue: string) => {
    if (onChange) {
      onChange(itemValue)
    }
    setIsOpen(false)
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
            <span className="text-so-color-neutral-600 text-base">
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
        <div className="relative w-full" ref={dropdownRef}>
          <div
            className={cn(
              'group flex h-12 items-center gap-2 rounded-lg border-2 bg-white px-4 py-3',
              props.disabled
                ? 'border-so-color-neutral-950 bg-so-color-neutral-200 cursor-not-allowed'
                : error
                  ? 'border-so-color-red-700'
                  : isOpen
                    ? 'border-so-color-persona-general-600'
                    : 'border-so-color-neutral-950'
            )}
            onClick={() => !props.disabled && setIsOpen(!isOpen)}
          >
            {iconLeading && (
              <span className="flex-shrink-0">{iconLeading}</span>
            )}
            <input
              id={inputId}
              readOnly
              value={selectedLabel}
              className={cn(
                'w-full cursor-pointer bg-transparent focus:outline-none disabled:cursor-not-allowed',
                inputClassName
              )}
              {...props}
            />
            {iconTrailing && (
              <span className="flex-shrink-0">{iconTrailing}</span>
            )}
            <i className="material-symbols-outlined text-so-color-neutral-950 flex-shrink-0 transition-transform duration-200">
              {isOpen ? 'keyboard_arrow_up' : 'keyboard_arrow_down'}
            </i>
          </div>

          {isOpen && (
            <div className="absolute z-10 mt-1 w-full">
              <DropdownMenu theme={theme}>
                <DropdownSection>
                  <div className="space-y-3">
                    {(() => {
                      const elements: React.ReactNode[] = []

                      // Process each item in the dropdown
                      for (let i = 0; i < dropdownItems.length; i++) {
                        const item = dropdownItems[i]
                        if (!item) continue

                        if ('type' in item) {
                          if (item.type === 'section') {
                            // Add section title
                            elements.push(
                              <div key={`section-${i}`} className="w-full">
                                <div className="text-so-color-neutral-950 p-2 text-base font-bold">
                                  {item.title}
                                </div>

                                {/* Divider after title if specified */}
                                {item.divider && (
                                  <DropdownDivider theme={theme} />
                                )}

                                {/* Section items */}
                                <div className="space-y-3">
                                  {item.items.map((option, optionIndex) => (
                                    <DropdownMenuItem
                                      key={`${i}-${optionIndex}`}
                                      isActive={value === option.value}
                                      iconLeading={option.iconLeading}
                                      iconTrailing={option.iconTrailing}
                                      icon={option.icon}
                                      onMouseDown={e => {
                                        // Prevent blur event from firing
                                        e.preventDefault()
                                      }}
                                      onClick={() =>
                                        handleItemClick(option.value)
                                      }
                                    >
                                      {option.label}
                                    </DropdownMenuItem>
                                  ))}
                                </div>
                              </div>
                            )
                          }
                          // Skip standalone dividers as they're handled with sections
                          // Unknown types are ignored
                        } else {
                          // Handle legacy options (without sections)
                          elements.push(
                            <DropdownMenuItem
                              key={item.value}
                              isActive={value === item.value}
                              iconLeading={item.iconLeading}
                              iconTrailing={item.iconTrailing}
                              icon={item.icon}
                              onMouseDown={e => {
                                e.preventDefault()
                              }}
                              onClick={() => handleItemClick(item.value)}
                            >
                              {item.label}
                            </DropdownMenuItem>
                          )
                        }
                      }

                      return elements
                    })()}
                  </div>
                </DropdownSection>
              </DropdownMenu>
            </div>
          )}
        </div>
        {hintExpander && (
          <div className="flex cursor-pointer items-center gap-1">
            <i className="material-symbols-outlined">keyboard_arrow_down</i>
            <p className="text-so-color-persona-general-600 text-base">
              Why can&apos;t I edit this?
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default InputSelect
