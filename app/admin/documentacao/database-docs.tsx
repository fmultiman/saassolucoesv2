"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { InfoIcon } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function DatabaseDocumentation() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Estrutura de Banco de Dados - SaaS Soluções</CardTitle>
          <CardDescription>Documentação completa sobre a estrutura do banco de dados do SaaS Soluções</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Tabs defaultValue="tables" className="w-full">
            <TabsList className="grid grid-cols-4 w-full">
              <TabsTrigger value="tables">Tabelas</TabsTrigger>
              <TabsTrigger value="views">Views</TabsTrigger>
              <TabsTrigger value="storage">Storage</TabsTrigger>
              <TabsTrigger value="migrations">Migrações</TabsTrigger>
            </TabsList>

            <TabsContent value="tables" className="space-y-6 mt-4">
              <section>
                <h3 className="text-lg font-semibold mb-2">Visão Geral do Banco de Dados</h3>
                <p>
                  O SaaS Soluções utiliza o Supabase como plataforma de banco de dados, que é baseado em PostgreSQL. A
                  estrutura foi projetada para suportar todas as funcionalidades do sistema, desde autenticação até
                  gerenciamento de soluções e assinaturas.
                </p>
              </section>

              <section>
                <h3 className="text-lg font-semibold mb-2">Tabelas Principais</h3>

                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium">auth.users</h4>
                    <p className="text-sm text-muted-foreground">
                      Tabela gerenciada pelo Supabase Auth que armazena informações básicas dos usuários.
                    </p>
                    <ul className="list-disc pl-6 text-sm mt-1">
                      <li>id (uuid): Identificador único do usuário</li>
                      <li>email (text): Email do usuário</li>
                      <li>created_at (timestamp): Data de criação</li>
                      <li>last_sign_in_at (timestamp): Último login</li>
                      <li>role (text): Papel do usuário (default: 'authenticated')</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-medium">public.profiles</h4>
                    <p className="text-sm text-muted-foreground">
                      Armazena informações adicionais do perfil do usuário.
                    </p>
                    <ul className="list-disc pl-6 text-sm mt-1">
                      <li>id (uuid): Chave primária, referencia auth.users.id</li>
                      <li>nome_completo (text): Nome completo do usuário</li>
                      <li>empresa (text): Empresa do usuário</li>
                      <li>cargo (text): Cargo do usuário</li>
                      <li>telefone (text): Telefone de contato</li>
                      <li>avatar_url (text): URL da imagem de perfil</li>
                      <li>created_at (timestamp): Data de criação</li>
                      <li>updated_at (timestamp): Data de atualização</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-medium">public.solutions</h4>
                    <p className="text-sm text-muted-foreground">Catálogo de soluções disponíveis no sistema.</p>
                    <ul className="list-disc pl-6 text-sm mt-1">
                      <li>id (uuid): Identificador único da solução</li>
                      <li>name (text): Nome da solução</li>
                      <li>description (text): Descrição detalhada</li>
                      <li>short_description (text): Descrição curta</li>
                      <li>category (text): Categoria da solução</li>
                      <li>is_active (boolean): Status de ativação</li>
                      <li>created_at (timestamp): Data de criação</li>
                      <li>updated_at (timestamp): Data de atualização</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-medium">public.plans</h4>
                    <p className="text-sm text-muted-foreground">Planos de assinatura disponíveis.</p>
                    <ul className="list-disc pl-6 text-sm mt-1">
                      <li>id (uuid): Identificador único do plano</li>
                      <li>name (text): Nome do plano</li>
                      <li>description (text): Descrição do plano</li>
                      <li>price (numeric): Preço mensal</li>
                      <li>code (text): Código único do plano</li>
                      <li>is_active (boolean): Status de ativação</li>
                      <li>created_at (timestamp): Data de criação</li>
                      <li>updated_at (timestamp): Data de atualização</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-medium">public.plan_solutions</h4>
                    <p className="text-sm text-muted-foreground">Tabela de relacionamento entre planos e soluções.</p>
                    <ul className="list-disc pl-6 text-sm mt-1">
                      <li>id (uuid): Identificador único</li>
                      <li>plan_id (uuid): Referência ao plano</li>
                      <li>solution_id (uuid): Referência à solução</li>
                      <li>created_at (timestamp): Data de criação</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-medium">public.subscriptions</h4>
                    <p className="text-sm text-muted-foreground">Assinaturas dos usuários.</p>
                    <ul className="list-disc pl-6 text-sm mt-1">
                      <li>id (uuid): Identificador único da assinatura</li>
                      <li>user_id (uuid): Referência ao usuário</li>
                      <li>plan_id (uuid): Referência ao plano</li>
                      <li>status (text): Status da assinatura</li>
                      <li>start_date (date): Data de início</li>
                      <li>end_date (date): Data de término</li>
                      <li>created_at (timestamp): Data de criação</li>
                      <li>updated_at (timestamp): Data de atualização</li>
                    </ul>
                  </div>
                </div>
              </section>

              <section>
                <h3 className="text-lg font-semibold mb-2">Relacionamentos</h3>
                <p className="text-sm mb-2">
                  O banco de dados utiliza chaves estrangeiras para garantir a integridade referencial:
                </p>
                <ul className="list-disc pl-6 text-sm">
                  <li>profiles.id → auth.users.id (one-to-one)</li>
                  <li>plan_solutions.plan_id → plans.id (many-to-one)</li>
                  <li>plan_solutions.solution_id → solutions.id (many-to-one)</li>
                  <li>subscriptions.user_id → auth.users.id (many-to-one)</li>
                  <li>subscriptions.plan_id → plans.id (many-to-one)</li>
                </ul>
              </section>

              <section>
                <h3 className="text-lg font-semibold mb-2">Políticas de Segurança (RLS)</h3>
                <p className="text-sm mb-2">
                  O Supabase utiliza Row Level Security (RLS) para controlar o acesso aos dados:
                </p>
                <ul className="list-disc pl-6 text-sm">
                  <li>
                    <strong>profiles</strong>: Usuários podem ler qualquer perfil, mas só podem editar o próprio perfil
                  </li>
                  <li>
                    <strong>solutions</strong>: Leitura pública, escrita apenas para administradores
                  </li>
                  <li>
                    <strong>plans</strong>: Leitura pública, escrita apenas para administradores
                  </li>
                  <li>
                    <strong>subscriptions</strong>: Usuários só podem ver e gerenciar suas próprias assinaturas
                  </li>
                </ul>
              </section>
            </TabsContent>

            <TabsContent value="views" className="space-y-6 mt-4">
              <section>
                <h3 className="text-lg font-semibold mb-2">Views</h3>

                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium">public.user_profiles_view</h4>
                    <p className="text-sm text-muted-foreground">
                      View que combina informações de auth.users e public.profiles para facilitar consultas.
                    </p>
                    <ul className="list-disc pl-6 text-sm mt-1">
                      <li>id (uuid): ID do usuário</li>
                      <li>email (text): Email do usuário</li>
                      <li>nome_completo (text): Nome completo</li>
                      <li>empresa (text): Empresa</li>
                      <li>cargo (text): Cargo</li>
                      <li>telefone (text): Telefone</li>
                      <li>avatar_url (text): URL da imagem de perfil</li>
                      <li>role (text): Papel do usuário</li>
                      <li>created_at (timestamp): Data de criação</li>
                      <li>last_sign_in_at (timestamp): Último login</li>
                    </ul>
                    <div className="mt-2 bg-muted p-3 rounded-md">
                      <p className="text-xs font-mono">Definição da view:</p>
                      <pre className="text-xs overflow-x-auto">
                        {`CREATE OR REPLACE VIEW public.user_profiles_view AS
SELECT 
  u.id,
  u.email,
  p.nome_completo,
  p.empresa,
  p.cargo,
  p.telefone,
  p.avatar_url,
  u.role,
  u.created_at,
  u.last_sign_in_at
FROM auth.users u
LEFT JOIN public.profiles p ON u.id = p.id;`}
                      </pre>
                    </div>
                    <div className="mt-2">
                      <p className="text-sm font-medium">Exemplo de uso:</p>
                      <pre className="text-xs bg-muted p-2 rounded-md">
                        {`// Consultar perfil completo de um usuário
const { data, error } = await supabase
  .from('user_profiles_view')
  .select('*')
  .eq('id', userId)
  .single();`}
                      </pre>
                    </div>
                  </div>
                </div>
              </section>
            </TabsContent>

            <TabsContent value="storage" className="space-y-6 mt-4">
              <section>
                <h3 className="text-lg font-semibold mb-2">Armazenamento (Storage)</h3>

                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium">Visão Geral do Storage</h4>
                    <p className="text-sm text-muted-foreground">
                      O SaaS Soluções utiliza o Supabase Storage para armazenamento de arquivos, como avatares de
                      usuários e outros conteúdos. O Supabase Storage é uma camada de abstração sobre serviços de
                      armazenamento compatíveis com S3, como AWS S3, MinIO, ou outros.
                    </p>
                  </div>

                  <div>
                    <h4 className="font-medium">Arquitetura do Storage</h4>
                    <p className="text-sm text-muted-foreground">
                      No Supabase Storage com S3/MinIO, o controle de acesso é feito no banco de dados (PostgreSQL) via
                      registros e RLS, enquanto os arquivos reais são armazenados fisicamente no bucket definido (ex:
                      supabase), organizados em pastas conforme o bucket lógico (ex: user-content).
                    </p>

                    <div className="mt-3 bg-muted p-4 rounded-md">
                      <h5 className="text-sm font-medium mb-2">Estrutura de Armazenamento</h5>
                      <pre className="text-xs overflow-x-auto">
                        {`Bucket Físico S3/MinIO: "supabase"
  └── Bucket Lógico: "user-content"
      └── Pasta: "avatars"
          └── [user-id]-[timestamp].[extensão]`}
                      </pre>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium">Buckets Configurados</h4>
                    <div className="mt-2 space-y-3">
                      <div className="bg-muted p-3 rounded-md">
                        <h5 className="text-sm font-medium">user-content</h5>
                        <p className="text-xs text-muted-foreground mt-1">
                          Bucket principal para armazenamento de conteúdo gerado por usuários.
                        </p>
                        <ul className="list-disc pl-5 text-xs mt-2">
                          <li>
                            <strong>Acesso:</strong> Leitura pública, escrita apenas para usuários autenticados
                          </li>
                          <li>
                            <strong>Limite de tamanho:</strong> 5MB por arquivo
                          </li>
                          <li>
                            <strong>Estrutura de pastas:</strong>
                            <ul className="list-disc pl-5 mt-1">
                              <li>
                                <code>avatars/</code> - Imagens de perfil dos usuários
                              </li>
                            </ul>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium">Sistema de Avatares</h4>
                    <p className="text-sm text-muted-foreground">
                      O sistema de avatares permite que os usuários façam upload de imagens de perfil. Estas imagens são
                      armazenadas no bucket "user-content" na pasta "avatars" e referenciadas na tabela "profiles".
                    </p>

                    <h5 className="text-sm font-medium mt-3">Fluxo de Upload de Avatar</h5>
                    <ol className="list-decimal pl-6 text-sm mt-1 space-y-1">
                      <li>
                        O usuário seleciona uma imagem através do componente <code>AvatarUpload</code>
                      </li>
                      <li>O componente valida o tipo e tamanho do arquivo (máx. 5MB)</li>
                      <li>O sistema verifica/configura o bucket de storage se necessário</li>
                      <li>
                        O arquivo é enviado para o Supabase Storage com um nome único:{" "}
                        <code>[user-id]-[timestamp].[extensão]</code>
                      </li>
                      <li>O Supabase Storage armazena o arquivo no bucket físico S3/MinIO</li>
                      <li>
                        A URL pública do arquivo é obtida e armazenada no campo <code>avatar_url</code> da tabela{" "}
                        <code>profiles</code>
                      </li>
                    </ol>

                    <div className="mt-3">
                      <h5 className="text-sm font-medium">Implementação do Componente AvatarUpload</h5>
                      <pre className="text-xs bg-muted p-2 rounded-md mt-1">
                        {`// Exemplo de uso do componente AvatarUpload
<AvatarUpload
  currentAvatarUrl={profile?.avatar_url || null}
  userId={userId}
  onAvatarChange={(url) => {
    // Atualizar o perfil com a nova URL
    updateProfile({ ...profile, avatar_url: url });
  }}
  size="lg"
/>`}
                      </pre>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium">Políticas de Segurança (RLS)</h4>
                    <p className="text-sm text-muted-foreground">
                      As seguintes políticas de segurança são aplicadas ao armazenamento:
                    </p>

                    <div className="bg-muted p-4 rounded-md mt-2 overflow-x-auto">
                      <pre className="text-xs">
                        <code>
                          {`-- Política para permitir leitura pública
CREATE POLICY "Allow public read access" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'user-content');

-- Política para permitir upload para usuários autenticados
CREATE POLICY "Allow authenticated uploads" 
ON storage.objects 
FOR INSERT 
TO authenticated 
WITH CHECK (bucket_id = 'user-content');

-- Política para permitir atualização para usuários autenticados
CREATE POLICY "Allow authenticated updates" 
ON storage.objects 
FOR UPDATE 
TO authenticated
USING (bucket_id = 'user-content');

-- Política para permitir exclusão para usuários autenticados
CREATE POLICY "Allow authenticated deletes" 
ON storage.objects 
FOR DELETE 
TO authenticated
USING (bucket_id = 'user-content');`}
                        </code>
                      </pre>
                    </div>

                    <p className="text-sm mt-3">Estas políticas garantem que:</p>
                    <ul className="list-disc pl-6 text-sm space-y-1 mt-1">
                      <li>Qualquer pessoa pode visualizar os arquivos (útil para avatares públicos)</li>
                      <li>Apenas usuários autenticados podem fazer upload, atualizar ou excluir arquivos</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-medium">Configuração e Diagnóstico</h4>
                    <p className="text-sm text-muted-foreground">
                      O sistema inclui ferramentas para configuração e diagnóstico do storage:
                    </p>

                    <ul className="list-disc pl-6 text-sm mt-1">
                      <li>
                        <strong>Configuração Automática:</strong> O sistema configura automaticamente o bucket e as
                        políticas de segurança durante a inicialização da aplicação
                      </li>
                      <li>
                        <strong>Componente StorageDiagnostics:</strong> Ferramenta para diagnosticar problemas de
                        storage, verificar configurações e testar uploads
                      </li>
                      <li>
                        <strong>API de Configuração:</strong> Endpoints para configurar e verificar o status do storage
                      </li>
                    </ul>

                    <div className="mt-3">
                      <h5 className="text-sm font-medium">Exemplo de Diagnóstico</h5>
                      <pre className="text-xs bg-muted p-2 rounded-md mt-1">
                        {`// Verificar status do storage
const checkStorage = async () => {
  const response = await fetch('/api/storage/status');
  const data = await response.json();
  console.log('Status do storage:', data);
};

// Configurar storage
const setupStorage = async () => {
  const response = await fetch('/api/storage/setup', {
    method: 'POST'
  });
  const data = await response.json();
  console.log('Configuração do storage:', data);
};`}
                      </pre>
                    </div>
                  </div>

                  <Alert>
                    <InfoIcon className="h-4 w-4" />
                    <AlertTitle>Importante</AlertTitle>
                    <AlertDescription>
                      Para que o sistema de storage funcione corretamente, é necessário que o serviço S3/MinIO esteja
                      configurado e acessível. Verifique as variáveis de ambiente relacionadas ao storage no arquivo
                      .env.
                    </AlertDescription>
                  </Alert>
                </div>
              </section>
            </TabsContent>

            <TabsContent value="migrations" className="space-y-6 mt-4">
              <section>
                <h3 className="text-lg font-semibold mb-2">Migrações</h3>
                <p className="text-sm mb-2">
                  As migrações são gerenciadas através de arquivos SQL numerados sequencialmente:
                </p>
                <ul className="list-disc pl-6 text-sm">
                  <li>000_create_execute_sql_function.sql</li>
                  <li>001_insert_solutions.sql</li>
                  <li>002_add_profile_fields.sql</li>
                  <li>003_create_plans.sql</li>
                  <li>004_create_plan_solutions.sql</li>
                  <li>005_create_subscriptions.sql</li>
                  <li>006_configure_storage_permissions.sql</li>
                  <li>007_create_profiles_table.sql</li>
                  <li>008_create_user_profiles_view.sql</li>
                  <li>009_fix_storage_policies.sql</li>
                </ul>

                <div className="mt-4">
                  <h4 className="text-base font-medium">Processo de Migração</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    O sistema utiliza uma tabela <code>migrations</code> para rastrear quais migrações já foram
                    aplicadas. As migrações são executadas em ordem sequencial e apenas uma vez.
                  </p>

                  <div className="mt-2">
                    <h5 className="text-sm font-medium">Estrutura da tabela migrations</h5>
                    <ul className="list-disc pl-6 text-sm mt-1">
                      <li>id (serial): Identificador único da migração</li>
                      <li>name (text): Nome do arquivo de migração</li>
                      <li>applied_at (timestamp): Data e hora da aplicação</li>
                    </ul>
                  </div>

                  <div className="mt-3">
                    <h5 className="text-sm font-medium">Executando migrações manualmente</h5>
                    <p className="text-sm text-muted-foreground mt-1">
                      As migrações podem ser executadas através do painel administrativo ou via API:
                    </p>
                    <pre className="text-xs bg-muted p-2 rounded-md mt-1">
                      {`// Executar uma migração específica
const executeMigration = async (migrationName) => {
  const response = await fetch('/api/admin/migrations/execute', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ name: migrationName })
  });
  return await response.json();
};`}
                    </pre>
                  </div>
                </div>
              </section>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

export default function DatabaseDocs() {
  return <DatabaseDocumentation />
}
