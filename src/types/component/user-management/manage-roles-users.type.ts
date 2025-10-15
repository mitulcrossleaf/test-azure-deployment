export interface CreateUserRoleFormValues {
  roleName: string
  segmentType: 'internal' | 'external' | ''
  organizationType: 'supply-ontario' | 'bps' | 'ops' | 'vendor' | 'audit' | ''
}

export type UserRoleType = {
  id: string
  userRole: string
  segmentType: string
  organizationType: string
}

export type SystemUserType = {
  id: string
  name: string
  email: string
  role: string
  status: 'Active' | 'Invited' | 'Pending approval'
}
