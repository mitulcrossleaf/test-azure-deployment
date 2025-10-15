// Add global types here

import { AccountInfo } from '@azure/msal-browser'
import { ProvinceOption, UserDetails, UserRoleDropdown } from './services'

export type IconPropsType = {
  className?: string
  width?: number
  height?: number
}

export type Mode = 'light' | 'dark'

export type CookieOptions = {
  path?: string
  maxAge?: number
  httpOnly?: boolean
  secure?: boolean
  sameSite?: 'lax' | 'strict' | 'none'
  domain?: string
}

export interface AuthState {
  account: AccountInfo | null
  isAuthenticated: boolean
  isLoading: boolean
  token: string | null
  userId: string | null
  userRole: string | null
  userDetails: UserDetails | null
}

export interface AuthContextType extends AuthState {
  login: () => Promise<void>
  logout: () => Promise<void>
}

export interface GeneticContextProviderProps {
  children: React.ReactNode
}

export interface DataContextType {
  roles: UserRoleDropdown[]
  fetchRoles: () => Promise<void>
  provinces: ProvinceOption[]
  fetchProvinces: () => Promise<void>
  loadingProvinces: boolean
}

export interface SonnarContextType {
  showSonnar: (options: {
    type?: 'success' | 'danger' | 'information' | 'warning' | 'discovery'
    label: string
    message?: string | React.ReactNode
    validationErrors?: string[]
  }) => void
}
