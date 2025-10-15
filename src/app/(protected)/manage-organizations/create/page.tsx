import { CircularLoader } from '@/components/common'
import { CreateOrganization } from '@/components/user-management'
import type { Metadata } from 'next'
import { Suspense } from 'react'

export const metadata: Metadata = {
  title: 'Create Organization | Supply Ontario',
  description:
    'Create a new organization in Supply Ontario. Set up organization details, preferences, and user access settings.',
  keywords: [
    'Create Organization',
    'Supply Ontario',
    'New Organization',
    'Organization Setup',
    'Organization Registration',
    'Ontario Government',
  ],
}

const page = () => {
  return (
    <Suspense fallback={<CircularLoader />}>
      <CreateOrganization />
    </Suspense>
  )
}

export default page
