import { GeneralLayout } from '@/layouts'
import React from 'react'

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return <GeneralLayout>{children}</GeneralLayout>
}

export default AuthLayout
