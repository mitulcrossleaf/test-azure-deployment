'use client'
import {
  AlertProps,
  Button,
  CheckBox,
  SectionTitle,
  Separator,
  Switch,
} from '@/components/ui'
import { cn } from '@/lib'
import { useState } from 'react'

const ManageRoleAccess = ({
  onAlert,
}: {
  onAlert?: (alert: AlertProps | null) => void
}) => {
  // Access levels
  const [accountAccessLevel, setAccountAccessLevel] = useState(true)
  const [applicationAccessLevel, setApplicationAccessLevel] = useState(false)

  // Access permissions
  const [
    organizationManagementPermission,
    setOrganizationManagementPermission,
  ] = useState(true)
  const [organizationUsersPermission, setOrganizationUsersPermission] =
    useState(false)

  const handleSubmit = () => {
    // Clear any existing alerts
    onAlert?.(null)
  }

  return (
    <div className="flex flex-col gap-8 pb-8">
      <SectionTitle
        title="Role access"
        lead
        apperance="h2-md"
        mainClassName="!max-w-none !px-0 !py-0"
        leadLabel="Review and manage this role's access"
      />

      {/* Account Access Level Section */}
      <div
        className={cn(
          'flex flex-col gap-6 rounded-2xl p-6',
          accountAccessLevel
            ? 'bg-so-color-persona-general-50'
            : 'bg-so-color-neutral-100'
        )}
      >
        <div className="flex w-full items-center justify-between">
          <div className="text-so-color-neutral-950">
            <h2 className="heading-h3-base font-bold">Access level</h2>
            <p className="body-base text-so-color-neutral-600">
              Integer suscipit auctor libero, sit amet tristique est molestie
              id.
            </p>
          </div>
          <Switch
            enabled={accountAccessLevel}
            onChange={setAccountAccessLevel}
          />
        </div>

        {accountAccessLevel && (
          <>
            <Separator
              appearance="thick"
              className="!bg-so-color-neutral-950 !px-0 !py-0"
            />

            <div className="flex w-full items-center justify-between">
              <div className="text-so-color-neutral-950">
                <h2 className="body-base font-bold">Access permission</h2>
                <p className="body-base text-so-color-neutral-600">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                </p>
              </div>
              <CheckBox
                checked={organizationManagementPermission}
                onChange={setOrganizationManagementPermission}
              />
            </div>

            <Separator
              appearance="thin"
              className="!border-so-color-neutral-300 !px-0 !py-0"
            />

            <div className="flex w-full items-center justify-between">
              <div className="text-so-color-neutral-950">
                <h2 className="body-base font-bold">Access permission</h2>
                <p className="body-base text-so-color-neutral-600">
                  Integer suscipit auctor libero, sit amet tristique est
                  molestie id.
                </p>
              </div>
              <CheckBox
                checked={organizationUsersPermission}
                onChange={setOrganizationUsersPermission}
              />
            </div>
          </>
        )}
      </div>

      {/* Application Access Level Section */}
      <div className="bg-so-color-neutral-100 flex flex-col gap-6 rounded-2xl p-6">
        <div className="flex w-full items-center justify-between">
          <div className="text-so-color-neutral-950">
            <h2 className="heading-h3-base font-bold">Access level</h2>
            <p className="body-base text-so-color-neutral-600">
              Integer suscipit auctor libero, sit amet tristique est molestie
              id.
            </p>
          </div>
          <Switch
            enabled={applicationAccessLevel}
            onChange={setApplicationAccessLevel}
          />
        </div>
      </div>

      <Button
        label="Update access"
        appearance="primary"
        className="w-fit px-6 font-bold"
        onClick={handleSubmit}
      />
    </div>
  )
}

export default ManageRoleAccess
