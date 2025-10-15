import { CircularLoader } from '@/components/common'
import { ManageUserPage } from '@/components/user-management'

import { Suspense } from 'react'

const ManageUser = () => {
  return (
    <Suspense fallback={<CircularLoader />}>
      <ManageUserPage />
    </Suspense>
  )
}

export default ManageUser
