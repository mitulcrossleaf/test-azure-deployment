'use client'
import {
  Alert,
  Button,
  InputRadioGroup,
  InputSelect,
  InputText,
} from '@/components/ui'
import { USER_ROLES, USER_STATUS } from '@/constants'
import { useAuth, useData, useSonnar } from '@/context'
import { cn } from '@/lib'
import { organizationService } from '@/services'
import {
  OrganizationProfileFormValues,
  OrganizationProfileTabProps,
} from '@/types/component'
import { ApiError } from '@/types/services'
import { Field, FieldInputProps, Form, Formik } from 'formik'
import { useCallback, useMemo } from 'react'
import 'react-loading-skeleton/dist/skeleton.css'
import * as Yup from 'yup'
import FormSkeleton from './FormSkeleton'

const OrganizationProfileTab = ({
  organizationData,
  loading = false,
  onUpdate,
}: OrganizationProfileTabProps) => {
  const { showSonnar } = useSonnar()
  const { token, userId, userRole } = useAuth()
  const { provinces, loadingProvinces } = useData()

  const isPendingApproval =
    organizationData?.status === USER_STATUS.PENDINGAPPROVAL
  const isOrgInActive = organizationData?.status === USER_STATUS.INACTIVE
  const initialValues: OrganizationProfileFormValues = useMemo(() => {
    if (organizationData) {
      return {
        orgType: organizationData.organizationType || 'Broader Public Sector',
        legalName: organizationData.legalName || '',
        displayName: organizationData.displayName || '',
        craBusinessNumber: organizationData.businessNumber || '',
        website: organizationData.websiteURL || '',
        address1: organizationData.addressLine1 || '',
        address2: organizationData.addressLine2 || '',
        city: organizationData.city || '',
        province: organizationData.provinceId || '',
        postalCode: organizationData.postalCode || '',
        language: organizationData.language || 'English',
        allowAllUsersManage: organizationData.isOrgManagement
          ? 'Enabled'
          : 'Disabled',
      }
    }

    return {
      orgType: 'Broader Public Sector',
      legalName: '',
      displayName: '',
      craBusinessNumber: '',
      website: '',
      address1: '',
      address2: '',
      city: '',
      province: '',
      postalCode: '',
      language: 'English',
      allowAllUsersManage: 'Disabled',
    }
  }, [organizationData])

  const validationSchema = Yup.object().shape({
    orgType: Yup.string().required('Organization type is required'),
    legalName: Yup.string().required('Legal name is required'),
    displayName: Yup.string(),
    craBusinessNumber: Yup.string().required('CRA Business number is required'),
    website: Yup.string().url('Please enter a valid URL'),
    address1: Yup.string().required('Address line 1 is required'),
    address2: Yup.string(),
    city: Yup.string().required('City is required'),
    province: Yup.string().required('Province is required'),
    postalCode: Yup.string().required('Postal code is required'),
    language: Yup.string().required('Language is required'),
    allowAllUsersManage: Yup.string().required(
      'Organization management setting is required'
    ),
  })

  const handleSubmit = useCallback(
    async (values: OrganizationProfileFormValues) => {
      if (!organizationData?.organizationId || !token) {
        showSonnar({
          type: 'danger',
          label: 'Error',
          message: 'Unable to update organization. Missing required data.',
        })
        return
      }

      try {
        const updateData = {
          legalName: values.legalName,
          displayName: values.displayName || '',
          description: organizationData.description || '',
          domain: organizationData.domain || '',
          websiteURL: values.website || '',
          phoneNumber: organizationData.phoneNumber || '',
          businessNumber: values.craBusinessNumber,
          organizationType: values.orgType,
          maxUsers: organizationData.maxUsers || 100,
          addressLine1: values.address1,
          addressLine2: values.address2 || '',
          city: values.city,
          provinceId: values.province || '',
          postalCode: values.postalCode,
          language: values.language,
          isOrgManagement: values.allowAllUsersManage === 'Enabled',
          aggrementExpiryDate: new Date().toISOString(),
          isConfirmationMemo: false,
          loginUserId: userId || '',
        }

        await organizationService.updateOrganization(
          organizationData.organizationId,
          updateData
        )

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
      }
    },
    [organizationData, token, showSonnar, userId, onUpdate]
  )

  if (loading) {
    return <FormSkeleton />
  }

  return (
    <div className="space-y-8">
      <div className="text-so-color-neutral-950 space-y-2">
        <h2 className="heading-h2-base font-bold">Organization details</h2>
        <p className="text-xl">
          {userRole === USER_ROLES.ORG_ADMIN
            ? 'Review and manage your organization’s information'
            : isPendingApproval
              ? 'Review this organization’s information'
              : 'Review and manage this organization’s information'}
        </p>
      </div>

      <Formik
        key={organizationData?.organizationId || 'new'}
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        validateOnChange={false}
        validateOnBlur={false}
        validateOnMount={false}
        enableReinitialize={true}
      >
        {({
          errors,
          touched,
          setFieldValue,
          setFieldTouched,
          isSubmitting,
        }) => {
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
                />
              )}

              <div className="flex w-full max-w-[544px] flex-col gap-8">
                {userRole === USER_ROLES.ORG_ADMIN || isPendingApproval ? (
                  <div className="bg-so-color-neutral-100 w-full max-w-[544px] rounded-2xl p-6">
                    {' '}
                    <Field name="orgType">
                      {({ field }: { field: FieldInputProps<string> }) => (
                        <InputText
                          {...field}
                          trailingLabel="(required)"
                          label="Organization type"
                          disabled={
                            userRole === USER_ROLES.ORG_ADMIN ||
                            isPendingApproval
                          }
                          name={field.name}
                          value={field.value}
                          error={
                            touched.orgType && errors.orgType
                              ? (errors.orgType as string)
                              : undefined
                          }
                          hintExpander={
                            userRole === USER_ROLES.ORG_ADMIN && !isOrgInActive
                          }
                          hintExpanderLabel="Why can't I edit this?"
                        />
                      )}
                    </Field>
                  </div>
                ) : (
                  <Field name="orgType">
                    {({ field }: { field: FieldInputProps<string> }) => (
                      <InputRadioGroup
                        label={'Select organization type'}
                        trailingLabel="(required)"
                        className="bg-so-color-neutral-100 w-full max-w-[544px] rounded-2xl p-6"
                        radioAppearance="regular"
                        labelSize="base"
                        hintLabel="Not sure which to choose?"
                        name={field.name}
                        value={field.value}
                        onChange={val => setFieldValue('orgType', val)}
                        onBlur={() => setFieldTouched('orgType', true)}
                        disabled={isPendingApproval}
                        error={
                          touched.orgType && errors.orgType
                            ? (errors.orgType as string)
                            : undefined
                        }
                        options={[
                          {
                            label: 'Broader Public Sector',
                            value: 'Broader Public Sector',
                          },
                          {
                            label: 'Ontario Public Service',
                            value: 'Ontario Public Service',
                          },
                          {
                            label: 'Supply Ontario',
                            value: 'Supply Ontario',
                          },
                          {
                            label: 'Vendor',
                            value: 'Vendor',
                          },
                        ]}
                      />
                    )}
                  </Field>
                )}

                <div className="bg-so-color-neutral-100 flex flex-col gap-8 rounded-2xl p-6">
                  <div className="text-so-color-neutral-950 space-y-2">
                    <h2 className="heading-h2-base font-bold">Profile</h2>
                    <p className="body-base">
                      Organization&apos;s primary information
                    </p>
                  </div>

                  <Field name="legalName">
                    {({ field }: { field: FieldInputProps<string> }) => (
                      <InputText
                        {...field}
                        trailingLabel="(required)"
                        label="Legal Name"
                        disabled={
                          isPendingApproval ||
                          (userRole === USER_ROLES.ORG_ADMIN && isOrgInActive)
                        }
                        error={
                          touched.legalName && errors.legalName
                            ? (errors.legalName as string)
                            : undefined
                        }
                      />
                    )}
                  </Field>

                  <Field name="displayName">
                    {({ field }: { field: FieldInputProps<string> }) => (
                      <InputText
                        {...field}
                        trailingLabel="(optional)"
                        label="Display Name"
                        hintExpander={
                          isPendingApproval ||
                          (userRole === USER_ROLES.ORG_ADMIN && !isOrgInActive)
                        }
                        hintExpanderLabel={
                          !isPendingApproval ? 'What is a display name?' : ''
                        }
                        hintExpanderContent="A display name is how your organization will appear to users. It can be different from your legal name."
                        disabled={
                          isPendingApproval ||
                          (userRole === USER_ROLES.ORG_ADMIN && isOrgInActive)
                        }
                        error={
                          touched.displayName && errors.displayName
                            ? (errors.displayName as string)
                            : undefined
                        }
                      />
                    )}
                  </Field>

                  <Field name="craBusinessNumber">
                    {({ field }: { field: FieldInputProps<string> }) => (
                      <InputText
                        {...field}
                        trailingLabel="(required)"
                        label="CRA Business number"
                        disabled={
                          userRole === USER_ROLES.ORG_ADMIN || isPendingApproval
                        }
                        error={
                          touched.craBusinessNumber && errors.craBusinessNumber
                            ? (errors.craBusinessNumber as string)
                            : undefined
                        }
                        hintExpander={
                          userRole === USER_ROLES.ORG_ADMIN && !isOrgInActive
                        }
                        hintExpanderLabel="Why can't I edit this?"
                      />
                    )}
                  </Field>

                  <Field name="website">
                    {({ field }: { field: FieldInputProps<string> }) => (
                      <InputText
                        {...field}
                        trailingLabel="(optional)"
                        label="Website"
                        disabled={
                          isPendingApproval ||
                          (userRole === USER_ROLES.ORG_ADMIN && isOrgInActive)
                        }
                        error={
                          touched.website && errors.website
                            ? (errors.website as string)
                            : undefined
                        }
                      />
                    )}
                  </Field>
                </div>

                <div className="bg-so-color-neutral-100 flex flex-col gap-8 rounded-2xl p-6">
                  <div className="text-so-color-neutral-950 space-y-2">
                    <h2 className="heading-h2-base font-bold">Address</h2>
                    <p className="body-base">
                      Organization&apos;s primary contact address
                    </p>
                  </div>

                  <Field name="address1">
                    {({ field }: { field: FieldInputProps<string> }) => (
                      <InputText
                        {...field}
                        trailingLabel="(required)"
                        label="Address line 1"
                        disabled={
                          isPendingApproval ||
                          (userRole === USER_ROLES.ORG_ADMIN && isOrgInActive)
                        }
                        error={
                          touched.address1 && errors.address1
                            ? (errors.address1 as string)
                            : undefined
                        }
                      />
                    )}
                  </Field>

                  <Field name="address2">
                    {({ field }: { field: FieldInputProps<string> }) => (
                      <InputText
                        {...field}
                        trailingLabel="(optional)"
                        label="Address line 2"
                        disabled={
                          isPendingApproval ||
                          (userRole === USER_ROLES.ORG_ADMIN && isOrgInActive)
                        }
                        error={
                          touched.address2 && errors.address2
                            ? (errors.address2 as string)
                            : undefined
                        }
                      />
                    )}
                  </Field>

                  <Field name="city">
                    {({ field }: { field: FieldInputProps<string> }) => (
                      <InputText
                        {...field}
                        trailingLabel="(required)"
                        label="City or town"
                        disabled={
                          isPendingApproval ||
                          (userRole === USER_ROLES.ORG_ADMIN && isOrgInActive)
                        }
                        error={
                          touched.city && errors.city
                            ? (errors.city as string)
                            : undefined
                        }
                      />
                    )}
                  </Field>

                  <Field name="province">
                    {({ field }: { field: FieldInputProps<string> }) => (
                      <InputSelect
                        label="Province"
                        required
                        value={field.value}
                        onChange={(val: string) => {
                          setFieldValue('province', val, false)
                          setFieldTouched('province', true, false)
                        }}
                        onBlur={() => setFieldTouched('province', true)}
                        items={provinces}
                        disabled={
                          loadingProvinces ||
                          isPendingApproval ||
                          (userRole === USER_ROLES.ORG_ADMIN && isOrgInActive)
                        }
                        placeholder={
                          loadingProvinces ? 'Loading provinces...' : ''
                        }
                        error={
                          touched.province && errors.province
                            ? (errors.province as string)
                            : undefined
                        }
                      />
                    )}
                  </Field>

                  <Field name="postalCode">
                    {({ field }: { field: FieldInputProps<string> }) => (
                      <InputText
                        {...field}
                        trailingLabel="(required)"
                        label="Postal code"
                        inputParentClassName={cn(
                          isPendingApproval ||
                            (userRole === USER_ROLES.ORG_ADMIN && isOrgInActive)
                            ? 'max-w-full'
                            : 'max-w-[120px] ',
                          'w-full'
                        )}
                        disabled={
                          isPendingApproval ||
                          (userRole === USER_ROLES.ORG_ADMIN && isOrgInActive)
                        }
                        error={
                          touched.postalCode && errors.postalCode
                            ? (errors.postalCode as string)
                            : undefined
                        }
                      />
                    )}
                  </Field>
                </div>

                {!isPendingApproval &&
                  (userRole !== USER_ROLES.ORG_ADMIN || !isOrgInActive) && (
                    <div className="flex flex-col gap-8">
                      {' '}
                      <Field name="language">
                        {({ field }: { field: FieldInputProps<string> }) => (
                          <InputRadioGroup
                            label="Language"
                            hintText="This will be the default language for the organization"
                            options={[
                              { label: 'English', value: 'English' },
                              { label: 'French', value: 'French' },
                            ]}
                            radioAppearance="regular"
                            labelSize="base"
                            trailingLabel="(required)"
                            className="bg-so-color-neutral-100 w-full max-w-[544px] rounded-2xl p-6"
                            name={field.name}
                            value={field.value || ''}
                            onChange={val => setFieldValue('language', val)}
                            onBlur={() => setFieldTouched('language', true)}
                            error={
                              touched.language && errors.language
                                ? (errors.language as string)
                                : undefined
                            }
                          />
                        )}
                      </Field>
                      {userRole !== USER_ROLES.ORG_ADMIN && (
                        <Field name="allowAllUsersManage">
                          {({ field }: { field: FieldInputProps<string> }) => (
                            <InputRadioGroup
                              label="Organization management"
                              hintText="Allow all users within the organization to manage it"
                              options={[
                                { label: 'Enabled', value: 'Enabled' },
                                { label: 'Disabled', value: 'Disabled' },
                              ]}
                              radioAppearance="regular"
                              labelSize="base"
                              trailingLabel="(required)"
                              className="bg-so-color-neutral-100 w-full max-w-[544px] rounded-2xl p-6"
                              name={field.name}
                              value={field.value || ''}
                              onChange={val =>
                                setFieldValue('allowAllUsersManage', val)
                              }
                              onBlur={() =>
                                setFieldTouched('allowAllUsersManage', true)
                              }
                              error={
                                touched.allowAllUsersManage &&
                                errors.allowAllUsersManage
                                  ? (errors.allowAllUsersManage as string)
                                  : undefined
                              }
                            />
                          )}
                        </Field>
                      )}
                    </div>
                  )}
              </div>

              {!isPendingApproval &&
                (userRole !== USER_ROLES.ORG_ADMIN || !isOrgInActive) && (
                  <Button
                    type="submit"
                    label={isSubmitting ? 'Updating...' : 'Update Profile'}
                    appearance="primary"
                    className="px-6 font-bold text-nowrap"
                    disabled={isSubmitting}
                  />
                )}
            </Form>
          )
        }}
      </Formik>
    </div>
  )
}

export default OrganizationProfileTab
