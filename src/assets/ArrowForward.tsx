import { IconPropsType } from '@/types/global'

const ArrowForward = ({ className, height, width }: IconPropsType) => {
  return (
    <svg
      width={width ?? '16'}
      height={height ?? '16'}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M12.175 9H0V7H12.175L6.575 1.4L8 0L16 8L8 16L6.575 14.6L12.175 9Z"
        fill="currentColor"
      />
    </svg>
  )
}

export default ArrowForward
