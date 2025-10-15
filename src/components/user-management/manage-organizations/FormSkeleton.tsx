import Skeleton from 'react-loading-skeleton'

const FormSkeleton = () => (
  <div className="space-y-8">
    <div className="text-so-color-neutral-950 space-y-2">
      <Skeleton height={32} width="40%" />
      <Skeleton height={24} width="60%" />
    </div>

    <div className="flex w-full max-w-[544px] flex-col gap-8">
      {/* Organization Type Skeleton */}
      <div className="bg-so-color-neutral-100 w-full max-w-[544px] rounded-2xl p-6">
        <Skeleton height={20} width="30%" className="mb-4" />
        <div className="space-y-3">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="flex items-center gap-3">
              <Skeleton circle height={20} width={20} />
              <Skeleton height={20} width="40%" />
            </div>
          ))}
        </div>
      </div>

      {/* Profile Section Skeleton */}
      <div className="bg-so-color-neutral-100 flex flex-col gap-8 rounded-2xl p-6">
        <div className="space-y-2">
          <Skeleton height={24} width="20%" />
          <Skeleton height={16} width="50%" />
        </div>
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="space-y-2">
            <Skeleton height={16} width="30%" />
            <Skeleton height={40} width="100%" />
          </div>
        ))}
      </div>

      {/* Address Section Skeleton */}
      <div className="bg-so-color-neutral-100 flex flex-col gap-8 rounded-2xl p-6">
        <div className="space-y-2">
          <Skeleton height={24} width="20%" />
          <Skeleton height={16} width="50%" />
        </div>
        {[1, 2, 3, 4, 5].map(i => (
          <div key={i} className="space-y-2">
            <Skeleton height={16} width="30%" />
            <Skeleton height={40} width={i === 5 ? '30%' : '100%'} />
          </div>
        ))}
      </div>

      {/* Language Section Skeleton */}
      <div className="bg-so-color-neutral-100 w-full max-w-[544px] rounded-2xl p-6">
        <Skeleton height={20} width="20%" className="mb-4" />
        <div className="space-y-3">
          {[1, 2].map(i => (
            <div key={i} className="flex items-center gap-3">
              <Skeleton circle height={20} width={20} />
              <Skeleton height={20} width="30%" />
            </div>
          ))}
        </div>
      </div>

      {/* Management Section Skeleton */}
      <div className="bg-so-color-neutral-100 w-full max-w-[544px] rounded-2xl p-6">
        <Skeleton height={20} width="40%" className="mb-4" />
        <div className="space-y-3">
          {[1, 2].map(i => (
            <div key={i} className="flex items-center gap-3">
              <Skeleton circle height={20} width={20} />
              <Skeleton height={20} width="30%" />
            </div>
          ))}
        </div>
      </div>
    </div>

    <Skeleton height={48} width="200px" />
  </div>
)

export default FormSkeleton
