'use client'
import {
  Alert,
  Button,
  InputSelect,
  InputText,
  StepIndicator,
  SubSectionTitle,
} from '@/components/ui'
import { USER_ROLES } from '@/constants'
import { useAuth, useSonnar } from '@/context'
import { userService } from '@/services'
import { InviteUserResponse, InviteUserToOrgProps } from '@/types/component'
import { ApiError } from '@/types/services'
import { Field, FieldInputProps, Form, Formik } from 'formik'
import { useMemo, useState } from 'react'
import * as Yup from 'yup'
import CancelnvitationModal from './CancelnvitationModal'

const InviteUserToOrg = ({
  roles,
  onCancel,
  onSuccess,
  orgId,
}: InviteUserToOrgProps) => {
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false)
  const { showSonnar } = useSonnar()
  const { token, userId, userRole } = useAuth()
  const [loading, setLoading] = useState(false)

  const initialFormData = {
    firstName: '',
    lastName: '',
    role: '',
    email: '',
  }

  const formSchema = Yup.object().shape({
    firstName: Yup.string().required('Please enter a valid first name'),
    lastName: Yup.string().required('Please enter a valid last name'),
    role: Yup.string().required('Please select a valid role'),
    email: Yup.string()
      .email('Please enter a valid email address')
      .required('Please enter a valid email address'),
  })

  const handleSubmit = async (values: typeof initialFormData) => {
    if (!token || !userId) {
      return
    }
    setLoading(true)
    try {
      const payload = {
        email: values.email,
        firstName: values.firstName,
        lastName: values.lastName,
        role: values.role,
        organizationId: orgId,
        loginUserId: userId,
        userRoleId: values?.role,
      }

      const response = await userService.inviteUser<InviteUserResponse>(payload)

      showSonnar({
        type: 'success',
        label: 'User invited',
        message: (
          <div>
            You&apos;ve successfully invited{' '}
            <b>{response.data?.item?.email}.</b>
            <br />
            <br /> The user will receive an email with instructions to get
            started. You can continue inviting additional users.
          </div>
        ),
      })

      if (onSuccess) {
        onSuccess()
      }
    } catch (error) {
      const APIError = error as ApiError
      showSonnar({
        type: 'danger',
        label: 'Failed to invite user',
        message: APIError.message,
      })
    } finally {
      setLoading(false)
    }
  }

  const handleCancelClick = () => {
    setIsCancelModalOpen(true)
  }

  const handleCancelInvitation = () => {
    setIsCancelModalOpen(false)
    if (onCancel) {
      onCancel()
    }
  }

  const handleContinueInviting = () => {
    setIsCancelModalOpen(false)
  }

  const filteredRoles = useMemo(() => {
    return roles.filter(
      role =>
        role.label === USER_ROLES.STANDARD_USER ||
        role.label === USER_ROLES.ORG_ADMIN
    )
  }, [roles])

  return (
    <div className="space-y-8">
      <StepIndicator step={'Step 1 of 1'} title={'User profile'} />
      <Formik
        initialValues={initialFormData}
        validationSchema={formSchema}
        onSubmit={handleSubmit}
        validateOnChange={false}
        validateOnBlur={true}
        validateOnMount={false}
      >
        {({ errors, touched, setFieldValue, setFieldTouched }) => {
          const errorMessages = Object.entries(errors)
            .filter(([fieldName]) => touched[fieldName as keyof typeof touched])
            .map(([_, error]) => error)
            .filter((error): error is string => typeof error === 'string')
          return (
            <Form className="space-y-8">
              {errorMessages.length > 0 && (
                <Alert
                  title="Missing required information"
                  description="Some required fields are incomplete or invalid. Review the details below to continue."
                  validationErrors={errorMessages}
                  variant="destructive"
                  validationErrorsClassName="decoration-so-color-red-700 underline"
                />
              )}
              {userRole === USER_ROLES.ORG_ADMIN && (
                <div className="bg-so-color-neutral-100 max-w-[544px] space-y-8 rounded-2xl p-6">
                  <SubSectionTitle
                    apperance="h3-md"
                    title="Role"
                    lead
                    leadLabel="User’s permissions role within organization"
                  />
                  <Field name="role">
                    {({ field }: { field: FieldInputProps<string> }) => {
                      const { onBlur, ...fieldWithoutBlur } = field
                      return (
                        <InputSelect
                          {...fieldWithoutBlur}
                          label="Role"
                          trailingLabel="(required)"
                          items={filteredRoles}
                          value={field.value}
                          onChange={(val: string) => {
                            setFieldValue('role', val, true)
                            setFieldTouched('role', true, false)
                          }}
                          onBlur={onBlur}
                          error={
                            touched.role && errors.role
                              ? errors.role
                              : undefined
                          }
                        />
                      )
                    }}
                  </Field>
                </div>
              )}
              <div className="bg-so-color-neutral-100 max-w-[544px] space-y-8 rounded-2xl p-6">
                <div>
                  <h2 className="font-raleway text-so-color-neutral-950 text-xl font-bold">
                    Profile
                  </h2>
                  <p className="font-open-sans text-so-color-neutral-600 text-base">
                    User&apos;s primary information
                  </p>
                </div>
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
                    />
                  )}
                </Field>
                {userRole !== USER_ROLES.ORG_ADMIN && (
                  <Field name="role">
                    {({ field }: { field: FieldInputProps<string> }) => {
                      const { onBlur, ...fieldWithoutBlur } = field
                      return (
                        <InputSelect
                          {...fieldWithoutBlur}
                          label="User role"
                          trailingLabel="(required)"
                          items={filteredRoles}
                          value={field.value}
                          onChange={(val: string) => {
                            setFieldValue('role', val, true)
                            setFieldTouched('role', true, false)
                          }}
                          onBlur={onBlur}
                          error={
                            touched.role && errors.role
                              ? errors.role
                              : undefined
                          }
                        />
                      )
                    }}
                  </Field>
                )}

                <Field name="email">
                  {({ field }: { field: FieldInputProps<string> }) => (
                    <InputText
                      {...field}
                      type="email"
                      label="Email address"
                      trailingLabel="(required)"
                      error={
                        touched.email && errors.email ? errors.email : undefined
                      }
                    />
                  )}
                </Field>
              </div>
              <div className="flex items-center gap-4">
                <Button
                  type="submit"
                  label="Invite user"
                  appearance="primary"
                  className="!px-6"
                  loading={loading}
                  loadingText="Inviting..."
                />
                <Button
                  type="button"
                  label="Cancel"
                  appearance="secondary"
                  className="px-6"
                  onClick={handleCancelClick}
                />
              </div>
            </Form>
          )
        }}
      </Formik>
      <CancelnvitationModal
        isOpen={isCancelModalOpen}
        onClose={handleContinueInviting}
        handleCancelInvitation={handleCancelInvitation}
        handleContinueInviting={handleContinueInviting}
      />
    </div>
  )
}

export default InviteUserToOrg
