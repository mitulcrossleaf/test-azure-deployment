import { FC } from 'react'
export interface StepIndicatorProps {
  step: string
  title?: string
  backButton?: React.ReactNode
}

const StepIndicator: FC<StepIndicatorProps> = ({ backButton, step, title }) => {
  return (
    <div className="border-b-so-color-neutral-950 flex w-full flex-col justify-start gap-2 border-b-2 pb-4">
      {backButton}
      <div className="font-raleway flex items-center justify-between gap-8">
        {title && (
          <h2 className="heading-h2-base text-so-color-neutral-black font-bold">
            {title}
          </h2>
        )}
        <p className="heading-h4-base text-so-color-neutral-black font-bold">
          {step}
        </p>
      </div>
    </div>
  )
}

export default StepIndicator
