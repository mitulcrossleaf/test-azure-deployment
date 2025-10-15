'use client'
import { Button, PageTitle, Separator, StepIndicator } from '@/components/ui'
import { useAuth, useSonnar } from '@/context'
import {
  STORAGE_KEYS,
  getLocalStorageItem,
  removeLocalStorageItem,
  setLocalStorageItem,
} from '@/helper'
import { organizationService } from '@/services'
import {
  FormPersistenceType,
  OrganizationFormDataType,
} from '@/types/component'
import { ApiError } from '@/types/services'
import { Form, Formik, FormikProps } from 'formik'
import { useRouter, useSearchParams } from 'next/navigation'
import { useCallback, useEffect, useMemo, useState } from 'react'
import * as Yup from 'yup'
import OrganizationDetailsStep from './OrganizationDetailsStep'
import OrganizationPreferencesStep from './OrganizationPreferencesStep'
import OrganizationTypeStep from './OrganizationTypeStep'

// Component to handle form data persistence
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

const step1Schema = Yup.object().shape({
  orgType: Yup.string().required('Please select an organization type'),
  confirmationMemo: Yup.string()
    .oneOf(['Yes', 'No'], 'Please select an option')
    .required('Please select an option'),
})

const step2Schema = Yup.object().shape({
  agreementExpiry: Yup.string()
    .trim()
    .required('Please enter an agreement expiry date'),
  legalName: Yup.string()
    .trim()
    .required('Please enter a legal name')
    .test('not-only-spaces', 'Please enter a legal name', value => {
      return value ? value.trim().length > 0 : false
    }),
  displayName: Yup.string()
    .trim()
    .test('not-only-spaces', 'Display name cannot be only spaces', value => {
      return !value || value.trim().length > 0
    })
    .optional(),
  craBusinessNumber: Yup.string()
    .trim()
    .required('Please enter CRA business number')
    .test('not-only-spaces', 'Please enter CRA business number', value => {
      return value ? value.trim().length > 0 : false
    }),
  website: Yup.string()
    .trim()
    .url('Please enter a valid website URL')
    .test('not-only-spaces', 'Website cannot be only spaces', value => {
      return !value || value.trim().length > 0
    })
    .optional(),
  address1: Yup.string()
    .trim()
    .required('Please enter address line 1')
    .test('not-only-spaces', 'Please enter address line 1', value => {
      return value ? value.trim().length > 0 : false
    }),
  address2: Yup.string()
    .trim()
    .test('not-only-spaces', 'Address line 2 cannot be only spaces', value => {
      return !value || value.trim().length > 0
    })
    .optional(),
  city: Yup.string()
    .trim()
    .required('Please enter city or town')
    .test('not-only-spaces', 'Please enter city or town', value => {
      return value ? value.trim().length > 0 : false
    }),
  province: Yup.string().trim().required('Please select a province'),
  postalCode: Yup.string()
    .trim()
    .required('Please enter a postal code')
    .test('not-only-spaces', 'Please enter a postal code', value => {
      return value ? value.trim().length > 0 : false
    }),
})

const step3Schema = Yup.object().shape({
  language: Yup.string()
    // .oneOf(['English', 'French'])
    .required('Please select a language'),
  allowAllUsersManage: Yup.string()
    // .oneOf(['Enabled', 'Disabled'])
    .required('Please select an organization management option'),
})

const formSchema = step1Schema.concat(step2Schema).concat(step3Schema)

const initialFormData: OrganizationFormDataType = {
  // Step 1
  orgType: '',
  confirmationMemo: '',

  // Step 2
  agreementExpiry: '',
  legalName: '',
  displayName: '',
  craBusinessNumber: '',
  website: '',
  address1: '',
  address2: '',
  city: '',
  province: '',
  postalCode: '',

  // Step 3
  language: '',
  allowAllUsersManage: '',
}

const CreateOrganization = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { showSonnar } = useSonnar()
  const { token, userId } = useAuth()

  const initialStep = useMemo(() => {
    const stepParam = searchParams.get('step')?.toLowerCase()
    switch (stepParam) {
      case 'details':
        return 2
      case 'preferences':
        return 3
      case 'review':
        return 4
      default:
        return 1
    }
  }, [searchParams])

  const [step, setStep] = useState<number>(initialStep)
  const [isChangeMode, setisChangeMode] = useState<boolean>(false)
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const [savedFormData, setSavedFormData] =
    useState<OrganizationFormDataType | null>(null)

  const stepLabel = useMemo(() => {
    if (step === 4) return 'Review'
    return `Step ${step} of 3`
  }, [step])

  const stepTitle = useMemo(() => {
    switch (step) {
      case 1:
        return 'Organization type'
      case 2:
        return 'Organization details'
      case 3:
        return 'Organization preferences'
      case 4:
        return 'Review and create'
      default:
        return ''
    }
  }, [step])

  // Function to save form data to localStorage
  const saveFormDataToStorage = useCallback(
    (values: OrganizationFormDataType) => {
      setLocalStorageItem(STORAGE_KEYS.CREATE_ORG_FORM, values)
    },
    []
  )

  // Function to clear form data from localStorage
  const clearFormDataFromStorage = useCallback(() => {
    removeLocalStorageItem(STORAGE_KEYS.CREATE_ORG_FORM)
    setSavedFormData(null)
  }, [])

  const handleSubmit = async (values: OrganizationFormDataType) => {
    if (!token || !userId) {
      return
    }

    setIsSubmitting(true)
    try {
      // Map form data to API payload format
      const payload = {
        legalName: values.legalName,
        displayName: values.displayName || values.legalName,
        description: values.displayName
          ? `${values.displayName} organization`
          : `${values.legalName} organization`,
        domain: values.website
          ? (() => {
              try {
                return new URL(values.website).hostname
              } catch {
                return ''
              }
            })()
          : '',
        websiteURL: values.website || '',
        phoneNumber: '', // Not collected in form, using empty string
        businessNumber: values.craBusinessNumber,
        organizationType: values.orgType,
        maxUsers: 100, // Default max users - can be configured later
        addressLine1: values.address1,
        addressLine2: values.address2 || '',
        city: values.city,
        provinceId: values.province, // Assuming this is the province ID
        postalCode: values.postalCode,
        language: values.language,
        isOrgManagement: values.allowAllUsersManage === 'Enabled',
        aggrementExpiryDate: values.agreementExpiry
          ? new Date(values.agreementExpiry).toISOString()
          : new Date().toISOString(),
        isConfirmationMemo: values.confirmationMemo === 'Yes',
        loginUserId: userId,
      }

      await organizationService.createOrganization(payload)

      showSonnar({
        type: 'success',
        label: 'Organization created',
        message: (
          <>
            You&apos;ve created the organization{' '}
            <b>{values.legalName || values.displayName}</b>.
            <br />
            <br />
            You can now manage its users and access.
          </>
        ),
      })

      // Clear form data from localStorage on successful submission
      clearFormDataFromStorage()
      router.push('/manage-organizations?tab=all')
    } catch (error) {
      const apiError = error as ApiError
      const errorMessage = apiError?.message
      showSonnar({
        type: 'danger',
        label: 'Failed to create organization',
        message: errorMessage,
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const getStepFields = useCallback((step: number): string[] => {
    switch (step) {
      case 1:
        return ['orgType', 'confirmationMemo']
      case 2:
        return [
          'agreementExpiry',
          'legalName',
          'displayName',
          'craBusinessNumber',
          'website',
          'address1',
          'address2',
          'city',
          'province',
          'postalCode',
        ]
      case 3:
        return ['language', 'allowAllUsersManage']
      default:
        return []
    }
  }, [])

  const validateCurrentStep = useCallback(
    async (
      formik: FormikProps<OrganizationFormDataType>,
      currentStep: number
    ) => {
      try {
        // Only validate fields relevant to current step
        const fieldsToValidate = getStepFields(currentStep)
        const stepValues = Object.keys(formik.values)
          .filter(key => fieldsToValidate.includes(key))
          .reduce(
            (obj, key) => {
              const typedKey = key as keyof OrganizationFormDataType
              obj[typedKey] = formik.values[typedKey]
              return obj
            },
            {} as Record<string, unknown>
          )

        // Validate using the appropriate schema
        switch (currentStep) {
          case 1:
            await step1Schema.validate(stepValues, { abortEarly: false })
            break
          case 2:
            await step2Schema.validate(stepValues, { abortEarly: false })
            break
          case 3:
            await step3Schema.validate(stepValues, { abortEarly: false })
            break
          default:
            return true
        }

        // Clear errors for current step fields if validation passes
        const clearedErrors = { ...formik.errors }
        fieldsToValidate.forEach(field => {
          delete clearedErrors[field as keyof OrganizationFormDataType]
        })
        formik.setErrors(clearedErrors)

        return true
      } catch (error: unknown) {
        const validationErrors: Record<string, string> = { ...formik.errors }
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
          touchedFields[field as keyof OrganizationFormDataType] = true
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
      formik?: FormikProps<OrganizationFormDataType>
    ) => {
      // Validate current step before proceeding (except when going back or in edit mode)
      if (formik && nextStep > step && !editMode) {
        const isValid = await validateCurrentStep(formik, step)
        if (!isValid) {
          return false
        }
      }

      setStep(nextStep)
      setisChangeMode(editMode)
      const stepNames = ['', 'type', 'details', 'preferences', 'review']
      const params = new URLSearchParams(window.location.search)
      params.set('step', stepNames[nextStep] || 'type')
      router.replace(`?${params.toString()}`, { scroll: false })
      return true
    },
    [router, step, validateCurrentStep]
  )

  const onCancel = useCallback(
    () => router.push('/manage-organizations'),
    [router]
  )

  const renderReviewStep = useCallback(
    (formik: FormikProps<OrganizationFormDataType>) => (
      <div className="flex flex-col gap-8">
        <div className="flex items-center justify-between">
          <h2 className="heading-h2-base text-so-color-neutral-950 font-bold">
            Organization type
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
              Type
            </p>
            <p className="body-base text-so-color-neutral-600">
              {formik.values.orgType || '-'}
            </p>
          </div>
          <div className="space-y-1">
            <p className="heading-h3-base text-so-color-neutral-950 font-bold">
              Confirmation memo
            </p>
            <p className="body-base text-so-color-neutral-600">
              {formik.values.confirmationMemo || '-'}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <h2 className="heading-h2-base text-so-color-neutral-950 font-bold">
            Organization details
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
              Agreement expiry date
            </p>
            <p className="body-base text-so-color-neutral-600">
              {formik.values.agreementExpiry || '-'}
            </p>
          </div>
          <div className="space-y-1">
            <p className="heading-h3-base text-so-color-neutral-950 font-bold">
              Legal name
            </p>
            <p className="body-base text-so-color-neutral-600">
              {formik.values.legalName || '-'}
            </p>
          </div>
          <div className="space-y-1">
            <p className="heading-h3-base text-so-color-neutral-950 font-bold">
              Display name
            </p>
            <p className="body-base text-so-color-neutral-600">
              {formik.values.displayName || '-'}
            </p>
          </div>
          <div className="space-y-1">
            <p className="heading-h3-base text-so-color-neutral-950 font-bold">
              CRA Business number
            </p>
            <p className="body-base text-so-color-neutral-600">
              {formik.values.craBusinessNumber || '-'}
            </p>
          </div>
          <div className="space-y-1">
            <p className="heading-h3-base text-so-color-neutral-950 font-bold">
              Website
            </p>
            <p className="body-base text-so-color-neutral-600">
              {formik.values.website || '-'}
            </p>
          </div>
          <div className="space-y-1">
            <p className="heading-h3-base text-so-color-neutral-950 font-bold">
              Address
            </p>
            <p className="body-base text-so-color-neutral-600">
              {formik.values.address1 ||
              formik.values.city ||
              formik.values.province ||
              formik.values.postalCode
                ? `${formik.values.address1 ?? ''}${formik.values.address2 ? ', ' + formik.values.address2 : ''}${formik.values.city ? ', ' + formik.values.city : ''}${formik.values.province ? ', ' + formik.values.province : ''}${formik.values.postalCode ? ', ' + formik.values.postalCode : ''}`
                : '-'}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <h2 className="heading-h2-base text-so-color-neutral-950 font-bold">
            Organization preferences
          </h2>
          <Button
            appearance="ghost"
            label="Change"
            className="underline"
            onClick={() => handleSteps(3, true)}
          />
        </div>
        <Separator appearance="thick" className="!p-0" />

        <div className="space-y-6">
          <div className="space-y-1">
            <p className="heading-h3-base text-so-color-neutral-950 font-bold">
              Language
            </p>
            <p className="body-base text-so-color-neutral-600">
              {formik.values.language || '-'}
            </p>
          </div>
          <div className="space-y-1">
            <p className="heading-h3-base text-so-color-neutral-950 font-bold">
              Organization management
            </p>
            <p className="body-base text-so-color-neutral-600">
              {formik.values.allowAllUsersManage || '-'}
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
            label="Create organization"
            appearance="primary"
            className="!px-6 text-center"
            disabled={isSubmitting}
            loading={isSubmitting}
            loadingText="Creating..."
          />
        </div>
      </div>
    ),
    [handleSteps, onCancel, isSubmitting]
  )

  const renderSteps = useCallback(
    (formik: FormikProps<OrganizationFormDataType>) => {
      switch (step) {
        case 1:
          return (
            <OrganizationTypeStep
              {...formik}
              handleSteps={(nextStep: number, editMode?: boolean) =>
                handleSteps(nextStep, editMode, formik)
              }
              onCancel={onCancel}
              isChangeMode={isChangeMode}
            />
          )
        case 2:
          return (
            <OrganizationDetailsStep
              {...formik}
              handleSteps={(nextStep: number, editMode?: boolean) =>
                handleSteps(nextStep, editMode, formik)
              }
              onCancel={onCancel}
              isChangeMode={isChangeMode}
            />
          )
        case 3:
          return (
            <OrganizationPreferencesStep
              {...formik}
              handleSteps={(nextStep: number, editMode?: boolean) =>
                handleSteps(nextStep, editMode, formik)
              }
              onCancel={onCancel}
              isChangeMode={isChangeMode}
            />
          )
        case 4:
          return renderReviewStep(formik)
        default:
          return (
            <OrganizationTypeStep
              {...formik}
              handleSteps={(nextStep: number, editMode?: boolean) =>
                handleSteps(nextStep, editMode, formik)
              }
              onCancel={onCancel}
              isChangeMode={isChangeMode}
            />
          )
      }
    },
    [step, handleSteps, onCancel, isChangeMode, renderReviewStep]
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
              handleSteps(4, false) // Go back to review step
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
    const savedData = getLocalStorageItem<OrganizationFormDataType>(
      STORAGE_KEYS.CREATE_ORG_FORM
    )
    if (savedData) {
      setSavedFormData(savedData)
    }
  }, [])

  // Clear localStorage when component unmounts (user navigates away)
  useEffect(() => {
    // Cleanup function - clear localStorage when component unmounts
    return () => {
      // Clear localStorage when component unmounts (user navigates away from page)
      clearFormDataFromStorage()
    }
  }, [clearFormDataFromStorage])

  return (
    <>
      {!isChangeMode && (
        <PageTitle
          variant={'standard'}
          title={'Create organization'}
          lead={
            step === 4
              ? 'Review and create new organization'
              : 'Create and manage a new organization'
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
              crumb: 'Manage organizations',
              href: '/manage-organizations',
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
          validateOnChange={false}
          validateOnBlur={true}
        >
          {formik => (
            <Form className="space-y-8">
              <FormPersistence
                values={formik.values}
                saveFormData={saveFormDataToStorage}
              />
              {step !== 4 && !isChangeMode && (
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
    </>
  )
}

export default CreateOrganization
