import { IconPropsType } from '@/types/global'

const ArrowBack = ({ className, height, width }: IconPropsType) => {
  return (
    <svg
      width={width ?? '24'}
      height={height ?? '24'}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <g clipPath="url(#clip0_36230_2314)">
        <mask
          id="mask0_36230_2314"
          style={{ maskType: 'alpha' }}
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="24"
          height="24"
        >
          <rect width="24" height="24" fill="currentColor" />
        </mask>
        <g mask="url(#mask0_36230_2314)">
          <path
            d="M7.825 13L13.425 18.6L12 20L4 12L12 4L13.425 5.4L7.825 11H20V13H7.825Z"
            fill="currentColor"
          />
        </g>
      </g>
      <defs>
        <clipPath id="clip0_36230_2314">
          <rect width="24" height="24" fill="currentColor" />
        </clipPath>
      </defs>
    </svg>
  )
}

export default ArrowBack
