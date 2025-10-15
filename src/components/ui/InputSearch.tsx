'use client'
import React, { useEffect, useRef, useState } from 'react'

import { cn } from '@/lib/utils'
import { Mode } from '@/types/global'
import DropdownMenu, { DropdownSection } from './DropdownMenu'
import DropdownSearchResult from './DropdownSearchResult'

export type InputSearchResultItem = {
  id: string
  title: string
  showDetails?: boolean
  showAddress?: boolean
  address?: string
  showUrl?: boolean
  url?: string
  desc?: string
}

export type InputSearchProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  'onChange' | 'value' | 'results' | 'onSelect' | 'onSearch'
> & {
  label?: string
  required?: boolean
  error?: string
  inputClassName?: string
  showOptional?: boolean
  labelClassName?: string
  hintText?: string
  iconLeading?: React.ReactNode
  iconTrailing?: React.ReactNode
  theme?: 'light' | 'dark'
  emptyText?: string
  loading?: boolean
  value?: string
  onSearch?: (query: string) => void
  onSelect?: (item: InputSearchResultItem) => void
  results?: InputSearchResultItem[]
}

const InputSearch = ({
  label,
  required = false,
  error,
  className = '',
  inputClassName,
  showOptional = true,
  labelClassName,
  hintText,
  iconLeading,
  iconTrailing,
  theme = 'light',
  emptyText = 'No results found',
  loading = false,
  value,
  onSearch,
  onSelect,
  results = [],
  ...props
}: InputSearchProps & { theme?: Mode }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [internalValue, setInternalValue] = useState(value ?? '')
  const dropdownRef = useRef<HTMLDivElement>(null)
  const inputId = React.useId()

  const inputValue = value !== undefined ? value : internalValue

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
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleChange: React.ChangeEventHandler<HTMLInputElement> = e => {
    const next = e.target.value
    if (value === undefined) setInternalValue(next)
    onSearch?.(next)
    setIsOpen(true)
  }

  const handleFocus: React.FocusEventHandler<HTMLInputElement> = () => {
    setIsOpen(true)
  }

  return (
    <div
      className={`flex w-full flex-col gap-4 ${className}`}
      ref={dropdownRef}
    >
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
            {required ? (
              <span className="text-so-color-neutral-600 text-base">
                (required)
              </span>
            ) : (
              showOptional && (
                <span className="text-so-color-neutral-600 text-base">
                  (optional)
                </span>
              )
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
        <div className="relative w-full">
          <div
            className={cn(
              'group flex h-12 items-center gap-2 rounded-lg border-2 bg-white px-4 py-3',
              error ? 'border-so-color-red-700' : 'border-so-color-neutral-950',
              props.disabled &&
                'border-so-color-neutral-300 bg-so-color-neutral-200 cursor-not-allowed',
              'focus-within:ring-so-color-sky-500 focus-within:ring-4 focus-within:ring-offset-2 focus-within:outline-none'
            )}
          >
            {iconLeading && (
              <span className="flex-shrink-0 !leading-none">{iconLeading}</span>
            )}
            <input
              id={inputId}
              value={inputValue}
              onChange={handleChange}
              onFocus={handleFocus}
              className={cn(
                'w-full bg-transparent focus:outline-none disabled:cursor-not-allowed',
                inputClassName
              )}
              aria-invalid={!!error}
              {...props}
            />
            {iconTrailing && (
              <span className="flex-shrink-0">{iconTrailing}</span>
            )}
          </div>

          {isOpen && (
            <div className="absolute z-10 mt-2 w-full">
              <DropdownMenu theme={theme} className="p-0 py-3 pr-3">
                <div className="custom-scrollbar max-h-[180px] overflow-y-auto">
                  <DropdownSection>
                    <div className="space-y-2">
                      {loading && (
                        <div className="text-so-color-neutral-600 px-3 py-2 text-base">
                          Loading…
                        </div>
                      )}
                      {!loading && results.length === 0 && (
                        <div className="text-so-color-neutral-600 px-3 py-2 text-base">
                          {emptyText}
                        </div>
                      )}
                      <div className="px-3 py-1.5">
                        {!loading &&
                          results.map(item => (
                            <DropdownSearchResult
                              key={item.id}
                              title={item.title}
                              showDetails={item.showDetails}
                              showAddress={item.showAddress}
                              address={item.address}
                              showUrl={item.showUrl}
                              url={item.url}
                              onClick={() => {
                                onSelect?.(item)
                                setIsOpen(false)
                              }}
                            />
                          ))}
                      </div>
                    </div>
                  </DropdownSection>
                </div>
              </DropdownMenu>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default InputSearch
