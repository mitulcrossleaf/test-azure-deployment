import { IconPropsType } from '@/types/global'

const Twitter = ({ className, height, width }: IconPropsType) => {
  return (
    <svg
      width={width ?? '22'}
      height={height ?? '20'}
      viewBox="0 0 22 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M17.0369 0.25H20.3463L13.1181 8.50937L21.6213 19.75H14.965L9.74782 12.9344L3.78532 19.75H0.471252L8.20094 10.9141L0.0493774 0.25H6.87438L11.5853 6.47969L17.0369 0.25ZM15.8744 17.7719H17.7072L5.87594 2.125H3.90719L15.8744 17.7719Z"
        fill="currentColor"
      />
    </svg>
  )
}

export default Twitter
