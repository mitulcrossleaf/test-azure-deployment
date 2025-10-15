'use client'
import {
  Alert,
  InputArea,
  InputRadioGroup,
  InputSelect,
  InputText,
} from '@/components/ui'
import { AddApplicationFormValues } from '@/types/component'
import { Field, FieldInputProps, FormikProps } from 'formik'

interface ApplicationDetailsProps {
  formik: FormikProps<AddApplicationFormValues>
  applicationTypeOptions: { value: string; label: string }[]
  availableToOptions: { value: string; label: string }[]
}

const ApplicationDetails = ({
  formik,
  applicationTypeOptions,
  availableToOptions,
}: ApplicationDetailsProps) => {
  const { errors, touched, setFieldValue } = formik

  const errorMessages = Object.entries(errors)
    .filter(([key]) => (touched as Record<string, unknown>)[key])
    .map(([, value]) => value)
    .filter((error): error is string => typeof error === 'string')

  return (
    <div className="flex flex-col gap-8 pt-8">
      {errorMessages.length > 0 && (
        <Alert
          title="Missing required information"
          description="Some required fields are incomplete or invalid. Review the details below to continue."
          validationErrors={errorMessages}
          variant="destructive"
        />
      )}

      <div className="flex w-full max-w-[544px] flex-col gap-8">
        {/* Application Type Section */}
        <div className="bg-so-color-neutral-100 rounded-2xl p-6">
          <div className="text-so-color-neutral-950 mb-8 space-y-2">
            <h2 className="heading-h3-base font-bold">Application type</h2>
            <p className="body-base">Application type (e.g., Web, API, SaaS)</p>
          </div>

          <Field name="applicationType">
            {({ field }: { field: FieldInputProps<string> }) => (
              <InputSelect
                {...field}
                label="Type"
                trailingLabel="(required)"
                items={applicationTypeOptions}
                value={field.value}
                onChange={(val: string) =>
                  setFieldValue('applicationType', val)
                }
                disabled={applicationTypeOptions.length === 0}
                placeholder={
                  applicationTypeOptions.length === 0
                    ? 'No application types available'
                    : 'Select application type'
                }
                error={
                  touched.applicationType && errors.applicationType
                    ? (errors.applicationType as string)
                    : undefined
                }
              />
            )}
          </Field>
        </div>

        {/* Available To Section */}
        <div className="bg-so-color-neutral-100 rounded-2xl p-6">
          <Field name="availableTo">
            {({ field }: { field: FieldInputProps<string> }) => (
              <InputRadioGroup
                name={field.name}
                radioAppearance="regular"
                label="Available to"
                trailingLabel={'(required)'}
                labelSize="base"
                options={availableToOptions}
                value={field.value}
                onChange={val => setFieldValue('availableTo', val)}
                hintExpander={true}
                hintLabel="What's the difference?"
                hintContent="Internal users are employees within your organization, while external users are clients, partners, or other outside parties. Both allows access to all user types."
                error={
                  touched.availableTo && errors.availableTo
                    ? (errors.availableTo as string)
                    : undefined
                }
              />
            )}
          </Field>
        </div>

        {/* Details Section */}
        <div className="bg-so-color-neutral-100 flex flex-col gap-8 rounded-2xl p-6">
          <div className="text-so-color-neutral-950">
            <h2 className="heading-h3-base font-bold">Details</h2>
            <p className="body-base">Application&apos;s primary information</p>
          </div>

          <div className="flex flex-col gap-8">
            <Field name="applicationName">
              {({ field }: { field: FieldInputProps<string> }) => (
                <InputText
                  {...field}
                  label="Application name"
                  trailingLabel="(required)"
                  error={
                    touched.applicationName && errors.applicationName
                      ? (errors.applicationName as string)
                      : undefined
                  }
                />
              )}
            </Field>

            <Field name="applicationDescription">
              {({ field }: { field: FieldInputProps<string> }) => (
                <InputArea
                  {...field}
                  label="Application description"
                  trailingLabel="(required)"
                  error={
                    touched.applicationDescription &&
                    errors.applicationDescription
                      ? (errors.applicationDescription as string)
                      : undefined
                  }
                />
              )}
            </Field>

            <Field name="applicationIcon">
              {({ field }: { field: FieldInputProps<string> }) => (
                <InputArea
                  {...field}
                  label="Application icon"
                  trailingLabel="(optional)"
                  error={
                    touched.applicationIcon && errors.applicationIcon
                      ? (errors.applicationIcon as string)
                      : undefined
                  }
                />
              )}
            </Field>

            <Field name="applicationUrl">
              {({ field }: { field: FieldInputProps<string> }) => (
                <InputText
                  {...field}
                  label="URL"
                  trailingLabel="(required)"
                  hintExpander={true}
                  hintExpanderLabel="What is an application URL?"
                  hintExpanderContent="The URL is the web address where users can access your application. It should be a valid web address starting with http:// or https://"
                  error={
                    touched.applicationUrl && errors.applicationUrl
                      ? (errors.applicationUrl as string)
                      : undefined
                  }
                />
              )}
            </Field>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ApplicationDetails
