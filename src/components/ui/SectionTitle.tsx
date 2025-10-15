import { cn } from '@/lib/utils'
import Skeleton from 'react-loading-skeleton'
import Button, { ButtonProps } from './Button'

type SectionTitleAppearance = 'h2-lg' | 'h2-md'

export type SectionTitleProps = {
  apperance: SectionTitleAppearance
  title: string
  lead?: boolean
  leadLabel?: string
  button?: ButtonProps
  className?: string
  mainClassName?: string
  loading?: boolean
}

const headingStyles: Record<
  NonNullable<SectionTitleProps['apperance']>,
  string
> = {
  'h2-lg': 'heading-h2-lg',
  'h2-md': 'heading-h2-base',
}

const leadStyles: Record<
  NonNullable<SectionTitleProps['apperance']>,
  string
> = {
  'h2-lg': 'body-2xl',
  'h2-md': 'body-xl',
}

const SectionTitle = ({
  apperance,
  lead = false,
  title,
  button,
  leadLabel,
  className,
  mainClassName,
  loading = false,
}: SectionTitleProps) => {
  return (
    <div className={cn('container', mainClassName)}>
      {loading ? (
        <Skeleton className="!w-[80%] sm:!w-[30%]" height={36} />
      ) : (
        <div className="flex w-full items-center justify-center gap-8 sm:pt-8">
          <div className="flex flex-1 flex-col">
            <h2
              className={cn(
                headingStyles[apperance],
                'text-so-color-neutral-950 font-raleway font-bold',
                className
              )}
            >
              {title}
            </h2>
            {lead && (
              <p
                className={cn(
                  leadStyles[apperance],
                  'text-so-color-neutral-600 font-open-sans'
                )}
              >
                {leadLabel}
              </p>
            )}
          </div>
          {button && <Button {...button} />}
        </div>
      )}
    </div>
  )
}

export default SectionTitle
