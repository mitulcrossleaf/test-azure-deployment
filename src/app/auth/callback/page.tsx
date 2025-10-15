'use client'

import { CircularLoader } from '@/components/common'
import { Providers } from '@/context'
import { deleteCookie, setCookie, STORAGE_KEYS } from '@/helper'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function AuthCallbackPage() {
  const router = useRouter()
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>(
    'loading'
  )
  const [message, setMessage] = useState('Processing authentication...')

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Get URL fragment (everything after #)
        const fragment = window.location.hash.substring(1) // Remove the # symbol
        if (!fragment) {
          setStatus('error')
          setMessage('No authentication data received')
          setTimeout(() => router.push('/signin'), 2000)
          return
        }

        // Parse fragment parameters
        const params = new URLSearchParams(fragment)
        const code = params.get('code')
        const state = params.get('state')
        const error = params.get('error')
        const errorDescription = params.get('error_description')
        const clientInfo = params.get('client_info')
        const _sessionState = params.get('session_state')

        // Check for authentication errors
        if (error) {
          setStatus('error')
          setMessage(`Authentication failed: ${errorDescription || error}`)
          setTimeout(() => router.push('/signin'), 3000)
          return
        }

        // Validate required parameters
        if (!code || !state || !clientInfo) {
          setStatus('error')
          setMessage('Missing required authentication parameters')
          setTimeout(() => router.push('/signin'), 2000)
          return
        }

        console.log('Authentication successful! Redirecting to dashboard...')
        // Authentication successful - set cookie
        await deleteCookie(STORAGE_KEYS.USER_ROLE)
        await setCookie(STORAGE_KEYS.SO_AUTH, 'true')

        setStatus('success')
        setMessage('Authentication successful! Redirecting to dashboard...')

        // Redirect to dashboard
        setTimeout(() => router.push('/'), 1500)
      } catch (error) {
        console.error('Auth callback error:', error)
        setStatus('error')
        setMessage('An error occurred during authentication')
        setTimeout(() => router.push('/signin'), 2000)
      }
    }

    handleAuthCallback()
  }, [router])
  if (status === 'success' || status === 'loading') {
    return (
      <Providers>
        <CircularLoader />
      </Providers>
    )
  }

  return (
    <Providers>
      <div className="flex min-h-screen items-center justify-center">
        <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-md">
          <div className="text-center">
            {status === 'error' && (
              <div className="mb-4 text-4xl text-red-600">✗</div>
            )}

            <h2 className="mb-2 text-xl font-semibold text-gray-900">
              {status === 'error' && 'Authentication Failed'}
            </h2>

            <p className="text-gray-600">{message}</p>
          </div>
        </div>
      </div>
    </Providers>
  )
}
