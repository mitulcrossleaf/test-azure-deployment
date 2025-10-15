// lib/msalConfig.ts
import { Configuration, PopupRequest } from '@azure/msal-browser'
import AppConfig from './config'
export const msalConfig: Configuration = {
  auth: {
    clientId: AppConfig.AZURE_AD_CLIENT_ID,
    authority: `https://login.microsoftonline.com/${AppConfig.AZURE_AD_TENANT_ID}`,
    redirectUri: AppConfig.REDIRECT_URI || 'http://localhost:3000',
    navigateToLoginRequestUrl: false,
  },
  cache: {
    cacheLocation: 'localStorage',
    storeAuthStateInCookie: true,
  },
}

export const loginRequest: PopupRequest = {
  scopes: ['https://crossleaf.ca/aum-api/AUM-FrontEnd'],
}

// For API calls
export const apiRequest = {
  scopes: ['https://crossleaf.ca/aum-api/AUM-FrontEnd'],
}
