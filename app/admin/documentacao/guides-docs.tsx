"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Code } from "@/components/ui/code"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { InfoIcon } from "lucide-react"

export function GuidesDocumentation() {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Guias de Desenvolvimento</CardTitle>
        <CardDescription>Guias práticos para desenvolvimento e manutenção do sistema SaaS Soluções</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Tabs defaultValue="getting-started" className="w-full">
          <TabsList className="grid grid-cols-4 w-full">
            <TabsTrigger value="getting-started">Primeiros Passos</TabsTrigger>
            <TabsTrigger value="authentication">Autenticação</TabsTrigger>
            <TabsTrigger value="database">Banco de Dados</TabsTrigger>
            <TabsTrigger value="deployment">Implantação</TabsTrigger>
          </TabsList>

          <TabsContent value="getting-started" className="space-y-4 mt-4">
            <div>
              <h3 className="text-lg font-medium">Configuração do Ambiente</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Siga estas etapas para configurar seu ambiente de desenvolvimento local:
              </p>
              <ol className="mt-2 text-sm space-y-2 list-decimal pl-5">
                <li>Clone o repositório do projeto</li>
                <li>
                  Instale as dependências com <code>npm install</code>
                </li>
                <li>
                  Configure as variáveis de ambiente copiando <code>.env.example</code> para <code>.env.local</code>
                </li>
                <li>
                  Inicie o servidor de desenvolvimento com <code>npm run dev</code>
                </li>
              </ol>
            </div>

            <div>
              <h3 className="text-lg font-medium">Requisitos</h3>
              <ul className="mt-2 text-sm space-y-2 list-disc pl-5">
                <li>Node.js 18.x ou superior</li>
                <li>npm 9.x ou superior</li>
                <li>PostgreSQL 14.x ou superior</li>
                <li>Redis 6.x ou superior (opcional, para cache)</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-medium">Estrutura do Projeto</h3>
              <Code language="text" className="mt-2">
                {`saas-solucoes/
├── app/                  # Rotas e páginas (Next.js App Router)
│   ├── api/              # Endpoints da API
│   ├── admin/            # Páginas administrativas
│   ├── dashboard/        # Páginas do dashboard do cliente
│   └── ...
├── components/           # Componentes React reutilizáveis
│   ├── ui/               # Componentes de UI básicos
│   ├── admin/            # Componentes administrativos
│   └── ...
├── lib/                  # Bibliotecas e utilitários
│   ├── services/         # Serviços de negócios
│   ├── supabase/         # Configuração e helpers do Supabase
│   └── ...
├── migrations/           # Migrações de banco de dados
├── public/               # Arquivos estáticos
├── scripts/              # Scripts utilitários
├── types/                # Definições de tipos TypeScript
└── ...`}
              </Code>
            </div>

            <div>
              <h3 className="text-lg font-medium">Fluxo de Trabalho</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                O fluxo de trabalho recomendado para desenvolvimento é:
              </p>
              <ol className="mt-2 text-sm space-y-2 list-decimal pl-5">
                <li>
                  Crie uma nova branch a partir da <code>main</code> para sua feature ou correção
                </li>
                <li>Desenvolva e teste localmente</li>
                <li>
                  Execute <code>npm run lint</code> e <code>npm run test</code> para verificar seu código
                </li>
                <li>Faça commit das alterações com mensagens descritivas</li>
                <li>Envie um Pull Request para revisão</li>
                <li>
                  Após aprovação, faça merge na branch <code>main</code>
                </li>
              </ol>
            </div>

            <Alert>
              <InfoIcon className="h-4 w-4" />
              <AlertTitle>Dica</AlertTitle>
              <AlertDescription>
                Use o comando <code>npm run dev:seed</code> para popular o banco de dados com dados de teste para
                desenvolvimento.
              </AlertDescription>
            </Alert>
          </TabsContent>

          <TabsContent value="authentication" className="space-y-4 mt-4">
            <div>
              <h3 className="text-lg font-medium">Implementando Autenticação</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                O sistema utiliza o Supabase Auth para autenticação. Aqui está como implementar autenticação em
                diferentes contextos:
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="text-base font-medium">Autenticação em Componentes do Cliente</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Para componentes do lado do cliente, use o hook <code>useUser</code>:
                </p>
                <Code language="tsx" className="mt-2">
                  {`'use client'

import { useUser } from '@/hooks/use-user'

export default function ProfileButton() {
  const { user, isLoading } = useUser()

  if (isLoading) {
    return <div>Carregando...</div>
  }

  if (!user) {
    return <LoginButton />
  }

  return (
    <Button>
      <UserIcon className="mr-2 h-4 w-4" />
      {user.name || 'Perfil'}
    </Button>
  )
}`}
                </Code>
              </div>

              <div>
                <h4 className="text-base font-medium">Autenticação em Componentes do Servidor</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Para componentes do lado do servidor, use a função <code>getCurrentUser</code>:
                </p>
                <Code language="tsx" className="mt-2">
                  {`import { getCurrentUser } from '@/lib/session'
import { redirect } from 'next/navigation'

export default async function DashboardPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect('/login')
  }

  return (
    <div>
      <h1>Bem-vindo, {user.name || 'Usuário'}</h1>
      {/* Conteúdo do dashboard */}
    </div>
  )
}`}
                </Code>
              </div>

              <div>
                <h4 className="text-base font-medium">Autenticação em APIs</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Para rotas de API, verifique a autenticação usando o cliente Supabase:
                </p>
                <Code language="tsx" className="mt-2">
                  {`import { createClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const supabase = createClient(cookies())
  
  // Verificar autenticação
  const { data: { session } } = await supabase.auth.getSession()
  
  if (!session) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  }
  
  // Continuar com a lógica da API
  const userId = session.user.id
  
  // ...
  
  return NextResponse.json({ data: 'Dados protegidos' })
}`}
                </Code>
              </div>

              <div>
                <h4 className="text-base font-medium">Fluxos de Autenticação</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Implementando os principais fluxos de autenticação:
                </p>
                <ul className="mt-2 text-sm space-y-1 list-disc pl-5">
                  <li>
                    <strong>Login</strong>: Use <code>signInWithPassword</code> do Supabase Auth
                  </li>
                  <li>
                    <strong>Registro</strong>: Use <code>signUp</code> do Supabase Auth
                  </li>
                  <li>
                    <strong>Logout</strong>: Use <code>signOut</code> do Supabase Auth
                  </li>
                  <li>
                    <strong>Redefinição de senha</strong>: Use <code>resetPasswordForEmail</code> do Supabase Auth
                  </li>
                </ul>
              </div>
            </div>

            <Alert>
              <InfoIcon className="h-4 w-4" />
              <AlertTitle>Segurança</AlertTitle>
              <AlertDescription>
                Nunca armazene tokens de autenticação em localStorage. O sistema usa cookies HttpOnly para armazenamento
                seguro de tokens.
              </AlertDescription>
            </Alert>
          </TabsContent>

          <TabsContent value="database" className="space-y-4 mt-4">
            <div>
              <h3 className="text-lg font-medium">Trabalhando com o Banco de Dados</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                O sistema utiliza PostgreSQL através do Supabase. Aqui estão as melhores práticas para trabalhar com o
                banco de dados:
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="text-base font-medium">Acessando o Banco de Dados</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Use os clientes Supabase para acessar o banco de dados:
                </p>
                <Code language="tsx" className="mt-2">
                  {`// Cliente para componentes do servidor
import { createClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'

export async function getData() {
  const supabase = createClient(cookies())
  
  const { data, error } = await supabase
    .from('table_name')
    .select('*')
    .order('created_at', { ascending: false })
  
  if (error) {
    console.error('Erro ao buscar dados:', error)
    return null
  }
  
  return data
}

// Cliente para operações administrativas
import { createServiceRoleClient } from '@/lib/supabase/service-role'

export async function adminOperation() {
  const supabase = createServiceRoleClient()
  
  // Operações com permissões elevadas
  const { data, error } = await supabase.from('users').select('*')
  
  // ...
}`}
                </Code>
              </div>

              <div>
                <h4 className="text-base font-medium">Criando Migrações</h4>
                <p className="text-sm text-muted-foreground mt-1">Para criar uma nova migração:</p>
                <ol className="mt-2 text-sm space-y-1 list-decimal pl-5">
                  <li>
                    Crie um novo arquivo SQL na pasta <code>migrations/</code> com o prefixo numérico sequencial
                  </li>
                  <li>Escreva as instruções SQL para a migração</li>
                  <li>Inclua comentários descritivos e instruções de rollback</li>
                  <li>Teste a migração em ambiente de desenvolvimento</li>
                  <li>Execute a migração através do painel administrativo ou via CLI</li>
                </ol>
                <Code language="sql" className="mt-2">
                  {`-- migrations/009_add_user_preferences.sql
-- Descrição: Adiciona coluna de preferências à tabela de usuários
-- Autor: Seu Nome
-- Data: 2023-03-01

-- Adicionar coluna de preferências como JSONB
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS preferences JSONB DEFAULT '{}'::jsonb;

-- Adicionar índice para consultas eficientes
CREATE INDEX IF NOT EXISTS idx_users_preferences ON public.users USING gin(preferences);

-- ROLLBACK: Remover coluna e índice em caso de problemas
-- DROP INDEX IF EXISTS idx_users_preferences;
-- ALTER TABLE public.users DROP COLUMN IF EXISTS preferences;`}
                </Code>
              </div>

              <div>
                <h4 className="text-base font-medium">Boas Práticas</h4>
                <ul className="mt-2 text-sm space-y-1 list-disc pl-5">
                  <li>Use Row Level Security (RLS) para controle de acesso a dados</li>
                  <li>Crie índices para campos frequentemente usados em consultas</li>
                  <li>Use views para encapsular consultas complexas</li>
                  <li>Implemente validação tanto no cliente quanto no servidor</li>
                  <li>Use transações para operações que afetam múltiplas tabelas</li>
                  <li>
                    Evite consultas N+1 usando <code>select('*')</code> com relações
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="text-base font-medium">Exemplo de Consulta com Relações</h4>
                <Code language="tsx" className="mt-2">
                  {`// Buscar usuários com seus perfis e assinaturas
const { data, error } = await supabase
  .from('users')
  .select(\`
    id,
    email,
    name,
    profiles (*),
    subscriptions (
      id,
      plan_id,
      status,
      current_period_end
    )
  \`)
  .eq('status', 'active')
  .order('created_at', { ascending: false })`}
                </Code>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="deployment" className="space-y-4 mt-4">
            <div>
              <h3 className="text-lg font-medium">Implantação</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Guia para implantar o sistema em ambientes de produção e homologação.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="text-base font-medium">Ambientes</h4>
                <p className="text-sm text-muted-foreground mt-1">O sistema suporta os seguintes ambientes:</p>
                <ul className="mt-2 text-sm space-y-1 list-disc pl-5">
                  <li>
                    <strong>Desenvolvimento</strong>: Ambiente local para desenvolvimento
                  </li>
                  <li>
                    <strong>Homologação</strong>: Ambiente para testes e validação
                  </li>
                  <li>
                    <strong>Produção</strong>: Ambiente para usuários finais
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="text-base font-medium">Implantação na Vercel</h4>
                <p className="text-sm text-muted-foreground mt-1">O sistema é otimizado para implantação na Vercel:</p>
                <ol className="mt-2 text-sm space-y-1 list-decimal pl-5">
                  <li>Configure o projeto na Vercel Dashboard</li>
                  <li>Adicione as variáveis de ambiente necessárias</li>
                  <li>Conecte ao repositório Git</li>
                  <li>Configure os domínios personalizados</li>
                  <li>Ative a integração contínua para implantação automática</li>
                </ol>
                <Code language="bash" className="mt-2">
                  {`# Implantação manual via CLI
vercel --prod`}
                </Code>
              </div>

              <div>
                <h4 className="text-base font-medium">Variáveis de Ambiente</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Variáveis de ambiente necessárias para implantação:
                </p>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm mt-2">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2 px-4 font-medium">Variável</th>
                        <th className="text-left py-2 px-4 font-medium">Descrição</th>
                        <th className="text-left py-2 px-4 font-medium">Exemplo</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b">
                        <td className="py-2 px-4 font-mono">NEXT_PUBLIC_SUPABASE_URL</td>
                        <td className="py-2 px-4">URL do projeto Supabase</td>
                        <td className="py-2 px-4 font-mono">https://example.supabase.co</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-2 px-4 font-mono">NEXT_PUBLIC_SUPABASE_ANON_KEY</td>
                        <td className="py-2 px-4">Chave anônima do Supabase</td>
                        <td className="py-2 px-4 font-mono">eyJhbGciOiJIUzI1...</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-2 px-4 font-mono">SUPABASE_SERVICE_ROLE_KEY</td>
                        <td className="py-2 px-4">Chave de serviço do Supabase</td>
                        <td className="py-2 px-4 font-mono">eyJhbGciOiJIUzI1...</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-2 px-4 font-mono">NEXT_PUBLIC_SITE_URL</td>
                        <td className="py-2 px-4">URL base do site</td>
                        <td className="py-2 px-4 font-mono">https://saas-solucoes.com</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-2 px-4 font-mono">REDIS_URL</td>
                        <td className="py-2 px-4">URL do Redis para cache</td>
                        <td className="py-2 px-4 font-mono">redis://user:pass@host:port</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div>
                <h4 className="text-base font-medium">Checklist de Implantação</h4>
                <ul className="mt-2 text-sm space-y-1 list-disc pl-5">
                  <li>Executar testes automatizados</li>
                  <li>Verificar performance com Lighthouse</li>
                  <li>Aplicar migrações de banco de dados</li>
                  <li>Verificar configurações de segurança</li>
                  <li>Configurar monitoramento e alertas</li>
                  <li>Verificar integrações com serviços externos</li>
                  <li>Testar fluxos críticos após implantação</li>
                </ul>
              </div>
            </div>

            <Alert>
              <InfoIcon className="h-4 w-4" />
              <AlertTitle>Importante</AlertTitle>
              <AlertDescription>
                Sempre faça backup do banco de dados antes de aplicar migrações em produção. Use a funcionalidade de
                backup automático do Supabase para maior segurança.
              </AlertDescription>
            </Alert>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

export default function GuidesDocs() {
  return <GuidesDocumentation />
}
