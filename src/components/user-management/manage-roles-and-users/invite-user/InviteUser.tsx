'use client'
import {
  Button,
  ConfirmationModal,
  PageTitle,
  Separator,
  StepIndicator,
} from '@/components/ui'
import { useSonnar } from '@/context'
import {
  STORAGE_KEYS,
  getLocalStorageItem,
  removeLocalStorageItem,
  setLocalStorageItem,
} from '@/helper'
import { Form, Formik, FormikProps } from 'formik'
import { useRouter, useSearchParams } from 'next/navigation'
import { useCallback, useEffect, useMemo, useState } from 'react'
import * as Yup from 'yup'
import UserInviteAccess from './UserInviteAccess'
import UserInviteProfile from './UserInviteProfile'

interface InviteUserFormValues {
  // Step 1 - User Profile
  role: string
  firstName: string
  lastName: string
  email: string
  jobTitle: string
  department: string

  // Step 2 - User Access
  accessScope: string[]
  accountManagement: string[]
  applicationManagement: string[]
}

// Component to handle form data persistence
interface FormPersistenceType {
  values: InviteUserFormValues
  saveFormData: (values: InviteUserFormValues) => void
}

const FormPersistence = ({ values, saveFormData }: FormPersistenceType) => {
  useEffect(() => {
    // Debounce the save operation to avoid excessive localStorage writes
    const timeoutId = setTimeout(() => {
      saveFormData(values)
    }, 500)

    return () => clearTimeout(timeoutId)
  }, [values, saveFormData])

  return null
}

const step1ValidationSchema = Yup.object({
  role: Yup.string().required('Please select a role'),
  firstName: Yup.string()
    .trim()
    .required('Please enter a valid first name')
    .test('not-only-spaces', 'Please enter a valid first name', value => {
      return value ? value.trim().length > 0 : false
    }),
  lastName: Yup.string()
    .trim()
    .required('Please enter a valid last name')
    .test('not-only-spaces', 'Please enter a valid last name', value => {
      return value ? value.trim().length > 0 : false
    }),
  email: Yup.string()
    .trim()
    .email('Please enter a valid email address')
    .required('Please enter a valid email address')
    .test('not-only-spaces', 'Please enter a valid email address', value => {
      return value ? value.trim().length > 0 : false
    }),
  jobTitle: Yup.string()
    .trim()
    .required('Please enter a valid job title')
    .test('not-only-spaces', 'Please enter a valid job title', value => {
      return value ? value.trim().length > 0 : false
    }),
  department: Yup.string()
    .trim()
    .required('Please enter a valid department')
    .test('not-only-spaces', 'Please enter a valid department', value => {
      return value ? value.trim().length > 0 : false
    }),
})

const step2ValidationSchema = Yup.object({
  accessScope: Yup.array().min(1, 'Please select at least one access scope'),
  accountManagement: Yup.array().min(
    1,
    'Please select at least one account management option'
  ),
  applicationManagement: Yup.array().min(
    1,
    'Please select at least one application management option'
  ),
})

const formSchema = step1ValidationSchema.concat(step2ValidationSchema)

const InviteUser = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { showSonnar } = useSonnar()

  const initialStep = useMemo(() => {
    const stepParam = searchParams.get('step')?.toLowerCase()
    switch (stepParam) {
      case 'user-access':
        return 2
      case 'review':
        return 3
      default:
        return 1
    }
  }, [searchParams])

  const [step, setStep] = useState<number>(initialStep)
  const [isChangeMode, setIsChangeMode] = useState<boolean>(false)
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [savedFormData, setSavedFormData] =
    useState<InviteUserFormValues | null>(null)

  const stepLabel = useMemo(() => {
    if (step === 3) return 'Review'
    return `Step ${step} of 2`
  }, [step])

  const stepTitle = useMemo(() => {
    switch (step) {
      case 1:
        return 'User profile'
      case 2:
        return 'User access'
      case 3:
        return 'Review and invite user'
      default:
        return 'User profile'
    }
  }, [step])

  const initialFormData: InviteUserFormValues = {
    role: '',
    firstName: '',
    lastName: '',
    email: '',
    jobTitle: '',
    department: '',
    accessScope: [],
    accountManagement: [],
    applicationManagement: [],
  }

  // Function to save form data to localStorage
  const saveFormDataToStorage = useCallback((values: InviteUserFormValues) => {
    setLocalStorageItem(STORAGE_KEYS.INVITE_USER_FORM, values)
  }, [])

  // Function to clear form data from localStorage
  const clearFormDataFromStorage = useCallback(() => {
    removeLocalStorageItem(STORAGE_KEYS.INVITE_USER_FORM)
    setSavedFormData(null)
  }, [])

  const roleOptions = useMemo(
    () => [
      { value: 'standard-user', label: 'Standard User' },
      { value: 'admin', label: 'Administrator' },
      { value: 'manager', label: 'Manager' },
    ],
    []
  )

  const accessScopeOptions = useMemo(
    () => [
      {
        value: 'ontario-public-service',
        label: 'Ontario Public Service Organizations',
      },
      {
        value: 'broader-public-sector',
        label: 'Broader Public Sector Organizations',
      },
      { value: 'vendor-organizations', label: 'Vendor Organizations' },
    ],
    []
  )

  const accountManagementOptions = useMemo(
    () => [
      { value: 'organization-management', label: 'Organization Management' },
      {
        value: 'organization-user-management',
        label: 'Organization User Management',
      },
    ],
    []
  )

  const applicationManagementOptions = useMemo(
    () => [
      { value: 'vendor-or-record', label: 'Vendor or Record' },
      {
        value: 'vendor-or-record-reporting',
        label: 'Vendor or Record Reporting',
      },
      { value: 'product-comparison', label: 'Product Comparison' },
      {
        value: 'digital-procurement-system',
        label: 'Digital Procurement System',
      },
    ],
    []
  )

  const handleSubmit = async (values: InviteUserFormValues) => {
    if (step === 3) {
      // Final submission - invite user
      setIsSubmitting(true)
      try {
        // TODO: Implement actual user invitation API call
        // await userService.inviteUser(values)

        showSonnar({
          type: 'success',
          label: 'User invited',
          message: (
            <>
              You&apos;ve invited{' '}
              <b>
                {values.firstName} {values.lastName}
              </b>{' '}
              to the system.
              <br />
              <br />
              They will receive an email with instructions to set up their
              account.
            </>
          ),
        })

        // Clear form data from localStorage on successful submission
        clearFormDataFromStorage()
        router.push('/manage-roles-and-users')
      } catch {
        showSonnar({
          type: 'danger',
          label: 'Failed to invite user',
          message: 'There was an error inviting the user. Please try again.',
        })
      } finally {
        setIsSubmitting(false)
      }
    }
  }

  const getStepFields = useCallback((step: number): string[] => {
    switch (step) {
      case 1:
        return [
          'role',
          'firstName',
          'lastName',
          'email',
          'jobTitle',
          'department',
        ]
      case 2:
        return ['accessScope', 'accountManagement', 'applicationManagement']
      default:
        return []
    }
  }, [])

  const validateCurrentStep = useCallback(
    async (formik: FormikProps<InviteUserFormValues>, currentStep: number) => {
      try {
        // Only validate fields relevant to current step
        const fieldsToValidate = getStepFields(currentStep)
        const stepValues = Object.keys(formik.values)
          .filter(key => fieldsToValidate.includes(key))
          .reduce(
            (obj, key) => {
              const typedKey = key as keyof InviteUserFormValues
              obj[typedKey] = formik.values[typedKey]
              return obj
            },
            {} as Record<string, unknown>
          )

        // Validate using the appropriate schema
        switch (currentStep) {
          case 1:
            await step1ValidationSchema.validate(stepValues, {
              abortEarly: false,
            })
            break
          case 2:
            await step2ValidationSchema.validate(stepValues, {
              abortEarly: false,
            })
            break
          default:
            return true
        }

        // Clear errors for current step fields if validation passes
        const clearedErrors = { ...formik.errors }
        fieldsToValidate.forEach(field => {
          delete clearedErrors[field as keyof InviteUserFormValues]
        })
        formik.setErrors(clearedErrors)

        return true
      } catch (error: unknown) {
        const validationErrors: Record<string, string | string[]> = {
          ...formik.errors,
        }
        if (error && typeof error === 'object' && 'inner' in error) {
          const yupError = error as {
            inner: Array<{ path?: string; message: string }>
          }
          yupError.inner.forEach(err => {
            if (err.path) {
              validationErrors[err.path] = err.message
            }
          })
        }
        formik.setErrors(validationErrors)

        // Mark fields as touched to show errors
        const fieldsToTouch = getStepFields(currentStep)
        const touchedFields = { ...formik.touched }
        fieldsToTouch.forEach(field => {
          touchedFields[field as keyof InviteUserFormValues] = true
        })
        formik.setTouched(touchedFields)

        return false
      }
    },
    [getStepFields]
  )

  const handleSteps = useCallback(
    async (
      nextStep: number,
      editMode: boolean = false,
      formik?: FormikProps<InviteUserFormValues>
    ) => {
      // Validate current step before proceeding (except when going back or in edit mode)
      if (formik && nextStep > step && !editMode) {
        const isValid = await validateCurrentStep(formik, step)
        if (!isValid) {
          return false
        }
      }

      setStep(nextStep)
      setIsChangeMode(editMode)
      const stepNames = ['', 'user-profile', 'user-access', 'review']
      const params = new URLSearchParams(window.location.search)
      params.set('step', stepNames[nextStep] || 'user-profile')
      router.replace(`?${params.toString()}`, { scroll: false })
      return true
    },
    [router, step, validateCurrentStep]
  )

  const onCancel = useCallback(() => setIsModalOpen(true), [])

  const handleModalClose = () => {
    setIsModalOpen(false)
  }

  const handleContinueInviting = () => {
    setIsModalOpen(false)
  }

  const handleCancelInviting = () => {
    setIsModalOpen(false)
    clearFormDataFromStorage()
    router.push('/manage-roles-and-users')
  }

  const renderReviewStep = useCallback(
    (formik: FormikProps<InviteUserFormValues>) => (
      <div className="flex flex-col gap-8">
        <div className="flex items-center justify-between">
          <h2 className="heading-h2-base text-so-color-neutral-950 font-bold">
            User profile
          </h2>
          <Button
            appearance="ghost"
            label="Change"
            className="underline"
            onClick={() => handleSteps(1, true)}
          />
        </div>
        <Separator appearance="thick" className="!p-0" />
        <div className="space-y-6">
          <div className="space-y-1">
            <p className="heading-h3-base text-so-color-neutral-950 font-bold">
              Role
            </p>
            <p className="body-base text-so-color-neutral-600">
              {roleOptions.find(option => option.value === formik.values.role)
                ?.label || '-'}
            </p>
          </div>
          <div className="space-y-1">
            <p className="heading-h3-base text-so-color-neutral-950 font-bold">
              Name
            </p>
            <p className="body-base text-so-color-neutral-600">
              {formik.values.firstName && formik.values.lastName
                ? `${formik.values.firstName} ${formik.values.lastName}`
                : '-'}
            </p>
          </div>
          <div className="space-y-1">
            <p className="heading-h3-base text-so-color-neutral-950 font-bold">
              Email
            </p>
            <p className="body-base text-so-color-neutral-600">
              {formik.values.email || '-'}
            </p>
          </div>
          <div className="space-y-1">
            <p className="heading-h3-base text-so-color-neutral-950 font-bold">
              Job title
            </p>
            <p className="body-base text-so-color-neutral-600">
              {formik.values.jobTitle || '-'}
            </p>
          </div>
          <div className="space-y-1">
            <p className="heading-h3-base text-so-color-neutral-950 font-bold">
              Department
            </p>
            <p className="body-base text-so-color-neutral-600">
              {formik.values.department || '-'}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <h2 className="heading-h2-base text-so-color-neutral-950 font-bold">
            User access
          </h2>
          <Button
            appearance="ghost"
            label="Change"
            className="underline"
            onClick={() => handleSteps(2, true)}
          />
        </div>
        <Separator appearance="thick" className="!p-0" />
        <div className="space-y-6">
          <div className="space-y-1">
            <p className="heading-h3-base text-so-color-neutral-950 font-bold">
              Access scope
            </p>
            <p className="body-base text-so-color-neutral-600">
              {formik.values.accessScope.length > 0
                ? formik.values.accessScope
                    .map(
                      (scope: string) =>
                        accessScopeOptions.find(
                          option => option.value === scope
                        )?.label
                    )
                    .join(', ')
                : '-'}
            </p>
          </div>
          <div className="space-y-1">
            <p className="heading-h3-base text-so-color-neutral-950 font-bold">
              Account management
            </p>
            <p className="body-base text-so-color-neutral-600">
              {formik.values.accountManagement.length > 0
                ? formik.values.accountManagement
                    .map(
                      (mgmt: string) =>
                        accountManagementOptions.find(
                          option => option.value === mgmt
                        )?.label
                    )
                    .join(', ')
                : '-'}
            </p>
          </div>
          <div className="space-y-1">
            <p className="heading-h3-base text-so-color-neutral-950 font-bold">
              Application management
            </p>
            <p className="body-base text-so-color-neutral-600">
              {formik.values.applicationManagement.length > 0
                ? formik.values.applicationManagement
                    .map(
                      (app: string) =>
                        applicationManagementOptions.find(
                          option => option.value === app
                        )?.label
                    )
                    .join(', ')
                : '-'}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <Button
            type="button"
            label="Cancel"
            appearance="secondary"
            semantic="general"
            className="px-6"
            onClick={onCancel}
          />
          <Button
            type="submit"
            label="Invite user"
            appearance="primary"
            className="!px-6 text-center"
            disabled={isSubmitting}
            loading={isSubmitting}
            loadingText="Inviting..."
          />
        </div>
      </div>
    ),
    [
      handleSteps,
      onCancel,
      isSubmitting,
      roleOptions,
      accessScopeOptions,
      accountManagementOptions,
      applicationManagementOptions,
    ]
  )

  const renderSteps = useCallback(
    (formik: FormikProps<InviteUserFormValues>) => {
      switch (step) {
        case 1:
          return (
            <UserInviteProfile
              roleOptions={roleOptions}
              errors={formik.errors}
              touched={formik.touched}
              setFieldValue={formik.setFieldValue}
              handleSteps={(nextStep: number, editMode?: boolean) =>
                handleSteps(nextStep, editMode, formik)
              }
              onCancel={onCancel}
              isChangeMode={isChangeMode}
            />
          )
        case 2:
          return (
            <UserInviteAccess
              accessScopeOptions={accessScopeOptions}
              accountManagementOptions={accountManagementOptions}
              applicationManagementOptions={applicationManagementOptions}
              errors={formik.errors}
              touched={formik.touched}
              setFieldValue={formik.setFieldValue}
              handleSteps={(nextStep: number, editMode?: boolean) =>
                handleSteps(nextStep, editMode, formik)
              }
              onCancel={onCancel}
              isChangeMode={isChangeMode}
            />
          )
        case 3:
          return renderReviewStep(formik)
        default:
          return (
            <UserInviteProfile
              roleOptions={roleOptions}
              errors={formik.errors}
              touched={formik.touched}
              setFieldValue={formik.setFieldValue}
              handleSteps={(nextStep: number, editMode?: boolean) =>
                handleSteps(nextStep, editMode, formik)
              }
              onCancel={onCancel}
              isChangeMode={isChangeMode}
            />
          )
      }
    },
    [
      step,
      handleSteps,
      onCancel,
      isChangeMode,
      renderReviewStep,
      roleOptions,
      accessScopeOptions,
      accountManagementOptions,
      applicationManagementOptions,
    ]
  )

  const renderStepIndicatorBackButton = useCallback(() => {
    if (step === 1 && !isChangeMode) return undefined
    return (
      <div className="flex flex-col justify-start gap-8">
        <Button
          iconLeading
          label="Back"
          icon={
            <i className="material-symbols-outlined !text-2xl">arrow_back</i>
          }
          className="w-fit"
          onClick={() => {
            if (isChangeMode) {
              handleSteps(3, false) // Go back to review step
            } else {
              handleSteps(step - 1, false)
            }
          }}
        />
        {isChangeMode && (
          <PageTitle
            variant={'standard'}
            title={stepTitle}
            className="!max-w-none !p-0"
          />
        )}
      </div>
    )
  }, [step, handleSteps, isChangeMode, stepTitle])

  // Load saved form data from localStorage on component mount
  useEffect(() => {
    const savedData = getLocalStorageItem<InviteUserFormValues>(
      STORAGE_KEYS.INVITE_USER_FORM
    )
    if (savedData) {
      setSavedFormData(savedData)
    }
  }, [])

  // Clear localStorage when component unmounts (user navigates away)
  useEffect(() => {
    return () => {
      clearFormDataFromStorage()
    }
  }, [clearFormDataFromStorage])

  return (
    <>
      {!isChangeMode && (
        <PageTitle
          variant={'standard'}
          title={'Invite user'}
          lead={
            step === 3
              ? 'Review and invite a new system user'
              : 'Invite a new system user'
          }
          breadcrumbs={true}
          crumbs={[
            {
              crumb: 'Dashboard',
              href: '/',
              collapsed: false,
              active: false,
            },
            {
              crumb: 'Manage roles and users',
              href: '/manage-roles-and-users',
              collapsed: false,
              active: true,
            },
          ]}
        />
      )}
      <div className="container py-8">
        <Formik
          initialValues={savedFormData || initialFormData}
          validationSchema={formSchema}
          onSubmit={handleSubmit}
          enableReinitialize={true}
        >
          {formik => (
            <Form className="space-y-8">
              <FormPersistence
                values={formik.values}
                saveFormData={saveFormDataToStorage}
              />
              {step !== 3 && !isChangeMode && (
                <StepIndicator
                  step={stepLabel}
                  title={stepTitle}
                  backButton={renderStepIndicatorBackButton()}
                />
              )}
              {isChangeMode && (
                <div className="flex items-center gap-4">
                  {renderStepIndicatorBackButton()}
                </div>
              )}
              {renderSteps(formik)}
            </Form>
          )}
        </Formik>
      </div>

      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        title="Cancel inviting user"
        description="If you cancel now, any unsaved information will be lost and the user won't be invited."
        confirmButton={{
          label: 'Continue inviting user',
          onClick: handleContinueInviting,
          appearance: 'primary',
        }}
        cancelButton={{
          label: 'Cancel inviting user',
          onClick: handleCancelInviting,
        }}
        headerClassName="gap-8"
        isclose={false}
      />
    </>
  )
}

export default InviteUser
