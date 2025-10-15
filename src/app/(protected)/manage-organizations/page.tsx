import { ManageOrganizationsPage } from '@/components/user-management'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Manage Organizations | Supply Ontario',
  description:
    'Manage organizations in Supply Ontario. View, edit, and configure organization settings, users, and access permissions.',
  keywords: [
    'Manage Organizations',
    'Supply Ontario',
    'Organization Management',
    'Organization Settings',
    'User Management',
    'Ontario Government',
  ],
}

const ManageOrganizations = () => {
  return <ManageOrganizationsPage />
}

export default ManageOrganizations
