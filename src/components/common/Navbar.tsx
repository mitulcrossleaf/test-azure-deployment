'use client'
import { Button, HeaderLink, Logo, Popup } from '@/components/ui'
import { BUYER_MENU_SECTION, VENDOR_MENU_SECTION } from '@/constants'
import { useAuth } from '@/context'
import { cn } from '@/lib'
import { NavbarProps } from '@/types/component'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useMemo, useRef, useState } from 'react'
import PersonaMegaMenu from './PersonaMegaMenu'

const Navbar = ({
  variant = 'general',
  location = 'website',
  theme = 'light',
  soLogoApperance,
  soLogoTheme,
}: NavbarProps) => {
  const { account, isAuthenticated, logout, userDetails } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const bgColor = useMemo(() => {
    switch (variant) {
      case 'general':
        return 'bg-so-color-persona-general-950'
      case 'buyer':
        return 'bg-so-color-persona-buyer-950'
      case 'vendor':
        return 'bg-so-color-persona-vendor-950'
      default:
        return ''
    }
  }, [variant])
  const handleLogin = () => {
    router.push('/signin')
  }

  const textColor = useMemo(
    () => (theme === 'dark' ? 'text-white' : 'text-black'),
    [theme]
  )

  const personaSearchIconColor = useMemo(() => {
    switch (variant) {
      case 'general':
        return 'text-so-color-persona-general-400'
      case 'buyer':
        return 'text-so-color-persona-buyer-600'
      case 'vendor':
        return 'text-so-color-persona-vendor-600'
      default:
        return ''
    }
  }, [variant])

  const [showBuyersMenu, setShowBuyersMenu] = useState(false)
  const [showVendorsMenu, setShowVendorsMenu] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const userMenuButtonRef = useRef<HTMLButtonElement | null>(null)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  return (
    <div className={`flex flex-col ${bgColor} ${textColor}`}>
      <div className={`container flex items-center justify-between py-4`}>
        <Logo
          appearance={soLogoApperance}
          variant={soLogoTheme}
          className="flex max-w-[140px] sm:max-w-none md:hidden"
          logoSvgSize="48"
          logotextHeight="44"
          logotextWidth="92"
        />
        <Logo
          appearance={soLogoApperance}
          variant={soLogoTheme}
          className="hidden md:flex"
        />
        <div className="flex items-center gap-3">
          <Button
            appearance="ghost"
            label="Français"
            className="hidden lg:block"
            semantic={variant}
            theme="dark"
          />
          <Button
            appearance="ghost"
            label="Fr"
            semantic={variant}
            theme="dark"
            className="block min-w-12 lg:hidden"
          />
          <Button
            appearance="ghost"
            label="Get help"
            semantic={variant}
            className="hidden lg:block"
            theme="dark"
          />
          <Button
            appearance="ghost"
            semantic={variant}
            theme="dark"
            iconOnly={true}
            icon={
              <i
                className={cn(
                  personaSearchIconColor,
                  'material-symbols-outlined'
                )}
              >
                search
              </i>
            }
          />
          <Button
            labelClassName="hidden md:block"
            appearance="neutral"
            label="Menu"
            semantic={variant}
            theme="dark"
            className="block min-w-12 md:min-w-auto lg:hidden"
            iconLeading
            icon={
              !isMobileMenuOpen ? (
                <i className="material-symbols-outlined">menu</i>
              ) : (
                <i className="material-symbols-outlined">close</i>
              )
            }
            onClick={() => setIsMobileMenuOpen(p => !p)}
          />
        </div>
      </div>
      <div
        className={cn(
          location === 'app' ? 'py-2.5' : '',
          'relative hidden border-y border-white/15 lg:block'
        )}
      >
        <div className="container flex items-center justify-between">
          {location === 'app' ? (
            <Button
              appearance="ghost"
              label="Back to SupplyOntario.ca"
              semantic="general"
              theme="dark"
              iconLeading={true}
              icon={
                <i className="material-symbols-outlined !text-2xl">
                  arrow_back
                </i>
              }
            />
          ) : (
            <div className="flex items-center justify-start">
              <div
                onMouseEnter={() => setShowBuyersMenu(true)}
                onMouseLeave={() => setShowBuyersMenu(false)}
              >
                <HeaderLink
                  label="Buyer"
                  isOpenUserMenu={showBuyersMenu}
                  appearance={showBuyersMenu ? 'buyer' : 'general'}
                  isIconTrailing={true}
                  theme={showBuyersMenu ? 'light' : 'dark'}
                  link="/buyer"
                  className={cn(
                    'border-t-4 border-t-transparent',
                    pathname === '/buyer'
                      ? 'border-so-color-persona-buyer-600'
                      : 'hover:border-so-color-persona-buyer-100'
                  )}
                />
                {showBuyersMenu && (
                  <div className="absolute top-full right-0 left-0 z-50 shadow-xl transition-all duration-300 ease-out">
                    <PersonaMegaMenu
                      persona="buyer"
                      heading="Start the buying process"
                      description="Find trusted vendors, explore licensing agreements, and get the support you need to buy with confidence."
                      buttonLabel="Register as a Buyer"
                      sections={BUYER_MENU_SECTION}
                      resourcesLink="#"
                      resourcesLabel="Explore all buyer resources"
                    />
                  </div>
                )}
              </div>
              <div
                onMouseEnter={() => setShowVendorsMenu(true)}
                onMouseLeave={() => setShowVendorsMenu(false)}
              >
                <HeaderLink
                  label="Vendors"
                  appearance={showVendorsMenu ? 'vendor' : 'general'}
                  isIconTrailing={true}
                  theme={showVendorsMenu ? 'light' : 'dark'}
                  isOpenUserMenu={showVendorsMenu}
                  link="/vendor"
                  className={cn(
                    'border-t-4 border-t-transparent',
                    pathname === '/vendor'
                      ? 'border-so-color-persona-vendor-600 border-t-4'
                      : 'hover:border-so-color-persona-vendor-100'
                  )}
                />
                {showVendorsMenu && (
                  <div className="absolute top-full right-0 left-0 z-50 shadow-xl transition-all duration-300 ease-out">
                    <PersonaMegaMenu
                      persona="vendor"
                      heading="Start selling to the government"
                      description="Register as a vendor to access procurement opportunities and grow your business through Ontario's Vendor of Record program."
                      buttonLabel="Register as a Vendor"
                      sections={VENDOR_MENU_SECTION}
                      resourcesLink="#"
                      resourcesLabel="Explore all vendor resources"
                    />
                  </div>
                )}
              </div>
              <HeaderLink
                label="Resources"
                appearance="general"
                theme="dark"
                link="/resources"
                className={cn(
                  pathname === '/resources'
                    ? 'border-so-color-persona-general-400 border-t-4'
                    : ''
                )}
              />
              <HeaderLink
                label="About"
                appearance="general"
                theme="dark"
                link="#"
                className={cn(
                  pathname === '/about'
                    ? 'border-so-color-persona-general-400 border-t-4'
                    : ''
                )}
              />
            </div>
          )}
          {account && isAuthenticated ? (
            <div className="relative">
              <button
                ref={userMenuButtonRef}
                className="flex items-center gap-2"
                onClick={() => setIsUserMenuOpen(p => !p)}
                aria-haspopup="menu"
                aria-expanded={isUserMenuOpen}
              >
                <div className="bg-so-color-neutral-400 body-bold flex size-8 items-center justify-center rounded-full text-neutral-950">
                  {account.name?.charAt(0)}
                </div>
                <p className="body-bold text-white">{account?.name}</p>
                <i className="material-symbols-outlined text-white">
                  keyboard_arrow_down
                </i>
              </button>
              <Popup
                isOpen={isUserMenuOpen}
                onClose={() => setIsUserMenuOpen(false)}
                position="bottom-left"
                className="border-so-color-neutral-300 border shadow-sm"
                triggerRef={userMenuButtonRef}
              >
                <div className="overflow-hidden rounded-2xl">
                  <div className="bg-so-color-neutral-200 p-6">
                    <div className="flex flex-col items-start gap-2">
                      <div className="bg-so-color-neutral-600 heading-h3-base flex h-12 w-12 items-center justify-center rounded-full font-bold text-white">
                        {account?.name?.charAt(0)}
                      </div>
                      <div>
                        <p className="text-so-color-neutral-950 heading-h3-base font-bold">
                          {account?.name}
                        </p>
                        <p className="text-so-color-neutral-950/80 body-base">
                          {userDetails?.organization?.displayName ||
                            userDetails?.organization?.legalName}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white py-4">
                    <div className="px-4 py-2">
                      <Link
                        href="/"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="text-so-color-persona-general-600 body-link"
                      >
                        Dashboard
                      </Link>
                    </div>
                    <div className="px-4 py-2">
                      <Link
                        href="#"
                        className="text-so-color-persona-general-600 body-link"
                      >
                        My profile
                      </Link>
                    </div>
                    <div className="px-4 py-3">
                      <button
                        className="text-so-color-red-700 flex items-center gap-2 font-bold"
                        onClick={logout}
                      >
                        <i className="material-symbols-outlined text-so-color-red-700">
                          logout
                        </i>
                        <span>Sign out</span>
                      </button>
                    </div>
                  </div>
                </div>
              </Popup>
            </div>
          ) : (
            <Button
              icon={<i className="material-symbols-outlined">account_circle</i>}
              iconLeading
              label="Login"
              size="base"
              appearance="secondary"
              theme="light"
              semantic="general"
              className="px-6"
              onClick={handleLogin}
            />
          )}
        </div>
      </div>
      {/* <MobileSidebar
        variant={variant}
        isOpen={isMobileMenuOpen}
        onOpenChange={setIsMobileMenuOpen}
      /> */}
    </div>
  )
}

export default Navbar
