'use client'
import { cn } from '@/lib/utils'
import Image from 'next/image'
import React, { useState } from 'react'

export interface HintExpanderProps {
  label: string
  content?: string
  className?: string
  defaultExpanded?: boolean
  onToggle?: (expanded: boolean) => void
  image?: {
    src: string
    alt: string
  }
  semantic?: 'general' | 'buyer' | 'vendor'
}

const HintExpander: React.FC<HintExpanderProps> = ({
  label,
  content,
  className = '',
  defaultExpanded = false,
  onToggle,
  image,
  semantic = 'general',
}) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded)
  const handleToggle = () => {
    const newExpanded = !isExpanded
    setIsExpanded(newExpanded)
    onToggle?.(newExpanded)
  }
  return (
    <div className={cn('flex flex-col gap-4', className)}>
      <button
        type="button"
        onClick={handleToggle}
        className="text-so-color-persona-general-600 hover:text-so-color-persona-general-700 flex items-center gap-1 transition-colors"
        aria-expanded={isExpanded}
        aria-controls="hint-content"
      >
        <i className="material-symbols-outlined transition-all duration-200">
          {(content || image) && isExpanded
            ? 'keyboard_arrow_up'
            : 'keyboard_arrow_down'}
        </i>
        <span className="text-base font-normal">{label}</span>
      </button>
      {(content || image) && isExpanded && (
        <div
          id="hint-content"
          className={cn(
            'flex flex-col gap-4 border-l-4 p-6',
            semantic === 'general' &&
              'bg-so-color-persona-general-100 border-so-color-persona-general-600',
            semantic === 'buyer' &&
              'bg-so-color-persona-buyer-100 border-so-color-persona-buyer-600',
            semantic === 'vendor' &&
              'bg-so-color-persona-vendor-100 border-so-color-persona-vendor-600'
          )}
        >
          <p className="text-so-color-neutral-950 text-base leading-6">
            {content}
          </p>
          {image && image.alt && image.src && (
            <Image
              src={image?.src}
              alt={image?.alt || ''}
              width={400}
              height={300}
              className="aspect-[4/3] object-cover"
            />
          )}
        </div>
      )}
    </div>
  )
}
export default HintExpander
