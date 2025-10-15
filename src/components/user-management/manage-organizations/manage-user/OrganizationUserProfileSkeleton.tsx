import Skeleton from 'react-loading-skeleton'

const OrganizationUserProfileSkeleton = () => {
  return (
    <div className="my-8 !max-w-[544px] space-y-8">
      <div>
        <Skeleton width="40%" height={28} />
        <Skeleton width="70%" height={24} style={{ marginTop: 6 }} />
      </div>
      <div className="bg-so-color-neutral-100 flex flex-col gap-8 rounded-2xl p-6">
        <div>
          <Skeleton width="40%" height={28} />
          <Skeleton width="70%" height={24} style={{ marginTop: 6 }} />
        </div>
        <div className="mt-3 flex flex-col gap-4">
          <Skeleton circle width={32} height={32} />
          <Skeleton circle width={32} height={32} />
        </div>
      </div>
      <div className="bg-so-color-neutral-100 space-y-6 rounded-2xl p-6">
        <div>
          <Skeleton width="40%" height={28} />
          <Skeleton width="70%" height={24} style={{ marginTop: 6 }} />
        </div>
        <div>
          <Skeleton width="25%" height={28} />
          <Skeleton height={48} borderRadius={8} style={{ marginTop: 8 }} />
        </div>
      </div>
      <div className="bg-so-color-neutral-100 space-y-6 rounded-2xl p-6">
        <div>
          <Skeleton width="40%" height={28} />
          <Skeleton width="70%" height={24} style={{ marginTop: 6 }} />
        </div>
        <div>
          <Skeleton width="25%" height={28} />
          <Skeleton height={48} borderRadius={8} style={{ marginTop: 8 }} />
        </div>
        <div>
          <Skeleton width="25%" height={28} />
          <Skeleton height={48} borderRadius={8} style={{ marginTop: 8 }} />
        </div>
        <div>
          <Skeleton width="35%" height={28} />
          <Skeleton height={48} borderRadius={8} style={{ marginTop: 8 }} />
          <Skeleton width="60%" height={24} style={{ marginTop: 4 }} />
        </div>
      </div>
      <div className="flex justify-center">
        <Skeleton width="40%" height={44} borderRadius={12} />
      </div>
    </div>
  )
}

export default OrganizationUserProfileSkeleton
