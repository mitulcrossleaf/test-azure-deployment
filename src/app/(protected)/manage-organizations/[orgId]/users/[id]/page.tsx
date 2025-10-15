import { CircularLoader } from '@/components/common'
import { ManageUserPage } from '@/components/user-management'

import type { Metadata } from 'next'
import { Suspense } from 'react'

export const metadata: Metadata = {
  title: 'Manage User | Supply Ontario',
  description:
    'Manage user details, roles, and permissions in Supply Ontario. Update user information, access settings, and organizational assignments.',
  keywords: [
    'Manage User',
    'Supply Ontario',
    'User Management',
    'User Details',
    'User Roles',
    'User Permissions',
    'Ontario Government',
  ],
}

const ManageUser = () => {
  return (
    <Suspense fallback={<CircularLoader />}>
      <ManageUserPage />
    </Suspense>
  )
}

export default ManageUser
