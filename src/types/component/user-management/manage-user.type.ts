import { UserType } from '@/types/services'

export interface DeclinePendingUserProps {
  title: string
  isOpen: boolean
  onClose: () => void
  handleCancelDecline: () => void
  handleDecline: (reason: string) => void | Promise<void>
  declineText: string
  isSubmitting?: boolean
}

export type PropsOrganizationUserProfileTab = {
  userData?: UserType | null
  onUpdate?: () => void
}

export interface DeclineFormValues {
  reason: string
}
