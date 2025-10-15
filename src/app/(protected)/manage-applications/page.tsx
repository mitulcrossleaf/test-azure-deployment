import { ManageApplications } from '@/components/user-management'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Manage Applications | Supply Ontario',
  description:
    'Manage enterprise applications in Supply Ontario. Add, configure, and monitor applications for your organization.',
  keywords: [
    'Manage Applications',
    'Supply Ontario',
    'Enterprise Applications',
    'Application Management',
    'Organization Applications',
    'Ontario Government',
  ],
}

const page = () => {
  return <ManageApplications />
}

export default page
