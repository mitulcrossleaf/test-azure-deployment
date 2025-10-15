'use client'

import { ArrowForward } from '@/assets'
import { Button } from '@/components/ui'
import { cn } from '@/lib'
import { MobileSidebarProps } from '@/types/component'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import MobileBuyerVendorMenu from './MobileBuyerVendorMenu'

const MobileSidebar = ({
  className,
  variant = 'general',
  isOpen: controlledOpen,
  onOpenChange,
}: MobileSidebarProps) => {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false)
  const isControlled = typeof controlledOpen === 'boolean'
  const isOpen = isControlled ? controlledOpen : uncontrolledOpen
  const setOpen = (open: boolean) => {
    if (!isControlled) setUncontrolledOpen(open)
    onOpenChange?.(open)
  }

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (!isOpen) return

    const scrollY = window.scrollY
    const originalOverflow = document.body.style.overflow
    const originalPosition = document.body.style.position
    const originalTop = document.body.style.top
    const originalWidth = document.body.style.width

    document.body.style.overflow = 'hidden'
    document.body.style.position = 'fixed'
    document.body.style.top = `-${scrollY}px`
    document.body.style.width = '100%'

    return () => {
      document.body.style.overflow = originalOverflow
      document.body.style.position = originalPosition
      document.body.style.top = originalTop
      document.body.style.width = originalWidth
      window.scrollTo(0, scrollY)
    }
  }, [isOpen])

  const [view, setView] = useState<'menu' | 'buyer' | 'vendor'>('menu')

  useEffect(() => {
    if (!isOpen) setView('menu')
  }, [isOpen])

  return (
    <div className={cn('lg:hidden', className)}>
      {isOpen && (
        <div className="fixed inset-0 top-20 z-[60]">
          <div
            className="absolute inset-0 cursor-pointer bg-black/40"
            aria-hidden
            onClick={() => setOpen(false)}
          />
          <aside className="absolute inset-y-0 left-0 flex min-h-[100dvh] w-screen flex-col overflow-y-auto bg-white shadow-xl">
            {view === 'menu' ? (
              <>
                <nav className="flex flex-col px-4 pt-6">
                  <button
                    type="button"
                    className="group border-so-color-neutral-200 relative flex h-20 w-full cursor-pointer items-center justify-between border-b text-neutral-950"
                    onClick={() => setView('buyer')}
                  >
                    <span className="heading-h4-base font-bold">Buyers</span>
                    <ArrowForward className="text-neutral-950 transition-transform group-active:translate-x-0.5" />
                  </button>
                  <button
                    type="button"
                    className="group border-so-color-neutral-200 relative flex h-20 w-full cursor-pointer items-center justify-between border-b text-neutral-950"
                    onClick={() => setView('vendor')}
                  >
                    <span className="heading-h4-base font-bold">Vendors</span>
                    <ArrowForward className="text-so-color-neutral-950 transition-transform group-active:translate-x-0.5" />
                  </button>
                  <Link
                    href="#"
                    className="border-so-color-neutral-200 text-so-color-neutral-950 relative flex h-20 w-full items-center justify-between border-b"
                    onClick={() => setOpen(false)}
                  >
                    <span className="heading-h4-base font-bold">Resources</span>
                  </Link>
                  <Link
                    href="#"
                    className="border-so-color-neutral-200 text-so-color-neutral-950 relative flex h-20 w-full items-center justify-between border-b"
                    onClick={() => setOpen(false)}
                  >
                    <span className="heading-h4-base font-bold">About</span>
                  </Link>
                </nav>
                <div className="mt-6 flex flex-col gap-4">
                  <div className="px-4 py-3">
                    <Link
                      href="#"
                      className="body-link text-so-color-persona-general-600 block text-center font-bold"
                      onClick={() => setOpen(false)}
                    >
                      <Button
                        appearance="ghost"
                        semantic={variant}
                        theme="light"
                        className="w-full"
                        label="Get help"
                      />
                    </Link>
                  </div>
                  <div className="px-4 pb-6">
                    <Link href="/signin" onClick={() => setOpen(false)}>
                      <Button
                        appearance="neutral"
                        semantic={variant}
                        theme="light"
                        className="w-full"
                        iconLeading
                        icon={
                          <i className="material-symbols-outlined !text-[34px]">
                            account_circle
                          </i>
                        }
                        label="Login"
                      />
                    </Link>
                  </div>
                </div>
              </>
            ) : (
              <MobileBuyerVendorMenu
                type={view}
                onBack={() => setView('menu')}
              />
            )}
          </aside>
        </div>
      )}
    </div>
  )
}

export default MobileSidebar
