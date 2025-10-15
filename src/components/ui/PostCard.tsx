'use client'
import { ArrowForward } from '@/assets'
import { cn } from '@/lib/utils'
import Image from 'next/image'
import React from 'react'
import Button from './Button'

export interface PostCardProps {
  image?: boolean
  imageUrl?: string
  imageAlt?: string
  date?: string
  category?: string
  title?: string
  excerpt?: string
  className?: string
  onClick?: () => void
  showExcerpt?: boolean
  appearance?: 'default' | 'link'
  removable?: boolean
  onRemoveCategory?: () => void
}

const PostCard: React.FC<PostCardProps> = ({
  image = true,
  imageUrl = '/images/placeholder.png',
  imageAlt = 'Placeholder Image',
  date = '29-september-2025',
  category = 'Category',
  title = 'Card title',
  excerpt = 'Write a blurb that contains a strong call-to-action and a concise description about a single topic',
  className = '',
  showExcerpt = 'true',
  appearance = 'link',
  removable = false,
  onClick,
  onRemoveCategory,
}) => {
  return (
    <div
      className={`focus:ring-so-color-sky-500 border-so-color-neutral-300 w-full cursor-pointer rounded-2xl border bg-white transition-all duration-200 hover:shadow-md focus:ring-4 focus:ring-offset-2 focus:outline-none ${className} `}
      tabIndex={0}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      onKeyDown={e => {
        if ((e.key === 'Enter' || e.key === ' ') && onClick) {
          e.preventDefault()
          onClick()
        }
      }}
    >
      {image && imageUrl && imageAlt && (
        <div className="flex h-[200px] w-full items-center justify-center overflow-hidden rounded-t-2xl">
          <Image
            src={imageUrl}
            alt={imageAlt}
            width={400}
            height={128}
            className="h-full w-full object-cover"
          />
        </div>
      )}

      <div className="flex flex-col gap-4 p-6">
        <div className="flex items-center gap-2 divide-black text-sm">
          {date ? (
            <p className="body-base text-so-color-neutral-600">{date}</p>
          ) : null}{' '}
          {date && category && (
            <span className="bg-so-color-neutral-300 h-6 w-[2px]"></span>
          )}
          {appearance === 'link' ? (
            <span className="text-so-color-persona-general-600 font-medium underline">
              {category}
            </span>
          ) : (
            <div className="flex items-center gap-2">
              <Button
                appearance="secondary"
                label={category}
                icon={
                  <i className="material-symbols-outlined !text-base !leading-none">
                    close
                  </i>
                }
                iconTrailing={removable}
                size="sm"
                onClick={() => {
                  onRemoveCategory?.()
                }}
                className="min-h-auto !rounded-full p-1 !font-normal transition-colors focus:!ring-3 focus:!ring-offset-2"
                aria-label={`Remove ${category} category`}
              />
            </div>
          )}
        </div>
        <h3 className="font-raleway text-so-color-neutral-950 heading-h3-base font-bold">
          {title}
        </h3>

        {showExcerpt && excerpt ? (
          <p className="text-so-color-neutral-950 body-base">{excerpt}</p>
        ) : null}
        <div onClick={onClick} className="mt-2">
          <ArrowForward
            className={cn(
              'text-so-color-persona-general-600 size-5 transition-transform group-hover:translate-x-1'
            )}
          />
        </div>
      </div>
    </div>
  )
}

export default PostCard
