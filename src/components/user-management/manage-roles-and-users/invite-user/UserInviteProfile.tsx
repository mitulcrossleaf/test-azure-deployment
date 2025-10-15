'use client'

import { Button, InputSelect, InputText } from '@/components/ui'
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

interface UserInviteProfileProps {
  roleOptions: Array<{ value: string; label: string }>
  errors: FormikErrors<InviteUserFormValues>
  touched: FormikTouched<InviteUserFormValues>
  setFieldValue: (field: string, value: string) => void
  handleSteps: (nextStep: number, editMode?: boolean) => Promise<boolean>
  onCancel: () => void
  isChangeMode: boolean
}

const UserInviteProfile: React.FC<UserInviteProfileProps> = ({
  roleOptions,
  errors,
  touched,
  setFieldValue,
  handleSteps,
  onCancel,
  isChangeMode,
}) => {
  return (
    <div className="flex w-full max-w-[544px] flex-col gap-8">
      {/* Role Section */}
      <div className="bg-so-color-neutral-100 rounded-2xl p-6">
        <div className="text-so-color-neutral-950 mb-8 space-y-2">
          <h2 className="heading-h3-base font-bold">Role</h2>
          <p className="body-base">
            User&apos;s permissions role within organization
          </p>
        </div>

        <Field name="role">
          {({ field }: { field: FieldInputProps<string> }) => (
            <InputSelect
              {...field}
              trailingLabel="(required)"
              label="Role"
              items={roleOptions}
              value={field.value}
              onChange={value => setFieldValue('role', value)}
              error={
                touched.role && errors.role
                  ? (errors.role as string)
                  : undefined
              }
            />
          )}
        </Field>
      </div>

      {/* Profile Section */}
      <div className="bg-so-color-neutral-100 rounded-2xl p-6">
        <div className="text-so-color-neutral-950 mb-8 space-y-2">
          <h2 className="heading-h3-base font-bold">Profile</h2>
          <p className="body-base">User&apos;s primary information</p>
        </div>

        <div className="space-y-6">
          <Field name="firstName">
            {({ field }: { field: FieldInputProps<string> }) => (
              <InputText
                {...field}
                trailingLabel="(required)"
                label="First name"
                error={
                  touched.firstName && errors.firstName
                    ? (errors.firstName as string)
                    : undefined
                }
              />
            )}
          </Field>

          <Field name="lastName">
            {({ field }: { field: FieldInputProps<string> }) => (
              <InputText
                {...field}
                trailingLabel="(required)"
                label="Last name"
                error={
                  touched.lastName && errors.lastName
                    ? (errors.lastName as string)
                    : undefined
                }
              />
            )}
          </Field>

          <Field name="email">
            {({ field }: { field: FieldInputProps<string> }) => (
              <InputText
                {...field}
                trailingLabel="(required)"
                label="Email address"
                type="email"
                error={
                  touched.email && errors.email
                    ? (errors.email as string)
                    : undefined
                }
              />
            )}
          </Field>

          <Field name="jobTitle">
            {({ field }: { field: FieldInputProps<string> }) => (
              <InputText
                {...field}
                trailingLabel="(required)"
                label="Job title"
                error={
                  touched.jobTitle && errors.jobTitle
                    ? (errors.jobTitle as string)
                    : undefined
                }
              />
            )}
          </Field>

          <Field name="department">
            {({ field }: { field: FieldInputProps<string> }) => (
              <InputText
                {...field}
                trailingLabel="(required)"
                label="Department"
                error={
                  touched.department && errors.department
                    ? (errors.department as string)
                    : undefined
                }
              />
            )}
          </Field>
        </div>
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
            label="Continue"
            appearance="primary"
            className="!px-6 text-center"
            onClick={() => handleSteps(2, false)}
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

export default UserInviteProfile
