'use client'
import { ConfirmationModal, InputText } from '@/components/ui'
import { DeclineFormValues, DeclinePendingUserProps } from '@/types/component'
import { Field, FieldInputProps, Formik } from 'formik'
import * as Yup from 'yup'

const validationSchema = Yup.object().shape({
  reason: Yup.string()
    .required('Please provide a valid reason for this decision')
    .min(10, 'Reason must be at least 10 characters')
    .max(500, 'Reason cannot exceed 500 characters'),
})

const DeclinePendingModal = ({
  title,
  isOpen,
  onClose,
  handleCancelDecline,
  handleDecline,
  declineText,
  isSubmitting,
}: DeclinePendingUserProps) => {
  const initialValues: DeclineFormValues = {
    reason: '',
  }

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={(values, { setSubmitting }) => {
        handleDecline(values.reason)
        setSubmitting(false)
      }}
      validateOnChange={false}
      validateOnBlur={true}
    >
      {({ errors, touched, handleSubmit }) => (
        <ConfirmationModal
          isOpen={isOpen}
          onClose={onClose}
          title={title}
          description={
            <div className="break-words">
              You are choosing to decline <br />
              <span className="font-semibold break-all">{declineText}</span>.
            </div>
          }
          confirmButton={{
            label: title,
            onClick: () => handleSubmit(),
            appearance: 'destructive',
            isLoading: isSubmitting,
            loadingText: 'Declining...',
          }}
          cancelButton={{
            label: 'Cancel',
            onClick: handleCancelDecline,
          }}
        >
          <Field name="reason">
            {({ field }: { field: FieldInputProps<string> }) => (
              <InputText
                {...field}
                type="area"
                label="Reason"
                trailingLabel="(required)"
                hintText="Input reason for this decision"
                error={
                  touched.reason && errors.reason ? errors.reason : undefined
                }
              />
            )}
          </Field>
        </ConfirmationModal>
      )}
    </Formik>
  )
}

export default DeclinePendingModal
