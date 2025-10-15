'use client'
import {
  Alert,
  Button,
  ConfirmationModal,
  InputRadioGroup,
  InputText,
  PageTitle,
  StepIndicator,
} from '@/components/ui'
import { CreateUserRoleFormValues } from '@/types/component'
import { Field, FieldInputProps, Form, Formik } from 'formik'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import * as Yup from 'yup'

const validationSchema = Yup.object({
  roleName: Yup.string().required('Please enter a valid role name'),
  segmentType: Yup.string().required('Please select a valid segment type'),
  organizationType: Yup.string().required(
    'Please select a valid organization type'
  ),
})

const CreateUserRole = () => {
  const router = useRouter()
  const [isModalOpen, setIsModalOpen] = useState(false)

  const initialValues: CreateUserRoleFormValues = {
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

  const handleSubmit = (_values: CreateUserRoleFormValues) => {
    // Handle form submission logic here
  }

  return (
    <div className="flex flex-col gap-8">
      {' '}
      <PageTitle
        title="Create a user role"
        lead="Create a new access role within the system"
        breadcrumbs={true}
        variant="standard"
        crumbs={[
          { crumb: 'Dashboard', href: '/', active: false, collapsed: false },
          {
            crumb: 'Manage roles and users',
            href: '/manage-roles-and-user',
            active: true,
            collapsed: false,
          },
        ]}
      />
      <div className="container flex flex-col">
        {' '}
        <StepIndicator title="User role" step="Step 1 of 1" />
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
              <Form className="flex flex-col gap-8 py-8">
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
                      <h2 className="heading-h3-base font-bold">Role</h2>
                      <p className="body-base">
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
                          label=" Segment type"
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
                          onChange={val =>
                            setFieldValue('organizationType', val)
                          }
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
                    label="Invite user"
                    appearance="primary"
                    className="!px-6 text-center"
                  />
                  <Button
                    type="button"
                    label="Cancel"
                    appearance="secondary"
                    semantic="general"
                    className="px-6"
                    onClick={() => setIsModalOpen(true)}
                  />
                </div>
              </Form>
            )
          }}
        </Formik>
      </div>
      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Cancel creating role"
        description="If you cancel now, any unsaved information will be lost and the user role won't be invited."
        confirmButton={{
          label: 'Continue creating role',
          onClick: () => setIsModalOpen(false),
          appearance: 'primary',
        }}
        cancelButton={{
          label: 'Cancel creating role',
          onClick: () => {
            setIsModalOpen(false)
            router.push('/manage-roles-and-users')
          },
        }}
        headerClassName="gap-8"
        isclose={false}
      />
    </div>
  )
}

export default CreateUserRole
