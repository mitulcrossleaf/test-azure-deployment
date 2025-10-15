import { Dashboard } from '@/components/user-management'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Dashboard | Supply Ontario',
  description:
    'Supply Ontario Dashboard - Manage your organization, applications, and users in one centralized platform.',
  keywords: [
    'Dashboard',
    'Supply Ontario',
    'Organization Management',
    'Application Management',
    'User Management',
    'Ontario Government',
  ],
}

export default function Home() {
  return <Dashboard />
}
