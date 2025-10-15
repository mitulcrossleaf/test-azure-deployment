import { SignInForm } from '@/components/authentication'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Sign In | Supply Ontario',
  description:
    'Sign in to your Supply Ontario account to access enterprise applications and manage your organization.',
  keywords: ['Sign In', 'Login', 'Supply Ontario', 'Authentication', 'Access'],
}

const Signin = () => {
  return (
    <div className="mx-auto max-w-[544px] space-y-8 py-16">
      <h1 className="heading-h1-base text-so-color-neutral-950 font-raleway font-bold">
        Sign in
      </h1>
      <SignInForm />
    </div>
  )
}

export default Signin
