'use client'
import type { AlertProps } from '@/components/ui'
import {
  Alert,
  Button,
  InputCheckboxGroup,
  InputSelect,
  InputText,
  SectionTitle,
  SubSectionTitle,
} from '@/components/ui'
import { useSonnar } from '@/context'
import { Field, FieldInputProps, Form, Formik } from 'formik'
import { useCallback, useMemo, useState } from 'react'
import * as Yup from 'yup'

interface ManageUserProfileProps {
  onAlert?: (alert: AlertProps | null) => void
}

const ManageUserProfile = ({ onAlert: _onAlert }: ManageUserProfileProps) => {
  const { showSonnar } = useSonnar()
  const [isUpdating, setIsUpdating] = useState(false)

  const initialFormData = useMemo(
    () => ({
      firstName: '',
      lastName: '',
      email: '',
      jobTitle: '',
      department: '',
      role: '',
      accessScope: [] as string[],
    }),
    []
  )

  const formSchema = Yup.object().shape({
    firstName: Yup.string().required('Please enter a valid first name'),
    lastName: Yup.string().required('Please enter a valid last name'),
    email: Yup.string()
      .email('Please enter a valid email address')
      .required('Please enter a valid email address'),
    jobTitle: Yup.string().required('Please enter a valid job title'),
    department: Yup.string().required('Please enter a valid department'),
    role: Yup.string().required('Please select a role'),
    accessScope: Yup.array().min(1, 'Please select at least one access scope'),
  })

  const handleSubmit = useCallback(
    async (_values: typeof initialFormData) => {
      try {
        setIsUpdating(true)
        // TODO: Replace with actual API call when available

        showSonnar({
          type: 'success',
          label: 'User profile updated',
          message: 'Changes have been saved successfully.',
        })
      } catch {
        showSonnar({
          type: 'danger',
          label: 'Error',
          message: 'Failed to update user profile. Please try again.',
        })
      } finally {
        setIsUpdating(false)
      }
    },
    [showSonnar]
  )

  return (
    <div className="flex flex-col justify-start gap-8">
      <SectionTitle
        apperance="h2-md"
        title="User profile"
        lead={true}
        leadLabel="Review and manage this user's information"
        mainClassName="!max-w-none !py-0 !px-0"
      />

      <Formik
        initialValues={initialFormData}
        validationSchema={formSchema}
        onSubmit={handleSubmit}
        enableReinitialize={true}
      >
        {({ errors, touched, handleBlur, setFieldValue, validateField }) => {
          const errorMessages = Object.keys(errors)
            .filter(key => touched[key as keyof typeof touched])
            .map(key => errors[key as keyof typeof errors])
            .filter((error): error is string => typeof error === 'string')

          return (
            <Form className="flex flex-col gap-8">
              {errorMessages.length > 0 && (
                <Alert
                  title="Missing required information"
                  description="Some required fields are incomplete or invalid. Review the details below to continue."
                  validationErrors={errorMessages}
                  variant="destructive"
                />
              )}

              <div className="flex w-full max-w-[544px] flex-col gap-8">
                {/* Role Section */}
                <div className="bg-so-color-neutral-100 flex flex-col gap-8 rounded-2xl p-6">
                  <SubSectionTitle
                    apperance="h3-md"
                    title="Role"
                    lead
                    leadLabel="User's permissions role within organization"
                  />

                  <Field name="role">
                    {({ field }: { field: FieldInputProps<string> }) => (
                      <InputSelect
                        {...field}
                        trailingLabel="(required)"
                        label="Role"
                        items={[
                          { label: 'Standard User', value: 'standard-user' },
                          { label: 'Organization Admin', value: 'org-admin' },
                          { label: 'SO Admin', value: 'so-admin' },
                        ]}
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

                {/* Access Scope Section */}
                <div className="bg-so-color-neutral-100 rounded-2xl p-6">
                  <Field name="accessScope">
                    {({ field }: { field: FieldInputProps<string[]> }) => (
                      <InputCheckboxGroup
                        label="Access scope"
                        trailingLabel="(required)"
                        options={[
                          {
                            label: 'Ontario Public Service Organizations',
                            value: 'ontario-public-service',
                          },
                          {
                            label: 'Broader Public Sector Organizations',
                            value: 'broader-public-sector',
                          },
                          {
                            label: 'Vendor Organizations',
                            value: 'vendor-organizations',
                          },
                        ]}
                        value={field.value || []}
                        onChange={(selectedValues: string[]) => {
                          setFieldValue('accessScope', selectedValues, false)
                          if (selectedValues.length > 0) {
                            validateField('accessScope')
                          }
                        }}
                        error={
                          touched.accessScope && errors.accessScope
                            ? (errors.accessScope as string)
                            : undefined
                        }
                        hintExpander
                        hintText="What is access scope?"
                        hintContent="Access scope determines which types of organizations this user can view and manage within the system."
                      />
                    )}
                  </Field>
                </div>

                {/* Profile Section */}
                <div className="bg-so-color-neutral-100 flex flex-col gap-8 rounded-2xl p-6">
                  <SubSectionTitle
                    apperance="h3-md"
                    title="Profile"
                    lead
                    leadLabel="User's primary information"
                  />

                  <div className="flex flex-col gap-8">
                    <Field name="firstName">
                      {({ field }: { field: FieldInputProps<string> }) => (
                        <InputText
                          {...field}
                          label="First name"
                          trailingLabel="(required)"
                          error={
                            touched.firstName && errors.firstName
                              ? errors.firstName
                              : undefined
                          }
                          onBlur={handleBlur}
                        />
                      )}
                    </Field>

                    <Field name="lastName">
                      {({ field }: { field: FieldInputProps<string> }) => (
                        <InputText
                          {...field}
                          label="Last name"
                          trailingLabel="(required)"
                          error={
                            touched.lastName && errors.lastName
                              ? errors.lastName
                              : undefined
                          }
                          onBlur={handleBlur}
                        />
                      )}
                    </Field>

                    <Field name="email">
                      {({ field }: { field: FieldInputProps<string> }) => (
                        <InputText
                          {...field}
                          type="email"
                          label="Email address"
                          trailingLabel="(required)"
                          error={
                            touched.email && errors.email
                              ? errors.email
                              : undefined
                          }
                          onBlur={handleBlur}
                        />
                      )}
                    </Field>

                    <Field name="jobTitle">
                      {({ field }: { field: FieldInputProps<string> }) => (
                        <InputText
                          {...field}
                          label="Job title"
                          trailingLabel="(required)"
                          error={
                            touched.jobTitle && errors.jobTitle
                              ? errors.jobTitle
                              : undefined
                          }
                          onBlur={handleBlur}
                        />
                      )}
                    </Field>

                    <Field name="department">
                      {({ field }: { field: FieldInputProps<string> }) => (
                        <InputText
                          {...field}
                          label="Department"
                          trailingLabel="(required)"
                          error={
                            touched.department && errors.department
                              ? errors.department
                              : undefined
                          }
                          onBlur={handleBlur}
                        />
                      )}
                    </Field>
                  </div>
                </div>

                <Button
                  type="submit"
                  label="Update profile"
                  appearance="primary"
                  className="!w-fit !px-6"
                  loading={isUpdating}
                  loadingText="Updating..."
                  disabled={isUpdating}
                />
              </div>
            </Form>
          )
        }}
      </Formik>
    </div>
  )
}

export default ManageUserProfile
