import { InputSearchResultItem } from '@/components/ui'

export enum USER_ROLES {
  SO_ADMIN = 'SO Admin',
  ORG_ADMIN = 'Org Admin',
  STANDARD_USER = 'Standard User',
  SO_SYSTEM_ADMIN = 'SO System Admin',
  READ_ONLY = 'Read Only',
}

export enum USER_STATUS {
  PENDING_APPROVAL = 'Pending approval',
  PENDINGAPPROVAL = 'PendingApproval',
  ACTIVE = 'Active',
  INACTIVE = 'Inactive',
  INVITED = 'Invited',
}

export const TABS_MANAGE_ORGANIZATIONS = [
  {
    label: 'All organizations',
    count: '1,195',
  },
  { label: 'Inactive', count: '23' },
  { label: 'Pending approval', count: '4' },
]

export const TABS_MANAGE_ORGANIZATION = [
  {
    label: 'Organization details',
    iconLeading: (
      <i className="material-symbols-outlined !leading-none">apartment</i>
    ),
  },
  {
    label: 'Organization users',
    iconLeading: (
      <i className="material-symbols-outlined !leading-none">account_circle</i>
    ),
  },
  {
    label: 'Organization access',
    iconLeading: (
      <i className="material-symbols-outlined !leading-none">tune</i>
    ),
  },
]
export const TABS_MANAGE_ORGANIZATION_ORG_ADMIN = [
  {
    label: 'Organization details',
    iconLeading: (
      <i className="material-symbols-outlined !leading-none">apartment</i>
    ),
  },
  {
    label: 'Organization users',
    iconLeading: (
      <i className="material-symbols-outlined !leading-none">account_circle</i>
    ),
  },
]
export const TABS_MANAGE_ORGANIZATION_MANAGE_USER_ORG_ADMIN = [
  {
    label: 'User profile',
    iconLeading: (
      <i className="material-symbols-outlined !leading-none">account_circle</i>
    ),
  },
  {
    label: 'User access',
    iconLeading: <i className="material-symbols-outlined">tune</i>,
  },
]

export const ALL_AGREEMENTS: InputSearchResultItem[] = [
  {
    id: '1',
    title: 'Tender-17543, IT Products and Services',
    showDetails: true,
    showAddress: false,
    url: 'Agreement details',
    desc: 'Truncated agreement description...',
  },
  {
    id: '2',
    title: 'Tender-17544, IT Products and Services',
    showDetails: true,
    showAddress: false,
    desc: 'Truncated agreement description...',
    url: 'Agreement details',
  },
  {
    id: '3',
    title: 'Tender-17545, Office Supplies',
    showDetails: true,
    showAddress: false,
    desc: 'Truncated agreement description...',
    url: 'Agreement details',
  },
]

export const TABS_MANAGE_ROLES_AND_USERS_MANAGE_ROLES_SYSTEM_ADMIN = [
  {
    label: 'Role details',
    iconLeading: (
      <i className="material-symbols-outlined !text-2xl !leading-none">
        account_circle
      </i>
    ),
  },
  {
    label: 'Role access',
    iconLeading: (
      <i className="material-symbols-outlined !text-2xl !leading-none">tune</i>
    ),
  },
]

export const DASHBOARD_CARDS_SO_SYSTEM_ADMIN = [
  {
    id: 0,
    title: 'Manage roles and users',
    description:
      'Define and update user roles and access permissions across the system.',
    icon: 'account_circle',
    href: '/manage-roles-and-users',
  },
  {
    id: 1,
    title: 'Manage applications',
    description: 'Create and manage enterprise applications across the system.',
    icon: 'dashboard_customize',
    href: '/manage-applications',
  },
  {
    id: 2,
    title: 'Manage IAM service',
    description:
      'Review and manage your Identity and Access Management (IAM) settings.',
    icon: 'key',
    href: '/manage-iam-service',
  },
  {
    id: 3,
    title: 'View audit history',
    description: 'View a detailed log of system activities and changes.',
    icon: 'schedule',
    href: '/view-audit-history',
  },
]

export const DASHBOARD_CARDS_ORG_ADMIN = [
  {
    id: 0,
    title: 'Manage my organization',
    description:
      'View and manage your organization, including organization details and users.',
    icon: 'storefront',
    href: '/manage-organizations-details',
  },
]

export const DASHBOARD_CARDS_SO_ADMIN = [
  {
    id: 0,
    title: 'Manage organizations',
    description:
      'View and manage organizational accounts, including organization users, and access controls.',
    icon: 'apartment',
    href: '/manage-organizations',
  },
]
