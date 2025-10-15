export const formatNumber = (num: number) => {
  return new Intl.NumberFormat('en-US').format(num)
}

export * from './cookieUtils'
export * from './getDayDiffrence'
export * from './localstorageAdapter'
export * from './localStorageUtils'
export * from './transformAllOrgData'
