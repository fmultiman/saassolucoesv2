import { createServiceRoleClient } from "@/lib/supabase/service-role"
import { SolutionPlansManager } from "@/components/admin/solution-plans-manager"

export default async function SolutionPlansPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const solutionId = Number.parseInt(id, 10)

  // Buscar dados da solução
  const supabase = createServiceRoleClient()
  const { data: solution } = await supabase
    .from("solutions")
    .select("id, name, description, category, is_active")
    .eq("id", solutionId)
    .single()

  if (!solution) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Solução não encontrada</h1>
          <p className="text-muted-foreground">A solução solicitada não existe ou foi removida.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Planos com {solution.name}</h1>
        <p className="text-muted-foreground">Gerencie os planos que incluem esta solução.</p>
      </div>

      <SolutionPlansManager solutionId={solutionId} solutionName={solution.name} />
    </div>
  )
}
