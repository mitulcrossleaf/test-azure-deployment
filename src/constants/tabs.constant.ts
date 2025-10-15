// Tab names for manage-organizations page
export const MANAGE_ORGANIZATIONS_TAB_NAMES = {
  ALL: 'all',
  INACTIVE: 'inactive',
  PENDING: 'pending',
} as const

export type ManageOrganizationsTabName =
  (typeof MANAGE_ORGANIZATIONS_TAB_NAMES)[keyof typeof MANAGE_ORGANIZATIONS_TAB_NAMES]

export const MANAGE_ROLES_AND_USERS_TAB_NAMES = {
  SYSTEM_ROLES: 'system-roles',
  SYSTEM_USERS: 'system-users',
} as const

export type ManageRolesAndUsersTabName =
  (typeof MANAGE_ROLES_AND_USERS_TAB_NAMES)[keyof typeof MANAGE_ROLES_AND_USERS_TAB_NAMES]

// Tab names for manage-organization page
export const MANAGE_ORGANIZATION_TAB_NAMES = {
  PROFILE: 'profile',
  USERS: 'users',
  ACCESS: 'access',
} as const

export type ManageOrganizationTabName =
  (typeof MANAGE_ORGANIZATION_TAB_NAMES)[keyof typeof MANAGE_ORGANIZATION_TAB_NAMES]

// Helper functions to convert between tab names and indices
export const getManageOrganizationsTabIndex = (
  tabName: string | null
): number => {
  switch (tabName) {
    case MANAGE_ORGANIZATIONS_TAB_NAMES.ALL:
      return 0
    case MANAGE_ORGANIZATIONS_TAB_NAMES.INACTIVE:
      return 1
    case MANAGE_ORGANIZATIONS_TAB_NAMES.PENDING:
      return 2
    default:
      return 0
  }
}

export const getManageOrganizationsTabName = (
  index: number
): ManageOrganizationsTabName => {
  switch (index) {
    case 0:
      return MANAGE_ORGANIZATIONS_TAB_NAMES.ALL
    case 1:
      return MANAGE_ORGANIZATIONS_TAB_NAMES.INACTIVE
    case 2:
      return MANAGE_ORGANIZATIONS_TAB_NAMES.PENDING
    default:
      return MANAGE_ORGANIZATIONS_TAB_NAMES.ALL
  }
}

export const getManageRolesAndUsersTabIndex = (
  tabName: string | null
): number => {
  switch (tabName) {
    case MANAGE_ROLES_AND_USERS_TAB_NAMES.SYSTEM_ROLES:
      return 0
    case MANAGE_ROLES_AND_USERS_TAB_NAMES.SYSTEM_USERS:
      return 1
    default:
      return 0
  }
}

export const getManageRolesAndUsersTabName = (
  tabName: number
): ManageRolesAndUsersTabName => {
  switch (tabName) {
    case 0:
      return MANAGE_ROLES_AND_USERS_TAB_NAMES.SYSTEM_ROLES
    case 1:
      return MANAGE_ROLES_AND_USERS_TAB_NAMES.SYSTEM_USERS
    default:
      return MANAGE_ROLES_AND_USERS_TAB_NAMES.SYSTEM_ROLES
  }
}

export const getManageOrganizationTabIndex = (
  tabName: string | null
): number => {
  switch (tabName) {
    case MANAGE_ORGANIZATION_TAB_NAMES.PROFILE:
      return 0
    case MANAGE_ORGANIZATION_TAB_NAMES.USERS:
      return 1
    case MANAGE_ORGANIZATION_TAB_NAMES.ACCESS:
      return 2
    default:
      return 0
  }
}
export const getManageUserTabIndex = (tabName: string | null): number => {
  switch (tabName) {
    case MANAGE_ORGANIZATION_TAB_NAMES.PROFILE:
      return 0
    case MANAGE_ORGANIZATION_TAB_NAMES.ACCESS:
      return 1
    default:
      return 0
  }
}

export const getManageOrganizationTabName = (
  index: number
): ManageOrganizationTabName => {
  switch (index) {
    case 0:
      return MANAGE_ORGANIZATION_TAB_NAMES.PROFILE
    case 1:
      return MANAGE_ORGANIZATION_TAB_NAMES.USERS
    case 2:
      return MANAGE_ORGANIZATION_TAB_NAMES.ACCESS
    default:
      return MANAGE_ORGANIZATION_TAB_NAMES.USERS
  }
}

export const getManageUserTabName = (
  index: number
): ManageOrganizationTabName => {
  switch (index) {
    case 0:
      return MANAGE_ORGANIZATION_TAB_NAMES.PROFILE
    case 1:
      return MANAGE_ORGANIZATION_TAB_NAMES.ACCESS
    default:
      return MANAGE_ORGANIZATION_TAB_NAMES.PROFILE
  }
}
