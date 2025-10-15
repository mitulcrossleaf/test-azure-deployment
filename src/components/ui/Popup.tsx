'use client'
import { useCallback, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

import { ReactNode } from 'react'

export type PopupPosition =
  | 'top-left'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-right'

export interface PopupProps {
  isOpen: boolean
  onClose: () => void
  children: ReactNode
  position?: PopupPosition
  className?: string
  triggerRef?: React.RefObject<HTMLElement | null>
}

const Popup = ({
  isOpen,
  onClose,
  children,
  position = 'bottom-right',
  className = '',
  triggerRef,
}: PopupProps) => {
  const popupRef = useRef<HTMLDivElement | null>(null)
  const [popupStyle, setPopupStyle] = useState<React.CSSProperties>({
    position: 'absolute',
    visibility: 'hidden',
    zIndex: 9999,
  })
  const calculatePosition = useCallback(() => {
    if (!triggerRef?.current || !popupRef?.current) return
    const triggerRect = triggerRef.current.getBoundingClientRect()
    const popupRect = popupRef.current.getBoundingClientRect()
    if (popupRect.width === 0 || popupRect.height === 0) {
      setTimeout(() => calculatePosition(), 10)
      return
    }
    const scrollX = window.scrollX || document.documentElement.scrollLeft
    const scrollY = window.scrollY || document.documentElement.scrollTop
    const viewportWidth = window.innerWidth
    let top = 0
    let left = 0
    switch (position) {
      case 'top-left':
        top = triggerRect.top + scrollY - popupRect.height - 8
        left = triggerRect.right + scrollX - popupRect.width
        break
      case 'top-right':
        top = triggerRect.top + scrollY - popupRect.height - 8
        left = triggerRect.left + scrollX
        break
      case 'bottom-left':
        top = triggerRect.bottom + scrollY + 8
        left = triggerRect.right + scrollX - popupRect.width
        // Ensure popup doesn't go outside viewport on the left
        if (left < scrollX) {
          left = triggerRect.left + scrollX
        }
        break
      case 'bottom-right':
      default:
        top = triggerRect.bottom + scrollY + 8
        left = triggerRect.left + scrollX
        // Ensure popup doesn't go outside viewport on the right
        if (left + popupRect.width > viewportWidth + scrollX) {
          left = triggerRect.right + scrollX - popupRect.width
        }
        break
    }
    setPopupStyle({
      position: 'absolute',
      top: `${top}px`,
      left: `${left}px`,
      zIndex: 9999,
      visibility: 'visible', // Show after positioning
    })
  }, [position, triggerRef])
  useEffect(() => {
    if (!isOpen) {
      setPopupStyle(prev => ({ ...prev, visibility: 'hidden' }))
      return
    }
    // Use double requestAnimationFrame to ensure DOM is fully rendered
    const timeoutId = requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        calculatePosition()
      })
    })
    const handleScroll = () => calculatePosition()
    const handleResize = () => calculatePosition()
    window.addEventListener('scroll', handleScroll, true)
    window.addEventListener('resize', handleResize)
    return () => {
      cancelAnimationFrame(timeoutId)
      window.removeEventListener('scroll', handleScroll, true)
      window.removeEventListener('resize', handleResize)
    }
  }, [isOpen, calculatePosition])
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popupRef.current &&
        !popupRef.current.contains(event.target as Node) &&
        (!triggerRef?.current ||
          !triggerRef.current.contains(event.target as Node))
      ) {
        onClose()
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen, onClose, triggerRef])
  if (!isOpen) return null
  const popupContent = (
    <div
      ref={popupRef}
      style={popupStyle}
      className={`border-so-color-neutral-200 mt-2 min-w-[280px] rounded-2xl border bg-white shadow-md ${className}`}
    >
      {children}
    </div>
  )
  // Render in portal to avoid clipping issues
  return typeof document !== 'undefined'
    ? createPortal(popupContent, document.body)
    : null
}
export default Popup
