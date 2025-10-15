'use client'
import type { AlertProps } from '@/components/ui'
import {
  Alert,
  Button,
  InputRadioGroup,
  InputText,
  SectionTitle,
} from '@/components/ui'
import { useSonnar } from '@/context'
import { Field, FieldInputProps, Form, Formik } from 'formik'
import { useCallback, useState } from 'react'
import * as Yup from 'yup'

interface ManageRoleDetailsProps {
  onAlert?: (alert: AlertProps | null) => void
}

interface RoleDetailsFormValues {
  roleName: string
  segmentType: string
  organizationType: string
}

const validationSchema = Yup.object({
  roleName: Yup.string().required('Please enter a valid role name'),
  segmentType: Yup.string().required('Please select a valid segment type'),
  organizationType: Yup.string().required(
    'Please select a valid organization type'
  ),
})

const ManageRoleDetails = ({ onAlert: _onAlert }: ManageRoleDetailsProps) => {
  const { showSonnar } = useSonnar()
  const [isUpdating, setIsUpdating] = useState(false)

  const initialValues: RoleDetailsFormValues = {
    roleName: '',
    segmentType: '',
    organizationType: '',
  }

  const segmentTypeOptions = [
    { value: 'internal', label: 'Internal' },
    { value: 'external', label: 'External' },
  ]

  const organizationTypeOptions = [
    { value: 'supply-ontario', label: 'Supply Ontario' },
    { value: 'bps', label: 'Broader Public Sector (BPS)' },
    { value: 'ops', label: 'Ontario Public Service (OPS)' },
    { value: 'vendor', label: 'Vendor' },
    { value: 'audit', label: 'Audit' },
  ]
  const handleSubmit = useCallback(
    async (_values: typeof initialValues) => {
      try {
        setIsUpdating(true)
        // TODO: Replace with actual API call when available

        showSonnar({
          type: 'success',
          label: 'Role details updated',
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
    <div className="flex flex-col gap-8 pb-8">
      <SectionTitle
        title="Role details"
        lead
        apperance="h2-md"
        mainClassName="!max-w-none !px-0 !py-0"
        leadLabel=" Review and manage this role's information"
      />

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ errors, touched, setFieldValue }) => {
          const errorMessages = Object.entries(errors)
            .filter(([key]) => (touched as Record<string, unknown>)[key])
            .map(([, value]) => value)
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
                <div className="bg-so-color-neutral-100 rounded-2xl p-6">
                  <div className="text-so-color-neutral-950 mb-8 space-y-2">
                    <h3 className="heading-h3-base font-bold">Role</h3>
                    <p className="body-base text-so-color-neutral-700">
                      Role&apos;s primary information
                    </p>
                  </div>

                  <Field name="roleName">
                    {({ field }: { field: FieldInputProps<string> }) => (
                      <InputText
                        {...field}
                        trailingLabel="(required)"
                        label="Role name"
                        error={
                          touched.roleName && errors.roleName
                            ? (errors.roleName as string)
                            : undefined
                        }
                      />
                    )}
                  </Field>
                </div>

                {/* Segment Type Section */}
                <div className="bg-so-color-neutral-100 rounded-2xl p-6">
                  <Field name="segmentType">
                    {({ field }: { field: FieldInputProps<string> }) => (
                      <InputRadioGroup
                        label="Segment type"
                        labelSize="base"
                        trailingLabel="(required)"
                        name={field.name}
                        radioAppearance="regular"
                        options={segmentTypeOptions}
                        value={field.value}
                        onChange={val => setFieldValue('segmentType', val)}
                        hintExpander={true}
                        hintLabel="What is a segment type?"
                        hintContent="Segment type determines the access level and permissions for the role within the system."
                        error={
                          touched.segmentType && errors.segmentType
                            ? (errors.segmentType as string)
                            : undefined
                        }
                      />
                    )}
                  </Field>
                </div>

                {/* Organization Type Section */}
                <div className="bg-so-color-neutral-100 rounded-2xl p-6">
                  <Field name="organizationType">
                    {({ field }: { field: FieldInputProps<string> }) => (
                      <InputRadioGroup
                        label="Organization type"
                        labelSize="base"
                        trailingLabel="(required)"
                        name={field.name}
                        radioAppearance="regular"
                        options={organizationTypeOptions}
                        value={field.value}
                        onChange={val => setFieldValue('organizationType', val)}
                        hintExpander={true}
                        hintLabel="What is an organization type?"
                        hintContent="Organization type defines the category of organization this role belongs to and determines specific permissions and access rights."
                        error={
                          touched.organizationType && errors.organizationType
                            ? (errors.organizationType as string)
                            : undefined
                        }
                      />
                    )}
                  </Field>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <Button
                  type="submit"
                  label="Update details"
                  appearance="primary"
                  className="!px-6 text-center"
                  loading={isUpdating}
                />
              </div>
            </Form>
          )
        }}
      </Formik>
    </div>
  )
}

export default ManageRoleDetails
