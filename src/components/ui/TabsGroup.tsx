'use client'
import { cn } from '@/lib'
import { Mode } from '@/types/global'
import React, { createContext, useEffect, useState } from 'react'
import Skeleton from 'react-loading-skeleton'

interface TabItem {
  label: React.ReactNode
  iconLeading?: React.ReactNode
  count?: number | string
  disabled?: boolean
}

export interface TabsGroupProps {
  tabs: TabItem[]
  theme?: Mode
  display?: 'inline' | 'block'
  defaultActiveTab?: number
  className?: string
  onTabChange?: (index: number) => void
  loading?: boolean
}

export interface TabProps extends TabItem {
  active?: boolean
  onClick?: () => void
  className?: string
}

export interface TabsContextType {
  activeTab: number
  setActiveTab: (index: number) => void
  theme: Mode
}

const TabsContext = createContext<TabsContextType | undefined>(undefined)
const Tab: React.FC<TabProps> = ({
  label,
  active = false,
  iconLeading,
  count,
  className = '',
  onClick,
  disabled = false,
}) => {
  const baseClasses =
    'text-base font-bold px-2 py-4 flex items-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed duration-300'
  const inactiveClasses = 'text-so-color-persona-general-600'
  const hoverClasses = 'hover:text-so-color-persona-general-800'
  const activeClasses = active
    ? 'text-so-color-neutral-950 border-b-4 border-so-color-persona-general-600'
    : ''

  return (
    <div
      className={`focus-within:ring-so-color-sky-500 inline-block rounded-lg focus-within:ring-5 focus-within:ring-offset-2 focus-within:ring-offset-white`}
    >
      <button
        disabled={disabled}
        className={`${baseClasses} ${active ? activeClasses : `${inactiveClasses} ${hoverClasses}`} rounded-none text-nowrap whitespace-nowrap focus:outline-none ${className}`}
        onClick={onClick}
        role="tab"
        aria-selected={active}
        aria-disabled={disabled}
      >
        {iconLeading && (
          <span className="size-6 flex-shrink-0">{iconLeading}</span>
        )}
        <span>{label}</span>
        {count !== undefined && (
          <span className="bg-so-color-neutral-200 text-so-color-neutral-950 ml-2 rounded-full px-3 py-1 text-base font-normal">
            {count}
          </span>
        )}
      </button>
    </div>
  )
}

export const TabsGroup: React.FC<TabsGroupProps> = ({
  tabs,
  theme = 'light',
  display = 'inline',
  defaultActiveTab = 0,
  className = '',
  onTabChange,
  loading = false,
}) => {
  const [activeTab, setActiveTab] = useState(defaultActiveTab)
  const displayClass = display === 'inline' ? 'flex' : 'block'

  const handleTabClick = (index: number) => {
    setActiveTab(index)
    onTabChange?.(index)
  }
  useEffect(() => {
    setActiveTab(defaultActiveTab)
  }, [defaultActiveTab])

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab, theme }}>
      <div
        className={cn(
          displayClass,
          className,
          loading ? 'border-none' : 'border-b',
          'border-so-color-neutral-300 custom-scrollbar-horizontal gap-2 overflow-x-auto overflow-y-visible px-2 pt-2 sm:overflow-x-visible sm:px-0 sm:pt-0'
        )}
        role="tablist"
      >
        {tabs.map((tab, index) =>
          loading ? (
            <Skeleton key={index} height={45} width={200} />
          ) : (
            <Tab
              key={index}
              label={tab.label}
              iconLeading={tab.iconLeading}
              count={tab.count}
              active={activeTab === index}
              disabled={tab.disabled}
              onClick={() => handleTabClick(index)}
            />
          )
        )}
      </div>
    </TabsContext.Provider>
  )
}

export default TabsGroup
