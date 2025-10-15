import ArrowForward from '@/assets/ArrowForward'
import { cn } from '@/lib/utils'
export type AlertAppearance = 'warning' | 'information'

export type AlertCardProps = {
  appearance?: AlertAppearance
  date?: string
  title?: string
  excerpt?: string
  showExcerpt?: boolean
  href?: string
  onClick?: () => void
  className?: string
}

const appearanceStyles: Record<
  AlertAppearance,
  { bg: string; bgHover: string; bgPressed: string; textAccent: string }
> = {
  warning: {
    bg: 'bg-so-color-yellow-50',
    bgHover: 'hover:bg-so-color-yellow-100',
    bgPressed: 'active:bg-so-color-yellow-200',
    textAccent: 'text-so-color-yellow-700',
  },
  information: {
    bg: 'bg-so-color-sky-50',
    bgHover: 'hover:bg-so-color-sky-100',
    bgPressed: 'active:bg-so-color-sky-200',
    textAccent: 'text-so-color-sky-700',
  },
}

export default function AlertCard(props: AlertCardProps) {
  const {
    appearance = 'warning',
    date = 'August 3, 2025',
    title = 'Card Title',
    excerpt = 'Write a blurb that contains a strong call-to-action and a concise description about a single topic',
    showExcerpt = true,
    onClick,
    className,
  } = props

  const styles = appearanceStyles[appearance]

  return (
    <div
      tabIndex={0}
      className={cn(
        'group focus:ring-so-color-sky-500 relative flex h-full w-full flex-col gap-4 rounded-2xl p-6 hover:shadow-md focus:ring-4 focus:ring-offset-4 focus-visible:outline-none',
        styles.bg,
        styles.bgHover,
        styles.bgPressed,
        className
      )}
    >
      <i
        className={cn(
          'material-symbols-outlined mt-1 size-6 shrink-0',
          styles.textAccent
        )}
      >
        warning
      </i>

      <div className="flex min-w-0 flex-col gap-4">
        {date ? (
          <p className="text-so-color-neutral-black body-base">{date}</p>
        ) : null}
        <h3 className="font-raleway text-so-color-neutral-950 heading-h3-base font-bold">
          {title}
        </h3>
      </div>
      {showExcerpt && excerpt ? (
        <p className="text-so-color-neutral-950 body-base">{excerpt}</p>
      ) : null}
      <div onClick={onClick} className="mt-2">
        <ArrowForward
          className={
            'text-so-color-neutral-900 size-5 transition-transform group-hover:translate-x-1'
          }
        />
      </div>
    </div>
  )
}
