'use client'
import {
  Alert,
  Button,
  InputRadioGroup,
  InputSelect,
  InputText,
  SubSectionTitle,
} from '@/components/ui'
import { USER_ROLES, USER_STATUS } from '@/constants'
import { useAuth, useData, useSonnar } from '@/context'
import { userService } from '@/services'
import { PropsOrganizationUserProfileTab } from '@/types/component'
import { ApiError } from '@/types/services'
import { Field, FieldInputProps, Form, Formik } from 'formik'
import { useCallback, useMemo, useState } from 'react'
import * as Yup from 'yup'

const OrganizationUserProfileTab = ({
  userData,
  onUpdate,
}: PropsOrganizationUserProfileTab) => {
  const { showSonnar } = useSonnar()
  const { roles } = useData()
  const { token, userId, userRole } = useAuth()
  const [isUpdating, setIsUpdaing] = useState(false)

  const initialFormData = useMemo(() => {
    if (userData) {
      return {
        firstName: userData?.firstName || '',
        lastName: userData?.lastName || '',
        email: userData?.email || '',
        role: userData?.userRoleId || '',
        isOrgContact: userData?.isOrgContact ? 'yes' : 'no',
        onlyContact: userData?.isOnlyAContact ? 'yes' : 'no',
      }
    }

    return {
      firstName: '',
      lastName: '',
      email: '',
      role: '',
      isOrgContact: 'no',
      onlyContact: 'no',
    }
  }, [userData])

  const formSchema = Yup.object().shape({
    firstName: Yup.string().required('Please enter a valid first name'),
    lastName: Yup.string().required('Please enter a valid last name'),
    email: Yup.string()
      .email('Please enter a valid email address')
      .required('Please enter a valid email address'),
    role: Yup.string().when('onlyContact', ([onlyContact], schema) => {
      return onlyContact === 'yes'
        ? schema.optional()
        : schema.required('Please select a role')
    }),
    isOrgContact: Yup.string().oneOf(['yes', 'no']).required(),
    onlyContact: Yup.string().when('isOrgContact', ([isOrgContact], schema) => {
      return isOrgContact === 'yes'
        ? schema.required('Please select if this user is only a contact')
        : schema.optional()
    }),
  })

  const handleSubmit = useCallback(
    async (values: typeof initialFormData) => {
      if (!userData?.userId || !token || !userId) {
        showSonnar({
          type: 'danger',
          label: 'Error',
          message: 'Unable to update organization. Missing required data.',
        })
        return
      }

      try {
        setIsUpdaing(true)
        const updateData = {
          organizationId: userData?.organizationId,
          firstName: values?.firstName,
          lastName: values?.lastName,
          userRoleId: values?.role,
          isOrgContact: values?.isOrgContact === 'yes' ? true : false,
          isOnlyAContact: values?.onlyContact === 'yes' ? true : false,
          email: values?.email,
          loginUserId: userId,
        }

        await userService.updateUser(userData.userId, updateData)

        showSonnar({
          type: 'success',
          label: 'Organization details updated',
          message: 'Changes have been saved successfully.',
        })
        onUpdate?.()
      } catch (error) {
        const APIError = error as ApiError
        showSonnar({
          type: 'danger',
          label: 'Error',
          message: APIError.message,
        })
      } finally {
        setIsUpdaing(false)
      }
    },
    [
      userData?.userId,
      userData?.organizationId,
      token,
      userId,
      showSonnar,
      onUpdate,
    ]
  )

  const filteredRoles = useMemo(() => {
    return roles.filter(
      role =>
        role.label === USER_ROLES.STANDARD_USER ||
        role.label === USER_ROLES.ORG_ADMIN
    )
  }, [roles])
  return (
    <div className="space-y-8">
      <div className="text-so-color-neutral-950">
        <h2 className="heading-h2-base font-bold">User profile</h2>
        <p className="font-open-sans text-so-color-neutral-600 text-xl font-normal">
          {userRole === USER_ROLES.ORG_ADMIN
            ? 'Review and manage this user’s information'
            : 'Edit a user’s information below'}
        </p>
      </div>
      <Formik
        initialValues={initialFormData}
        validationSchema={formSchema}
        onSubmit={handleSubmit}
        validateOnChange={false}
        validateOnBlur={true}
        enableReinitialize={true}
      >
        {({ errors, touched, handleBlur, values, setFieldValue }) => {
          const errorMessages = Object.values(errors).filter(
            (error): error is string => typeof error === 'string'
          )
          return (
            <Form className="max-w-[544px] space-y-8">
              {errorMessages.length > 0 && (
                <Alert
                  title="Missing required information"
                  description="Some required fields are incomplete or invalid. Review the details below to continue."
                  validationErrors={errorMessages}
                  variant="destructive"
                />
              )}
              <div className="bg-so-color-neutral-100 flex flex-col gap-8 rounded-2xl p-6">
                <SubSectionTitle
                  apperance="h3-md"
                  title="Organization contact"
                  lead
                  leadLabel="A primary point of contact for organization"
                />
                <InputRadioGroup
                  labelSize={'base'}
                  name="isOrgContact"
                  options={[
                    { label: 'Yes', value: 'yes' },
                    { label: 'No', value: 'no' },
                  ]}
                  value={values.isOrgContact}
                  onChange={(
                    e: React.ChangeEvent<HTMLInputElement> | string
                  ) => {
                    const newValue = typeof e === 'string' ? e : e.target?.value
                    setFieldValue('isOrgContact', newValue)
                    if (newValue !== 'yes') {
                      setFieldValue('onlyContact', '')
                    }
                  }}
                  hintExpander={values.isOrgContact !== 'yes'}
                  hintContent={
                    values.isOrgContact !== 'yes'
                      ? userRole === USER_ROLES.ORG_ADMIN
                        ? 'A person who serves as a point of contact for the organization.'
                        : 'An Organization contact is a designated point of communication for the organization. Contacts can also hold formal user roles, but if someone is marked only as a contact, they won’t have access to system features.'
                      : undefined
                  }
                  hintLabel={
                    values.isOrgContact !== 'yes'
                      ? 'What is an organization contact?'
                      : undefined
                  }
                  disabled={userData?.status === USER_STATUS?.INACTIVE}
                />
                {values.isOrgContact === 'yes' && (
                  <InputRadioGroup
                    labelSize={'base'}
                    label="Is this user only a contact?"
                    name="onlyContact"
                    radioAppearance="regular"
                    options={[
                      { label: 'Yes', value: 'yes' },
                      { label: 'No', value: 'no' },
                    ]}
                    value={values.onlyContact}
                    onChange={(
                      e: React.ChangeEvent<HTMLInputElement> | string
                    ) => {
                      const newValue =
                        typeof e === 'string' ? e : e.target?.value
                      setFieldValue('onlyContact', newValue)
                      if (newValue === 'yes') {
                        setFieldValue('role', '')
                      }
                    }}
                    hintExpander
                    hintContent="An Organization contact is a designated point of communication for the organization. Contacts can also hold formal user roles, but if someone is marked only as a contact, they won’t have access to system features."
                    hintLabel="What is an organization contact?"
                    error={
                      touched.onlyContact && errors.onlyContact
                        ? (errors.onlyContact as string)
                        : undefined
                    }
                    disabled={userData?.status === USER_STATUS?.INACTIVE}
                  />
                )}
              </div>
              {values.onlyContact !== 'yes' && (
                <div className="bg-so-color-neutral-100 space-y-8 rounded-2xl p-6">
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
                        label="Role"
                        trailingLabel="(required)"
                        items={filteredRoles}
                        value={field.value}
                        onChange={(val: string) =>
                          setFieldValue('role', val, true)
                        }
                        error={
                          touched.role && errors.role ? errors.role : undefined
                        }
                        disabled={userData?.status === USER_STATUS?.INACTIVE}
                      />
                    )}
                  </Field>
                </div>
              )}
              <div className="bg-so-color-neutral-100 space-y-8 rounded-2xl p-6">
                <SubSectionTitle
                  apperance="h3-md"
                  title="Profile"
                  lead
                  leadLabel="User’s primary information"
                />

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
                      disabled={userData?.status === USER_STATUS?.INACTIVE}
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
                      disabled={userData?.status === USER_STATUS?.INACTIVE}
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
                      hintText={
                        userRole === USER_ROLES.ORG_ADMIN &&
                        userData?.status !== USER_STATUS?.PENDINGAPPROVAL
                          ? undefined
                          : 'You cannot edit a users email address'
                      }
                      hintExpander={
                        userRole === USER_ROLES.ORG_ADMIN &&
                        userData?.status !== USER_STATUS?.PENDINGAPPROVAL
                          ? false
                          : true
                      }
                      hintExpanderLabel="What can't I edit this?"
                      error={
                        touched.email && errors.email ? errors.email : undefined
                      }
                      disabled={
                        userRole === USER_ROLES.ORG_ADMIN &&
                        userData?.status !== USER_STATUS?.PENDINGAPPROVAL
                          ? false
                          : true
                      }
                    />
                  )}
                </Field>
              </div>

              {userData?.status === USER_STATUS?.ACTIVE && (
                <Button
                  type="submit"
                  label="Update profile"
                  appearance="primary"
                  className="!px-6"
                  loading={isUpdating}
                  loadingText="Updating..."
                  disabled={isUpdating}
                />
              )}
            </Form>
          )
        }}
      </Formik>
    </div>
  )
}

export default OrganizationUserProfileTab
