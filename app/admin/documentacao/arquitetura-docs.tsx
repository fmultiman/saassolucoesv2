"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { InfoIcon } from "lucide-react"

export function ArquiteturaDocumentation() {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Arquitetura do Sistema</CardTitle>
        <CardDescription>Visão geral da arquitetura do sistema SaaS Soluções</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <section>
          <h3 className="text-lg font-semibold mb-2">Visão Geral da Arquitetura</h3>
          <p>
            O SaaS Soluções é construído utilizando uma arquitetura modular e escalável, projetada para garantir
            desempenho, segurança e facilidade de manutenção. A arquitetura é dividida em camadas bem definidas, cada
            uma com responsabilidades específicas.
          </p>
        </section>

        <section>
          <h3 className="text-lg font-semibold mb-2">Camadas da Arquitetura</h3>
          <div className="space-y-4">
            <div>
              <h4 className="font-medium">Frontend</h4>
              <p className="text-sm text-muted-foreground">
                A camada de frontend é responsável pela interface do usuário e interação com o cliente.
              </p>
              <ul className="list-disc pl-6 text-sm mt-1">
                <li>Next.js 14 (App Router)</li>
                <li>React 18</li>
                <li>TypeScript</li>
                <li>Tailwind CSS</li>
                <li>shadcn/ui</li>
              </ul>
            </div>

            <div>
              <h4 className="font-medium">Backend</h4>
              <p className="text-sm text-muted-foreground">
                A camada de backend é responsável pela lógica de negócios, acesso a dados e APIs.
              </p>
              <ul className="list-disc pl-6 text-sm mt-1">
                <li>Next.js API Routes</li>
                <li>Supabase</li>
                <li>PostgreSQL</li>
                <li>Redis</li>
                <li>TypeScript</li>
              </ul>
            </div>

            <div>
              <h4 className="font-medium">Infraestrutura</h4>
              <p className="text-sm text-muted-foreground">
                A camada de infraestrutura fornece os recursos necessários para hospedar e executar a aplicação.
              </p>
              <ul className="list-disc pl-6 text-sm mt-1">
                <li>Vercel</li>
                <li>Supabase</li>
                <li>Upstash Redis</li>
                <li>GitHub Actions</li>
              </ul>
            </div>
          </div>
        </section>

        <section>
          <h3 className="text-lg font-semibold mb-2">Diagrama da Arquitetura</h3>
          <p className="text-sm text-muted-foreground">
            O diagrama abaixo ilustra a arquitetura do sistema e o fluxo de dados entre os componentes:
          </p>
          <img src="/interconnected-ai-network.png" alt="Diagrama da Arquitetura" className="rounded-md" />
        </section>

        <section>
          <h3 className="text-lg font-semibold mb-2">Padrões de Projeto</h3>
          <p className="text-sm text-muted-foreground">
            O sistema utiliza vários padrões de projeto para garantir a qualidade do código e facilitar a manutenção:
          </p>
          <ul className="list-disc pl-6 text-sm">
            <li>
              <strong>MVC (Model-View-Controller)</strong>: Separação de responsabilidades entre modelo de dados,
              interface do usuário e lógica de controle
            </li>
            <li>
              <strong>Repository Pattern</strong>: Abstração do acesso a dados para facilitar a troca de provedores
            </li>
            <li>
              <strong>Service Layer</strong>: Encapsulamento da lógica de negócios em serviços reutilizáveis
            </li>
            <li>
              <strong>Dependency Injection</strong>: Injeção de dependências para facilitar testes e modularidade
            </li>
          </ul>
        </section>

        <Alert>
          <InfoIcon className="h-4 w-4" />
          <AlertTitle>Próximos Passos</AlertTitle>
          <AlertDescription>
            Para informações mais detalhadas sobre cada componente da arquitetura, consulte as seções específicas desta
            documentação: Banco de Dados, API, Componentes, Guias e Migrações.
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  )
}

export default function ArquiteturaDocs() {
  return <ArquiteturaDocumentation />
}
