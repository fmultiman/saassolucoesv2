"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Code } from "@/components/ui/code"

export function AuthDocumentation() {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Autenticação e Usuários</CardTitle>
        <CardDescription>Documentação sobre o sistema de autenticação e gerenciamento de usuários</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid grid-cols-5 w-full">
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="auth">Autenticação</TabsTrigger>
            <TabsTrigger value="users">Usuários</TabsTrigger>
            <TabsTrigger value="profiles">Perfis</TabsTrigger>
            <TabsTrigger value="apis">APIs</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4 mt-4">
            <div>
              <h3 className="text-lg font-medium">Sistema de Autenticação e Usuários</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                O SaaS Soluções utiliza o Supabase Auth para gerenciar autenticação e usuários. Este sistema fornece
                funcionalidades completas de registro, login, recuperação de senha, e gerenciamento de perfis.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-medium">Principais Características</h3>
              <ul className="mt-2 text-sm space-y-2 list-disc pl-5">
                <li>
                  <strong>Autenticação por Email/Senha</strong>: Sistema padrão de autenticação com email e senha
                </li>
                <li>
                  <strong>Verificação de Email</strong>: Processo de verificação para garantir emails válidos
                </li>
                <li>
                  <strong>Recuperação de Senha</strong>: Fluxo seguro para redefinição de senhas
                </li>
                <li>
                  <strong>Perfis de Usuário</strong>: Dados adicionais associados a cada usuário
                </li>
                <li>
                  <strong>Controle de Acesso</strong>: Diferentes níveis de permissão (usuário, admin)
                </li>
                <li>
                  <strong>Gerenciamento de Avatares</strong>: Upload e gerenciamento de fotos de perfil
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-medium">Fluxo de Autenticação</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                O diagrama abaixo ilustra o fluxo básico de autenticação no sistema:
              </p>
              <div className="mt-2 bg-muted p-3 rounded-md">
                <pre className="text-xs">
                  {`1. Registro
   ├─ Usuário preenche formulário de cadastro
   ├─ Sistema valida dados e cria conta
   ├─ Email de verificação é enviado
   └─ Usuário é redirecionado para página de confirmação

2. Login
   ├─ Usuário fornece credenciais
   ├─ Sistema valida credenciais
   ├─ Sessão é criada
   └─ Usuário é redirecionado para dashboard

3. Recuperação de Senha
   ├─ Usuário solicita recuperação
   ├─ Email com link de redefinição é enviado
   ├─ Usuário define nova senha
   └─ Usuário é redirecionado para login`}
                </pre>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="auth" className="space-y-4 mt-4">
            <div>
              <h3 className="text-lg font-medium">Sistema de Autenticação</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                O sistema de autenticação é baseado no Supabase Auth, que fornece uma API completa para gerenciar
                usuários e sessões.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-medium">Configuração</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                A configuração do sistema de autenticação é feita através de variáveis de ambiente e arquivos de
                configuração.
              </p>
              <Code language="typescript" className="mt-2">
                {`// lib/supabase/server.ts
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { cookieOptions } from './cookie-config'

export function createClient() {
  const cookieStore = cookies()
  
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name) {
          return cookieStore.get(name)?.value
        },
        set(name, value, options) {
          cookieStore.set({ name, value, ...options })
        },
        remove(name, options) {
          cookieStore.set({ name, value: '', ...options })
        },
      },
    }
  )
}`}
              </Code>
            </div>

            <div>
              <h3 className="text-lg font-medium">Funções de Autenticação</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                O sistema fornece várias funções para gerenciar a autenticação de usuários.
              </p>
              <Code language="typescript" className="mt-2">
                {`// Exemplo de login
async function login(email: string, password: string) {
  const supabase = createClient()
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })
  
  if (error) throw error
  return data
}

// Exemplo de registro
async function signup(email: string, password: string, userData: any) {
  const supabase = createClient()
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: userData,
    },
  })
  
  if (error) throw error
  return data
}

// Exemplo de logout
async function logout() {
  const supabase = createClient()
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}`}
              </Code>
            </div>

            <div>
              <h3 className="text-lg font-medium">Middleware de Autenticação</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                O sistema utiliza um middleware para proteger rotas e verificar a autenticação do usuário.
              </p>
              <Code language="typescript" className="mt-2">
                {`// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/middleware'

export async function middleware(request: NextRequest) {
  const { supabase, response } = createClient(request)
  
  // Verificar se o usuário está autenticado
  const {
    data: { session },
  } = await supabase.auth.getSession()
  
  // Redirecionar para login se não estiver autenticado
  if (!session && !request.nextUrl.pathname.startsWith('/login')) {
    return NextResponse.redirect(new URL('/login', request.url))
  }
  
  return response
}

// Configurar quais rotas o middleware deve proteger
export const config = {
  matcher: ['/dashboard/:path*', '/perfil/:path*', '/admin/:path*'],
}`}
              </Code>
            </div>
          </TabsContent>

          <TabsContent value="users" className="space-y-4 mt-4">
            <div>
              <h3 className="text-lg font-medium">Gerenciamento de Usuários</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                O sistema fornece funcionalidades para gerenciar usuários, incluindo criação, atualização e exclusão.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-medium">Estrutura de Dados</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Os usuários são armazenados na tabela <code>auth.users</code> gerenciada pelo Supabase Auth.
              </p>
              <Code language="typescript" className="mt-2">
                {`// Tipo de usuário
interface User {
  id: string
  email: string
  role: string
  created_at: string
  last_sign_in_at: string | null
  // Outros campos gerenciados pelo Supabase Auth
}

// Exemplo de consulta de usuário
async function getUser(userId: string) {
  const supabase = createClient()
  const { data, error } = await supabase.auth.admin.getUserById(userId)
  
  if (error) throw error
  return data.user
}`}
              </Code>
            </div>

            <div>
              <h3 className="text-lg font-medium">Funções de Gerenciamento</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                O sistema fornece várias funções para gerenciar usuários.
              </p>
              <Code language="typescript" className="mt-2">
                {`// Criar usuário (admin)
async function createUser(email: string, password: string, role: string = 'authenticated') {
  const supabase = createServiceRoleClient()
  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { role }
  })
  
  if (error) throw error
  return data
}

// Atualizar usuário
async function updateUser(userId: string, userData: any) {
  const supabase = createServiceRoleClient()
  const { data, error } = await supabase.auth.admin.updateUserById(
    userId,
    userData
  )
  
  if (error) throw error
  return data
}

// Excluir usuário
async function deleteUser(userId: string) {
  const supabase = createServiceRoleClient()
  const { error } = await supabase.auth.admin.deleteUser(userId)
  
  if (error) throw error
  return { success: true }
}`}
              </Code>
            </div>

            <div>
              <h3 className="text-lg font-medium">Controle de Acesso</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                O sistema utiliza roles para controlar o acesso a diferentes funcionalidades.
              </p>
              <Code language="typescript" className="mt-2">
                {`// Verificar se o usuário é admin
async function isAdmin(userId: string) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('user_profiles_view')
    .select('role')
    .eq('id', userId)
    .single()
  
  if (error) return false
  return data.role === 'admin'
}

// Componente de proteção para rotas admin
function AdminProtectedRoute({ children }) {
  const { user, isLoading } = useCurrentUser()
  
  if (isLoading) return <LoadingSpinner />
  
  if (!user || user.role !== 'admin') {
    return <AccessDenied />
  }
  
  return children
}`}
              </Code>
            </div>
          </TabsContent>

          <TabsContent value="profiles" className="space-y-4 mt-4">
            <div>
              <h3 className="text-lg font-medium">Perfis de Usuário</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Além das informações básicas de autenticação, o sistema mantém perfis de usuário com informações
                adicionais.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-medium">Estrutura de Dados</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Os perfis são armazenados na tabela <code>public.profiles</code> e relacionados com
                <code>auth.users</code> através do ID do usuário.
              </p>
              <Code language="typescript" className="mt-2">
                {`// Tipo de perfil
interface Profile {
  id: string // Mesmo ID do usuário
  nome_completo: string | null
  empresa: string | null
  cargo: string | null
  telefone: string | null
  avatar_url: string | null
  created_at: string
  updated_at: string
}

// Exemplo de consulta de perfil
async function getProfile(userId: string) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()
  
  if (error) throw error
  return data
}`}
              </Code>
            </div>

            <div>
              <h3 className="text-lg font-medium">Gerenciamento de Perfil</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                O sistema fornece funções para gerenciar perfis de usuário.
              </p>
              <Code language="typescript" className="mt-2">
                {`// Criar ou atualizar perfil
async function upsertProfile(profile) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('profiles')
    .upsert(profile)
    .select()
  
  if (error) throw error
  return data[0]
}

// Exemplo de uso do componente ProfileForm
function ProfilePage() {
  const { user } = useCurrentUser()
  const { profile, isLoading } = useProfile(user?.id)
  
  if (isLoading) return <LoadingSpinner />
  
  return (
    <ProfileForm
      profile={profile}
      userId={user.id}
      onUpdateProfile={handleProfileUpdate}
    />
  )
}`}
              </Code>
            </div>

            <div>
              <h3 className="text-lg font-medium">Sistema de Avatares</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                O sistema permite que os usuários façam upload de avatares (fotos de perfil).
              </p>
              <Code language="typescript" className="mt-2">
                {`// Componente de upload de avatar
function AvatarUploadExample() {
  const { user } = useCurrentUser()
  const { profile, updateProfile } = useProfile(user?.id)
  
  return (
    <AvatarUpload
      currentAvatarUrl={profile?.avatar_url || null}
      userId={user.id}
      onAvatarChange={(url) => {
        updateProfile({ ...profile, avatar_url: url })
      }}
      size="lg"
    />
  )
}

// Fluxo de upload de avatar
// 1. Usuário seleciona imagem
// 2. Componente valida tipo e tamanho
// 3. Imagem é enviada para o bucket "user-content/avatars"
// 4. URL pública é gerada e salva no perfil do usuário`}
              </Code>
            </div>
          </TabsContent>

          <TabsContent value="apis" className="space-y-4 mt-4">
            <div>
              <h3 className="text-lg font-medium">APIs de Autenticação e Usuários</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                O sistema fornece várias APIs para gerenciar autenticação e usuários.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-medium">APIs de Autenticação</h3>
              <div className="mt-2 space-y-3">
                <div className="bg-muted p-3 rounded-md">
                  <h4 className="text-sm font-medium">POST /api/auth/login</h4>
                  <p className="text-xs text-muted-foreground mt-1">Autentica um usuário com email e senha.</p>
                  <p className="text-xs mt-1">
                    <strong>Body:</strong> <code>&#123; email: string, password: string &#125;</code>
                  </p>
                  <p className="text-xs mt-1">
                    <strong>Resposta:</strong> <code>&#123; user: User, session: Session &#125;</code>
                  </p>
                </div>

                <div className="bg-muted p-3 rounded-md">
                  <h4 className="text-sm font-medium">POST /api/auth/signup</h4>
                  <p className="text-xs text-muted-foreground mt-1">Registra um novo usuário.</p>
                  <p className="text-xs mt-1">
                    <strong>Body:</strong> <code>{`{ email: string, password: string, userData: any }`}</code>
                  </p>
                  <p className="text-xs mt-1">
                    <strong>Resposta:</strong> <code>&#123; user: User, session: Session &#125;</code>
                  </p>
                </div>

                <div className="bg-muted p-3 rounded-md">
                  <h4 className="text-sm font-medium">POST /api/auth/logout</h4>
                  <p className="text-xs text-muted-foreground mt-1">Encerra a sessão do usuário atual.</p>
                  <p className="text-xs mt-1">
                    <strong>Resposta:</strong> <code>&#123; success: boolean &#125;</code>
                  </p>
                </div>

                <div className="bg-muted p-3 rounded-md">
                  <h4 className="text-sm font-medium">POST /api/auth/reset-password</h4>
                  <p className="text-xs text-muted-foreground mt-1">Solicita redefinição de senha.</p>
                  <p className="text-xs mt-1">
                    <strong>Body:</strong> <code>&#123; email: string &#125;</code>
                  </p>
                  <p className="text-xs mt-1">
                    <strong>Resposta:</strong> <code>&#123; success: boolean &#125;</code>
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium">APIs de Usuários</h3>
              <div className="mt-2 space-y-3">
                <div className="bg-muted p-3 rounded-md">
                  <h4 className="text-sm font-medium">GET /api/users</h4>
                  <p className="text-xs text-muted-foreground mt-1">Lista usuários (requer permissão de admin).</p>
                  <p className="text-xs mt-1">
                    <strong>Query:</strong> <code>?page=1&limit=10&search=termo</code>
                  </p>
                  <p className="text-xs mt-1">
                    <strong>Resposta:</strong>{" "}
                    <code>&#123; users: User[], total: number, page: number, limit: number &#125;</code>
                  </p>
                </div>

                <div className="bg-muted p-3 rounded-md">
                  <h4 className="text-sm font-medium">GET /api/users/[id]</h4>
                  <p className="text-xs text-muted-foreground mt-1">Obtém detalhes de um usuário específico.</p>
                  <p className="text-xs mt-1">
                    <strong>Resposta:</strong> <code>&#123; user: User, profile: Profile &#125;</code>
                  </p>
                </div>

                <div className="bg-muted p-3 rounded-md">
                  <h4 className="text-sm font-medium">POST /api/users</h4>
                  <p className="text-xs text-muted-foreground mt-1">
                    Cria um novo usuário (requer permissão de admin).
                  </p>
                  <p className="text-xs mt-1">
                    <strong>Body:</strong>{" "}
                    <code>{`{ email: string, password: string, role: string, userData: any }`}</code>
                  </p>
                  <p className="text-xs mt-1">
                    <strong>Resposta:</strong> <code>&#123; user: User &#125;</code>
                  </p>
                </div>

                <div className="bg-muted p-3 rounded-md">
                  <h4 className="text-sm font-medium">PUT /api/users/[id]</h4>
                  <p className="text-xs text-muted-foreground mt-1">Atualiza um usuário existente.</p>
                  <p className="text-xs mt-1">
                    <strong>Body:</strong> <code>&#123; userData: any &#125;</code>
                  </p>
                  <p className="text-xs mt-1">
                    <strong>Resposta:</strong> <code>&#123; user: User &#125;</code>
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium">APIs de Perfil</h3>
              <div className="mt-2 space-y-3">
                <div className="bg-muted p-3 rounded-md">
                  <h4 className="text-sm font-medium">GET /api/user/profile</h4>
                  <p className="text-xs text-muted-foreground mt-1">Obtém o perfil do usuário atual.</p>
                  <p className="text-xs mt-1">
                    <strong>Resposta:</strong> <code>&#123; profile: Profile &#125;</code>
                  </p>
                </div>

                <div className="bg-muted p-3 rounded-md">
                  <h4 className="text-sm font-medium">PUT /api/user/profile</h4>
                  <p className="text-xs text-muted-foreground mt-1">Atualiza o perfil do usuário atual.</p>
                  <p className="text-xs mt-1">
                    <strong>Body:</strong> <code>&#123; profile: any &#125;</code>
                  </p>
                  <p className="text-xs mt-1">
                    <strong>Resposta:</strong> <code>&#123; profile: Profile &#125;</code>
                  </p>
                </div>

                <div className="bg-muted p-3 rounded-md">
                  <h4 className="text-sm font-medium">POST /api/storage/upload</h4>
                  <p className="text-xs text-muted-foreground mt-1">
                    Faz upload de um arquivo para o storage (usado para avatares).
                  </p>
                  <p className="text-xs mt-1">
                    <strong>Body:</strong> <code>FormData com arquivo</code>
                  </p>
                  <p className="text-xs mt-1">
                    <strong>Resposta:</strong> <code>&#123; url: string &#125;</code>
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

export default function AuthDocs() {
  return <AuthDocumentation />
}
