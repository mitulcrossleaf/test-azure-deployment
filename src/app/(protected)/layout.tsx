import { GeneralLayout } from '@/layouts'
import React from 'react'

const ProtactedLayout = ({ children }: { children: React.ReactNode }) => {
  return <GeneralLayout>{children}</GeneralLayout>
}

export default ProtactedLayout
