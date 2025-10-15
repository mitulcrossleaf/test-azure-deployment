export interface ApplicationRole {
  // Define application role properties when available
  [key: string]: unknown
}

export interface ApplicationTypeOption {
  applictaionTypeId: string
  applictaionTypeName: string
  isActive: boolean
  createdAt: string
  createdBy: string | null
  modifiedAt: string
  modifiedBy: string | null
}

export interface CreateApplicationPayload {
  name: string
  description: string
  applictaionTypeId: string
  availableTo: string
  applictaionIcon: string
  url: string
  loginUserId: string
}

export type ApplicationType = {
  applicationId: string
  name: string
  displayName: string
  description: string
  clientId: string | null
  isActive: boolean
  apiEndpoint: string | null
  createdAt: string
  createdBy: string
  modifiedAt: string
  modifiedBy: string | null
  applictaionTypeId: string
  applictaionTypeName: string
  availableTo: string
  applictaionIcon: string
  url: string
  status: string
  applicationRoles: ApplicationRole[]
}
