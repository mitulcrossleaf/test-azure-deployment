'use client'
import { Button, Separator } from '@/components/ui'
import { AddApplicationFormValues } from '@/types/component'
import { FormikProps } from 'formik'

interface ApplicationReviewProps {
  formik: FormikProps<AddApplicationFormValues>
  applicationTypeOptions: { value: string; label: string }[]
  availableToOptions: { value: string; label: string }[]
  onBackToEdit: () => void
  onCancel: () => void
  isSubmitting: boolean
}

const ApplicationReview = ({
  formik,
  applicationTypeOptions,
  availableToOptions,
  onBackToEdit,
  onCancel,
  isSubmitting,
}: ApplicationReviewProps) => {
  const { values } = formik

  const getApplicationTypeLabel = (value: string) => {
    return (
      applicationTypeOptions.find(option => option.value === value)?.label ||
      '-'
    )
  }

  const getAvailableToLabel = (value: string) => {
    return (
      availableToOptions.find(option => option.value === value)?.label || '-'
    )
  }

  return (
    <div className="flex flex-col gap-8">
      {/* Application Details Section */}
      <div className="flex flex-col gap-8">
        <div className="flex items-center justify-between">
          <h2 className="heading-h2-base text-so-color-neutral-950 font-bold">
            Application details
          </h2>
          <Button
            appearance="ghost"
            labelClassName="font-normal"
            label="Change"
            className="underline"
            onClick={onBackToEdit}
          />
        </div>
        <Separator appearance="thick" className="!p-0" />
        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-1">
            <p className="heading-h3-base text-so-color-neutral-950 font-bold">
              Type
            </p>
            <p className="body-base text-so-color-neutral-600">
              {getApplicationTypeLabel(values.applicationType)}
            </p>
          </div>
          <div className="flex flex-col gap-1">
            <p className="heading-h3-base text-so-color-neutral-950 font-bold">
              Available to
            </p>
            <p className="body-base text-so-color-neutral-600">
              {getAvailableToLabel(values.availableTo)}
            </p>
          </div>
          <div className="flex flex-col gap-1">
            <p className="heading-h3-base text-so-color-neutral-950 font-bold">
              Name
            </p>
            <p className="body-base text-so-color-neutral-600">
              {values.applicationName || '-'}
            </p>
          </div>
          <div className="flex flex-col gap-1">
            <p className="heading-h3-base text-so-color-neutral-950 font-bold">
              Description
            </p>
            <p className="body-base text-so-color-neutral-600">
              {values.applicationDescription || '-'}
            </p>
          </div>
          <div className="flex flex-col gap-1">
            <p className="heading-h3-base text-so-color-neutral-950 font-bold">
              Icon
            </p>
            <p className="body-base text-so-color-neutral-600">
              {values.applicationIcon || '-'}
            </p>
          </div>
          <div className="flex flex-col gap-1">
            <p className="heading-h3-base text-so-color-neutral-950 font-bold">
              URL
            </p>
            <p className="body-base text-so-color-neutral-600">
              {values.applicationUrl || '-'}
            </p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
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
          label="Add application"
          appearance="primary"
          className="!px-6 text-center"
          disabled={isSubmitting}
          loading={isSubmitting}
          loadingText="Adding..."
        />
      </div>
    </div>
  )
}

export default ApplicationReview
