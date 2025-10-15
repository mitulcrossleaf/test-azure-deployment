export interface Province {
  provincesId: string
  provinceOrder: number
  provinceEnName: string
  provinceCode: string
  createdAt: string
  createdBy: string
  modifiedAt: string
  modifiedBy: string | null
}

export interface ProvinceOption {
  value: string
  label: string
}
