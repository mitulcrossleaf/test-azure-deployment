import { CircularLoader } from '@/components/common'
import { AddApplication } from '@/components/user-management'
import type { Metadata } from 'next'
import { Suspense } from 'react'

export const metadata: Metadata = {
  title: 'Add Application | Supply Ontario',
  description:
    'Add a new enterprise application to Supply Ontario. Configure application details, access settings, and management options.',
  keywords: [
    'Add Application',
    'Supply Ontario',
    'Enterprise Applications',
    'Application Configuration',
    'New Application',
    'Ontario Government',
  ],
}

const page = () => {
  return (
    <Suspense fallback={<CircularLoader />}>
      <AddApplication />
    </Suspense>
  )
}

export default page
