'use client'
import { cn } from '@/lib/utils'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import Skeleton from 'react-loading-skeleton'
import Button from './Button'

type StandardCardApperance = 'standard' | 'clickable' | 'ghost'
export type StandardCardProps = {
  apperance: StandardCardApperance
  title: string
  image?: {
    url: string
    alt: string
  }
  description?: string
  className?: string
  icon?: string
  iconSize?: string
  id: number
  href?: string
  label?: string
  semantic?: 'buyer' | 'vendor' | 'general'
  loading?: boolean
}

const StandardCard = ({
  apperance,
  title,
  className,
  description,
  icon,
  iconSize = 'size-10',
  image,
  id,
  href,
  label = 'Go somewhere',
  semantic,
  loading = false,
}: StandardCardProps) => {
  const router = useRouter()

  if (loading) {
    return (
      <div
        className={cn(
          className,
          'border-so-color-neutral-300 w-full overflow-hidden rounded-xl border bg-white'
        )}
      >
        {image && (
          <div className="relative aspect-video min-h-[200px] w-auto">
            <Skeleton height="100%" />
          </div>
        )}
        <div className="flex w-full flex-col items-start gap-4 p-6">
          <div className="w-full space-y-4">
            {icon && <Skeleton width={40} height={40} circle={false} />}
            <Skeleton height={24} width="75%" />
          </div>
          {description && (
            <div className="w-full">
              <Skeleton height={72} width="100%" />
            </div>
          )}
          <div className="flex items-center justify-start gap-4">
            <Skeleton
              height={32}
              width={
                apperance === 'standard' || apperance === 'ghost' ? 96 : 48
              }
            />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div
      tabIndex={id}
      className={cn(
        className,
        'border-so-color-neutral-300 focus:ring-so-color-sky-500 w-full overflow-hidden rounded-xl border bg-white hover:shadow-md focus:shadow-md focus:ring-4 focus:ring-offset-2 focus:outline-none active:shadow-lg active:ring-0 active:ring-offset-0'
      )}
    >
      {image && (
        <div className="relative aspect-video min-h-[200px] w-auto">
          <Image
            src={image.url}
            alt={image.alt}
            fill
            className="object-cover"
          />
        </div>
      )}
      <div className="flex w-full flex-col items-start gap-4 p-6">
        <div className="flex w-full flex-col items-start gap-4">
          {icon && (
            <div
              className={cn(
                iconSize,
                'text-so-color-neutral-black flex items-center justify-center'
              )}
            >
              <i className="material-symbols-outlined !text-[34px]">{icon}</i>
            </div>
          )}
          <h3 className="heading-h3-base text-so-color-neutral-black font-bold">
            {title}
          </h3>
        </div>
        {description && (
          <p className="body-base font-open-sans text-so-color-neutral-black">
            {description}
          </p>
        )}
        <div
          onClick={() => (href ? router.push(href) : null)}
          className="flex cursor-pointer items-center justify-start gap-4"
        >
          {apperance === 'standard' || apperance === 'ghost' ? (
            <Button
              appearance="ghost"
              iconTrailing
              icon={
                <i className="material-symbols-outlined !text-[32px]">
                  arrow_forward
                </i>
              }
              label={label}
              theme="light"
              semantic={semantic}
            />
          ) : (
            <div className="text-so-color-persona-general-600 flex size-8 items-center justify-center">
              <i className="material-symbols-outlined !text-[32px]">
                arrow_forward
              </i>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
export default StandardCard
