export interface AddApplicationFormValues {
  applicationType: string
  availableTo: 'internal' | 'external' | 'both' | ''
  applicationName: string
  applicationDescription: string
  applicationIcon: string
  applicationUrl: string
}
