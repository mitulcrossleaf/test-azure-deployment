'use client'

import ArrowForward from '@/assets/ArrowForward'
import { cn } from '@/lib/utils'
import Image from 'next/image'

export type LinkedinCardProps = {
  organization?: string
  date?: string
  post?: string
  theme?: 'light' | 'dark'
  onClick?: () => void
  className?: string
  avatarSrc?: string
  avatarAlt?: string
}

export default function LinkedinCard(props: LinkedinCardProps) {
  const {
    organization = 'Supply Ontario',
    date = '21 hours ago',
    post = "📣 We're hiring a Senior Financial Accountant! In this role, you’ll provide expert analysis, support financial operations, and collaborate with diverse teams to enhance transparency and financial stability.",
    theme = 'light',
    onClick,
    className,
    avatarSrc = '/images/avatar.png',
    avatarAlt = 'Avatar',
  } = props

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'focus:ring-so-color-sky-500 border-so-color-neutral-300 relative flex w-full flex-col gap-4 rounded-2xl border p-6 text-left transition-shadow hover:shadow-lg focus:ring-4 focus:ring-offset-2 focus:outline-none',
        theme === 'dark' ? 'bg-so-color-neutral-950' : 'bg-white',

        className
      )}
    >
      <div className="flex items-center gap-4">
        {avatarSrc && avatarAlt && (
          <div className="relative size-12 overflow-hidden rounded-full">
            {' '}
            <Image src={avatarSrc} alt={avatarAlt} fill />
          </div>
        )}
        <div className="min-w-0">
          <p
            className={cn(
              'font-raleway body-base font-bold',
              theme === 'dark'
                ? 'text-so-color-persona-general-400'
                : 'text-so-color-persona-general-600'
            )}
          >
            {organization}
          </p>
          <p
            className={cn(
              'body-base',
              theme === 'dark' ? 'text-white' : 'text-so-color-neutral-700'
            )}
          >
            {date}
          </p>
        </div>
      </div>

      <p
        className={cn(
          'body-base',
          theme === 'dark' ? 'text-white' : 'text-so-color-neutral-950'
        )}
      >
        {post}
      </p>

      <div className="mt-2">
        <ArrowForward
          className={cn(
            theme === 'dark'
              ? 'text-so-color-persona-general-400'
              : 'text-so-color-persona-general-600',
            'size-5 transition-transform hover:translate-x-1'
          )}
        />
      </div>
    </button>
  )
}
