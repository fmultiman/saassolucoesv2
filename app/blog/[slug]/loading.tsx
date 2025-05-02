import { Skeleton } from "@/components/ui/skeleton"

export default function BlogPostLoading() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <Skeleton className="h-6 w-32 mb-8" />

      <article className="space-y-6">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-4 w-48" />

        <Skeleton className="h-[400px] w-full rounded-lg" />

        <div className="space-y-4">
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-5/6" />
        </div>
      </article>
    </div>
  )
}
