import ArrowForward from '@/assets/ArrowForward'
import { cn } from '@/lib/utils'

export type EventCardProps = {
  title?: string
  excerpt?: string
  showExcerpt?: boolean
  href?: string
  onClick?: () => void
  className?: string
  month?: string
  day?: number
}

export default function EventCard(props: EventCardProps) {
  const {
    title = 'Card Title',
    excerpt = 'Write a blurb that contains a strong call-to-action and a concise description about a single topic',
    showExcerpt = true,
    onClick,
    className,
    month = 'sep',
    day = 25,
  } = props

  return (
    <div
      tabIndex={0}
      className={cn(
        'group focus:ring-so-color-sky-500 border-so-color-neutral-300 relative flex h-full w-full flex-col gap-4 rounded-2xl border p-6 hover:shadow-md focus:ring-4 focus:ring-offset-4 focus-visible:outline-none',
        className
      )}
    >
      <div className="flex min-w-0 flex-col gap-4">
        <div className="bg-so-color-persona-general-50 flex size-20 flex-col items-center rounded-lg p-3">
          <div className="body-base text-so-color-persona-general-600 font-sans font-bold uppercase">
            {month}
          </div>
          <div className="body-2xl text-so-color-persona-general-600 font-sans font-bold">
            {' '}
            {day}
          </div>
        </div>
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
            'text-so-color-persona-general-600 size-5 transition-transform group-hover:translate-x-1'
          }
        />
      </div>
    </div>
  )
}
