"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CheckCircle } from "lucide-react"

export default function ImplementationStrategy() {
  return (
    <Tabs defaultValue="performance">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="performance">Performance</TabsTrigger>
        <TabsTrigger value="ux">Experiência do Usuário</TabsTrigger>
        <TabsTrigger value="architecture">Arquitetura</TabsTrigger>
      </TabsList>

      <TabsContent value="performance">
        <Card>
          <CardHeader>
            <CardTitle>Estratégia de Melhoria de Performance</CardTitle>
            <CardDescription>Otimizações para melhorar a velocidade e responsividade da aplicação</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h3 className="font-medium flex items-center">
                <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                Server Components
              </h3>
              <p className="text-sm text-muted-foreground ml-6">
                Converter componentes que não precisam de interatividade para Server Components, reduzindo o JavaScript
                enviado ao cliente e melhorando o tempo de carregamento inicial.
              </p>
              <div className="ml-6 p-3 bg-slate-50 rounded-md text-sm">
                <p className="font-mono">Componentes prioritários para conversão:</p>
                <ul className="list-disc ml-5 mt-1 space-y-1">
                  <li>admin-overview-stats.tsx</li>
                  <li>admin-solutions-catalog.tsx</li>
                  <li>admin-users-list.tsx</li>
                  <li>solucoes-inteligentes.tsx</li>
                </ul>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="font-medium flex items-center">
                <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                Paginação e Carregamento Sob Demanda
              </h3>
              <p className="text-sm text-muted-foreground ml-6">
                Implementar paginação em todas as listas e carregamento sob demanda para componentes pesados, reduzindo
                a carga inicial e melhorando a responsividade.
              </p>
              <div className="ml-6 p-3 bg-slate-50 rounded-md text-sm">
                <p className="font-mono">Componentes para implementar paginação:</p>
                <ul className="list-disc ml-5 mt-1 space-y-1">
                  <li>admin-users-list.tsx (10 itens por página)</li>
                  <li>admin-solutions-catalog.tsx (12 itens por página)</li>
                  <li>marketplace-grid.tsx (9 itens por página)</li>
                </ul>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="font-medium flex items-center">
                <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                Otimização de Imagens e Assets
              </h3>
              <p className="text-sm text-muted-foreground ml-6">
                Utilizar o componente Image do Next.js para otimização automática de imagens e implementar lazy loading
                para recursos não críticos.
              </p>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="ux">
        <Card>
          <CardHeader>
            <CardTitle>Estratégia de Melhoria da Experiência do Usuário</CardTitle>
            <CardDescription>
              Aprimoramentos na interface e interações para melhorar a satisfação do usuário
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h3 className="font-medium flex items-center">
                <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                Estados de Carregamento
              </h3>
              <p className="text-sm text-muted-foreground ml-6">
                Implementar esqueletos de carregamento (skeletons) para todos os componentes que buscam dados,
                melhorando a percepção de velocidade.
              </p>
              <div className="ml-6 p-3 bg-slate-50 rounded-md text-sm">
                <p className="font-mono">Exemplo de implementação:</p>
                <pre className="mt-1 text-xs overflow-x-auto">
                  {`// Componente de esqueleto para cards de solução
export function SolucaoCardSkeleton() {
  return (
    <div className="border rounded-lg p-4 animate-pulse">
      <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
      <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
      <div className="h-3 bg-gray-200 rounded w-5/6"></div>
      <div className="mt-4 h-8 bg-gray-200 rounded w-1/3"></div>
    </div>
  )
}`}
                </pre>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="font-medium flex items-center">
                <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                Onboarding Personalizado
              </h3>
              <p className="text-sm text-muted-foreground ml-6">
                Criar um fluxo de onboarding que guie novos usuários conforme o plano selecionado, destacando as
                soluções relevantes e como utilizá-las.
              </p>
              <div className="ml-6 p-3 bg-slate-50 rounded-md text-sm">
                <p className="font-mono">Etapas do onboarding:</p>
                <ol className="list-decimal ml-5 mt-1 space-y-1">
                  <li>Boas-vindas personalizada com base no plano</li>
                  <li>Tour guiado das funcionalidades principais</li>
                  <li>Sugestão das primeiras soluções a explorar</li>
                  <li>Configuração inicial do perfil</li>
                  <li>Checklist de primeiros passos</li>
                </ol>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="font-medium flex items-center">
                <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                Feedback e Notificações
              </h3>
              <p className="text-sm text-muted-foreground ml-6">
                Implementar um sistema de notificações contextual que informe o usuário sobre ações bem-sucedidas, erros
                e atualizações importantes.
              </p>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="architecture">
        <Card>
          <CardHeader>
            <CardTitle>Estratégia de Melhoria da Arquitetura</CardTitle>
            <CardDescription>
              Aprimoramentos estruturais para melhorar a manutenibilidade e escalabilidade
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h3 className="font-medium flex items-center">
                <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                Gerenciamento de Estado
              </h3>
              <p className="text-sm text-muted-foreground ml-6">
                Expandir o uso do Zustand para gerenciar o estado da aplicação de forma mais organizada, criando stores
                específicos para diferentes domínios.
              </p>
              <div className="ml-6 p-3 bg-slate-50 rounded-md text-sm">
                <p className="font-mono">Stores a serem implementados:</p>
                <ul className="list-disc ml-5 mt-1 space-y-1">
                  <li>useSolutionsStore - gerenciamento de soluções</li>
                  <li>useNotificationsStore - sistema de notificações</li>
                  <li>useOnboardingStore - estado do processo de onboarding</li>
                  <li>useUIStore - estado da interface (modais, drawers, etc)</li>
                </ul>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="font-medium flex items-center">
                <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                Tratamento de Erros Centralizado
              </h3>
              <p className="text-sm text-muted-foreground ml-6">
                Criar um sistema unificado de tratamento de erros para facilitar a manutenção e garantir consistência no
                feedback ao usuário.
              </p>
              <div className="ml-6 p-3 bg-slate-50 rounded-md text-sm">
                <p className="font-mono">Implementação proposta:</p>
                <pre className="mt-1 text-xs overflow-x-auto">
                  {`// lib/error-handler.ts
export class AppError extends Error {
  public statusCode: number;
  public code: string;
  
  constructor(message: string, statusCode = 400, code = 'UNKNOWN_ERROR') {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
  }
}

export function handleApiError(error: unknown) {
  if (error instanceof AppError) {
    return { error: error.message, code: error.code, status: error.statusCode };
  }
  
  console.error('Unexpected error:', error);
  return { error: 'Ocorreu um erro inesperado', code: 'INTERNAL_ERROR', status: 500 };
}`}
                </pre>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="font-medium flex items-center">
                <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                Testes Automatizados
              </h3>
              <p className="text-sm text-muted-foreground ml-6">
                Implementar testes unitários, de integração e e2e para garantir a qualidade do código e facilitar
                refatorações futuras.
              </p>
              <div className="ml-6 p-3 bg-slate-50 rounded-md text-sm">
                <p className="font-mono">Estratégia de testes:</p>
                <ul className="list-disc ml-5 mt-1 space-y-1">
                  <li>Vitest para testes unitários</li>
                  <li>React Testing Library para testes de componentes</li>
                  <li>MSW para mock de APIs em testes</li>
                  <li>Playwright para testes e2e</li>
                  <li>Cobertura mínima de 70% para código crítico</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}
