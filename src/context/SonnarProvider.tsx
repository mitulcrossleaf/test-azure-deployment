'use client'
import Sonnar from '@/components/ui/Sonnar'
import { GeneticContextProviderProps, SonnarContextType } from '@/types/global'
import { AnimatePresence, motion } from 'framer-motion'
import { createContext, useCallback, useContext, useState } from 'react'

const SonnarContext = createContext<SonnarContextType | undefined>(undefined)

export const SonnarProvider = ({ children }: GeneticContextProviderProps) => {
  const [sonnars, setSonnars] = useState<
    {
      id: number
      type?: 'success' | 'danger' | 'information' | 'warning' | 'discovery'
      label: string
      message?: string | React.ReactNode
      validationErrors?: string[]
    }[]
  >([])

  const showSonnar: SonnarContextType['showSonnar'] = useCallback(options => {
    const id = Date.now()
    setSonnars(prev => [...prev, { id, ...options }])

    setTimeout(() => {
      setSonnars(prev => prev.filter(s => s.id !== id))
    }, 4000)
  }, [])

  return (
    <SonnarContext.Provider value={{ showSonnar }}>
      {children}
      <div className="fixed top-8 right-8 z-50 flex flex-col gap-4">
        <AnimatePresence>
          {sonnars.map(({ id, ...props }) => (
            <motion.div
              key={id}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
            >
              <Sonnar
                {...props}
                onClose={() =>
                  setSonnars(prev => prev.filter(s => s.id !== id))
                }
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </SonnarContext.Provider>
  )
}

export const useSonnar = () => {
  const ctx = useContext(SonnarContext)
  if (!ctx) throw new Error('useSonnar must be used inside SonnarProvider')
  return ctx
}
