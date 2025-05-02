import { Skeleton } from "@/components/ui/skeleton"

export default function SolutionPlansLoading() {
  return (
    <div className="space-y-6">
      <div>
        <Skeleton className="h-10 w-[300px] mb-2" />
        <Skeleton className="h-5 w-[500px]" />
      </div>

      <div className="space-y-4">
        <Skeleton className="h-[400px] w-full" />
      </div>
    </div>
  )
}
