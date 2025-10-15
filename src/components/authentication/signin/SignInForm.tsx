'use client'

import { Button, InputText } from '@/components/ui'
import { useAuth } from '@/context'
import { SignInFormValues } from '@/types/component'
import { Field, FieldInputProps, Form, Formik, FormikHelpers } from 'formik'
import * as Yup from 'yup'

const validationSchema = Yup.object().shape({
  email: Yup.string()
    .email('Please enter a valid email address')
    .required('Email is required'),
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .required('Password is required'),
})

const HorizontalRule = () => (
  <div className="flex items-center gap-2">
    <span className="bg-so-color-neutral-950/10 h-px flex-1" />
    <span className="font-open-sans font-bold">OR</span>
    <span className="bg-so-color-neutral-950/10 h-px flex-1" />
  </div>
)

const SignInForm = () => {
  // const router = useRouter()
  const { login } = useAuth()
  const initialValues: SignInFormValues = {
    email: '',
    password: '',
  }

  const handleSubmit = (
    values: SignInFormValues,
    { setSubmitting }: FormikHelpers<SignInFormValues>
  ) => {
    console.log('Form submitted:', values)
    // Simulate API call
    setTimeout(() => {
      setSubmitting(false)
    }, 1000)
  }
  const handleRegisterclick = () => {
    // router.push('/register/type')
  }

  return (
    <div className="border-so-color-neutral-200 rounded-3xl border p-8 shadow-sm">
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        validateOnChange={false}
        validateOnBlur={true}
      >
        {({
          errors,
          touched,
          isSubmitting,
          handleBlur,
          handleChange,
          values,
        }) => (
          <Form className="space-y-6">
            <p className="heading-h2-sm font-raleway font-bold">
              Supply Ontario Online
            </p>
            <div className="flex items-center justify-between gap-2.5">
              <p className="font-open-sans">
                Don&apos;t have a Supply Ontario account?
              </p>
              <Button
                type="button"
                appearance="ghost"
                label="Register"
                onClick={handleRegisterclick}
              />
            </div>
            <HorizontalRule />

            <Field name="email">
              {({ field }: { field: FieldInputProps<string> }) => (
                <InputText
                  {...field}
                  label="Email"
                  type="email"
                  hintText="The email address you registered with"
                  error={
                    touched.email && errors.email ? errors.email : undefined
                  }
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.email}
                />
              )}
            </Field>

            <Field name="password">
              {({ field }: { field: FieldInputProps<string> }) => (
                <InputText
                  {...field}
                  label="Password"
                  type="password"
                  error={
                    touched.password && errors.password
                      ? errors.password
                      : undefined
                  }
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.password}
                />
              )}
            </Field>

            <Button
              type="submit"
              appearance="primary"
              label={isSubmitting ? 'Signing in...' : 'Sign in'}
              className="w-full"
              disabled={isSubmitting}
            />

            <Button
              type="button"
              appearance="ghost"
              label="Trouble logging in?"
              className="w-full"
            />

            <HorizontalRule />

            <Button
              onClick={login}
              type="button"
              appearance="outline"
              label="OPS Sign in"
              className="w-full"
            />
          </Form>
        )}
      </Formik>
    </div>
  )
}

export default SignInForm
