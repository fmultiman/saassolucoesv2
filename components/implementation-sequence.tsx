"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, AlertTriangle, Clock, ArrowRight } from "lucide-react"

export default function ImplementationSequence() {
  const [activePhase, setActivePhase] = useState("phase1")

  const phases = [
    {
      id: "phase1",
      name: "Fase 1: Fundação",
      description: "Melhorias não visíveis ao usuário que fortalecem a base técnica",
      steps: [
        {
          title: "Testes Automatizados (Base)",
          description: "Implementar testes para componentes e funcionalidades críticas existentes",
          risk: "Baixo",
          impact: "Invisível ao usuário",
          duration: "1 semana",
          dependencies: [],
        },
        {
          title: "Tratamento de Erros Centralizado",
          description: "Criar sistema unificado para captura e tratamento de erros",
          risk: "Baixo",
          impact: "Invisível ao usuário",
          duration: "3 dias",
          dependencies: [],
        },
        {
          title: "Validação com Zod",
          description: "Implementar validação em APIs e formulários existentes",
          risk: "Médio",
          impact: "Invisível ao usuário",
          duration: "4 dias",
          dependencies: ["Tratamento de Erros Centralizado"],
        },
        {
          title: "Feature Flags",
          description: "Implementar sistema de feature flags para lançamentos graduais",
          risk: "Baixo",
          impact: "Invisível ao usuário",
          duration: "2 dias",
          dependencies: [],
        },
      ],
    },
    {
      id: "phase2",
      name: "Fase 2: Melhorias Visuais",
      description: "Aprimoramentos na interface que não alteram a lógica principal",
      steps: [
        {
          title: "Estados de Carregamento",
          description: "Adicionar esqueletos de carregamento para melhorar percepção de velocidade",
          risk: "Baixo",
          impact: "Visível, não crítico",
          duration: "3 dias",
          dependencies: [],
        },
        {
          title: "Feedback Visual",
          description: "Melhorar sistema de notificações e feedback para ações do usuário",
          risk: "Baixo",
          impact: "Visível, não crítico",
          duration: "2 dias",
          dependencies: ["Tratamento de Erros Centralizado"],
        },
        {
          title: "Responsividade",
          description: "Aprimorar a experiência em dispositivos móveis",
          risk: "Médio",
          impact: "Visível, não crítico",
          duration: "4 dias",
          dependencies: [],
        },
        {
          title: "Acessibilidade",
          description: "Melhorar suporte a leitores de tela e navegação por teclado",
          risk: "Baixo",
          impact: "Visível para alguns usuários",
          duration: "3 dias",
          dependencies: [],
        },
      ],
    },
    {
      id: "phase3",
      name: "Fase 3: Otimização de Performance",
      description: "Melhorias técnicas com impacto direto na experiência do usuário",
      steps: [
        {
          title: "Server Components (Não Interativos)",
          description: "Converter componentes estáticos para Server Components",
          risk: "Médio",
          impact: "Invisível ao usuário",
          duration: "5 dias",
          dependencies: ["Testes Automatizados (Base)"],
        },
        {
          title: "Paginação",
          description: "Implementar paginação em listas longas",
          risk: "Médio",
          impact: "Visível, potencialmente crítico",
          duration: "3 dias",
          dependencies: ["Feature Flags"],
        },
        {
          title: "Otimização de Imagens",
          description: "Implementar carregamento otimizado de imagens",
          risk: "Baixo",
          impact: "Visível, não crítico",
          duration: "2 dias",
          dependencies: [],
        },
        {
          title: "Lazy Loading",
          description: "Implementar carregamento sob demanda para componentes pesados",
          risk: "Médio",
          impact: "Invisível ao usuário",
          duration: "3 dias",
          dependencies: ["Feature Flags"],
        },
      ],
    },
    {
      id: "phase4",
      name: "Fase 4: Novas Funcionalidades",
      description: "Adição de novas funcionalidades que melhoram a experiência do usuário",
      steps: [
        {
          title: "Onboarding Personalizado",
          description: "Criar fluxo de onboarding baseado no plano do usuário",
          risk: "Baixo",
          impact: "Visível, não crítico",
          duration: "1 semana",
          dependencies: ["Feature Flags"],
        },
        {
          title: "Histórico de Uso",
          description: "Implementar sistema de histórico de uso das soluções",
          risk: "Médio",
          impact: "Visível, não crítico",
          duration: "5 dias",
          dependencies: ["Paginação"],
        },
        {
          title: "Personalização de Soluções",
          description: "Permitir que usuários personalizem configurações das soluções",
          risk: "Alto",
          impact: "Visível, potencialmente crítico",
          duration: "1 semana",
          dependencies: ["Validação com Zod", "Feature Flags"],
        },
        {
          title: "Sistema de Trial",
          description: "Implementar período de teste para soluções premium",
          risk: "Alto",
          impact: "Visível, crítico para negócio",
          duration: "1 semana",
          dependencies: ["Validação com Zod", "Feature Flags", "Testes Automatizados (Base)"],
        },
      ],
    },
  ]

  const getRiskBadge = (risk: string) => {
    switch (risk) {
      case "Baixo":
        return <Badge className="bg-green-100 text-green-800">Risco Baixo</Badge>
      case "Médio":
        return <Badge className="bg-yellow-100 text-yellow-800">Risco Médio</Badge>
      case "Alto":
        return <Badge className="bg-red-100 text-red-800">Risco Alto</Badge>
      default:
        return <Badge className="bg-gray-100 text-gray-800">{risk}</Badge>
    }
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="phase1" value={activePhase} onValueChange={setActivePhase}>
        <TabsList className="grid w-full grid-cols-4">
          {phases.map((phase) => (
            <TabsTrigger key={phase.id} value={phase.id}>
              {phase.name}
            </TabsTrigger>
          ))}
        </TabsList>

        {phases.map((phase) => (
          <TabsContent key={phase.id} value={phase.id}>
            <Card>
              <CardHeader>
                <CardTitle>{phase.name}</CardTitle>
                <CardDescription>{phase.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {phase.steps.map((step, index) => (
                    <div key={index} className="border rounded-lg p-4 hover:bg-slate-50 transition-colors">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-medium flex items-center">
                            {step.title}
                            {step.risk === "Alto" && <AlertTriangle className="ml-2 h-4 w-4 text-amber-500" />}
                          </h3>
                          <p className="text-sm text-muted-foreground mt-1">{step.description}</p>
                        </div>
                        <div>{getRiskBadge(step.risk)}</div>
                      </div>
                      <div className="mt-3 flex flex-wrap gap-2 items-center text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span>{step.duration}</span>
                        {step.dependencies.length > 0 && (
                          <>
                            <ArrowRight className="h-4 w-4 mx-1" />
                            <span>Depende de: {step.dependencies.join(", ")}</span>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle>Princípios de Implementação Segura</CardTitle>
          <CardDescription>Abordagens para minimizar riscos durante a implementação</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <h3 className="font-medium flex items-center">
              <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
              Implementação Incremental
            </h3>
            <p className="text-sm text-muted-foreground ml-6">
              Dividir grandes mudanças em pequenos incrementos que podem ser testados e lançados independentemente,
              reduzindo o risco de cada implantação.
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="font-medium flex items-center">
              <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
              Feature Flags
            </h3>
            <p className="text-sm text-muted-foreground ml-6">
              Usar feature flags para controlar o acesso a novas funcionalidades, permitindo lançamentos graduais e
              rollback rápido em caso de problemas.
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="font-medium flex items-center">
              <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
              Testes Automatizados
            </h3>
            <p className="text-sm text-muted-foreground ml-6">
              Implementar testes unitários, de integração e e2e para detectar problemas antes que cheguem à produção.
              Começar com testes para funcionalidades críticas.
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="font-medium flex items-center">
              <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
              Monitoramento e Observabilidade
            </h3>
            <p className="text-sm text-muted-foreground ml-6">
              Implementar logging, monitoramento e alertas para detectar problemas rapidamente em produção e facilitar a
              resolução.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
