'use client'
import { cn } from '@/lib/utils'
import { ReactNode, useEffect } from 'react'

export type ModalProps = {
  isOpen: boolean
  onClose: () => void
  children: ReactNode
  className?: string
}

const Modal = ({ isOpen, onClose, children, className }: ModalProps) => {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }

    if (isOpen) {
      document.body.style.overflow = 'hidden'
      window.addEventListener('keydown', handleEsc)
    } else {
      document.body.style.overflow = ''
    }

    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handleEsc)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div
      className={cn(
        'fixed inset-0 z-50 flex items-center justify-center',
        className
      )}
      aria-modal="true"
      role="dialog"
    >
      <div
        className="bg-so-color-neutral-950/80 absolute inset-0"
        onClick={onClose}
      />

      <div className="relative z-10 flex w-full max-w-[544px] flex-col gap-8 rounded-3xl bg-white p-8 shadow-lg">
        {children}
      </div>
    </div>
  )
}

export default Modal
