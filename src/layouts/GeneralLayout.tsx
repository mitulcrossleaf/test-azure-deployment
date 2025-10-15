import { Footer, Navbar } from '@/components/common'
import { Providers } from '@/context'

const GeneralLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode
}>) => {
  return (
    <Providers>
      <Navbar
        soLogoApperance="neutral"
        soLogoTheme="light"
        userMenu={false}
        location="app"
      />
      {children}
      <Footer />
    </Providers>
  )
}

export default GeneralLayout
