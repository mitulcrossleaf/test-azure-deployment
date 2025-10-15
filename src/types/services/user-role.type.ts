export interface UserRoleType {
  userRoleId: string
  roleName: string
  isActive: boolean
  createdAt: string
  createdBy: string
  modifiedAt: string
  modifiedBy: string | null
}

export interface UserRoleDropdown {
  value: string
  label: string
}
