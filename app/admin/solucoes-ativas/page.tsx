import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AdminActiveSolutionsList } from "@/components/admin/admin-active-solutions-list"
import { SolutionsService } from "@/lib/services/solutions-service"

export const metadata = {
  title: "Soluções Ativas | Admin Dashboard",
  description: "Gerencie todas as soluções ativas na plataforma.",
}

export default async function AdminActiveSolutionsPage() {
  // Buscar contagem de soluções ativas por categoria
  const solutions = await SolutionsService.getActiveSolutions()

  const totalSolutions = solutions.length
  const automacaoSolutions = solutions.filter((s) => s.category === "automacao").length
  const analiseSolutions = solutions.filter((s) => s.category === "analise").length
  const integracaoSolutions = solutions.filter((s) => s.category === "integracao").length

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Soluções Ativas</h1>
        <p className="text-muted-foreground">Gerencie e monitore todas as soluções ativas na plataforma.</p>
      </div>

      <Tabs defaultValue="todas" className="space-y-4">
        <TabsList>
          <TabsTrigger value="todas">Todas</TabsTrigger>
          <TabsTrigger value="automacao">Automação</TabsTrigger>
          <TabsTrigger value="analise">Análise de Dados</TabsTrigger>
          <TabsTrigger value="integracao">Integração</TabsTrigger>
        </TabsList>
        <TabsContent value="todas" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Visão Geral</CardTitle>
              <CardDescription>Total de {totalSolutions} soluções ativas em uso</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <AdminActiveSolutionsList filter="todas" />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="automacao" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Automação</CardTitle>
              <CardDescription>Total de {automacaoSolutions} soluções de automação ativas</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <AdminActiveSolutionsList filter="automacao" />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="analise" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Análise de Dados</CardTitle>
              <CardDescription>Total de {analiseSolutions} soluções de análise de dados ativas</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <AdminActiveSolutionsList filter="analise" />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="integracao" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Integração</CardTitle>
              <CardDescription>Total de {integracaoSolutions} soluções de integração ativas</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <AdminActiveSolutionsList filter="integracao" />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
