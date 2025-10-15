'use client'

import { msalConfig } from '@/lib'
import { PublicClientApplication } from '@azure/msal-browser'
import { MsalProvider } from '@azure/msal-react'
import { ReactNode } from 'react'
import { AuthProvider } from './AuthContext'
import { DataProvider } from './DataContext'
import { SonnarProvider } from './SonnarProvider'

const msalInstance = new PublicClientApplication(msalConfig)

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <SonnarProvider>
      <MsalProvider instance={msalInstance}>
        <AuthProvider>
          <DataProvider>{children}</DataProvider>
        </AuthProvider>
      </MsalProvider>
    </SonnarProvider>
  )
}
