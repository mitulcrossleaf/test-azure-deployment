'use client'
import { cn } from '@/lib/utils'
import { Mode } from '@/types/global'
import React, { useState } from 'react'
import Skeleton from 'react-loading-skeleton'

export type SearchProps = {
  label?: string
  required?: boolean
  className?: string
  name?: string
  value?: string
  error?: string
  inputClassName?: string
  labelClassName?: string
  hintText?: string
  inputSize?: 'medium' | 'large'
  onChange?: (value: string) => void
  onSearch?: (value: string) => void
  searchBy?: boolean
  theme?: Mode
  loading?: boolean
  maxLength?: number
} & React.InputHTMLAttributes<HTMLInputElement>

const SearchField = ({
  label,
  error,
  className = '',
  inputClassName,
  labelClassName,
  hintText,
  inputSize = 'medium',
  searchBy,
  theme = 'light',
  value = '',
  onChange,
  onSearch,
  loading = false,
  maxLength = 100,
  ...props
}: SearchProps) => {
  const inputId = React.useId()
  const isLarge = inputSize === 'large'
  const isDark = theme === 'dark'
  const [isFocused, setIsFocused] = useState(false)

  const handleClear = (e: React.MouseEvent) => {
    e.preventDefault()
    if (onChange) {
      onChange('')
    }
    if (onSearch) {
      onSearch('')
    }
  }

  const handleSearch = () => {
    if (onSearch) {
      onSearch(value)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  return (
    <div className={`flex w-full flex-col gap-4 ${className}`}>
      {label && (
        <div className="flex flex-col">
          {loading ? (
            <Skeleton width={'50%'} height={28} />
          ) : (
            <label
              htmlFor={inputId}
              className={cn(
                isLarge ? 'text-2xl' : 'text-lg',
                'text-so-color-neutral-950 font-raleway font-bold',
                isDark && 'text-white',
                labelClassName
              )}
            >
              {label}
            </label>
          )}
          {hintText && (
            <span
              className={cn(
                'text-so-color-neutral-600 font-open-sans text-base',
                isDark && 'text-so-color-neutral-400'
              )}
            >
              {hintText}
            </span>
          )}
          {error && (
            <div className="text-so-color-red-700 mt-2 flex items-center gap-2">
              <i className="material-symbols-outlined flex-shrink-0 !leading-none">
                info
              </i>
              <p className="font-open-sans text-base">{error}</p>
            </div>
          )}
        </div>
      )}
      {/* search div */}
      {loading ? (
        <Skeleton width={'100%'} height={48} />
      ) : (
        <div
          className={cn(
            'group',
            isLarge ? 'h-20' : 'h-10',
            error ? 'border-so-color-red-700' : 'border-so-color-neutral-950',
            isFocused && 'ring-5 ring-sky-500 ring-offset-2',
            props.disabled &&
              'border-so-color-neutral-300 bg-so-color-neutral-200 cursor-not-allowed',
            'flex h-full w-full items-stretch rounded-lg transition-shadow duration-200'
          )}
        >
          <div
            className={cn(
              'border-so-color-neutral-950 flex w-full items-center self-stretch rounded-lg rounded-r-none border-2 border-r-0',
              isDark && 'border-so-color-neutral-50'
            )}
          >
            {searchBy && (
              <div
                className={cn(
                  'bg-so-color-neutral-950 font-open-sans flex h-11 items-center gap-2 px-4 text-base font-bold text-white',
                  isLarge && 'h-[76px] text-xl',
                  isDark && 'bg-so-color-neutral-50 text-so-color-neutral-950'
                )}
              >
                Category
                <i
                  className={cn(
                    isLarge && '!text-[32px] !leading-none',
                    'material-symbols-outlined'
                  )}
                >
                  keyboard_arrow_down
                </i>
              </div>
            )}

            <div
              className={cn(
                'relative flex h-11 w-full items-center',
                isLarge && 'h-[76px]'
              )}
            >
              <input
                id={inputId}
                type="text"
                value={value}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                onChange={e => {
                  if (onChange) {
                    onChange(e.target.value)
                  }
                }}
                onKeyDown={handleKeyDown}
                className={cn(
                  'font-open-sans w-full self-stretch bg-transparent px-3 focus:outline-none disabled:cursor-not-allowed',
                  isLarge ? 'text-xl' : 'text-base',
                  value && 'pr-10',
                  isDark && 'text-white',
                  inputClassName
                )}
                maxLength={maxLength}
                {...props}
              />
              {value && (
                <button
                  type="button"
                  onClick={handleClear}
                  className={cn(
                    'text-so-color-neutral-950 absolute right-4 leading-none focus:outline-none',
                    isDark && 'text-white'
                  )}
                  aria-label="Clear search"
                >
                  <i
                    className={cn(
                      isLarge && '!text-3xl',
                      'material-symbols-outlined !leading-none'
                    )}
                  >
                    close
                  </i>
                </button>
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={handleSearch}
            className={cn(
              'bg-so-color-persona-general-600 hover:bg-so-color-persona-general-800 focus:bg-so-color-persona-general-800 flex w-full max-w-[56px] items-center justify-center rounded-r-lg text-white',
              isLarge && 'w-20',
              isFocused
                ? isDark
                  ? 'bg-so-color-persona-general-400'
                  : 'bg-so-color-persona-general-800'
                : '',
              isDark &&
                'bg-so-color-persona-general-400 hover:bg-so-color-persona-general-600 focus:bg-so-color-persona-general-600 text-so-color-neutral-950'
            )}
          >
            {/* <SearchIcon className={cn(isLarge ? 'h-10 w-10' : 'h-6 w-6')} /> */}
            <i
              className={cn(
                isLarge && '!text-[32px]',
                'material-symbols-outlined !leading-none'
              )}
            >
              search
            </i>
          </button>
        </div>
      )}
    </div>
  )
}

export default SearchField
