'use client'

import { Button } from '@/components/ui'
import InputCheckboxGroup from '@/components/ui/InputCheckboxGroup'
import { Field, FieldInputProps, FormikErrors, FormikTouched } from 'formik'
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

interface UserInviteAccessProps {
  accessScopeOptions: Array<{ value: string; label: string }>
  accountManagementOptions: Array<{ value: string; label: string }>
  applicationManagementOptions: Array<{ value: string; label: string }>
  errors: FormikErrors<InviteUserFormValues>
  touched: FormikTouched<InviteUserFormValues>
  setFieldValue: (field: string, value: string[]) => void
  handleSteps: (nextStep: number, editMode?: boolean) => Promise<boolean>
  onCancel: () => void
  isChangeMode: boolean
}

const UserInviteAccess: React.FC<UserInviteAccessProps> = ({
  accessScopeOptions,
  accountManagementOptions,
  applicationManagementOptions,
  errors,
  touched,
  setFieldValue,
  handleSteps,
  onCancel,
  isChangeMode,
}) => {
  return (
    <div className="flex w-full max-w-[544px] flex-col gap-8">
      {/* Access Scope Section */}
      <div className="bg-so-color-neutral-100 rounded-2xl p-6">
        <Field name="accessScope">
          {({ field }: { field: FieldInputProps<string[]> }) => (
            <InputCheckboxGroup
              label="Access scope"
              trailingLabel="(required)"
              name={field.name}
              options={accessScopeOptions}
              value={field.value}
              onChange={(values: string[]) =>
                setFieldValue('accessScope', values)
              }
              hintExpander={true}
              hintText="What is access scope?"
              hintContent="Access scope determines which organizations and data the user can access within the system."
              error={
                touched.accessScope && errors.accessScope
                  ? (errors.accessScope as string)
                  : undefined
              }
            />
          )}
        </Field>
      </div>

      {/* Account Management Section */}
      <div className="bg-so-color-neutral-100 rounded-2xl p-6">
        <Field name="accountManagement">
          {({ field }: { field: FieldInputProps<string[]> }) => (
            <InputCheckboxGroup
              label="Account management"
              trailingLabel="(required)"
              name={field.name}
              options={accountManagementOptions}
              value={field.value}
              onChange={(values: string[]) =>
                setFieldValue('accountManagement', values)
              }
              hintExpander={true}
              hintText="What is account management?"
              hintContent="Account management permissions control what organizational and user management actions the user can perform."
              error={
                touched.accountManagement && errors.accountManagement
                  ? (errors.accountManagement as string)
                  : undefined
              }
            />
          )}
        </Field>
      </div>

      {/* Application Management Section */}
      <div className="bg-so-color-neutral-100 rounded-2xl p-6">
        <Field name="applicationManagement">
          {({ field }: { field: FieldInputProps<string[]> }) => (
            <InputCheckboxGroup
              label="Application management"
              trailingLabel="(required)"
              name={field.name}
              options={applicationManagementOptions}
              value={field.value}
              onChange={(values: string[]) =>
                setFieldValue('applicationManagement', values)
              }
              hintExpander={true}
              hintText="What is application management?"
              hintContent="Application management permissions determine which applications and features the user can access and manage."
              error={
                touched.applicationManagement && errors.applicationManagement
                  ? (errors.applicationManagement as string)
                  : undefined
              }
            />
          )}
        </Field>
      </div>

      {/* Action Buttons */}
      {isChangeMode ? (
        <div className="flex items-center justify-start">
          <Button
            type="button"
            label="Save changes"
            appearance="primary"
            className="!px-6 text-center"
            onClick={() => handleSteps(3, false)}
          />
        </div>
      ) : (
        <div className="flex items-center gap-8">
          <Button
            type="button"
            label="Review"
            appearance="primary"
            className="!px-6 text-center"
            onClick={() => handleSteps(3, false)}
          />
          <Button
            type="button"
            label="Cancel"
            appearance="secondary"
            semantic="general"
            className="px-6"
            onClick={onCancel}
          />
        </div>
      )}
    </div>
  )
}

export default UserInviteAccess
