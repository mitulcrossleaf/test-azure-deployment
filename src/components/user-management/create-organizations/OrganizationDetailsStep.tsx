'use client'
import {
  Alert,
  Button,
  InputDate,
  InputSelect,
  InputText,
} from '@/components/ui'
import { useData } from '@/context'
import { OrganizationDetailsStepProps } from '@/types/component'
import { Field, FieldInputProps } from 'formik'

const OrganizationDetailsStep = ({
  errors,
  touched,
  handleSteps,
  onCancel,
  setFieldValue,
  setFieldTouched,
  isChangeMode = false,
}: OrganizationDetailsStepProps) => {
  const { provinces, loadingProvinces } = useData()

  const errorMessages = Object.entries(errors)
    .filter(([key]) => (touched as Record<string, unknown>)[key])
    .map(([, value]) => value)
    .filter((error): error is string => typeof error === 'string')

  return (
    <div className="flex flex-col gap-8 py-6">
      {errorMessages.length > 0 && (
        <Alert
          title="Missing required information"
          description="Some required fields are incomplete or invalid. Review the details below to continue."
          validationErrors={errorMessages}
          variant="destructive"
        />
      )}
      <div className="flex w-full max-w-[544px] flex-col gap-8">
        <div className="bg-so-color-neutral-100 rounded-2xl p-6">
          <Field name="agreementExpiry">
            {({ field }: { field: FieldInputProps<string> }) => {
              const { onBlur, ...fieldWithoutBlur } = field
              return (
                <InputDate
                  {...fieldWithoutBlur}
                  trailingIcon={true}
                  icon={
                    <i className="material-symbols-outlined">calendar_month</i>
                  }
                  name={field.name}
                  value={field.value}
                  onChange={(v: string) => {
                    setFieldValue('agreementExpiry', v, true)
                    setFieldTouched('agreementExpiry', true, false)
                  }}
                  onBlur={onBlur}
                  hintText="This is the expiry date for the transfer payment agreement"
                  label="Agreement expiry date"
                  trailingLabel="(required)"
                  className="so-date-input"
                  disablePastDates={true}
                  error={
                    touched.agreementExpiry && errors.agreementExpiry
                      ? (errors.agreementExpiry as string)
                      : undefined
                  }
                />
              )
            }}
          </Field>
        </div>

        <div className="bg-so-color-neutral-100 flex flex-col gap-8 rounded-2xl p-6">
          <div className="text-so-color-neutral-950">
            <h2 className="heading-h2-base font-bold">Profile</h2>
            <p className="body-base">Organization&apos;s primary information</p>
          </div>
          <Field name="legalName">
            {({ field }: { field: FieldInputProps<string> }) => (
              <InputText
                {...field}
                trailingLabel="(required)"
                label="Legal name"
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
                label="Display name"
                hintExpander
                hintExpanderLabel="What is a display name?"
                hintExpanderContent="A display name is how your organization will appear to users. It can be different from your legal name."
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
                inputFilter={/\d/} // Only allow digits (0-9)
                error={
                  touched.craBusinessNumber && errors.craBusinessNumber
                    ? (errors.craBusinessNumber as string)
                    : undefined
                }
                maxLength={9}
              />
            )}
          </Field>
          <Field name="website">
            {({ field }: { field: FieldInputProps<string> }) => (
              <InputText
                {...field}
                trailingLabel="(optional)"
                label="Website"
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
          <div className="text-so-color-neutral-950">
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
                error={
                  touched.address1 && errors.address1
                    ? (errors.address1 as string)
                    : undefined
                }
                hintText="Street and number or P.O. box."
              />
            )}
          </Field>

          <Field name="address2">
            {({ field }: { field: FieldInputProps<string> }) => (
              <InputText
                {...field}
                trailingLabel="(optional)"
                label="Address line 2"
                error={
                  touched.address2 && errors.address2
                    ? (errors.address2 as string)
                    : undefined
                }
                hintText="Apartment, suite, unit, building, etc."
              />
            )}
          </Field>

          <Field name="city">
            {({ field }: { field: FieldInputProps<string> }) => (
              <InputText
                {...field}
                trailingLabel="(required)"
                label="City or town"
                error={
                  touched.city && errors.city
                    ? (errors.city as string)
                    : undefined
                }
              />
            )}
          </Field>

          <Field name="province">
            {({ field }: { field: FieldInputProps<string> }) => {
              const { onBlur, ...fieldWithoutBlur } = field
              return (
                <InputSelect
                  {...fieldWithoutBlur}
                  label="Province"
                  required
                  trailingLabel="(required)"
                  value={field.value}
                  onChange={(val: string) => {
                    setFieldValue('province', val, true)
                    setFieldTouched('province', true, false)
                  }}
                  onBlur={onBlur}
                  items={provinces}
                  disabled={loadingProvinces}
                  placeholder={loadingProvinces ? 'Loading provinces...' : ''}
                  error={
                    touched.province && errors.province
                      ? (errors.province as string)
                      : undefined
                  }
                />
              )
            }}
          </Field>

          <Field name="postalCode">
            {({ field }: { field: FieldInputProps<string> }) => (
              <InputText
                {...field}
                trailingLabel="(required)"
                label="Postal code"
                inputParentClassName="max-w-[120px] w-full"
                inputFilter={/[a-zA-Z0-9\s]/} // Allow letters, numbers, and spaces
                error={
                  touched.postalCode && errors.postalCode
                    ? (errors.postalCode as string)
                    : undefined
                }
                maxLength={7}
              />
            )}
          </Field>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <Button
          type="button"
          label={isChangeMode ? 'Save changes' : 'Continue'}
          appearance="primary"
          className="!px-6 text-center"
          onClick={async () => {
            await handleSteps(isChangeMode ? 4 : 3, false)
          }}
        />
        {!isChangeMode && (
          <Button
            type="button"
            label="Cancel"
            appearance="secondary"
            semantic="general"
            className="px-6"
            onClick={onCancel}
          />
        )}
      </div>
    </div>
  )
}

export default OrganizationDetailsStep
