import { ArrowForward } from '@/assets'
import { Button } from '@/components/ui'
import { PersonaMegaMenuProps } from '@/types/component'
import Link from 'next/link'

const PersonaMegaMenu = ({
  persona,
  heading,
  description,
  buttonLabel,
  sections,
  resourcesLink,
  resourcesLabel,
}: PersonaMegaMenuProps) => {
  const bgColor =
    persona === 'buyer'
      ? 'bg-so-color-persona-buyer-100'
      : 'bg-so-color-persona-vendor-100'
  const resourceTextColor =
    persona === 'buyer'
      ? 'text-so-color-persona-buyer-600'
      : 'text-so-color-persona-vendor-600'

  return (
    <div
      className={`${bgColor} w-full overflow-hidden`}
      onClick={e => e.stopPropagation()}
      data-name="Megamenu-Wrapper"
    >
      <div className="relative container flex w-full">
        <div className={`${bgColor} flex w-[320px] flex-col gap-8 p-8 pl-0`}>
          <h2 className="heading-h2-lg text-so-color-neutral-950 mb-2 font-bold">
            {heading}
          </h2>
          <p className="body-base text-so-color-neutral-950 mb-6">
            {description}
          </p>
          {/* Use custom Button component instead of native button */}
          <Button
            label={buttonLabel}
            appearance="primary"
            semantic={persona}
            theme="light"
            className={`!w-fit px-6 font-bold`}
            iconTrailing={true}
            icon={<ArrowForward />}
          />
        </div>
        <div className="relative grid flex-1 grid-cols-2 gap-8 bg-white py-8 pr-4 pl-8">
          <div className="absolute -right-full h-full w-full bg-white"></div>
          {sections.map((section, idx) => (
            <div
              key={idx}
              className="border-b-so-color-neutral-200 flex min-h-[128px] flex-col gap-4 border-b pb-4"
            >
              <div className="flex items-center gap-3">
                <span className="heading-h4-base text-so-color-neutral-950 font-open-sans font-bold">
                  {section.title}
                </span>
                <ArrowForward />
              </div>
              <p className="body-base text-so-color-neutral-600 w-full max-w-[352px]">
                {section.description}
              </p>
            </div>
          ))}
          <div className="col-span-2 mt-2">
            <Link
              href={resourcesLink}
              className={`body-link ${resourceTextColor}`}
            >
              {resourcesLabel}
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PersonaMegaMenu
