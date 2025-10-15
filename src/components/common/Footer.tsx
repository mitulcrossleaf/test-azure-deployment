import { Linkedin, Twitter } from '@/assets'
import { FOOTER_GENERAL_LINKS, FOOTER_NAVIGATION_DATA } from '@/constants'
import { Logo } from '@components/ui'
import Link from 'next/link'

const Footer = () => {
  return (
    <div className="relative flex w-full flex-col items-center">
      <div className="bg-so-color-neutral-200 w-full">
        <div className="container grid grid-cols-1 justify-center gap-4 py-8 md:grid-cols-12 md:gap-8 md:py-16">
          <div className="flex w-full flex-col items-start gap-4 md:col-span-4 md:gap-8">
            <div className="flex w-full items-center justify-start gap-8">
              <Logo
                appearance="neutral"
                variant="dark"
                className="flex max-w-[140px] items-center justify-center gap-2.5 sm:max-w-none md:gap-3"
              />
              <div className="flex items-center gap-6">
                <Linkedin className="text-so-color-neutral-black cursor-pointer" />
                <Twitter className="text-so-color-neutral-black cursor-pointer" />
              </div>
            </div>
            <p className="body-base font-open-sans text-so-color-neutral-black">
              At Supply Ontario, we believe that modernizing procurement is a
              key driver of success for Ontario&apos;s public sector.
            </p>
          </div>
          <div className="flex w-full flex-col items-start gap-4 md:col-span-8 md:flex-row md:flex-wrap md:items-center md:justify-end md:gap-8">
            {FOOTER_NAVIGATION_DATA.map(data => (
              <Link
                href={data.link}
                key={data.id}
                className="body-link text-so-color-neutral-black font-bold"
              >
                {data.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
      <div className="bg-so-color-neutral-300 w-full">
        <div className="container grid grid-cols-1 gap-8 py-4 md:grid-cols-12">
          <div className="row-start-2 w-full md:col-span-3 md:row-start-1">
            <p className="body-bold text-so-color-neutral-black">
              ©2025 Supply Ontario
            </p>
          </div>
          <div className="row-start-1 w-full md:col-span-9 md:row-start-1">
            <div className="flex flex-col items-start gap-4 md:flex-row md:flex-wrap md:items-center md:justify-end md:gap-8">
              {FOOTER_GENERAL_LINKS.map(data => (
                <Link
                  key={data.id}
                  href={data.link}
                  className="body-link text-so-color-neutral-black"
                >
                  {data.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Footer
