import { ManageOrganizationPage } from '@/components/user-management'
import { Metadata } from 'next'
export const metadata: Metadata = {
  title: 'Manage Organization | Supply Ontario',
  description:
    'Manage organization in Supply Ontario. View, edit, and configure organization settings, users, and access permissions.',
  keywords: [
    'Manage Organization',
    'Supply Ontario',
    'Organization Management',
    'Organization Settings',
    'User Management',
    'Ontario Government',
  ],
}
const ManageOrganization = () => {
  return <ManageOrganizationPage />
}

export default ManageOrganization
