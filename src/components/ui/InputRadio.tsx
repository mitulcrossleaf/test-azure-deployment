import { cn } from '@/lib'

export interface InputRadioProps {
  label: string
  name: string | undefined
  value: string
  checked: boolean | undefined
  onChange?: (value: string) => void
  size?: 'small' | 'large'
  appearance?: 'bold' | 'regular'
  error?: boolean
  disabled?: boolean
}

const sizes = {
  small: 'body-base', // 32px
  large: 'body-xl', // 48px
}

const appearances = {
  bold: 'font-bold',
  regular: 'font-normal',
}

const InputRadio = ({
  name,
  value,
  checked,
  onChange,
  label,
  size = 'small',
  appearance = 'bold',
  error = false,
  disabled = false,
  ...props
}: InputRadioProps) => {
  return (
    <label
      key={value}
      className={cn(
        disabled && 'cursor-not-allowed opacity-50',
        'flex items-center gap-[14px]'
      )}
    >
      <input
        type="radio"
        name={name}
        value={value}
        checked={checked}
        onChange={e => onChange?.(e.target.value)}
        className="peer sr-only"
        disabled={disabled}
        {...props}
      />
      <div
        className={cn(
          error ? 'border-so-color-red-700' : 'border-so-color-neutral-950',
          'peer-focus:ring-so-color-sky-500 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border-2 peer-focus:ring-2'
        )}
      >
        {checked && (
          <div className="bg-so-color-neutral-950 h-4 w-4 rounded-full" />
        )}
      </div>
      <div
        className={cn(
          sizes[size],
          appearances[appearance],
          'text-so-color-neutral-950 font-open-sans'
        )}
      >
        {label}
      </div>
    </label>
  )
}

export default InputRadio
