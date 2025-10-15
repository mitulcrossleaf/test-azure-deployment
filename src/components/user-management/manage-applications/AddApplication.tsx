'use client'
import { CircularLoader } from '@/components/common'
import {
  Button,
  ConfirmationModal,
  PageTitle,
  StepIndicator,
} from '@/components/ui'
import { useAuth, useSonnar } from '@/context'
import {
  STORAGE_KEYS,
  getLocalStorageItem,
  removeLocalStorageItem,
  setLocalStorageItem,
} from '@/helper'
import { applicationService } from '@/services'
import { applicationTypeService } from '@/services/applicationtype.service'
import { AddApplicationFormValues } from '@/types/component'
import { ApiError, ApplicationTypeOption } from '@/types/services'
import { Form, Formik } from 'formik'
import { useRouter, useSearchParams } from 'next/navigation'
import { useCallback, useEffect, useMemo, useState } from 'react'
import * as Yup from 'yup'
import ApplicationDetails from './add-application/ApplicationDetailsStep'
import ApplicationReview from './add-application/ApplicationReviewStep'

interface FormPersistenceProps {
  values: AddApplicationFormValues
  saveFormData: (values: AddApplicationFormValues) => void
}

const validationSchema = Yup.object({
  applicationType: Yup.string().required(
    'Please select a valid application type'
  ),
  availableTo: Yup.string().required(
    'Please select who this application is available to'
  ),
  applicationName: Yup.string().required(
    'Please enter a valid application name'
  ),
  applicationDescription: Yup.string().required(
    'Please enter a valid application description'
  ),
  applicationUrl: Yup.string()
    .required('Please enter an application URL')
    .url('Please enter a valid URL'),
})

const AddApplication = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { showSonnar } = useSonnar()
  const { token, userId } = useAuth()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isReviewMode, setIsReviewMode] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isPageLoading, setIsPageLoading] = useState(true)
  const [savedFormData, setSavedFormData] =
    useState<AddApplicationFormValues | null>(null)
  const [applicationTypes, setApplicationTypes] = useState<
    ApplicationTypeOption[]
  >([])

  const initialValues: AddApplicationFormValues = {
    applicationType: '',
    availableTo: '',
    applicationName: '',
    applicationDescription: '',
    applicationIcon: '',
    applicationUrl: '',
  }

  const FormPersistence = ({ values, saveFormData }: FormPersistenceProps) => {
    useEffect(() => {
      // Debounce the save operation to avoid excessive localStorage writes
      const timeoutId = setTimeout(() => {
        saveFormData(values)
      }, 500)

      return () => clearTimeout(timeoutId)
    }, [values, saveFormData])

    return null
  }

  // Convert API response to dropdown format
  const applicationTypeOptions = useMemo(
    () =>
      applicationTypes
        .filter(
          type =>
            type.applictaionTypeName && type.applictaionTypeName.trim() !== ''
        )
        .map(type => ({
          value: type.applictaionTypeId,
          label: type.applictaionTypeName,
        })),
    [applicationTypes]
  )

  const availableToOptions = useMemo(
    () => [
      { value: 'internal', label: 'Internal users' },
      { value: 'external', label: 'External users' },
      { value: 'both', label: 'Both' },
    ],
    []
  )

  // Function to save form data to localStorage
  const saveFormDataToStorage = useCallback(
    (values: AddApplicationFormValues) => {
      setLocalStorageItem(STORAGE_KEYS.ADD_APPLICATION_FORM, values)
    },
    []
  )

  // Function to clear form data from localStorage
  const clearFormDataFromStorage = useCallback(() => {
    removeLocalStorageItem(STORAGE_KEYS.ADD_APPLICATION_FORM)
    setSavedFormData(null)
  }, [])

  // Fetch application types on component mount
  const fetchApplicationTypes = useCallback(async () => {
    try {
      setIsPageLoading(true)
      const response =
        await applicationTypeService.getAllApplicationType<
          ApplicationTypeOption[]
        >()

      // Handle both direct array response and wrapped response
      const data = response.data || response
      if (Array.isArray(data)) {
        setApplicationTypes(data)
      }
    } catch {
      showSonnar({
        type: 'danger',
        label: 'Error',
        message: 'Failed to load application types. Please refresh the page.',
      })
    } finally {
      setIsPageLoading(false)
    }
  }, [showSonnar])

  const handleSubmit = async (values: AddApplicationFormValues) => {
    if (!isReviewMode) {
      router.push('?review=true')
    } else {
      if (!token || !userId) {
        return
      }

      setIsSubmitting(true)

      try {
        const payload = {
          name: values.applicationName,
          description: values.applicationDescription,
          applictaionTypeId: values.applicationType,
          availableTo: values.availableTo,
          applictaionIcon: values.applicationIcon,
          url: values.applicationUrl,
          loginUserId: userId,
        }

        await applicationService.createApplication(payload)

        showSonnar({
          type: 'success',
          label: 'Application added',
          message: (
            <div>
              You have successfully added the application{' '}
              <b>{values.applicationName}.</b>
              <br />
              <br />
              You can now manage its administrative settings.
            </div>
          ),
        })

        // Clear form data from localStorage on successful submission
        clearFormDataFromStorage()
        router.push('/manage-applications')
      } catch (error) {
        const apiError = error as ApiError
        showSonnar({
          type: 'danger',
          label: 'Error',
          message:
            apiError.message ?? 'Failed to add application. Please try again.',
        })
      } finally {
        setIsSubmitting(false)
      }
    }
  }

  const handleBackToEdit = () => {
    setIsReviewMode(false)
    router.push(window.location.pathname)
  }

  const handleModalClose = () => {
    setIsModalOpen(false)
  }

  const handleCancelCreating = () => {
    setIsModalOpen(false)
    clearFormDataFromStorage()
    router.push('/manage-applications')
  }

  // Load saved form data from localStorage on component mount
  useEffect(() => {
    const savedData = getLocalStorageItem<AddApplicationFormValues>(
      STORAGE_KEYS.ADD_APPLICATION_FORM
    )
    if (savedData) {
      setSavedFormData(savedData)
    }
  }, [])

  // Clear localStorage when component unmounts (user navigates away)
  useEffect(() => {
    return () => {
      // Only clear if not submitting (successful submission already clears)
      if (!isSubmitting) {
        clearFormDataFromStorage()
      }
    }
  }, [clearFormDataFromStorage, isSubmitting])

  useEffect(() => {
    const reviewParam = searchParams.get('review')
    if (reviewParam === 'true') {
      setIsReviewMode(true)
    } else {
      setIsReviewMode(false)
    }
  }, [searchParams])

  useEffect(() => {
    fetchApplicationTypes()
  }, [fetchApplicationTypes])

  return (
    <>
      {isPageLoading && <CircularLoader />}

      <div className="flex flex-col">
        <PageTitle
          title="Add application"
          lead="Add a new enterprise application"
          breadcrumbs={true}
          variant="standard"
          crumbs={[
            { crumb: 'Dashboard', href: '/', active: false, collapsed: false },
            {
              crumb: 'Manage enterprise applications',
              href: '/manage-applications',
              active: true,
              collapsed: false,
            },
          ]}
        />

        <div className="container flex flex-col pt-8">
          {!isReviewMode && (
            <StepIndicator title="Application details" step="Step 1 of 1" />
          )}

          <Formik
            initialValues={savedFormData || initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
            enableReinitialize
          >
            {formik => (
              <Form className="flex flex-col gap-8 pb-8">
                <FormPersistence
                  values={formik.values}
                  saveFormData={saveFormDataToStorage}
                />

                {isReviewMode ? (
                  <ApplicationReview
                    formik={formik}
                    applicationTypeOptions={applicationTypeOptions}
                    availableToOptions={availableToOptions}
                    onBackToEdit={handleBackToEdit}
                    onCancel={() => setIsModalOpen(true)}
                    isSubmitting={isSubmitting}
                  />
                ) : (
                  <>
                    <ApplicationDetails
                      formik={formik}
                      applicationTypeOptions={applicationTypeOptions}
                      availableToOptions={availableToOptions}
                    />
                    <div className="flex items-center gap-4">
                      <Button
                        type="submit"
                        label="Review"
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
                  </>
                )}
              </Form>
            )}
          </Formik>
        </div>

        <ConfirmationModal
          isOpen={isModalOpen}
          onClose={handleModalClose}
          title="Cancel creating application"
          description="If you cancel now, any unsaved information will be lost and the application won't be created."
          confirmButton={{
            label: 'Continue creating application',
            onClick: () => setIsModalOpen(false),
            appearance: 'primary',
          }}
          cancelButton={{
            label: 'Cancel creating application',
            onClick: handleCancelCreating,
          }}
          headerClassName="gap-8"
          isclose={false}
        />
      </div>
    </>
  )
}

export default AddApplication
