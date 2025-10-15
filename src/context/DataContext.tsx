'use client'

import { provinceService, userRoleService } from '@/services'
import { DataContextType, GeneticContextProviderProps } from '@/types/global'
import {
  ApiError,
  Province,
  ProvinceOption,
  UserRoleDropdown,
} from '@/types/services'
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { useAuth } from './AuthContext'
import { useSonnar } from './SonnarProvider'

const DataContext = createContext<DataContextType | undefined>(undefined)

export const DataProvider: React.FC<GeneticContextProviderProps> = ({
  children,
}) => {
  const { token } = useAuth()
  const { showSonnar } = useSonnar()
  const [roles, setRoles] = useState<UserRoleDropdown[]>([])
  const [provinces, setProvinces] = useState<ProvinceOption[]>([])
  const [loadingProvinces, setLoadingProvinces] = useState(true)

  const fetchRoles = useCallback(async () => {
    if (!token) return

    try {
      const response =
        await userRoleService.getUserRoles<
          Array<{ userRoleId: string; roleName: string }>
        >()

      const formattedRoles = response.data.map(role => ({
        value: role.userRoleId,
        label: role.roleName,
      }))

      setRoles(formattedRoles)
    } catch (error) {
      const APIError = error as ApiError
      showSonnar({
        type: 'danger',
        label: 'Error',
        message:
          APIError.message ?? 'Failed to load provinces. Please try again.',
      })
    }
  }, [token, showSonnar])

  const fetchProvinces = useCallback(async () => {
    if (!token) return
    try {
      setLoadingProvinces(true)
      const response = await provinceService.getProvinces<Province[]>()

      if (response.data) {
        const provinceOptions: ProvinceOption[] = response.data
          .sort((a: Province, b: Province) => a.provinceOrder - b.provinceOrder)
          .map((province: Province) => ({
            value: province.provincesId,
            label: province.provinceEnName,
          }))
        setProvinces(provinceOptions)
      }
    } catch (error) {
      const APIError = error as ApiError
      showSonnar({
        type: 'danger',
        label: 'Error',
        message:
          APIError.message ?? 'Failed to load provinces. Please try again.',
      })
    } finally {
      setLoadingProvinces(false)
    }
  }, [showSonnar, token])

  useEffect(() => {
    if (token) {
      fetchRoles()
      fetchProvinces()
    }
  }, [token, fetchRoles, fetchProvinces])

  const value = useMemo(
    () => ({ roles, fetchRoles, provinces, fetchProvinces, loadingProvinces }),
    [roles, fetchRoles, provinces, fetchProvinces, loadingProvinces]
  )

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>
}

export const useData = (): DataContextType => {
  const context = useContext(DataContext)
  if (!context) {
    throw new Error('useData must be used within a DataProvider')
  }
  return context
}

export default DataContext
