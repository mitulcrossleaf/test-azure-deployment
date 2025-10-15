interface SeparatorProps {
  appearance?: 'thin' | 'thick' | 'thickest'
  className?: string
}

export default function Separator({
  appearance = 'thin',
  className = '',
}: SeparatorProps) {
  let height = 'h-px'
  if (appearance === 'thick') height = 'h-[2px]'
  if (appearance === 'thickest') height = 'h-[4px]'
  // Use global color variable for border color

  return (
    <div
      className={`relative box-border flex size-full flex-col content-stretch items-start gap-[16px] bg-[color:var(--so-color-neutral-300)] p-[16px] ${className}`}
      data-name={`appearance=${appearance}`}
    >
      <div className={` ${height} w-full shrink-0`} data-name="line" />
    </div>
  )
}
