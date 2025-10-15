import { USER_STATUS } from '@/constants'
import { AllOrgType, OrganizationType } from '@/types/services'

export const transformAllOrg = (data: OrganizationType[]): AllOrgType[] => {
  return data.map(org => ({
    organizationId: org.organizationId,
    name: org.displayName || org?.legalName,
    type: org.organizationType,
    status:
      org.status === USER_STATUS.PENDINGAPPROVAL
        ? USER_STATUS.PENDING_APPROVAL
        : org.status,
    createdAt: org.createdAt,
  }))
}
