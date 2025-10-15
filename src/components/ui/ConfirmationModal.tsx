import { Button } from '@/components/ui'
import Modal from '@/components/ui/Modal'
import { cn } from '@/lib'
import { ReactNode } from 'react'

export interface ConfirmationModalProps {
  isOpen: boolean
  onClose: () => void
  isclose?: boolean
  title: string
  description: ReactNode
  confirmButton: {
    label: string
    onClick: () => void
    appearance?: 'primary' | 'secondary' | 'destructive' | 'outline' | 'ghost'
    isLoading?: boolean
    loadingText?: string
  }
  cancelButton?: {
    label: string
    onClick: () => void
  }
  children?: ReactNode
  headerClassName?: string
}

const ConfirmationModal = ({
  isOpen,
  onClose,
  title,
  description,
  confirmButton,
  cancelButton,
  children,
  headerClassName,
  isclose = true,
}: ConfirmationModalProps) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="space-y-8">
        <div className="flex justify-between">
          <div className={cn('flex flex-col gap-1', headerClassName)}>
            <h2 className="text-so-color-neutral-950 font-raleway text-2xl font-bold">
              {title}
            </h2>
            <div className="text-so-color-neutral-950 font-open-sans text-base font-normal break-all">
              {description}
            </div>
          </div>
          {isclose && (
            <button
              type="button"
              onClick={onClose}
              className="flex size-8 items-center justify-center"
            >
              <i className="material-symbols-outlined !text-xl !leading-none">
                close
              </i>
            </button>
          )}
        </div>
        {children}
        <div className="flex flex-col gap-4">
          <Button
            type="button"
            label={
              confirmButton.isLoading
                ? confirmButton.loadingText
                : confirmButton.label
            }
            appearance={confirmButton.appearance || 'primary'}
            onClick={confirmButton.onClick}
            disabled={confirmButton.isLoading}
            className="text-center"
            loading={confirmButton?.isLoading}
            loadingText={confirmButton?.loadingText}
          />
          {cancelButton && (
            <Button
              type="button"
              label={cancelButton.label}
              appearance="secondary"
              semantic="general"
              onClick={cancelButton.onClick}
              disabled={confirmButton.isLoading}
            />
          )}
        </div>
      </div>
    </Modal>
  )
}
export default ConfirmationModal
