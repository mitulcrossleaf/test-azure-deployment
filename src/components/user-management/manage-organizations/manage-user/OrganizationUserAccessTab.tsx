'use client'
import {
  Button,
  CheckBox,
  SectionTitle,
  SubSectionTitle,
  Switch,
} from '@/components/ui'
import { USER_ROLES } from '@/constants'
import { useAuth, useSonnar } from '@/context'
import { UserType } from '@/types/services'
import Link from 'next/link'
import { useState } from 'react'
const OrganizationUserAccessTab = ({ userData }: { userData: UserType }) => {
  const { showSonnar } = useSonnar()
  const { userRole } = useAuth()

  const [showInactive, setShowInactive] = useState(true)
  const [IsCheck, setIsCheck] = useState(true)
  const [IsCheckPermit, setIsCheckPermit] = useState(true)

  const handleUpdateAccess = () => {
    showSonnar({
      type: 'success',
      label: 'User access updated',
      message: 'Changes have been saved successfully.',
    })
  }

  return (
    <div className="flex flex-col gap-8">
      <SectionTitle
        apperance="h2-md"
        title="User access"
        lead
        leadLabel="Review and manage this user’s access"
        mainClassName="!p-0 !max-w-none"
      />

      {userRole === USER_ROLES.ORG_ADMIN && userData?.isOnlyAContact ? (
        <div className="bg-so-color-neutral-100 text-so-color-neutral-950 font-open-sans rounded-2xl p-6 text-base">
          Please turn off{' '}
          <Link
            href={`/manage-organizations-details/users/${userData?.userId}?tab=profile`}
            className="text-so-color-persona-general-600 underline"
          >
            Contact only
          </Link>{' '}
          to edit this user&apos;s access
        </div>
      ) : (
        <div className="space-y-8">
          <div className="bg-so-color-persona-general-50 flex flex-col gap-6 rounded-2xl p-6">
            <div className="flex w-full items-center justify-between">
              <SubSectionTitle
                apperance="h3-md"
                title="Application name"
                lead
                leadLabel="Application description"
              />
              <Switch enabled={showInactive} onChange={setShowInactive} />
            </div>
            <hr className="text-so-color-neutral-950 h-[2px]" />
            <div className="flex w-full items-center justify-between">
              <SubSectionTitle
                apperance="h3-md"
                title="App specific permission"
                lead
                leadLabel="Lorem ipsum dolor sit amet, consectetur adipiscing elit."
                className="!text-base"
              />

              <CheckBox checked={IsCheck} onChange={setIsCheck} />
            </div>
            <div className="flex w-full items-center justify-between">
              <SubSectionTitle
                apperance="h3-md"
                title="App specific permission"
                lead
                leadLabel="Lorem ipsum dolor sit amet, consectetur adipiscing elit."
                className="!text-base"
              />

              <CheckBox checked={IsCheckPermit} onChange={setIsCheckPermit} />
            </div>
          </div>

          <Button
            label="Update Access"
            onClick={handleUpdateAccess}
            appearance="primary"
            className="w-fit px-6 font-bold text-nowrap"
          />
        </div>
      )}
    </div>
  )
}

export default OrganizationUserAccessTab
