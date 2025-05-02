import { Skeleton } from "@/components/ui/skeleton"

export default function ContaLoading() {
  return (
    <div className="container mx-auto py-10 space-y-6">
      <Skeleton className="h-8 w-[250px]" />

      <div className="space-y-4">
        <Skeleton className="h-6 w-[200px]" />
        <div className="grid gap-4 md:grid-cols-2">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      </div>

      <div className="space-y-4">
        <Skeleton className="h-6 w-[200px]" />
        <Skeleton className="h-10 w-full" />
      </div>

      <div className="space-y-4">
        <Skeleton className="h-6 w-[200px]" />
        <div className="grid gap-4 md:grid-cols-2">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      </div>

      <div className="flex justify-end space-x-4">
        <Skeleton className="h-10 w-[100px]" />
        <Skeleton className="h-10 w-[100px]" />
      </div>
    </div>
  )
}
