import { cn } from '@/lib/utils'

type SubSectionTitleAppearance = 'h3-lg' | 'h3-md'

export type SubSectionTitleProps = {
  apperance: SubSectionTitleAppearance
  title: string
  lead?: boolean
  leadLabel?: string
  className?: string
  mainClassName?: string
}

const headingStyles: Record<
  NonNullable<SubSectionTitleProps['apperance']>,
  string
> = {
  'h3-lg': 'heading-h3-lg',
  'h3-md': 'heading-h3-base',
}

const leadStyles: Record<
  NonNullable<SubSectionTitleProps['apperance']>,
  string
> = {
  'h3-lg': 'text-base',
  'h3-md': 'text-base',
}

const SubSectionTitle = ({
  apperance,
  lead = false,
  title,
  leadLabel,
  className,
  mainClassName,
}: SubSectionTitleProps) => {
  return (
    <div className={cn('', mainClassName)}>
      <h3
        className={cn(
          headingStyles[apperance],
          'text-so-color-neutral-950 font-raleway font-bold',
          className
        )}
      >
        {title}
      </h3>
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
  )
}

export default SubSectionTitle
