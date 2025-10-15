// services/tokenService.ts
import { loginRequest, msalConfig } from '@/lib'
import {
  AccountInfo,
  PopupRequest,
  PublicClientApplication,
  SilentRequest,
} from '@azure/msal-browser'

export class AuthService {
  private msalInstance: PublicClientApplication

  constructor() {
    this.msalInstance = new PublicClientApplication(msalConfig)
  }

  async initialize() {
    await this.msalInstance.initialize()
  }

  async getAccessToken(
    scopes: string[] = loginRequest.scopes
  ): Promise<string> {
    await this.initialize()

    const accounts = this.msalInstance.getAllAccounts()
    if (accounts.length === 0) {
      throw new Error('No authenticated accounts found')
    }

    const account = accounts[0]
    if (!account) {
      throw new Error('No account found')
    }

    try {
      const silentRequest: SilentRequest = {
        scopes,
        account,
      }

      // This will automatically handle token refresh if needed
      const response = await this.msalInstance.acquireTokenSilent(silentRequest)
      return response.accessToken
    } catch (error) {
      // If it's a login_required error, the session might have expired
      if (error instanceof Error && error.message.includes('login_required')) {
        // Clear the MSAL cache and force re-authentication
        await this.clearAccountCache()
        throw new Error('Session expired. Please sign in again.')
      }

      throw error
    }
  }

  async getAccount(): Promise<AccountInfo | null | undefined> {
    await this.initialize()
    const accounts = this.msalInstance.getAllAccounts()
    return accounts.length > 0 ? accounts[0] : null
  }

  async loginPopup(request: PopupRequest) {
    await this.initialize()
    return await this.msalInstance.loginRedirect(request)
  }

  async logoutPopup() {
    await this.initialize()
    return await this.msalInstance.logoutRedirect({
      postLogoutRedirectUri: '/signin',
    })
  }

  async clearAccountCache() {
    await this.msalInstance.clearCache()
  }

  async getAllAccounts() {
    await this.initialize()
    return this.msalInstance.getAllAccounts()
  }

  async isAuthenticated(): Promise<boolean> {
    await this.initialize()
    return this.msalInstance.getAllAccounts().length > 0
  }

  async handleRedirectPromise(): Promise<{
    account: AccountInfo | undefined
    token: string
  } | null> {
    await this.initialize()
    try {
      const result = await this.msalInstance.handleRedirectPromise()
      if (result) {
        // User just logged in via redirect
        const account = result.account
        const token = await this.getAccessToken()
        return { account, token }
      } else {
        // Check if already logged in
        const currentAccounts = await this.getAllAccounts()
        if (currentAccounts.length > 0) {
          const account = currentAccounts[0]
          const token = await this.getAccessToken()
          return { account, token }
        }
      }
      return null
    } catch (error) {
      throw error
    }
  }
}

// Singleton instance
export const authService = new AuthService()
