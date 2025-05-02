"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Code } from "@/components/ui/code"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { InfoIcon } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export function MigrationsDocumentation() {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Migrações de Banco de Dados</CardTitle>
        <CardDescription>
          Documentação sobre o sistema de migrações e histórico de alterações no banco de dados
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid grid-cols-4 w-full">
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="migrations-list">Lista de Migrações</TabsTrigger>
            <TabsTrigger value="how-to">Como Usar</TabsTrigger>
            <TabsTrigger value="best-practices">Boas Práticas</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4 mt-4">
            <div>
              <h3 className="text-lg font-medium">Sistema de Migrações</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                O sistema de migrações do SaaS Soluções permite gerenciar alterações no esquema do banco de dados de
                forma controlada e versionada. Cada migração representa uma alteração específica no banco de dados, como
                criação de tabelas, adição de colunas ou configuração de índices.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-medium">Funcionamento</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                O sistema utiliza uma tabela <code>migrations</code> para rastrear quais migrações já foram aplicadas.
                Cada migração é um arquivo SQL numerado sequencialmente, armazenado no diretório{" "}
                <code>migrations/</code>. As migrações podem ser aplicadas através do painel administrativo ou via linha
                de comando.
              </p>
            </div>

            <div className="p-4 bg-muted rounded-md">
              <pre className="text-xs overflow-x-auto whitespace-pre">
                {`┌─────────────────────────────────────────────────────────────────┐
│                     Fluxo de Migrações                           │
└───────────────────────────┬─────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│ 1. Criar arquivo SQL numerado em migrations/                    │
│    Exemplo: 009_add_user_preferences.sql                        │
└───────────────────────────┬─────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│ 2. Aplicar migração via painel administrativo                   │
│    ou via script de linha de comando                            │
└───────────────────────────┬─────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│ 3. Sistema registra migração na tabela migrations               │
│    com timestamp e status de sucesso                            │
└───────────────────────────┬─────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│ 4. Migração é marcada como aplicada e não será                  │
│    executada novamente                                          │
└─────────────────────────────────────────────────────────────────┘`}
              </pre>
            </div>

            <Alert>
              <InfoIcon className="h-4 w-4" />
              <AlertTitle>Importante</AlertTitle>
              <AlertDescription>
                As migrações são aplicadas em ordem sequencial e não devem ser modificadas após serem aplicadas em
                produção. Para corrigir uma migração com erro, crie uma nova migração que reverta ou corrija o problema.
              </AlertDescription>
            </Alert>
          </TabsContent>

          <TabsContent value="migrations-list" className="space-y-4 mt-4">
            <div>
              <h3 className="text-lg font-medium">Lista de Migrações</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Abaixo está a lista de todas as migrações aplicadas no sistema, em ordem cronológica:
              </p>
            </div>

            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Nome</TableHead>
                    <TableHead>Descrição</TableHead>
                    <TableHead>Data de Criação</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>000</TableCell>
                    <TableCell>create_execute_sql_function.sql</TableCell>
                    <TableCell>Cria função auxiliar para execução de SQL dinâmico</TableCell>
                    <TableCell>10/01/2023</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>001</TableCell>
                    <TableCell>insert_solutions.sql</TableCell>
                    <TableCell>Insere soluções iniciais no sistema</TableCell>
                    <TableCell>15/01/2023</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>002</TableCell>
                    <TableCell>add_profile_fields.sql</TableCell>
                    <TableCell>Adiciona campos adicionais à tabela de perfis</TableCell>
                    <TableCell>20/01/2023</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>003</TableCell>
                    <TableCell>create_plans.sql</TableCell>
                    <TableCell>Cria tabela de planos de assinatura</TableCell>
                    <TableCell>25/01/2023</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>004</TableCell>
                    <TableCell>create_plan_solutions.sql</TableCell>
                    <TableCell>Cria tabela de relacionamento entre planos e soluções</TableCell>
                    <TableCell>01/02/2023</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>005</TableCell>
                    <TableCell>create_subscriptions.sql</TableCell>
                    <TableCell>Cria tabela de assinaturas de usuários</TableCell>
                    <TableCell>10/02/2023</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>006</TableCell>
                    <TableCell>configure_storage_permissions.sql</TableCell>
                    <TableCell>Configura permissões para armazenamento de arquivos</TableCell>
                    <TableCell>15/02/2023</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>007</TableCell>
                    <TableCell>create_profiles_table.sql</TableCell>
                    <TableCell>Cria tabela de perfis de usuários</TableCell>
                    <TableCell>20/02/2023</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>008</TableCell>
                    <TableCell>create_user_profiles_view.sql</TableCell>
                    <TableCell>Cria view que combina dados de usuários e perfis</TableCell>
                    <TableCell>25/02/2023</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>

            <div className="space-y-4 mt-4">
              <h3 className="text-lg font-medium">Detalhes das Migrações</h3>

              <div>
                <h4 className="text-base font-medium">008_create_user_profiles_view.sql</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Cria uma view que combina dados das tabelas users e profiles para facilitar consultas.
                </p>
                <Code language="sql" className="mt-2">
                  {`CREATE OR REPLACE VIEW public.user_profiles_view AS
SELECT 
  u.id,
  u.email,
  u.user_type,
  u.plan,
  u.status,
  u.created_at,
  p.name,
  p.bio,
  p.phone,
  p.job_title,
  p.company,
  p.website,
  p.location,
  p.avatar_url,
  p.preferences,
  p.profile_complete,
  p.company_name,
  p.company_size,
  p.industry,
  p.address,
  p.city,
  p.state,
  p.country,
  p.postal_code,
  p.social_links,
  p.created_at AS profile_created_at,
  p.updated_at AS profile_updated_at
FROM 
  public.users u
INNER JOIN 
  public.profiles p ON u.id = p.id;`}
                </Code>
              </div>

              <div>
                <h4 className="text-base font-medium">007_create_profiles_table.sql</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Cria a tabela de perfis de usuários com campos para informações pessoais e profissionais.
                </p>
                <Code language="sql" className="mt-2">
                  {`CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES public.users(id) ON DELETE CASCADE,
  name TEXT,
  bio TEXT,
  phone TEXT,
  job_title TEXT,
  company TEXT,
  website TEXT,
  location TEXT,
  avatar_url TEXT,
  preferences JSONB,
  profile_complete BOOLEAN DEFAULT false,
  company_name TEXT,
  company_size TEXT,
  industry TEXT,
  address TEXT,
  city TEXT,
  state TEXT,
  country TEXT,
  postal_code TEXT,
  social_links JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Trigger para atualizar o timestamp
CREATE OR REPLACE FUNCTION update_profile_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_profile_timestamp
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION update_profile_timestamp();`}
                </Code>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="how-to" className="space-y-4 mt-4">
            <div>
              <h3 className="text-lg font-medium">Como Usar o Sistema de Migrações</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                O sistema de migrações pode ser utilizado de duas formas: através do painel administrativo ou via linha
                de comando.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="text-base font-medium">Usando o Painel Administrativo</h4>
                <ol className="mt-2 text-sm space-y-2 list-decimal pl-5">
                  <li>
                    Acesse o painel administrativo em <code>/admin/migracoes</code>
                  </li>
                  <li>Clique em "Nova Migração" para criar um novo arquivo de migração</li>
                  <li>Digite um nome descritivo para a migração (sem o prefixo numérico)</li>
                  <li>Escreva o código SQL da migração no editor</li>
                  <li>Clique em "Salvar" para criar o arquivo de migração</li>
                  <li>Clique em "Executar" para aplicar a migração ao banco de dados</li>
                </ol>
              </div>

              <div>
                <h4 className="text-base font-medium">Usando a Linha de Comando</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Para executar migrações via linha de comando, utilize o script <code>run-migration.ts</code>:
                </p>
                <Code language="bash" className="mt-2">
                  {`# Executar uma migração específica
npx tsx scripts/run-migration.ts --file=008_create_user_profiles_view.sql

# Executar todas as migrações pendentes
npx tsx scripts/run-migration.ts --all

# Verificar status das migrações
npx tsx scripts/run-migration.ts --status`}
                </Code>
              </div>

              <div>
                <h4 className="text-base font-medium">Criando uma Nova Migração</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Para criar uma nova migração manualmente, siga estas etapas:
                </p>
                <ol className="mt-2 text-sm space-y-2 list-decimal pl-5">
                  <li>
                    Crie um novo arquivo no diretório <code>migrations/</code> com o prefixo numérico sequencial (ex:{" "}
                    <code>009_add_user_preferences.sql</code>)
                  </li>
                  <li>
                    Escreva o código SQL da migração, começando com comentários que descrevem o propósito da migração
                  </li>
                  <li>
                    Inclua instruções para reverter a migração em caso de problemas (comentadas com{" "}
                    <code>-- ROLLBACK:</code>)
                  </li>
                  <li>Teste a migração em um ambiente de desenvolvimento antes de aplicá-la em produção</li>
                </ol>
                <Code language="sql" className="mt-2">
                  {`-- Migração: 009_add_user_preferences.sql
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
            </div>
          </TabsContent>

          <TabsContent value="best-practices" className="space-y-4 mt-4">
            <div>
              <h3 className="text-lg font-medium">Boas Práticas para Migrações</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Seguir estas boas práticas ajudará a manter o sistema de migrações organizado e confiável:
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="text-base font-medium">Nomenclatura e Organização</h4>
                <ul className="mt-2 text-sm space-y-2 list-disc pl-5">
                  <li>
                    Use prefixos numéricos sequenciais de três dígitos (ex: <code>001_</code>, <code>002_</code>)
                  </li>
                  <li>
                    Use nomes descritivos que indicam claramente o propósito da migração (ex:{" "}
                    <code>create_users_table.sql</code>, <code>add_email_index.sql</code>)
                  </li>
                  <li>Inclua comentários no início do arquivo com descrição, autor e data</li>
                  <li>
                    Agrupe migrações relacionadas com prefixos semelhantes (ex: <code>001_create_users_table.sql</code>,{" "}
                    <code>002_create_users_index.sql</code>)
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="text-base font-medium">Conteúdo das Migrações</h4>
                <ul className="mt-2 text-sm space-y-2 list-disc pl-5">
                  <li>Mantenha cada migração focada em uma única alteração lógica</li>
                  <li>
                    Use instruções idempotentes sempre que possível (ex: <code>CREATE TABLE IF NOT EXISTS</code>)
                  </li>
                  <li>Inclua instruções de rollback comentadas para reverter a migração se necessário</li>
                  <li>Evite dependências circulares entre migrações</li>
                  <li>Teste migrações em ambiente de desenvolvimento antes de aplicá-las em produção</li>
                </ul>
              </div>

              <div>
                <h4 className="text-base font-medium">Segurança e Performance</h4>
                <ul className="mt-2 text-sm space-y-2 list-disc pl-5">
                  <li>
                    Considere o impacto de performance em tabelas grandes (use <code>CONCURRENTLY</code> para índices)
                  </li>
                  <li>Evite bloqueios longos que possam afetar a disponibilidade do sistema</li>
                  <li>Não inclua dados sensíveis ou credenciais nas migrações</li>
                  <li>Para migrações de dados grandes, considere dividir em lotes menores</li>
                  <li>Aplique migrações em janelas de manutenção para sistemas em produção</li>
                </ul>
              </div>

              <div>
                <h4 className="text-base font-medium">Versionamento e Colaboração</h4>
                <ul className="mt-2 text-sm space-y-2 list-disc pl-5">
                  <li>Nunca modifique uma migração que já foi aplicada em produção</li>
                  <li>Coordene a numeração de migrações entre membros da equipe para evitar conflitos</li>
                  <li>Documente alterações significativas no esquema do banco de dados</li>
                  <li>Mantenha um histórico de migrações aplicadas em cada ambiente</li>
                  <li>Revise migrações antes de aplicá-las em ambientes de produção</li>
                </ul>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

export default function MigrationsDocs() {
  return <MigrationsDocumentation />
}
