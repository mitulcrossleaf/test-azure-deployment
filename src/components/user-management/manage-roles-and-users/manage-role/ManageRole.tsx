'use client'
import type { AlertProps } from '@/components/ui'
import { Alert, PageTitle, TabsGroup } from '@/components/ui'
import {
  TABS_MANAGE_ROLES_AND_USERS_MANAGE_ROLES_SYSTEM_ADMIN,
  getManageUserTabIndex,
  getManageUserTabName,
} from '@/constants'

import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import ManageRoleAccess from './ManageRoleAccess'
import ManageRoleDetails from './ManageRoleDetails'

const ManageRole = () => {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [activeTab, setActiveTab] = useState(() => {
    const tabParam = searchParams.get('tab')
    return getManageUserTabIndex(tabParam)
  })
  const [loading, _setLoading] = useState(false)
  const [alert, setAlert] = useState<AlertProps | null>(null)

  const handleTabChange = (newTab: number) => {
    setActiveTab(newTab)
    const tabName = getManageUserTabName(newTab)
    router.push(`/manage-roles-and-users/system-roles/1?tab=${tabName}`, {
      scroll: false,
    })
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 0:
        return <ManageRoleDetails onAlert={setAlert} />
      case 1:
        return <ManageRoleAccess onAlert={setAlert} />
      default:
        return <ManageRoleDetails onAlert={setAlert} />
    }
  }

  useEffect(() => {
    const tabParam = searchParams.get('tab')
    if (tabParam) {
      const tabIndex = getManageUserTabIndex(tabParam)
      setActiveTab(tabIndex)
    }
  }, [searchParams])

  return (
    <div className="flex flex-col">
      <PageTitle
        title="Organization Admin"
        lead="Manage user role"
        breadcrumbs={true}
        variant="profile"
        crumbs={[
          {
            collapsed: false,
            active: false,
            crumb: 'Dashboard',
            href: '/',
          },
          {
            collapsed: false,
            active: false,
            crumb: 'Manage roles and users',
            href: '/manage-roles-and-users',
          },
          {
            collapsed: false,
            active: true,
            crumb: 'Manage role',
            href: '/manage-roles-and-users/manage-role',
          },
        ]}
        loading={loading}
      />

      <div className="container flex flex-col pt-8">
        <TabsGroup
          tabs={TABS_MANAGE_ROLES_AND_USERS_MANAGE_ROLES_SYSTEM_ADMIN}
          onTabChange={handleTabChange}
          defaultActiveTab={activeTab}
          loading={loading}
        />

        {alert && (
          <Alert
            title={alert.title}
            description={alert.description}
            validationErrors={alert.validationErrors}
            variant={alert.variant}
          />
        )}

        {renderTabContent()}
      </div>
    </div>
  )
}

export default ManageRole
