import { Skeleton } from "@/components/ui/skeleton"

export default function AdminPostEditLoading() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <Skeleton className="h-6 w-40 mb-8" />
      <Skeleton className="h-10 w-64 mb-8" />

      <div className="space-y-6">
        <div className="space-y-2">
          <Skeleton className="h-5 w-24" />
          <Skeleton className="h-10 w-full" />
        </div>

        <div className="space-y-2">
          <Skeleton className="h-5 w-24" />
          <Skeleton className="h-10 w-full" />
        </div>

        <div className="space-y-2">
          <Skeleton className="h-5 w-24" />
          <Skeleton className="h-10 w-full" />
        </div>

        <div className="space-y-2">
          <Skeleton className="h-5 w-24" />
          <Skeleton className="h-64 w-full" />
        </div>

        <div className="space-y-2">
          <Skeleton className="h-10 w-40" />
        </div>

        <div className="flex justify-between">
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-10 w-32" />
        </div>
      </div>
    </div>
  )
}
