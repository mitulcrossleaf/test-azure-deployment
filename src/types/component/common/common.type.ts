export type NavbarProps = {
  variant?: 'general' | 'buyer' | 'vendor'
  location?: 'website' | 'app'
  theme?: 'dark' | 'light'
  soLogoApperance: 'neutral' | 'general' | 'buyer' | 'vendor'
  soLogoTheme: 'dark' | 'light'
  userMenu: boolean
}

export type PersonaType = 'buyer' | 'vendor'

export type PersonaCopyType = Record<
  PersonaType,
  {
    heading: string
    description: string
    cta: string
    resourcesLabel: string
    list: string[]
  }
>

export type PersonaMenuProps = {
  type: PersonaType
  onBack: () => void
}

export type MobileSidebarProps = {
  className?: string
  variant?: 'general' | 'buyer' | 'vendor'
  isOpen?: boolean
  onOpenChange?: (open: boolean) => void
}

export type PersonaMegaMenuSection = {
  title: string
  description: string
  link?: string
  linkLabel?: string
}

export type PersonaMegaMenuProps = {
  persona: 'buyer' | 'vendor'
  heading: string
  description: string
  buttonLabel: string
  sections: PersonaMegaMenuSection[]
  resourcesLink: string
  resourcesLabel: string
}
