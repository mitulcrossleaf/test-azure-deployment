/**
 * Generic localStorage utility functions
 */

// Storage keys constants for userId and userRole
export const STORAGE_KEYS = {
  USER_ID: 'so_user_id',
  USER_ROLE: 'so_user_role',
  CREATE_ORG_FORM: 'so_create_org_form',
  INVITE_USER_FORM: 'so_invite_user_form',
  ADD_APPLICATION_FORM: 'so_add_application_form',
  SO_AUTH: 'so_auth',
} as const

export type StorageCookieKey = keyof typeof STORAGE_KEYS

/**
 * Generic function to set data in localStorage
 * @param key - The key to store the data under
 * @param value - The value to store (will be JSON stringified)
 */
export const setLocalStorageItem = <T>(key: string, value: T): void => {
  try {
    if (typeof window !== 'undefined') {
      localStorage.setItem(key, JSON.stringify(value))
    }
  } catch (error) {
    console.error(`Error setting localStorage item ${key}:`, error)
  }
}

/**
 * Generic function to get data from localStorage
 * @param key - The key to retrieve the data from
 * @returns The parsed value or null if not found/error
 */
export const getLocalStorageItem = <T>(key: string): T | null => {
  try {
    if (typeof window !== 'undefined') {
      const item = localStorage.getItem(key)
      return item ? JSON.parse(item) : null
    }
    return null
  } catch (error) {
    console.error(`Error getting localStorage item ${key}:`, error)
    return null
  }
}

/**
 * Remove a specific item from localStorage
 * @param key - The key to remove
 */
export const removeLocalStorageItem = (key: string): void => {
  try {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(key)
    }
  } catch (error) {
    console.error(`Error removing localStorage item ${key}:`, error)
  }
}

/**
 * Clear specific user-related localStorage items (userId and userRole)
 */
export const clearUserLocalStorage = (): void => {
  try {
    if (typeof window !== 'undefined') {
      Object.values(STORAGE_KEYS).forEach(key => {
        localStorage.removeItem(key)
      })
    }
  } catch (error) {
    console.error('Error clearing user localStorage:', error)
  }
}
