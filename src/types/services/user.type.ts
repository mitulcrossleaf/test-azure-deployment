import { USER_STATUS } from '@/constants'

export interface User {
  userId: string
}

export interface UserResponse {
  userId: string
}

export type InviteUserPayload = {
  email: string
  firstName: string
  lastName: string
  role: string
  organizationId: string
  loginUserId: string
  userRoleId: string
}
export type UpdateUserPayload = {
  firstName: string
  lastName: string
  organizationId: string
  userRoleId: string
  isOrgContact: boolean
  isOnlyAContact: boolean
  email: string
  loginUserId: string
}

export interface UserDetails {
  userId: string
  organizationId: string
  entraExternalId: string
  email: string
  firstName: string
  lastName: string
  phoneNumber: string
  registrationType: string
  invitedBy: string | null
  status: USER_STATUS
  isActive: boolean
  isEmailVerified: boolean
  lastLoginAt: string | null
  passwordResetRequired: boolean
  createdAt: string // ISO date string
  createdBy: string
  modifiedAt: string
  modifiedBy: string | null
  approvedRejectedBy: string | null
  userRoleId: string
  userRoleName: string
  isOrgContact: boolean
  isOnlyAContact: boolean
  rejectedNote: string | null
  organization: {
    organizationId: string
    legalName: string
    displayName: string
  }
}

export type UserType = {
  userId: string
  organizationId: string
  entraExternalId: string | null
  email: string
  firstName: string
  lastName: string
  phoneNumber: string | null
  registrationType: string
  invitedBy: string | null
  status: 'PendingApproval' | 'Approved' | string
  isActive: boolean
  isEmailVerified: boolean
  lastLoginAt: string | null
  passwordResetRequired: boolean
  createdAt: string
  createdBy: string | null
  modifiedAt: string
  modifiedBy: string | null
  approvedRejectedBy: string | null
  userRoleId: string
  isOrgContact: boolean
  isOnlyAContact: boolean
  rejectedNote: string | null
  organization: any | null
  userRoleName: string | null
}

export type UserProps = {
  name: string
  email: string
  role: string
  status: 'Active' | 'Inactive' | 'Invited'
}
