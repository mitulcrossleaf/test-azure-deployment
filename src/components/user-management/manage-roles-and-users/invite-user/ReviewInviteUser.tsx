'use client'
import { Button } from '@/components/ui'
import React from 'react'

interface InviteUserFormValues {
  role: string
  firstName: string
  lastName: string
  email: string
  jobTitle: string
  department: string
  accessScope: string[]
  accountManagement: string[]
  applicationManagement: string[]
}

interface ReviewInviteUserProps {
  formData: InviteUserFormValues | null
  roleOptions: Array<{ value: string; label: string }>
  accessScopeOptions: Array<{ value: string; label: string }>
  accountManagementOptions: Array<{ value: string; label: string }>
  applicationManagementOptions: Array<{ value: string; label: string }>
  onChangeStep: (step: string) => void
}

const ReviewInviteUser: React.FC<ReviewInviteUserProps> = ({
  formData,
  roleOptions,
  accessScopeOptions,
  accountManagementOptions,
  applicationManagementOptions,
  onChangeStep,
}) => {
  return (
    <div className="flex w-full flex-col gap-8">
      {/* User Profile Review */}
      <div className="flex flex-col gap-8">
        <div className="flex items-center justify-between">
          <h2 className="heading-h2-base text-so-color-neutral-950 font-bold">
            User profile
          </h2>
          <Button
            appearance="ghost"
            labelClassName="font-normal"
            label="Change"
            className="underline"
            onClick={() => onChangeStep('user-profile')}
          />
        </div>
        <hr className="border-so-color-neutral-300" />

        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-1">
            <p className="heading-h3-base text-so-color-neutral-950 font-bold">
              Role
            </p>
            <p className="body-base text-so-color-neutral-600">
              {roleOptions.find(opt => opt.value === formData?.role)?.label ||
                '-'}
            </p>
          </div>

          <div className="flex flex-col gap-1">
            <p className="heading-h3-base text-so-color-neutral-950 font-bold">
              Full name
            </p>
            <p className="body-base text-so-color-neutral-600">
              {formData?.firstName} {formData?.lastName}
            </p>
          </div>

          <div className="flex flex-col gap-1">
            <p className="heading-h3-base text-so-color-neutral-950 font-bold">
              Email address
            </p>
            <p className="body-base text-so-color-neutral-600">
              {formData?.email || '-'}
            </p>
          </div>

          <div className="flex flex-col gap-1">
            <p className="heading-h3-base text-so-color-neutral-950 font-bold">
              Job title
            </p>
            <p className="body-base text-so-color-neutral-600">
              {formData?.jobTitle || '-'}
            </p>
          </div>

          <div className="flex flex-col gap-1">
            <p className="heading-h3-base text-so-color-neutral-950 font-bold">
              Department
            </p>
            <p className="body-base text-so-color-neutral-600">
              {formData?.department || '-'}
            </p>
          </div>
        </div>
      </div>

      {/* User Access Review */}
      <div className="flex flex-col gap-8">
        <div className="flex items-center justify-between">
          <h2 className="heading-h2-base text-so-color-neutral-950 font-bold">
            User access
          </h2>
          <Button
            appearance="ghost"
            labelClassName="font-normal"
            label="Change"
            className="underline"
            onClick={() => onChangeStep('user-access')}
          />
        </div>
        <hr className="border-so-color-neutral-300" />

        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-1">
            <p className="heading-h3-base text-so-color-neutral-950 font-bold">
              Access scope
            </p>
            <p className="body-base text-so-color-neutral-600">
              {formData?.accessScope
                ?.map(
                  (scope: string) =>
                    accessScopeOptions.find(opt => opt.value === scope)?.label
                )
                .join(', ') || '-'}
            </p>
          </div>

          <div className="flex flex-col gap-1">
            <p className="heading-h3-base text-so-color-neutral-950 font-bold">
              Account management
            </p>
            <p className="body-base text-so-color-neutral-600">
              {formData?.accountManagement
                ?.map(
                  (mgmt: string) =>
                    accountManagementOptions.find(opt => opt.value === mgmt)
                      ?.label
                )
                .join(', ') || '-'}
            </p>
          </div>

          <div className="flex flex-col gap-1">
            <p className="heading-h3-base text-so-color-neutral-950 font-bold">
              Application management
            </p>
            <p className="body-base text-so-color-neutral-600">
              {formData?.applicationManagement
                ?.map(
                  (app: string) =>
                    applicationManagementOptions.find(opt => opt.value === app)
                      ?.label
                )
                .join(', ') || '-'}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ReviewInviteUser
