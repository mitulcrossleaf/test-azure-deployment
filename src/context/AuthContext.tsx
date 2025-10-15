'use client'

import { CircularLoader } from '@/components/common'
import {
  clearUserLocalStorage,
  deleteCookie,
  getCookie,
  getLocalStorageItem,
  setCookie,
  setLocalStorageItem,
  STORAGE_KEYS,
} from '@/helper'
import { loginRequest } from '@/lib'
import {
  apiService,
  authService,
  userRoleService,
  userService,
} from '@/services'
import {
  AuthContextType,
  AuthState,
  GeneticContextProviderProps,
} from '@/types/global'
import {
  ApiError,
  UserDetails,
  UserResponse,
  UserRoleType,
} from '@/types/services'
import { AccountInfo } from '@azure/msal-browser'
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'

// Initial state
const initialState: AuthState = {
  account: null,
  isAuthenticated: false,
  isLoading: true,
  token: null,
  userId: null,
  userRole: null,
  userDetails: null,
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<GeneticContextProviderProps> = ({
  children,
}) => {
  const [account, setAccount] = useState<AccountInfo | null>(
    initialState.account
  )
  const [isAuthenticated, setIsAuthenticated] = useState(
    initialState.isAuthenticated
  )

  const [isLoading, setIsLoading] = useState(initialState.isLoading)
  const [token, setToken] = useState<string | null>(initialState.token)
  const [userId, setUserId] = useState<string | null>(initialState.userId)
  const [userRole, setUserRole] = useState<string | null>(initialState.userRole)
  const [userDetails, setUserDetails] = useState<UserDetails | null>(
    initialState.userDetails
  )

  const getUserDetails = useCallback(async () => {
    if (!token || !userId) return
    const response = await userService.getUserById<UserDetails>(
      userId as string
    )
    setUserDetails(response.data)
  }, [token, userId])

  const getUserByEmail = useCallback(async (email: string) => {
    try {
      // Check localStorage first
      const storedUserId = getLocalStorageItem<string>(STORAGE_KEYS.USER_ID)
      if (storedUserId) {
        setUserId(storedUserId)
        return { userId: storedUserId }
      }

      // Set the token on the user service instance
      const response = await userService.getUserByEmail<UserResponse>(email)
      if (response.data?.userId) {
        setUserId(response.data.userId)
        // Store in localStorage
        setLocalStorageItem(STORAGE_KEYS.USER_ID, response.data.userId)
      }
      return response?.data
    } catch (error) {
      console.error('Error fetching user by email:', error)
      throw error
    }
  }, [])

  const getUserRole = useCallback(async (id: string) => {
    try {
      // Check localStorage first
      const storedUserRole = await getCookie(STORAGE_KEYS.USER_ROLE)
      if (storedUserRole) {
        setUserRole(storedUserRole)
        return { data: { roleName: storedUserRole } }
      }

      // Set the token on the API service instance
      const response = await userRoleService.getUserRoleById<UserRoleType>(id)
      if (response.data?.roleName) {
        setUserRole(response.data.roleName)
        // Store in localStorage
        await setCookie(STORAGE_KEYS.USER_ROLE, response.data.roleName)
      }
      return response
    } catch (error) {
      throw error
    }
  }, [])

  // Initialize authentication
  const initializeAuth = useCallback(async () => {
    try {
      setIsLoading(true)

      // Check localStorage for existing user data first
      const storedUserId = getLocalStorageItem<string>(STORAGE_KEYS.USER_ID)
      const storedUserRole = await getCookie(STORAGE_KEYS.USER_ROLE)

      // Handle redirect response if coming back from MS login
      const redirectResult = await authService.handleRedirectPromise()
      if (redirectResult && redirectResult?.account && redirectResult?.token) {
        setAccount(redirectResult?.account)
        setIsAuthenticated(true)
        setToken(redirectResult?.token)

        // If we have stored data, use it, otherwise fetch from API
        if (storedUserId && storedUserRole) {
          setUserId(storedUserId)
          setUserRole(storedUserRole)
        } else {
          const user = await getUserByEmail(redirectResult?.account?.username)
          await getUserRole(user?.userId)
        }
      } else {
        const isAuthenticated = await authService.isAuthenticated()
        if (isAuthenticated) {
          setIsAuthenticated(true)
          const acc = await authService.getAccount()
          const t = await authService.getAccessToken()
          if (acc) {
            setAccount(acc)
          }
          if (t) {
            setToken(t)

            // If we have stored data, use it, otherwise fetch from API
            if (storedUserId && storedUserRole) {
              setUserId(storedUserId)
              setUserRole(storedUserRole)
            } else {
              const user = await getUserByEmail(acc?.username ?? '')
              await getUserRole(user?.userId)
            }
          }
        } else {
          setIsAuthenticated(false)
          // Clear localStorage if not authenticated
          clearUserLocalStorage()
        }
      }
    } catch (error) {
      const apiError = error as ApiError
      console.log(apiError)
      // Clear localStorage on authentication error
      clearUserLocalStorage()
    } finally {
      setIsLoading(false)
    }
  }, [getUserByEmail, getUserRole])

  const login = useCallback(async () => {
    try {
      await authService.loginPopup(loginRequest)
    } catch {}
  }, [])

  const logout = useCallback(async () => {
    try {
      authService.clearAccountCache()
      apiService.clearAuthToken()
      await apiService.clearCache()
      await deleteCookie(STORAGE_KEYS.SO_AUTH)
      // await deleteCookie(STORAGE_KEYS.USER_ROLE)

      // Clear all localStorage data
      clearUserLocalStorage()

      await authService.logoutPopup()

      // Reset state
      setAccount(null)
      setIsAuthenticated(false)
      setToken(null)
      setUserId(null)
      setUserRole(null)
    } catch {}
  }, [])

  // Handle session expiry and token refresh
  // const handleSessionExpiry = useCallback(async () => {
  //   try {
  //     // Clear localStorage and cookies
  //     clearUserLocalStorage()
  //     await deleteCookie(STORAGE_KEYS.SO_AUTH)
  //     await deleteCookie(STORAGE_KEYS.USER_ROLE)

  //     // Reset state
  //     setAccount(null)
  //     setIsAuthenticated(false)
  //     setToken(null)
  //     setUserId(null)
  //     setUserRole(null)

  //     // Clear MSAL cache
  //     authService.clearAccountCache()
  //     apiService.clearAuthToken()
  //     await apiService.clearCache()
  //   } catch (error) {
  //     console.error('Error handling session expiry:', error)
  //   }
  // }, [])

  // // Monitor for session expiry by checking token validity periodically
  // useEffect(() => {
  //   if (!isAuthenticated) return

  //   const checkTokenValidity = async () => {
  //     try {
  //       await authService.getAccessToken()
  //     } catch {
  //       await handleSessionExpiry()
  //     }
  //   }

  //   // Check token validity every 5 minutes
  //   const interval = setInterval(checkTokenValidity, 5 * 60 * 1000)

  //   return () => clearInterval(interval)
  // }, [isAuthenticated, handleSessionExpiry])

  // On mount, initialize authentication
  useEffect(() => {
    initializeAuth()
  }, [initializeAuth])

  useEffect(() => {
    getUserDetails()
  }, [getUserDetails])

  const contextValue: AuthContextType = useMemo(
    () => ({
      account,
      isAuthenticated,
      isLoading,
      token,
      userId,
      userRole,
      login,
      logout,
      userDetails,
    }),
    [
      account,
      isAuthenticated,
      isLoading,
      login,
      logout,
      token,
      userId,
      userRole,
      userDetails,
    ]
  )

  if (isLoading) {
    return <CircularLoader />
  }

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  )
}

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export default AuthContext
