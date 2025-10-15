import { ArrowBack, ArrowForward } from '@/assets'
import { Button } from '@/components/ui'
import { PersonaCopyType, PersonaMenuProps } from '@/types/component'
import Link from 'next/link'

const PERSONA_COPY: PersonaCopyType = {
  buyer: {
    heading: 'Start the buying process',
    description:
      'Find trusted vendors, explore licensing agreements, and get the support you need to buy with confidence.',
    cta: 'Register as a Buyer',
    resourcesLabel: 'Explore all buyer resources',
    list: [
      'Contract search',
      'Second Stage Selector',
      'BOBI guide for buyers',
      'Why work with us',
    ],
  },
  vendor: {
    heading: 'Start selling to the government',
    description:
      "Register as a vendor to access procurement opportunities and grow your business through Ontario's Vendor of Record program.",
    cta: 'Register as a Vendor',
    resourcesLabel: 'Explore all vendor resources',
    list: [
      'Opportunities search',
      'How to get on a VOR',
      'Guides for vendors',
      'Why work with us',
    ],
  },
}

export default function MobileBuyerVendorMenu({
  type,
  onBack,
}: PersonaMenuProps) {
  const copy = PERSONA_COPY[type]

  return (
    <div className="h-full min-h-[100dvh] overflow-y-auto py-6">
      <div className="flex items-center gap-2 px-4">
        <Button
          aria-label="Back"
          appearance="ghost"
          semantic={type}
          iconLeading
          icon={<ArrowBack />}
          label="Back"
          className="cursor-pointer"
          onClick={onBack}
        />
      </div>

      <div className="h-full px-4 py-6">
        <div className="bg-so-color-sky-100 rounded-2xl p-6">
          <div className="text-so-color-neutral-950 flex flex-col gap-4">
            <h2 className="heading-h3-base font-bold">{copy.heading}</h2>
            <p className="body-xl">{copy.description}</p>
          </div>
          <div className="mt-6">
            <Button
              appearance="primary"
              semantic={type}
              theme="light"
              iconTrailing
              icon={<ArrowForward className="text-white" />}
              label={copy.cta}
              className="px-6"
            />
          </div>
        </div>

        <div className="mt-6">
          <ul className="divide-so-color-neutral-200 divide-y">
            {copy.list.map(item => (
              <li
                key={item}
                className="flex cursor-pointer items-center justify-between py-6"
                role="button"
                tabIndex={0}
              >
                <span className="font-open-sans text-s0-color-neutral-950 text-[18px] leading-7 font-bold">
                  {item}
                </span>
                <ArrowForward />
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-4">
          <Link
            href="#"
            className={` ${type === 'buyer' ? 'text-so-color-persona-buyer-600' : 'text-so-color-persona-vendor-600'} cursor-pointer underline`}
          >
            {copy.resourcesLabel}
          </Link>
        </div>
      </div>
    </div>
  )
}
