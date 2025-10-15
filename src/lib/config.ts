const AppConfig = {
  AZURE_AD_CLIENT_ID: process.env.NEXT_PUBLIC_AZURE_AD_CLIENT_ID ?? '',
  AZURE_AD_CLIENT_SECRET: process.env.NEXT_PUBLIC_AZURE_AD_CLIENT_SECRET ?? '',
  AZURE_AD_TENANT_ID: process.env.NEXT_PUBLIC_AZURE_AD_TENANT_ID ?? '',
  REDIRECT_URI: process.env.NEXT_PUBLIC_REDIRECT_URI ?? '',
  API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL ?? '',
}

export default AppConfig
