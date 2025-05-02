"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { InfoIcon } from "lucide-react"

export function VisaoGeralDocumentation() {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Visão Geral do Sistema</CardTitle>
        <CardDescription>Introdução ao sistema SaaS Soluções e seus principais componentes</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="text-lg font-medium">Sobre o SaaS Soluções</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            O SaaS Soluções é uma plataforma completa para gerenciamento de soluções empresariais, oferecendo um
            conjunto de ferramentas integradas para otimização de processos, análise de dados e automação de tarefas. A
            plataforma foi desenvolvida com foco em escalabilidade, segurança e experiência do usuário.
          </p>
        </div>

        <div>
          <h3 className="text-lg font-medium">Principais Funcionalidades</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
            <Card>
              <CardHeader className="py-3">
                <CardTitle className="text-base">Gerenciamento de Soluções</CardTitle>
              </CardHeader>
              <CardContent className="py-2">
                <p className="text-sm text-muted-foreground">
                  Catálogo completo de soluções empresariais com configuração personalizada para cada cliente.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="py-3">
                <CardTitle className="text-base">Planos e Assinaturas</CardTitle>
              </CardHeader>
              <CardContent className="py-2">
                <p className="text-sm text-muted-foreground">
                  Sistema flexível de planos com diferentes níveis de acesso e funcionalidades.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="py-3">
                <CardTitle className="text-base">Análise de Métricas</CardTitle>
              </CardHeader>
              <CardContent className="py-2">
                <p className="text-sm text-muted-foreground">
                  Dashboards interativos com métricas de desempenho e utilização das soluções.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="py-3">
                <CardTitle className="text-base">Gestão de Usuários</CardTitle>
              </CardHeader>
              <CardContent className="py-2">
                <p className="text-sm text-muted-foreground">
                  Controle granular de acesso com diferentes níveis de permissão e perfis personalizáveis.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-medium">Tecnologias Utilizadas</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
            <Card>
              <CardHeader className="py-3">
                <CardTitle className="text-base">Frontend</CardTitle>
              </CardHeader>
              <CardContent className="py-2">
                <ul className="text-sm text-muted-foreground list-disc pl-5 space-y-1">
                  <li>Next.js 14 (App Router)</li>
                  <li>React 18</li>
                  <li>TypeScript</li>
                  <li>Tailwind CSS</li>
                  <li>shadcn/ui</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="py-3">
                <CardTitle className="text-base">Backend</CardTitle>
              </CardHeader>
              <CardContent className="py-2">
                <ul className="text-sm text-muted-foreground list-disc pl-5 space-y-1">
                  <li>Next.js API Routes</li>
                  <li>Supabase</li>
                  <li>PostgreSQL</li>
                  <li>Redis</li>
                  <li>TypeScript</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="py-3">
                <CardTitle className="text-base">Infraestrutura</CardTitle>
              </CardHeader>
              <CardContent className="py-2">
                <ul className="text-sm text-muted-foreground list-disc pl-5 space-y-1">
                  <li>Vercel</li>
                  <li>Supabase</li>
                  <li>Upstash Redis</li>
                  <li>GitHub Actions</li>
                  <li>Vercel KV</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-medium">Estrutura do Sistema</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            O SaaS Soluções segue uma arquitetura modular e escalável, dividida em componentes independentes que se
            comunicam através de interfaces bem definidas. A estrutura principal inclui:
          </p>
          <ul className="mt-2 text-sm space-y-2 list-disc pl-5">
            <li>
              <strong>Interface do Cliente</strong>: Dashboard personalizado para usuários finais acessarem as soluções
              contratadas
            </li>
            <li>
              <strong>Painel Administrativo</strong>: Interface para administradores gerenciarem usuários, planos,
              soluções e configurações do sistema
            </li>
            <li>
              <strong>API RESTful</strong>: Conjunto de endpoints para comunicação entre frontend e backend
            </li>
            <li>
              <strong>Banco de Dados</strong>: Armazenamento persistente de dados com PostgreSQL via Supabase
            </li>
            <li>
              <strong>Sistema de Cache</strong>: Camada de cache com Redis para otimização de performance
            </li>
            <li>
              <strong>Sistema de Autenticação</strong>: Gerenciamento de usuários e controle de acesso com Supabase Auth
            </li>
          </ul>
        </div>

        <Alert>
          <InfoIcon className="h-4 w-4" />
          <AlertTitle>Documentação Detalhada</AlertTitle>
          <AlertDescription>
            Para informações mais detalhadas sobre cada componente do sistema, consulte as seções específicas desta
            documentação: Arquitetura, Banco de Dados, API, Componentes, Guias e Migrações.
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  )
}

export default function VisaoGeralDocs() {
  return <VisaoGeralDocumentation />
}
