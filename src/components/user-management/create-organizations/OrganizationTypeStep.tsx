'use client'
import {
  Alert,
  Button,
  InputRadioCardGroup,
  InputRadioGroup,
} from '@/components/ui'
import { OrganizationTypeStepProps } from '@/types/component'
import { Field, FieldInputProps } from 'formik'

const OrganizationTypeStep = ({
  errors,
  touched,
  handleSteps,
  onCancel,
  setFieldValue,
  setFieldTouched,
  isChangeMode = false,
}: OrganizationTypeStepProps) => {
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

      <Field name="orgType">
        {({ field }: { field: FieldInputProps<string> }) => (
          <InputRadioCardGroup
            label={'Select organization type'}
            trailingLabel="(required)"
            className="bg-so-color-neutral-100 w-full max-w-[544px] rounded-2xl p-6"
            hintExpander
            labelSize="base"
            hintLabel="Not sure which to choose?"
            hintContent="If you’re unsure, select the option that best describes your organization."
            name={field.name}
            value={field.value}
            onChange={val => setFieldValue('orgType', val)}
            onBlur={() => setFieldTouched('orgType', true)}
            error={
              touched.orgType && errors.orgType
                ? (errors.orgType as string)
                : undefined
            }
            options={[
              {
                label: 'Broader Public Sector',
                value: 'Broader Public Sector',
                description:
                  'A Broader Public Sector (BPS) organization is a publicly funded entity that receives funding from the Government of Ontario but is not a part of the government itself',
              },
              {
                label: 'Ontario Public Service',
                value: 'Ontario Public Service',
                description:
                  'An Ontario Public Service (OPS) organization is an organization that provides government services.',
              },
              {
                label: 'Supply Ontario',
                value: 'Supply Ontario',
                description:
                  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi mattis dolor sed turpis consectetur.',
              },
              {
                label: 'Vendor',
                value: 'Vendor',
                description:
                  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi mattis dolor sed turpis consectetur.',
              },
            ]}
          />
        )}
      </Field>

      <Field name="confirmationMemo">
        {({ field }: { field: FieldInputProps<string> }) => (
          <InputRadioGroup
            label={'Confirmation memo?'}
            options={[
              { label: 'Yes', value: 'Yes' },
              { label: 'No', value: 'No' },
            ]}
            radioAppearance="regular"
            labelSize="base"
            hintExpander
            trailingLabel="(required)"
            className="bg-so-color-neutral-100 w-full max-w-[544px] rounded-2xl p-6"
            hintLabel="What is a confirmation memo"
            hintContent="A confirmation memo is a document that confirms your organization’s eligibility. It can be a letter, email, or other official document."
            name={field.name}
            value={field.value || ''}
            onChange={val => setFieldValue('confirmationMemo', val)}
            onBlur={() => setFieldTouched('confirmationMemo', true)}
            error={
              touched.confirmationMemo && errors.confirmationMemo
                ? (errors.confirmationMemo as string)
                : undefined
            }
          />
        )}
      </Field>

      <div className="flex items-center gap-4">
        <Button
          type="button"
          label={isChangeMode ? 'Save changes' : 'Continue'}
          appearance="primary"
          className="!px-6 text-center"
          onClick={async () => {
            await handleSteps(isChangeMode ? 4 : 2, false)
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

export default OrganizationTypeStep
