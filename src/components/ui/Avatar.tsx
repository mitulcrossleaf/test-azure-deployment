import { cn } from '@/lib/utils'
import Image from 'next/image'
import { ComponentPropsWithoutRef } from 'react'

export type AvatarProps = {
  type?: 'image' | 'text'
  src?: string
  text?: string
  size?: number
  alt?: string
  className?: string
} & ComponentPropsWithoutRef<'div'>

const getTextSize = (size: number): string => {
  if (size <= 24) return 'text-xs'
  if (size <= 32) return 'text-base'
  if (size <= 48) return 'text-2xl'
  return 'text-[56px] leading-[64px]'
}

const Avatar = ({
  type = 'text',
  src,
  text,
  size = 40,
  alt = 'Avatar',
  className,
  style,
  ...props
}: AvatarProps) => {
  const textSize = getTextSize(size)
  const displayText = text ? text.charAt(0).toUpperCase() : '?'

  return (
    <div
      className={cn(
        'relative flex items-center justify-center overflow-hidden rounded-full bg-gray-200',
        type === 'image'
          ? 'bg-so-color-neutral-200'
          : 'bg-so-color-neutral-600',
        className
      )}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        minWidth: `${size}px`,
        ...style,
      }}
      {...props}
    >
      {type === 'image' && src ? (
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover"
          sizes={`${size}px`}
        />
      ) : (
        <span className={cn('font-bold text-white select-none', textSize)}>
          {displayText}
        </span>
      )}
    </div>
  )
}

export default Avatar
