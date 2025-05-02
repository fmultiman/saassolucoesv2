import { Skeleton } from "@/components/ui/skeleton"

export default function DocumentacaoLoading() {
  return (
    <div className="space-y-6">
      <div>
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-96 mt-2" />
      </div>

      <Skeleton className="h-10 w-full" />

      <div className="space-y-4">
        <Skeleton className="h-[300px] w-full rounded-lg" />
      </div>
    </div>
  )
}
