'use client'
import { Alert, Button, InputRadioGroup } from '@/components/ui'
import { OrganizationPreferencesStepProps } from '@/types/component'
import { Field, FieldInputProps } from 'formik'

const OrganizationPreferencesStep = ({
  errors,
  touched,
  handleSteps,
  onCancel,
  setFieldValue,
  setFieldTouched,
  isChangeMode = false,
}: OrganizationPreferencesStepProps) => {
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
            onChange={val => setFieldValue('allowAllUsersManage', val)}
            onBlur={() => setFieldTouched('allowAllUsersManage', true)}
            error={
              touched.allowAllUsersManage && errors.allowAllUsersManage
                ? (errors.allowAllUsersManage as string)
                : undefined
            }
          />
        )}
      </Field>

      <div className="flex items-center gap-4">
        <Button
          type="button"
          label={isChangeMode ? 'Save changes' : 'Review'}
          appearance="primary"
          className="!px-6 text-center"
          onClick={async () => {
            await handleSteps(4, false)
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

export default OrganizationPreferencesStep
