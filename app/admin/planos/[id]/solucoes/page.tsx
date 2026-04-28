import { PlanSolutionsManager } from "@/components/admin/plan-solutions-manager"

export default async function PlanSolutionsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const planId = Number.parseInt(id, 10)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Gerenciar Soluções do Plano</h1>
        <p className="text-muted-foreground">Adicione ou remova soluções disponíveis para este plano.</p>
      </div>

      <PlanSolutionsManager planId={planId} />
    </div>
  )
}
