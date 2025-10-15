import { USER_STATUS } from '@/constants'
import { UserType } from './user.type'

export interface BaseOrganizationPayload {
  legalName: string
  displayName: string
  description?: string
  domain?: string
  websiteURL: string
  phoneNumber?: string
  businessNumber: string
  organizationType: string
  maxUsers?: number
  addressLine1: string
  addressLine2: string
  city: string
  provinceId: string
  postalCode: string
  language: string
  isOrgManagement: boolean
  aggrementExpiryDate?: string
  isConfirmationMemo?: boolean
  loginUserId: string
}

export interface CreateOrganizationPayload extends BaseOrganizationPayload {
  description: string
  domain: string
  phoneNumber: string
  maxUsers: number
  aggrementExpiryDate: string
  isConfirmationMemo: boolean
}
export type UpdateOrganizationPayload = BaseOrganizationPayload

export type RejectPayload = {
  rejectedNote: string
  loginUserId: string
}

export interface AllOrgType {
  organizationId: string
  name: string
  type: string
  status: USER_STATUS
  createdAt: string // ISO timestamp for sorting
}

export interface OrganizationType {
  organizationId: string
  legalName: string
  displayName: string
  description: string
  domain: string
  websiteURL: string
  phoneNumber: string
  businessNumber: string
  isActive: boolean
  organizationType: string
  maxUsers: number
  createdAt: string // ISO timestamp
  createdBy: string
  modifiedAt: string // ISO timestamp
  modifiedBy: string
  addressLine1: string
  addressLine2: string
  city: string
  province: string
  provinceId?: string // UUID for province
  postalCode: string
  language: string
  isOrgManagement: boolean
  status: USER_STATUS
  users: UserType[] // Replace `any` with a proper `User` type if available
}
