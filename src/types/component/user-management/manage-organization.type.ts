import { OrganizationType } from '@/types/services'
import { UserRoleDropdown } from '@/types/services/user-role.type'
import { FormikProps } from 'formik'

export type OrganizationFormDataType = {
  orgType: string
  confirmationMemo: 'Yes' | 'No' | ''
  agreementExpiry: string
  legalName: string
  displayName?: string
  craBusinessNumber: string
  website?: string
  address1: string
  address2?: string
  city: string
  province: string
  postalCode: string
  language: string
  allowAllUsersManage: string
}

export type FormPersistenceType = {
  values: OrganizationFormDataType
  saveFormData: (data: OrganizationFormDataType) => void
}

export interface OrganizationDetailsStepProps
  extends FormikProps<OrganizationFormDataType> {
  handleSteps: (step: number, editMode?: boolean) => Promise<boolean> | boolean
  onCancel: () => void
  isChangeMode?: boolean
}

export interface OrganizationPreferencesStepProps
  extends FormikProps<OrganizationFormDataType> {
  handleSteps: (step: number, editMode?: boolean) => Promise<boolean> | boolean
  onCancel: () => void
  isChangeMode?: boolean
}

export interface OrganizationTypeStepProps
  extends FormikProps<OrganizationFormDataType> {
  handleSteps: (step: number, editMode?: boolean) => Promise<boolean> | boolean
  onCancel: () => void
  isChangeMode?: boolean
}

export interface OrganizationUsersTabProps {
  organizationData: OrganizationType | null
  orgId: string
  onInviteModeChange?: (isInviteMode: boolean) => void
  roles: UserRoleDropdown[]
  isSkeletonLoading: boolean
  fetchOrganizationDetails: () => Promise<void>
}

export interface OrganizationProfileTabProps {
  organizationData?: OrganizationType | null
  loading?: boolean
  onUpdate?: () => void
}

export interface OrganizationProfileFormValues {
  orgType: string
  legalName: string
  displayName: string
  craBusinessNumber: string
  website: string
  address1: string
  address2: string
  city: string
  province: string
  postalCode: string
  language: string
  allowAllUsersManage: string
}

export type InviteUserResponse = {
  item: {
    userId: string
    organizationId: string
    entraExternalId: string
    email: string
    firstName: string
    lastName: string
    phoneNumber: string
    registrationType: string
    invitedBy: string
    status: string
    isActive: boolean
    isEmailVerified: boolean
    lastLoginAt: string
    passwordResetRequired: boolean
    createdAt: string
    createdBy: string
    modifiedAt: string
    modifiedBy: string
    userRoleId: string
    organization: any
  }
}

export interface InviteUserToOrgProps {
  onCancel?: () => void
  onSuccess?: () => void
  roles: UserRoleDropdown[]
  orgId: string
}

export interface CancelnvitationModalProps {
  isOpen: boolean
  onClose: () => void
  handleCancelInvitation: () => void
  handleContinueInviting: () => void
}
