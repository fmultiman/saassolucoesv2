"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Code } from "@/components/ui/code"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { InfoIcon } from "lucide-react"

export function ServicesDocumentation() {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Serviços e Funções - SaaS Soluções</CardTitle>
        <CardDescription>
          Documentação completa dos serviços, funções e APIs que interagem com usuários, perfis e autenticação
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Tabs defaultValue="architecture" className="w-full">
          <TabsList className="grid grid-cols-6 w-full">
            <TabsTrigger value="architecture">Arquitetura</TabsTrigger>
            <TabsTrigger value="user-services">Serviços de Usuário</TabsTrigger>
            <TabsTrigger value="auth-system">Autenticação</TabsTrigger>
            <TabsTrigger value="middleware">Middleware</TabsTrigger>
            <TabsTrigger value="apis">APIs</TabsTrigger>
            <TabsTrigger value="ui-components">Componentes UI</TabsTrigger>
          </TabsList>

          <TabsContent value="architecture" className="space-y-4 mt-4">
            <div>
              <h3 className="text-lg font-medium">Visão Geral da Arquitetura</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                O sistema de usuários, perfis e autenticação do SaaS Soluções segue uma arquitetura em camadas que
                separa claramente as responsabilidades e promove a manutenibilidade e segurança.
              </p>
            </div>

            <div className="p-4 bg-muted rounded-md">
              <pre className="text-xs overflow-x-auto whitespace-pre">
                {`┌─────────────────────────────────────────────────────────────────┐
│                        Componentes de UI                         │
│  (ProfileForm, LoginForm, SignupForm, AvatarUpload, etc.)        │
└───────────────────────────────┬─────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────────┐
│                         APIs e Rotas                            │
│  (/api/users/*, /api/user/profile, /api/auth/*, etc.)           │
└───────────────────────────────┬─────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Serviços e Funções                         │
│  (user-service.ts, profile-service.ts, auth-helpers.ts, etc.)   │
└───────────────────────────────┬─────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Middleware e Proteção                        │
│  (middleware.ts, session.ts, rate-limit.ts, etc.)               │
└───────────────────────────────┬─────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Banco de Dados                             │
│  (Tabelas: users, profiles | Views: user_profiles_view)         │
└─────────────────────────────────────────────────────────────────┘`}
              </pre>
            </div>

            <div className="space-y-4 mt-4">
              <div>
                <h3 className="text-lg font-medium">Fluxo de Dados</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  O fluxo de dados no sistema segue um padrão consistente que promove a separação de responsabilidades e
                  facilita a manutenção:
                </p>
                <ol className="mt-2 text-sm space-y-2 list-decimal pl-5">
                  <li>
                    <strong>Componentes de UI</strong> capturam entradas do usuário e as enviam para APIs
                  </li>
                  <li>
                    <strong>APIs e Rotas</strong> validam os dados recebidos e chamam os serviços apropriados
                  </li>
                  <li>
                    <strong>Serviços e Funções</strong> implementam a lógica de negócios e interagem com o banco de
                    dados
                  </li>
                  <li>
                    <strong>Middleware e Proteção</strong> garantem segurança, autenticação e controle de acesso
                  </li>
                  <li>
                    <strong>Banco de Dados</strong> armazena e recupera dados de forma estruturada e segura
                  </li>
                </ol>
              </div>

              <div>
                <h3 className="text-lg font-medium">Princípios de Design</h3>
                <ul className="mt-2 text-sm space-y-2 list-disc pl-5">
                  <li>
                    <strong>Separação de Responsabilidades</strong>: Cada componente tem uma função clara e específica
                  </li>
                  <li>
                    <strong>Segurança em Camadas</strong>: Múltiplas camadas de proteção (RLS, middleware, validação)
                  </li>
                  <li>
                    <strong>Reutilização de Código</strong>: Funções comuns são centralizadas em serviços
                  </li>
                  <li>
                    <strong>Tratamento de Erros Consistente</strong>: Padrão uniforme para captura e relato de erros
                  </li>
                  <li>
                    <strong>Tipagem Forte</strong>: TypeScript em todas as camadas para garantir consistência de dados
                  </li>
                </ul>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="user-services" className="space-y-4 mt-4">
            <div>
              <h3 className="text-lg font-medium">Serviços de Usuário e Perfil</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Os serviços de usuário e perfil encapsulam toda a lógica de negócios relacionada à gestão de usuários e
                seus perfis, fornecendo uma API consistente para o resto da aplicação.
              </p>
            </div>

            <Tabs defaultValue="user-service" className="w-full">
              <TabsList className="grid grid-cols-2 w-full">
                <TabsTrigger value="user-service">Serviço de Usuário</TabsTrigger>
                <TabsTrigger value="profile-service">Serviço de Perfil</TabsTrigger>
              </TabsList>

              <TabsContent value="user-service" className="space-y-4 mt-4">
                <div>
                  <h4 className="text-base font-medium">user-service.ts</h4>
                  <p className="mt-2 text-sm text-muted-foreground">
                    O serviço de usuário gerencia operações relacionadas à tabela <code>users</code>, incluindo busca,
                    atualização e cache de dados de usuário.
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <h5 className="text-sm font-medium">getUserById</h5>
                    <p className="text-xs text-muted-foreground mt-1">
                      Busca um usuário pelo ID, com suporte a cache para melhorar performance.
                    </p>
                    <Code language="typescript" className="mt-2">
                      {`export async function getUserById(userId: string) {
 // Tentar obter do cache primeiro
 const cacheKey = \`\${USER_CACHE_KEY_PREFIX}\${userId}\`
 const cachedUser = await getCachedData(cacheKey)

 if (cachedUser) {
   console.log(\`Usuário encontrado em cache: \${userId}\`)
   return cachedUser
 }

 // Se não estiver em cache, buscar do Supabase
 console.log(\`Buscando usuário do banco de dados: \${userId}\`)
 const supabase = createServiceRoleClient()

 const { data: user, error } = await supabase.from("users").select("*").eq("id", userId).single()

 if (error) {
   console.error("Erro ao buscar usuário:", error)
   throw error
 }

 if (user) {
   // Armazenar em cache para futuras requisições
   await cacheData(cacheKey, user, CACHE_TTL)
 }

 return user
}`}
                    </Code>
                  </div>

                  <div>
                    <h5 className="text-sm font-medium">getAllUsers</h5>
                    <p className="text-xs text-muted-foreground mt-1">
                      Busca todos os usuários, com suporte a cache para melhorar performance.
                    </p>
                    <Code language="typescript" className="mt-2">
                      {`export async function getAllUsers() {
 // Tentar obter do cache primeiro
 const cachedUsers = await getCachedData(USERS_LIST_CACHE_KEY)

 if (cachedUsers) {
   console.log("Lista de usuários encontrada em cache")
   return cachedUsers
 }

 // Se não estiver em cache, buscar do Supabase
 console.log("Buscando lista de usuários do banco de dados")
 const supabase = createServiceRoleClient()

 const { data: users, error } = await supabase.from("users").select("*").order("created_at", { ascending: false })

 if (error) {
   console.error("Erro ao buscar usuários:", error)
   throw error
 }

 if (users) {
   // Armazenar em cache para futuras requisições
   await cacheData(USERS_LIST_CACHE_KEY, users, CACHE_TTL)
 }

 return users
}`}
                    </Code>
                  </div>

                  <div>
                    <h5 className="text-sm font-medium">updateUser</h5>
                    <p className="text-xs text-muted-foreground mt-1">
                      Atualiza dados de um usuário e invalida o cache correspondente.
                    </p>
                    <Code language="typescript" className="mt-2">
                      {`export async function updateUser(userId: string, userData: any) {
 const supabase = createServiceRoleClient()

 const { data, error } = await supabase.from("users").update(userData).eq("id", userId).select().single()

 if (error) {
   console.error("Erro ao atualizar usuário:", error)
   throw error
 }

 // Invalidar cache do usuário
 await invalidateUserCache(userId)

 return data
}`}
                    </Code>
                  </div>

                  <div>
                    <h5 className="text-sm font-medium">invalidateUserCache</h5>
                    <p className="text-xs text-muted-foreground mt-1">
                      Invalida o cache de um usuário específico e da lista de usuários.
                    </p>
                    <Code language="typescript" className="mt-2">
                      {`export async function invalidateUserCache(userId: string) {
 // Invalidar cache do usuário específico
 await invalidateCache(\`\${USER_CACHE_KEY_PREFIX}\${userId}\`)
 // Invalidar cache da lista de usuários
 await invalidateCache(USERS_LIST_CACHE_KEY)
}`}
                    </Code>
                  </div>
                </div>

                <div>
                  <h4 className="text-base font-medium">Uso do Serviço de Usuário</h4>
                  <p className="mt-2 text-sm text-muted-foreground">
                    O serviço de usuário é utilizado em várias partes da aplicação:
                  </p>
                  <ul className="mt-2 text-sm space-y-1 list-disc pl-5">
                    <li>APIs de usuário para buscar e atualizar dados</li>
                    <li>Middleware para verificar permissões baseadas em tipo de usuário</li>
                    <li>Componentes administrativos para gerenciar usuários</li>
                    <li>Páginas de perfil para exibir informações do usuário</li>
                  </ul>
                </div>
              </TabsContent>

              <TabsContent value="profile-service" className="space-y-4 mt-4">
                <div>
                  <h4 className="text-base font-medium">profile-service.ts</h4>
                  <p className="mt-2 text-sm text-muted-foreground">
                    O serviço de perfil gerencia operações relacionadas à tabela <code>profiles</code> e à view{" "}
                    <code>user_profiles_view</code>, incluindo busca, atualização e estatísticas de perfil.
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <h5 className="text-sm font-medium">getUserProfileById</h5>
                    <p className="text-xs text-muted-foreground mt-1">
                      Busca um perfil de usuário pelo ID, utilizando a view <code>user_profiles_view</code>.
                    </p>
                    <Code language="typescript" className="mt-2">
                      {`export async function getUserProfileById(userId: string) {
 const supabase = createServiceRoleClient()

 // Usar a view para obter dados completos do usuário e perfil
 const { data, error } = await supabase.from("user_profiles_view").select("*").eq("id", userId).single()

 if (error) {
   console.error("Erro ao buscar perfil do usuário:", error)
   return null
 }

 return data
}`}
                    </Code>
                  </div>

                  <div>
                    <h5 className="text-sm font-medium">updateUserProfile</h5>
                    <p className="text-xs text-muted-foreground mt-1">
                      Atualiza ou cria um perfil de usuário, dependendo se ele já existe.
                    </p>
                    <Code language="typescript" className="mt-2">
                      {`export async function updateUserProfile(userId: string, profileData: ProfileUpdateData) {
 const supabase = createServiceRoleClient()

 // Verificar se o perfil existe
 const { data: existingProfile } = await supabase.from("profiles").select("id").eq("id", userId).single()

 if (!existingProfile) {
   // Se o perfil não existir, criar um novo
   const { error: insertError } = await supabase.from("profiles").insert({ id: userId, ...profileData })

   if (insertError) {
     console.error("Erro ao criar perfil:", insertError)
     return { success: false, error: insertError.message }
   }
 } else {
   // Se o perfil existir, atualizar
   const { error: updateError } = await supabase.from("profiles").update(profileData).eq("id", userId)

   if (updateError) {
     console.error("Erro ao atualizar perfil:", updateError)
     return { success: false, error: updateError.message }
   }
 }

 return { success: true }
}`}
                    </Code>
                  </div>

                  <div>
                    <h5 className="text-sm font-medium">getAllUserProfiles</h5>
                    <p className="text-xs text-muted-foreground mt-1">
                      Busca perfis de usuários com paginação, utilizando a view <code>user_profiles_view</code>.
                    </p>
                    <Code language="typescript" className="mt-2">
                      {`export async function getAllUserProfiles(page = 1, limit = 10) {
 const supabase = createServiceRoleClient()
 const offset = (page - 1) * limit
 
 // Usar a view para obter dados completos dos usuários e perfis
 const { data, error, count } = await supabase
   .from("user_profiles_view")
   .select("*", { count: "exact" })
   .range(offset, offset + limit - 1)
   .order("created_at", { ascending: false })
 
 if (error) {
   console.error("Erro ao buscar perfis de usuários:", error)
   return { data: [], count: 0 }
 }

 return { data: data || [], count: count || 0 }
}`}
                    </Code>
                  </div>

                  <div>
                    <h5 className="text-sm font-medium">searchUserProfiles</h5>
                    <p className="text-xs text-muted-foreground mt-1">
                      Busca perfis de usuários por termo de pesquisa, com paginação.
                    </p>
                    <Code language="typescript" className="mt-2">
                      {`export async function searchUserProfiles(query: string, page = 1, limit = 10) {
 const supabase = createServiceRoleClient()
 const offset = (page - 1) * limit

 // Busca por nome, email ou empresa
 const { data, error, count } = await supabase
   .from("user_profiles_view")
   .select("*", { count: "exact" })
   .or(\`name.ilike.%\${query}%,email.ilike.%\${query}%,company.ilike.%\${query}%\`)
   .range(offset, offset + limit - 1)
   .order("created_at", { ascending: false })

 if (error) {
   console.error("Erro ao buscar perfis de usuários:", error)
   return { data: [], count: 0 }
 }

 return { data: data || [], count: count || 0 }
}`}
                    </Code>
                  </div>

                  <div>
                    <h5 className="text-sm font-medium">getUserProfileStats</h5>
                    <p className="text-xs text-muted-foreground mt-1">
                      Obtém estatísticas gerais sobre perfis de usuários.
                    </p>
                    <Code language="typescript" className="mt-2">
                      {`export async function getUserProfileStats() {
 const supabase = createServiceRoleClient()

 // Estatísticas gerais de perfis
 const { data, error } = await supabase.from("user_profiles_view").select("role, verified, has_profile")

 if (error || !data) {
   console.error("Erro ao buscar estatísticas de perfis:", error)
   return {
     total: 0,
     verified: 0,
     withProfile: 0,
     byRole: {},
   }
 }

 const stats = {
   total: data.length,
   verified: data.filter((user) => user.verified).length,
   withProfile: data.filter((user) => user.has_profile).length,
   byRole: data.reduce((acc: Record<string, number>, user) => {
     const role = user.role || "unknown"
     acc[role] = (acc[role] || 0) + 1
     return acc
   }, {}),
 }

 return stats
}`}
                    </Code>
                  </div>
                </div>

                <div>
                  <h4 className="text-base font-medium">Uso do Serviço de Perfil</h4>
                  <p className="mt-2 text-sm text-muted-foreground">
                    O serviço de perfil é utilizado em várias partes da aplicação:
                  </p>
                  <ul className="mt-2 text-sm space-y-1 list-disc pl-5">
                    <li>APIs de perfil para buscar e atualizar dados</li>
                    <li>Componentes de perfil para exibir e editar informações</li>
                    <li>Painéis administrativos para visualizar estatísticas</li>
                    <li>Páginas de usuário para exibir informações completas</li>
                  </ul>
                </div>
              </TabsContent>
            </Tabs>

            <Alert className="mt-4">
              <InfoIcon className="h-4 w-4" />
              <AlertTitle>Integração entre Serviços</AlertTitle>
              <AlertDescription>
                Os serviços de usuário e perfil são complementares e frequentemente utilizados em conjunto. Enquanto o
                serviço de usuário lida com informações básicas de autenticação e controle de acesso, o serviço de
                perfil gerencia informações pessoais e profissionais mais detalhadas.
              </AlertDescription>
            </Alert>
          </TabsContent>

          <TabsContent value="auth-system" className="space-y-4 mt-4">
            <div>
              <h3 className="text-lg font-medium">Sistema de Autenticação</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                O sistema de autenticação do SaaS Soluções é construído sobre o Supabase Auth, com camadas adicionais
                para gerenciamento de sessão, helpers de autenticação e integração com o resto da aplicação.
              </p>
            </div>

            <Tabs defaultValue="auth-helpers" className="w-full">
              <TabsList className="grid grid-cols-3 w-full">
                <TabsTrigger value="auth-helpers">Auth Helpers</TabsTrigger>
                <TabsTrigger value="session">Gerenciamento de Sessão</TabsTrigger>
                <TabsTrigger value="auth-flows">Fluxos de Autenticação</TabsTrigger>
              </TabsList>

              <TabsContent value="auth-helpers" className="space-y-4 mt-4">
                <div>
                  <h4 className="text-base font-medium">auth-helpers.ts</h4>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Funções auxiliares para operações comuns de autenticação, como envio de emails de confirmação e
                    redefinição de senha.
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <h5 className="text-sm font-medium">getAuthRedirectUrls</h5>
                    <p className="text-xs text-muted-foreground mt-1">
                      Configura URLs de redirecionamento para fluxos de autenticação.
                    </p>
                    <Code language="typescript" className="mt-2">
                      {`export function getAuthRedirectUrls() {
 return {
   emailRedirectTo: \`\${SITE_URL}/auth/verify\`,
   redirectTo: \`\${SITE_URL}/auth/verify\`,
 }
}`}
                    </Code>
                  </div>

                  <div>
                    <h5 className="text-sm font-medium">sendConfirmationEmail</h5>
                    <p className="text-xs text-muted-foreground mt-1">Envia email de confirmação para um usuário.</p>
                    <Code language="typescript" className="mt-2">
                      {`export async function sendConfirmationEmail(email: string) {
 try {
   const supabase = createClient()
   const { error } = await supabase.auth.signInWithOtp({
     email,
     options: {
       emailRedirectTo: getAuthRedirectUrls().emailRedirectTo,
     },
   })

   if (error) throw error
   return { success: true }
 } catch (error) {
   console.error("Erro ao enviar email de confirmação:", error)
   return { success: false, error }
 }
}`}
                    </Code>
                  </div>

                  <div>
                    <h5 className="text-sm font-medium">sendPasswordResetEmail</h5>
                    <p className="text-xs text-muted-foreground mt-1">
                      Envia email de redefinição de senha para um usuário.
                    </p>
                    <Code language="typescript" className="mt-2">
                      {`export async function sendPasswordResetEmail(email: string) {
 try {
   const supabase = createClient()
   const { error } = await supabase.auth.resetPasswordForEmail(email, {
     redirectTo: getAuthRedirectUrls().emailRedirectTo,
   })

   if (error) throw error
   return { success: true }
 } catch (error) {
   console.error("Erro ao enviar email de redefinição de senha:", error)
   return { success: false, error }
 }
}`}
                    </Code>
                  </div>
                </div>

                <div>
                  <h4 className="text-base font-medium">Uso dos Auth Helpers</h4>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Os auth helpers são utilizados em várias partes da aplicação:
                  </p>
                  <ul className="mt-2 text-sm space-y-1 list-disc pl-5">
                    <li>Formulários de login e registro</li>
                    <li>Páginas de redefinição de senha</li>
                    <li>Fluxos de verificação de email</li>
                    <li>Processos de onboarding</li>
                  </ul>
                </div>
              </TabsContent>

              <TabsContent value="session" className="space-y-4 mt-4">
                <div>
                  <h4 className="text-base font-medium">session.ts</h4>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Sistema de gerenciamento de sessão que utiliza Redis para armazenar e gerenciar sessões de usuário.
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <h5 className="text-sm font-medium">createSession</h5>
                    <p className="text-xs text-muted-foreground mt-1">
                      Cria uma nova sessão para um usuário autenticado.
                    </p>
                    <Code language="typescript" className="mt-2">
                      {`async function createSession(data: Omit<SessionData, "createdAt" | "lastActive">): Promise<string> {
 const redis = getRedisClient()
 const sessionId = generateSessionId(data.userId)

 const sessionData: SessionData = {
   ...data,
   createdAt: Date.now(),
   lastActive: Date.now(),
 }

 // Armazenar dados da sessão
 await redis.set(\`session:\${sessionId}\`, JSON.stringify(sessionData), { ex: SESSION_TTL })

 // Mapear usuário para sessões ativas
 await redis.sadd(\`user_sessions:\${data.userId}\`, sessionId)

 // Definir cookie de sessão
 cookies().set("session_id", sessionId, {
   httpOnly: true,
   secure: process.env.NODE_ENV === "production",
   maxAge: SESSION_TTL,
   path: "/",
   sameSite: "lax",
 })

 return sessionId
}`}
                    </Code>
                  </div>

                  <div>
                    <h5 className="text-sm font-medium">getCurrentUser</h5>
                    <p className="text-xs text-muted-foreground mt-1">
                      Obtém dados do usuário atual a partir do cookie de sessão.
                    </p>
                    <Code language="typescript" className="mt-2">
                      {`async function getCurrentUser(): Promise<SessionData | null> {
 const sessionId = cookies().get("session_id")?.value

 if (!sessionId) {
   return null
 }

 return getSessionById(sessionId)
}`}
                    </Code>
                  </div>

                  <div>
                    <h5 className="text-sm font-medium">destroySession</h5>
                    <p className="text-xs text-muted-foreground mt-1">Encerra a sessão atual do usuário.</p>
                    <Code language="typescript" className="mt-2">
                      {`async function destroySession(): Promise<void> {
 const sessionId = cookies().get("session_id")?.value

 if (sessionId) {
   await destroySessionById(sessionId)
 }

 cookies().delete("session_id")
}`}
                    </Code>
                  </div>

                  <div>
                    <h5 className="text-sm font-medium">getUserActiveSessions</h5>
                    <p className="text-xs text-muted-foreground mt-1">Lista todas as sessões ativas de um usuário.</p>
                    <Code language="typescript" className="mt-2">
                      {`async function getUserActiveSessions(userId: string): Promise<SessionData[]> {
 const redis = getRedisClient()
 const sessionIds = await redis.smembers(\`user_sessions:\${userId}\`)

 if (!sessionIds.length) {
   return []
 }

 const sessions: SessionData[] = []

 for (const sessionId of sessionIds) {
   const sessionData = await redis.get<string>(\`session:\${sessionId}\`)

   if (sessionData) {
     try {
       sessions.push(JSON.parse(sessionData) as SessionData)
     } catch (error) {
       console.error("Erro ao fazer parse dos dados da sessão:", error)
     }
   } else {
     // Remover referência a sessão que não existe mais
     await redis  error)
     }
   } else {
     // Remover referência a sessão que não existe mais
     await redis.srem(\`user_sessions:\${userId}\`, sessionId)
   }
 }

 return sessions
}`}
                    </Code>
                  </div>

                  <div>
                    <h5 className="text-sm font-medium">destroyAllUserSessions</h5>
                    <p className="text-xs text-muted-foreground mt-1">
                      Encerra todas as sessões de um usuário (exceto a atual).
                    </p>
                    <Code language="typescript" className="mt-2">
                      {`async function destroyAllUserSessions(userId: string, exceptCurrentSession = true): Promise<number> {
 const redis = getRedisClient()
 const sessionIds = await redis.smembers(\`user_sessions:\${userId}\`)

 if (!sessionIds.length) {
   return 0
 }

 const currentSessionId = exceptCurrentSession ? cookies().get("session_id")?.value : null
 let destroyedCount = 0

 for (const sessionId of sessionIds) {
   if (exceptCurrentSession && sessionId === currentSessionId) {
     continue
   }

   await redis.del(\`session:\${sessionId}\`)
   destroyedCount++
 }

 // Atualizar conjunto de sessões do usuário
 if (exceptCurrentSession && currentSessionId) {
   await redis.del(\`user_sessions:\${userId}\`)
   await redis.sadd(\`user_sessions:\${userId}\`, currentSessionId)
 } else {
   await redis.del(\`user_sessions:\${userId}\`)
 }

 return destroyedCount
}`}
                    </Code>
                  </div>
                </div>

                <div>
                  <h4 className="text-base font-medium">Uso do Gerenciamento de Sessão</h4>
                  <p className="mt-2 text-sm text-muted-foreground">
                    O sistema de gerenciamento de sessão é utilizado em várias partes da aplicação:
                  </p>
                  <ul className="mt-2 text-sm space-y-1 list-disc pl-5">
                    <li>Middleware para autenticação e controle de acesso</li>
                    <li>Páginas que precisam de informações do usuário atual</li>
                    <li>Funcionalidades de logout e gerenciamento de dispositivos</li>
                    <li>Monitoramento de atividade do usuário</li>
                  </ul>
                </div>
              </TabsContent>

              <TabsContent value="auth-flows" className="space-y-4 mt-4">
                <div>
                  <h4 className="text-base font-medium">Fluxos de Autenticação</h4>
                  <p className="mt-2 text-sm text-muted-foreground">
                    O sistema implementa vários fluxos de autenticação para diferentes cenários de uso.
                  </p>
                </div>

                <div className="space-y-6">
                  <div>
                    <h5 className="text-sm font-medium">Fluxo de Registro</h5>
                    <div className="p-4 bg-muted rounded-md mt-2">
                      <pre className="text-xs overflow-x-auto whitespace-pre">
                        {`1. Usuário preenche formulário de registro (email, senha, nome)
2. Frontend valida dados e envia para /api/auth/signup
3. API verifica se email já existe
4. Se não existir, cria usuário no Supabase Auth
5. Cria registro na tabela users com tipo "client"
6. Trigger automático cria registro na tabela profiles
7. Envia email de confirmação
8. Redireciona para página de verificação de email`}
                      </pre>
                    </div>
                  </div>

                  <div>
                    <h5 className="text-sm font-medium">Fluxo de Login</h5>
                    <div className="p-4 bg-muted rounded-md mt-2">
                      <pre className="text-xs overflow-x-auto whitespace-pre">
                        {`1. Usuário preenche formulário de login (email, senha)
2. Frontend valida dados e envia para Supabase Auth
3. Se autenticação for bem-sucedida, Supabase retorna sessão
4. Frontend armazena token de sessão em cookie
5. Middleware verifica tipo de usuário (client/admin)
6. Redireciona para dashboard apropriado (client ou admin)`}
                      </pre>
                    </div>
                  </div>

                  <div>
                    <h5 className="text-sm font-medium">Fluxo de Redefinição de Senha</h5>
                    <div className="p-4 bg-muted rounded-md mt-2">
                      <pre className="text-xs overflow-x-auto whitespace-pre">
                        {`1. Usuário solicita redefinição de senha informando email
2. Sistema envia email com link para redefinição
3. Usuário clica no link e é redirecionado para página de redefinição
4. Usuário define nova senha
5. Sistema atualiza senha no Supabase Auth
6. Usuário é redirecionado para página de login`}
                      </pre>
                    </div>
                  </div>

                  <div>
                    <h5 className="text-sm font-medium">Fluxo de Verificação de Email</h5>
                    <div className="p-4 bg-muted rounded-md mt-2">
                      <pre className="text-xs overflow-x-auto whitespace-pre">
                        {`1. Usuário recebe email com link de verificação
2. Ao clicar no link, é redirecionado para /auth/verify com token
3. Sistema verifica token com Supabase Auth
4. Se válido, marca email como verificado
5. Atualiza status na tabela users
6. Redireciona para dashboard ou onboarding`}
                      </pre>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-base font-medium">Implementação dos Fluxos</h4>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Os fluxos de autenticação são implementados através de uma combinação de:
                  </p>
                  <ul className="mt-2 text-sm space-y-1 list-disc pl-5">
                    <li>Componentes de UI para captura de dados</li>
                    <li>APIs para processamento de requisições</li>
                    <li>Serviços para lógica de negócios</li>
                    <li>Middleware para controle de acesso</li>
                    <li>Páginas específicas para cada etapa do fluxo</li>
                  </ul>
                </div>
              </TabsContent>
            </Tabs>
          </TabsContent>

          <TabsContent value="middleware" className="space-y-4 mt-4">
            <div>
              <h3 className="text-lg font-medium">Middleware e Proteção de Rotas</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                O sistema utiliza middleware para proteger rotas, controlar acesso e aplicar rate limiting, garantindo
                segurança e performance.
              </p>
            </div>

            <div className="space-y-6">
              <div>
                <h4 className="text-base font-medium">middleware.ts</h4>
                <p className="mt-2 text-sm text-muted-foreground">
                  O middleware principal da aplicação, responsável por autenticação, controle de acesso e
                  redirecionamentos.
                </p>
                <Code language="typescript" className="mt-2">
                  {`export async function middleware(request: NextRequest) {
 const { pathname } = request.nextUrl

 // Rotas que não precisam de autenticação
 const publicRoutes = ["/", "/login", "/signup", "/blog", "/marketplace", "/recursos-adicionais"]
 const isPublicRoute = publicRoutes.some((route) => pathname === route || pathname.startsWith(\`\${route}/\`))

 // Rotas específicas de admin
 const isAdminRoute = pathname.startsWith("/admin")
 const isAdminLoginRoute = pathname === "/login/admin"

 // Rotas específicas de cliente (usuário logado)
 const isClientRoute =
   pathname.startsWith("/dashboard") ||
   pathname.startsWith("/conta") ||
   pathname.startsWith("/configuracoes") ||
   pathname.startsWith("/minhas-solucoes") ||
   pathname.startsWith("/assinatura") ||
   pathname.startsWith("/metricas") ||
   pathname.startsWith("/interacoes") ||
   pathname.startsWith("/proximos-envios") ||
   pathname.startsWith("/ajuda") ||
   pathname.startsWith("/expansao")

 // Aplicar rate limiting para rotas de API
 if (pathname.startsWith("/api")) {
   // Configurações de rate limit mais restritivas para rotas sensíveis
   if (pathname.includes("/auth") || pathname.includes("/users") || pathname.includes("/payment")) {
     const rateLimitResult = await rateLimit(request, {
       limit: 5,
       window: 60,
       identifier: pathname,
     })

     if (rateLimitResult && !("headers" in rateLimitResult)) {
       return rateLimitResult // Retorna resposta de erro se limite excedido
     }
   } else {
     // Rate limit padrão para outras rotas de API
     const rateLimitResult = await rateLimit(request, {
       limit: 20,
       window: 60,
       identifier: pathname,
     })

     if (rateLimitResult && !("headers" in rateLimitResult)) {
       return rateLimitResult // Retorna resposta de erro se limite excedido
     }
   }
 }

 // Se não for uma rota protegida ou de login admin, permite o acesso
 if (!isAdminRoute && !isClientRoute && !isAdminLoginRoute) {
   return NextResponse.next()
 }

 const res = NextResponse.next()

 // Criar cliente Supabase para o middleware
 const supabase = createServerClient(
   process.env.NEXT_PUBLIC_SUPABASE_URL!,
   process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
   {
     cookies: {
       get(name) {
         return request.cookies.get(name)?.value
       },
       set(name, value, options) {
         request.cookies.set({
           name,
           value,
           ...options,
         })
         res.cookies.set({
           name,
           value,
           ...options,
         })
       },
       remove(name, options) {
         request.cookies.set({
           name,
           value: "",
           ...options,
         })
         res.cookies.set({
           name,
           value: "",
           ...options,
         })
       },
     },
     cookieOptions: {
       name: "sb-auth-token",
       secure: process.env.NODE_ENV === "production",
       sameSite: "lax",
       path: "/",
       maxAge: 60 * 60 * 24 * 7, // 7 dias
     },
   },
 )

 // Verificar se o usuário está autenticado
 const {
   data: { session },
 } = await supabase.auth.getSession()

 // Verificar o tipo de usuário (admin ou cliente)
 let userType = null
 if (session) {
   const { data: userData } = await supabase.from("users").select("user_type").eq("id", session.user.id).single()
   userType = userData?.user_type
 }

 // Redirecionar com base nas regras de autenticação
 if (!session) {
   // Se não estiver autenticado e tentar acessar rota protegida
   if (isAdminRoute) {
     return NextResponse.redirect(new URL("/login/admin", request.url))
   }
   if (isClientRoute) {
     return NextResponse.redirect(new URL("/login", request.url))
   }
 } else {
   // Se estiver autenticado mas tentar acessar rota incompatível com seu tipo
   if (isAdminRoute && userType !== "admin") {
     return NextResponse.redirect(new URL("/dashboard", request.url))
   }

   // NOVA REGRA: Cliente tentando acessar login de admin
   if (isAdminLoginRoute && userType === "client") {
     return NextResponse.redirect(new URL("/dashboard", request.url))
   }

   if (isClientRoute && userType !== "client") {
     return NextResponse.redirect(new URL("/admin", request.url))
   }

   // Se estiver autenticado e tentar acessar página de login
   if (pathname === "/login" || pathname === "/signup") {
     if (userType === "admin") {
       return NextResponse.redirect(new URL("/admin", request.url))
     }
     if (userType === "client") {
       return NextResponse.redirect(new URL("/dashboard", request.url))
     }
   }
 }

 return res
}`}
                </Code>
              </div>

              <div>
                <h4 className="text-base font-medium">rate-limit.ts</h4>
                <p className="mt-2 text-sm text-muted-foreground">
                  Implementação de rate limiting para proteger APIs contra abusos.
                </p>
                <Code language="typescript" className="mt-2">
                  {`import { NextRequest, NextResponse } from "next/server"
import { getRedisClient } from "./redis"

interface RateLimitOptions {
 limit: number
 window: number // em segundos
 identifier?: string
}

export async function rateLimit(
 request: NextRequest,
 { limit, window, identifier }: RateLimitOptions
): Promise<NextResponse | { headers: Headers }> {
 const redis = getRedisClient()
 
 // Identificador único para o limite de taxa
 // Combina IP + caminho + identificador opcional
 const ip = request.ip || "127.0.0.1"
 const path = request.nextUrl.pathname
 const customIdentifier = identifier || ""
 
 const key = \`rate-limit:\${ip}:\${path}:\${customIdentifier}\`
 
 // Obter contagem atual
 const currentCount = await redis.get<number>(key) || 0
 
 // Verificar se excedeu o limite
 if (currentCount >= limit) {
   console.warn(\`Rate limit excedido para \${key}\`)
   
   return NextResponse.json(
     { error: "Muitas requisições, tente novamente mais tarde" },
     { status: 429 }
   )
 }
 
 // Incrementar contagem
 await redis.incr(key)
 
 // Definir TTL se for a primeira requisição
 if (currentCount === 0) {
   await redis.expire(key, window)
 }
 
 // Calcular cabeçalhos para informar cliente sobre limites
 const headers = new Headers()
 headers.set("X-RateLimit-Limit", limit.toString())
 headers.set("X-RateLimit-Remaining", (limit - (currentCount + 1)).toString())
 
 return { headers }
}`}
                </Code>
              </div>

              <div>
                <h4 className="text-base font-medium">Proteção de Rotas</h4>
                <p className="mt-2 text-sm text-muted-foreground">
                  O sistema implementa múltiplas camadas de proteção para rotas:
                </p>
                <ul className="mt-2 text-sm space-y-1 list-disc pl-5">
                  <li>
                    <strong>Middleware Global</strong>: Verifica autenticação e tipo de usuário para todas as rotas
                  </li>
                  <li>
                    <strong>Rate Limiting</strong>: Protege APIs contra abusos e ataques de força bruta
                  </li>
                  <li>
                    <strong>Verificação de Sessão</strong>: Valida sessões ativas e gerencia expiração
                  </li>
                  <li>
                    <strong>Row Level Security (RLS)</strong>: Controla acesso a dados no nível do banco de dados
                  </li>
                  <li>
                    <strong>Validação de Dados</strong>: Verifica integridade e segurança dos dados recebidos
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="text-base font-medium">Fluxo de Proteção</h4>
                <div className="p-4 bg-muted rounded-md mt-2">
                  <pre className="text-xs overflow-x-auto whitespace-pre">
                    {`1. Requisição chega ao servidor
2. Middleware verifica se é rota protegida
3. Se for rota de API, aplica rate limiting
4. Verifica autenticação via Supabase Auth
5. Verifica tipo de usuário (admin/client)
6. Redireciona se acesso não autorizado
7. Se autorizado, passa para handler da rota
8. Handler pode fazer verificações adicionais
9. Acesso ao banco de dados é filtrado por RLS`}
                  </pre>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="apis" className="space-y-4 mt-4">
            <div>
              <h3 className="text-lg font-medium">APIs de Usuário e Perfil</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                O sistema expõe várias APIs para gerenciar usuários e perfis, fornecendo endpoints para criação,
                atualização, busca e outras operações.
              </p>
            </div>

            <Tabs defaultValue="users-api" className="w-full">
              <TabsList className="grid grid-cols-3 w-full">
                <TabsTrigger value="users-api">API de Usuários</TabsTrigger>
                <TabsTrigger value="profile-api">API de Perfil</TabsTrigger>
                <TabsTrigger value="auth-api">API de Autenticação</TabsTrigger>
              </TabsList>

              <TabsContent value="users-api" className="space-y-4 mt-4">
                <div>
                  <h4 className="text-base font-medium">API de Usuários</h4>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Endpoints para gerenciar usuários, incluindo criação, atualização e busca.
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <h5 className="text-sm font-medium">POST /api/users</h5>
                    <p className="text-xs text-muted-foreground mt-1">
                      Cria um novo usuário com autenticação e registro na tabela users.
                    </p>
                    <Code language="typescript" className="mt-2">
                      {`export async function POST(request: Request) {
 try {
   const supabaseAdmin = createServiceRoleClient()

   const { nome, email, tipoAcesso, plano, forceCreate } = await request.json()

   if (!nome || !email) {
     return NextResponse.json({ error: "Nome e email são obrigatórios" }, { status: 400 })
   }

   const normalizedEmail = email.trim().toLowerCase()
   const userType = tipoAcesso === "admin" ? "admin" : "client"
   const validPlans = ["free", "basic", "pro", "enterprise"]
   const userPlan = validPlans.includes(plano) ? plano : "free"

   // 🔍 Verificar se já existe na tabela users
   const { data: userInTable, error: tableError } = await supabaseAdmin
     .from("users")
     .select("id")
     .eq("email", normalizedEmail)
     .maybeSingle()

   if (tableError) throw tableError

   // 🔍 Verificar se já existe no auth
   const { data: authUsers, error: authError } = await supabaseAdmin.auth.admin.listUsers()
   if (authError) throw authError

   const existingAuthUser = authUsers?.users?.find((user) => user.email?.toLowerCase() === normalizedEmail)

   if ((userInTable || existingAuthUser) && !forceCreate) {
     return NextResponse.json({ error: "Usuário com este email já existe" }, { status: 400 })
   }

   let userId = existingAuthUser?.id

   // 👤 Criar no auth se não existir
   if (!existingAuthUser) {
     const password = generateTemporaryPassword()

     const { data: created, error: createError } = await supabaseAdmin.auth.admin.createUser({
       email: normalizedEmail,
       password,
       email_confirm: true,
       user_metadata: {
         name: nome,
         tipo: userType,
         plano: userType === "client" ? userPlan : null,
       },
     })

     if (createError || !created?.user?.id) {
       return NextResponse.json({ error: createError?.message || "Erro ao criar usuário no auth" }, { status: 500 })
     }

     userId = created.user.id
   }

   // 🔄 Atualizar ou inserir na tabela users
   const { data: existing, error: findUserError } = await supabaseAdmin
     .from("users")
     .select("id")
     .eq("id", userId)
     .maybeSingle()

   if (findUserError) throw findUserError

   if (existing) {
     // Atualizar
     const { error: updateError } = await supabaseAdmin
       .from("users")
       .update({
         name: nome,
         email: normalizedEmail,
         user_type: userType,
         plan: userPlan,
         status: "active",
       })
       .eq("id", userId)

     if (updateError) {
       return NextResponse.json({ error: updateError.message }, { status: 500 })
     }

     return NextResponse.json({
       message: "Usuário atualizado com sucesso",
       userId,
       action: "updated",
     })
   } else {
     // Inserir
     const { error: insertError } = await supabaseAdmin.from("users").insert({
       id: userId,
       name: nome,
       email: normalizedEmail,
       user_type: userType,
       plan: userPlan,
       status: "active",
     })

     if (insertError) {
       return NextResponse.json({ error: insertError.message }, { status: 500 })
     }

     return NextResponse.json({
       message: "Usuário criado com sucesso",
       userId,
       action: "created",
     })
   }
 } catch (err: any) {
   console.error("Erro geral:", err)
   return NextResponse.json({ error: err.message || "Erro inesperado" }, { status: 500 })
 }
}`}
                    </Code>
                  </div>

                  <div>
                    <h5 className="text-sm font-medium">GET /api/users/[id]</h5>
                    <p className="text-xs text-muted-foreground mt-1">Busca um usuário específico pelo ID.</p>
                    <Code language="typescript" className="mt-2">
                      {`export async function GET(request: Request, { params }: { params: { id: string } }) {
 try {
   const userId = params.id
   
   if (!userId) {
     return NextResponse.json({ error: "ID do usuário é obrigatório" }, { status: 400 })
   }
   
   const user = await getUserById(userId)
   
   if (!user) {
     return NextResponse.json({ error: "Usuário não encontrado" }, { status: 404 })
   }
   
   return NextResponse.json({ user })
 } catch (error: any) {
   console.error("Erro ao buscar usuário:", error)
   return NextResponse.json({ error: error.message || "Erro ao buscar usuário" }, { status: 500 })
 }
}`}
                    </Code>
                  </div>

                  <div>
                    <h5 className="text-sm font-medium">PUT /api/users/[id]</h5>
                    <p className="text-xs text-muted-foreground mt-1">Atualiza dados de um usuário específico.</p>
                    <Code language="typescript" className="mt-2">
                      {`export async function PUT(request: Request, { params }: { params: { id: string } }) {
 try {
   const userId = params.id
   
   if (!userId) {
     return NextResponse.json({ error: "ID do usuário é obrigatório" }, { status: 400 })
   }
   
   const userData = await request.json()
   
   // Validar dados
   const validationResult = userUpdateSchema.safeParse(userData)
   
   if (!validationResult.success) {
     return NextResponse.json({ error: "Dados inválidos", details: validationResult.error.format() }, { status: 400 })
   }
   
   const updatedUser = await updateUser(userId, validationResult.data)
   
   return NextResponse.json({ user: updatedUser })
 } catch (error: any) {
   console.error("Erro ao atualizar usuário:", error)
   return NextResponse.json({ error: error.message || "Erro ao atualizar usuário" }, { status: 500 })
 }
}`}
                    </Code>
                  </div>

                  <div>
                    <h5 className="text-sm font-medium">GET /api/users/check-email</h5>
                    <p className="text-xs text-muted-foreground mt-1">Verifica se um email já está em uso.</p>
                    <Code language="typescript" className="mt-2">
                      {`export async function GET(request: Request) {
 try {
   const { searchParams } = new URL(request.url)
   const email = searchParams.get("email")
   
   if (!email) {
     return NextResponse.json({ error: "Email é obrigatório" }, { status: 400 })
   }
   
   const normalizedEmail = email.trim().toLowerCase()
   const supabase = createServiceRoleClient()
   
   // Verificar na tabela users
   const { data, error } = await supabase
     .from("users")
     .select("id")
     .eq("email", normalizedEmail)
     .maybeSingle()
   
   if (error) {
     throw error
   }
   
   return NextResponse.json({ exists: !!data })
 } catch (error: any) {
   console.error("Erro ao verificar email:", error)
   return NextResponse.json({ error: error.message || "Erro ao verificar email" }, { status: 500 })
 }
}`}
                    </Code>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="profile-api" className="space-y-4 mt-4">
                <div>
                  <h4 className="text-base font-medium">API de Perfil</h4>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Endpoints para gerenciar perfis de usuário, incluindo atualização e busca de informações de perfil.
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <h5 className="text-sm font-medium">GET /api/user/profile</h5>
                    <p className="text-xs text-muted-foreground mt-1">Busca o perfil do usuário autenticado.</p>
                    <Code language="typescript" className="mt-2">
                      {`export async function GET(request: Request) {
 try {
   const supabase = createClient(cookies())

   // Verificar autenticação
   const {
     data: { session },
   } = await supabase.auth.getSession()

   if (!session) {
     return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
   }

   // Buscar dados do usuário
   const { data: userData, error: userError } = await supabase
     .from("users")
     .select("*")
     .eq("id", session.user.id)
     .single()

   if (userError) {
     console.error("Erro ao buscar usuário:", userError)
     return NextResponse.json({ error: "Erro ao buscar usuário", details: userError }, { status: 500 })
   }

   // Buscar dados do perfil
   const { data: profileData, error: profileError } = await supabase
     .from("profiles")
     .select("*")
     .eq("id", session.user.id)
     .single()

   if (profileError && profileError.code !== "PGRST116") {
     console.error("Erro ao buscar perfil:", profileError)
     return NextResponse.json({ error: "Erro ao buscar perfil", details: profileError }, { status: 500 })
   }

   return NextResponse.json({
     user: userData,
     profile: profileData || null,
   })
 } catch (error) {
   console.error("Erro ao processar requisição:", error)
   return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
 }
}`}
                    </Code>
                  </div>

                  <div>
                    <h5 className="text-sm font-medium">PUT /api/user/profile</h5>
                    <p className="text-xs text-muted-foreground mt-1">Atualiza o perfil do usuário autenticado.</p>
                    <Code language="typescript" className="mt-2">
                      {`export async function PUT(request: Request) {
 try {
   const supabase = createClient(cookies())

   // Verificar autenticação
   const {
     data: { session },
   } = await supabase.auth.getSession()

   if (!session) {
     return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
   }

   // Obter dados do corpo da requisição
   const body = await request.json()
   console.log("Dados recebidos para atualização:", body)

   // Validar dados
   const validationResult = profileUpdateSchema.safeParse(body)

   if (!validationResult.success) {
     console.error("Erro de validação:", validationResult.error.format())
     return NextResponse.json({ error: "Dados inválidos", details: validationResult.error.format() }, { status: 400 })
   }

   const validData = validationResult.data
   console.log("Dados validados:", validData)

   // Remover campos undefined ou null antes de atualizar
   const cleanData = Object.fromEntries(Object.entries(validData).filter(([_, v]) => v !== undefined))

   // Adicionar updated_at
   const dataToUpdate = {
     ...cleanData,
     updated_at: new Date().toISOString(),
   }

   // Verificar se o perfil já existe
   const { data: existingProfile } = await supabase.from("profiles").select("id").eq("id", session.user.id).single()

   if (existingProfile) {
     // Atualizar perfil existente
     const { error } = await supabase.from("profiles").update(dataToUpdate).eq("id", session.user.id)

     if (error) {
       console.error("Erro ao atualizar perfil:", error)
       return NextResponse.json({ error: "Erro ao atualizar perfil", details: error }, { status: 500 })
     }
   } else {
     // Criar novo perfil
     const { error } = await supabase.from("profiles").insert({
       id: session.user.id,
       ...dataToUpdate,
       created_at: new Date().toISOString(),
     })

     if (error) {
       console.error("Erro ao criar perfil:", error)
       return NextResponse.json({ error: "Erro ao criar perfil", details: error }, { status: 500 })
     }
   }

   console.log("Perfil atualizado com sucesso")
   return NextResponse.json({ success: true, message: "Perfil atualizado com sucesso" })
 } catch (error) {
   console.error("Erro ao processar requisição:", error)
   return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
 }
}`}
                    </Code>
                  </div>

                  <div>
                    <h5 className="text-sm font-medium">GET /api/admin/users/[id]/profile</h5>
                    <p className="text-xs text-muted-foreground mt-1">
                      Busca o perfil de um usuário específico (acesso administrativo).
                    </p>
                    <Code language="typescript" className="mt-2">
                      {`export async function GET(request: Request, { params }: { params: { id: string } }) {
 try {
   const supabase = createClient(cookies())

   // Verificar autenticação e permissão de admin
   const {
     data: { session },
   } = await supabase.auth.getSession()

   if (!session) {
     return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
   }

   // Verificar se é admin
   const { data: userData } = await supabase
     .from("users")
     .select("user_type")
     .eq("id", session.user.id)
     .single()

   if (userData?.user_type !== "admin") {
     return NextResponse.json({ error: "Acesso negado" }, { status: 403 })
   }

   const userId = params.id

   // Buscar perfil completo usando o serviço
   const profile = await getUserProfileById(userId)

   if (!profile) {
     return NextResponse.json({ error: "Perfil não encontrado" }, { status: 404 })
   }

   return NextResponse.json({ profile })
 } catch (error) {
   console.error("Erro ao processar requisição:", error)
   return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
 }
}`}
                    </Code>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="auth-api" className="space-y-4 mt-4">
                <div>
                  <h4 className="text-base font-medium">API de Autenticação</h4>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Endpoints para gerenciar autenticação, verificação de email e redefinição de senha.
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <h5 className="text-sm font-medium">POST /api/verify-email</h5>
                    <p className="text-xs text-muted-foreground mt-1">
                      Verifica o email de um usuário após clicar no link de verificação.
                    </p>
                    <Code language="typescript" className="mt-2">
                      {`export async function POST(request: Request) {
 try {
   const { token } = await request.json()

   if (!token) {
     return NextResponse.json({ error: "Token é obrigatório" }, { status: 400 })
   }

   const supabaseAdmin = createServiceRoleClient()

   // Verificar token
   const { data, error } = await supabaseAdmin.auth.verifyOtp({
     token_hash: token,
     type: "email",
   })

   if (error) {
     console.error("Erro ao verificar token:", error)
     return NextResponse.json({ error: "Token inválido ou expirado" }, { status: 400 })
   }

   if (!data.user) {
     return NextResponse.json({ error: "Usuário não encontrado" }, { status: 404 })
   }

   // Atualizar status do usuário
   const { error: updateError } = await supabaseAdmin
     .from("users")
     .update({ email_verified: true })
     .eq("id", data.user.id)

   if (updateError) {
     console.error("Erro ao atualizar status de verificação:", updateError)
     return NextResponse.json({ error: "Erro ao atualizar status de verificação" }, { status: 500 })
   }

   return NextResponse.json({ success: true, userId: data.user.id })
 } catch (error) {
   console.error("Erro ao processar verificação de email:", error)
   return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
 }
}`}
                    </Code>
                  </div>

                  <div>
                    <h5 className="text-sm font-medium">POST /api/user/email-change</h5>
                    <p className="text-xs text-muted-foreground mt-1">
                      Inicia o processo de alteração de email para um usuário.
                    </p>
                    <Code language="typescript" className="mt-2">
                      {`export async function POST(request: Request) {
 try {
   const supabase = createClient(cookies())

   // Verificar autenticação
   const {
     data: { session },
   } = await supabase.auth.getSession()

   if (!session) {
     return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
   }

   const { newEmail } = await request.json()

   if (!newEmail) {
     return NextResponse.json({ error: "Novo email é obrigatório" }, { status: 400 })
   }

   // Verificar se email já está em uso
   const { data: existingUser } = await supabase
     .from("users")
     .select("id")
     .eq("email", newEmail.toLowerCase())
     .maybeSingle()

   if (existingUser) {
     return NextResponse.json({ error: "Este email já está em uso" }, { status: 400 })
   }

   // Iniciar processo de alteração de email
   const supabaseAdmin = createServiceRoleClient()
   
   // Criar registro de solicitação de alteração
   const { error: insertError } = await supabaseAdmin.from("email_change_requests").insert({
     user_id: session.user.id,
     current_email: session.user.email,
     new_email: newEmail.toLowerCase(),
     status: "pending",
     expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 horas
   })

   if (insertError) {
     console.error("Erro ao registrar solicitação de alteração:", insertError)
     return NextResponse.json({ error: "Erro ao processar solicitação" }, { status: 500 })
   }

   // Enviar email de confirmação
   // Implementação do envio de email...

   return NextResponse.json({ success: true, message: "Solicitação de alteração de email enviada" })
 } catch (error) {
   console.error("Erro ao processar alteração de email:", error)
   return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
 }
}`}
                    </Code>
                  </div>
                </div>

                <div>
                  <h4 className="text-base font-medium">Considerações de Segurança</h4>
                  <p className="mt-2 text-sm text-muted-foreground">
                    As APIs de autenticação implementam várias medidas de segurança:
                  </p>
                  <ul className="mt-2 text-sm space-y-1 list-disc pl-5">
                    <li>Rate limiting para prevenir ataques de força bruta</li>
                    <li>Tokens de uso único para verificação de email e redefinição de senha</li>
                    <li>Expiração de tokens para limitar janela de vulnerabilidade</li>
                    <li>Validação rigorosa de dados para prevenir injeção</li>
                    <li>Logs detalhados para auditoria e detecção de problemas</li>
                  </ul>
                </div>
              </TabsContent>
            </Tabs>
          </TabsContent>

          <TabsContent value="ui-components" className="space-y-4 mt-4">
            <div>
              <h3 className="text-lg font-medium">Componentes de UI</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                O sistema inclui vários componentes de UI para interação com usuários, perfis e autenticação, fornecendo
                uma experiência consistente e segura.
              </p>
            </div>

            <Tabs defaultValue="profile-components" className="w-full">
              <TabsList className="grid grid-cols-3 w-full">
                <TabsTrigger value="profile-components">Componentes de Perfil</TabsTrigger>
                <TabsTrigger value="auth-components">Componentes de Autenticação</TabsTrigger>
                <TabsTrigger value="admin-components">Componentes Administrativos</TabsTrigger>
              </TabsList>

              <TabsContent value="profile-components" className="space-y-4 mt-4">
                <div>
                  <h4 className="text-base font-medium">Componentes de Perfil</h4>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Componentes para exibição e edição de informações de perfil.
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <h5 className="text-sm font-medium">ProfileForm</h5>
                    <p className="text-xs text-muted-foreground mt-1">
                      Formulário para edição de informações de perfil.
                    </p>
                    <Code language="typescript" className="mt-2">
                      {`export function ProfileForm({ profile, userId, onUpdateProfile, isAdmin = false }: ProfileFormProps) {
 const [formData, setFormData] = useState<ProfileUpdateData>({
   name: profile?.name || "",
   bio: profile?.bio || "",
   phone: profile?.phone || "",
   job_title: profile?.job_title || "",
   company: profile?.company || "",
   website: profile?.website || "",
   location: profile?.location || "",
   avatar_url: profile?.avatar_url || null,
   company_name: profile?.company_name || "",
   company_size: profile?.company_size || "",
   industry: profile?.industry || "",
 })
 const [isSaving, setIsSaving] = useState(false)
 const { toast } = useToast()

 // Atualizar estados quando o perfil mudar
 useEffect(() => {
   if (profile) {
     setFormData({
       name: profile.name || "",
       bio: profile.bio || "",
       phone: profile.phone || "",
       job_title: profile.job_title || "",
       company: profile.company || "",
       website: profile.website || "",
       location: profile.location || "",
       avatar_url: profile.avatar_url || null,
       company_name: profile.company_name || "",
       company_size: profile.company_size || "",
       industry: profile.industry || "",
     })
   }
 }, [profile])

 const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
   const { name, value } = e.target
   setFormData((prev) => ({ ...prev, [name]: value }))
 }

 const handleAvatarChange = (url: string | null) => {
   console.log("Avatar URL atualizada:", url)
   setFormData((prev) => ({ ...prev, avatar_url: url }))
 }

 const handleSubmit = async (e: React.FormEvent) => {
   e.preventDefault()
   setIsSaving(true)

   try {
     console.log("Enviando dados do perfil:", formData)

     const result = await onUpdateProfile(formData)

     if (result.error) {
       throw result.error
     }

     toast({
       title: "Perfil atualizado",
       description: "Suas informações foram atualizadas com sucesso.",
     })
   } catch (error: any) {
     console.error("Erro ao atualizar perfil:", error)
     toast({
       variant: "destructive",
       title: "Erro ao atualizar perfil",
       description: error.message || "Ocorreu um erro ao atualizar suas informações.",
     })
   } finally {
     setIsSaving(false)
   }
 }

 return (
   <form onSubmit={handleSubmit} className="space-y-6">
     <div className="flex justify-center mb-6">
       <AvatarUpload
         currentAvatarUrl={formData.avatar_url}
         userId={userId}
         onAvatarChange={handleAvatarChange}
         size="xl"
       />
     </div>

     <div className="space-y-4">
       <div className="space-y-2">
         <Label htmlFor="name">Nome completo</Label>
         <Input
           id="name"
           name="name"
           value={formData.name || ""}
           onChange={handleChange}
           placeholder="Seu nome completo"
         />
       </div>

       <div className="space-y-2">
         <Label htmlFor="bio">Biografia</Label>
         <Textarea
           id="bio"
           name="bio"
           value={formData.bio || ""}
           onChange={handleChange}
           placeholder="Conte um pouco sobre você..."
           className="min-h-32"
         />
       </div>

       {/* Outros campos do formulário... */}
     </div>

     <div className="flex justify-end">
       <Button type="submit" disabled={isSaving}>
         {isSaving ? (
           <>
             <Loader2 className="mr-2 h-4 w-4 animate-spin" />
             Salvando...
           </>
         ) : (
           "Salvar Alterações"
         )}
       </Button>
     </div>
   </form>
 )
}`}
                    </Code>
                  </div>

                  <div>
                    <h5 className="text-sm font-medium">AvatarUpload</h5>
                    <p className="text-xs text-muted-foreground mt-1">
                      Componente para upload e gerenciamento de avatar do usuário.
                    </p>
                    <Code language="typescript" className="mt-2">
                      {`export function AvatarUpload({
 currentAvatarUrl,
 userId,
 onAvatarChange,
 size = "md",
}: AvatarUploadProps) {
 const [isUploading, setIsUploading] = useState(false)
 const [uploadError, setUploadError] = useState<string | null>(null)
 const fileInputRef = useRef<HTMLInputElement>(null)
 const { toast } = useToast()

 const avatarSizes = {
   sm: "h-16 w-16",
   md: "h-24 w-24",
   lg: "h-32 w-32",
   xl: "h-40 w-40",
 }

 const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
   const file = e.target.files?.[0]
   if (!file) return

   // Validar tipo de arquivo
   if (!file.type.startsWith("image/")) {
     setUploadError("O arquivo deve ser uma imagem")
     toast({
       variant: "destructive",
       title: "Erro no upload",
       description: "O arquivo deve ser uma imagem (JPEG, PNG, etc.)",
     })
     return
   }

   // Validar tamanho (máximo 5MB)
   if (file.size > 5 * 1024 * 1024) {
     setUploadError("A imagem deve ter no máximo 5MB")
     toast({
       variant: "destructive",
       title: "Erro no upload",
       description: "A imagem deve ter no máximo 5MB",
     })
     return
   }

   setIsUploading(true)
   setUploadError(null)

   try {
     const supabase = createClient()
     
     // Gerar nome único para o arquivo
     const fileExt = file.name.split(".").pop()
     const fileName = \`\${userId}-\${Math.random().toString(36).substring(2, 15)}.\${fileExt}\`
     const filePath = \`avatars/\${fileName}\`

     // Fazer upload para o Storage
     const { error: uploadError } = await supabase.storage
       .from("user-content")
       .upload(filePath, file, { upsert: true })

     if (uploadError) {
       throw uploadError
     }

     // Obter URL pública
     const { data } = supabase.storage.from("user-content").getPublicUrl(filePath)
     
     // Notificar componente pai sobre mudança
     onAvatarChange(data.publicUrl)

     toast({
       title: "Avatar atualizado",
       description: "Seu avatar foi atualizado com sucesso",
     })
   } catch (error: any) {
     console.error("Erro ao fazer upload:", error)
     setUploadError(error.message || "Erro ao fazer upload da imagem")
     toast({
       variant: "destructive",
       title: "Erro no upload",
       description: error.message || "Ocorreu um erro ao fazer upload da imagem",
     })
   } finally {
     setIsUploading(false)
     // Limpar input
     if (fileInputRef.current) {
       fileInputRef.current.value = ""
     }
   }
 }

 const handleRemoveAvatar = async () => {
   if (!currentAvatarUrl) return

   try {
     // Notificar componente pai
     onAvatarChange(null)

     toast({
       title: "Avatar removido",
       description: "Seu avatar foi removido com sucesso",
     })
   } catch (error: any) {
     console.error("Erro ao remover avatar:", error)
     toast({
       variant: "destructive",
       title: "Erro ao remover avatar",
       description: error.message || "Ocorreu um erro ao remover seu avatar",
     })
   }
 }

 return (
   <div className="flex flex-col items-center gap-2">
     <div className={\`relative \${avatarSizes[size]} overflow-hidden rounded-full bg-muted\`}>
       {currentAvatarUrl ? (
         <Image
           src={currentAvatarUrl || "/placeholder.svg"}
           alt="Avatar"
           fill
           className="object-cover"
           sizes={\`(max-width: 768px) 100vw, \${parseInt(avatarSizes[size].split("w-")[1]) * 16}px\`}
         />
       ) : (
         <div className="flex h-full w-full items-center justify-center bg-muted">
           <UserIcon className="h-1/2 w-1/2 text-muted-foreground" />
         </div>
       )}

       {isUploading && (
         <div className="absolute inset-0 flex items-center justify-center bg-black/50">
           <Loader2 className="h-1/3 w-1/3 animate-spin text-white" />
         </div>
       )}
     </div>

     <div className="flex gap-2">
       <Button
         type="button"
         variant="outline"
         size="sm"
         onClick={() => fileInputRef.current?.click()}
         disabled={isUploading}
       >
         {currentAvatarUrl ? "Alterar" : "Adicionar"}
       </Button>

       {currentAvatarUrl && (
         <Button
           type="button"
           variant="outline"
           size="sm"
           onClick={handleRemoveAvatar}
           disabled={isUploading}
         >
           Remover
         </Button>
       )}

       <input
         type="file"
         ref={fileInputRef}
         onChange={handleFileChange}
         accept="image/*"
         className="hidden"
       />
     </div>

     {uploadError && <p className="text-xs text-destructive">{uploadError}</p>}
   </div>
 )
}`}
                    </Code>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="auth-components" className="space-y-4 mt-4">
                <div>
                  <h4 className="text-base font-medium">Componentes de Autenticação</h4>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Componentes para login, registro e gerenciamento de autenticação.
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <h5 className="text-sm font-medium">LoginForm</h5>
                    <p className="text-xs text-muted-foreground mt-1">
                      Formulário de login com validação e tratamento de erros.
                    </p>
                    <Code language="typescript" className="mt-2">
                      {`export function LoginForm() {
 const [isLoading, setIsLoading] = useState(false)
 const [error, setError] = useState<string | null>(null)
 const router = useRouter()
 const { toast } = useToast()

 const form = useForm<LoginFormValues>({
   resolver: zodResolver(loginSchema),
   defaultValues: {
     email: "",
     password: "",
   },
 })

 async function onSubmit(data: LoginFormValues) {
   setIsLoading(true)
   setError(null)

   try {
     const supabase = createClient()
     
     const { error } = await supabase.auth.signInWithPassword({
       email: data.email,
       password: data.password,
     })

     if (error) {
       throw error
     }

     // Verificar tipo de usuário para redirecionamento
     const { data: userData, error: userError } = await supabase
       .from("users")
       .select("user_type")
       .eq("email", data.email)
       .single()

     if (userError) {
       throw userError
     }

     // Redirecionar com base no tipo de usuário
     if (userData.user_type === "admin") {
       router.push("/admin")
     } else {
       router.push("/dashboard")
     }
   } catch (error: any) {
     console.error("Erro de login:", error)
     
     // Tratar mensagens de erro específicas
     if (error.message.includes("Invalid login")) {
       setError("Email ou senha incorretos")
     } else if (error.message.includes("Email not confirmed")) {
       setError("Email não confirmado. Verifique sua caixa de entrada.")
     } else {
       setError(error.message || "Ocorreu um erro ao fazer login")
     }

     toast({
       variant: "destructive",
       title: "Erro de login",
       description: error.message || "Ocorreu um erro ao fazer login",
     })
   } finally {
     setIsLoading(false)
   }
 }

 return (
   <Form {...form}>
     <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
       <FormField
         control={form.control}
         name="email"
         render={({ field }) => (
           <FormItem>
             <FormLabel>Email</FormLabel>
             <FormControl>
               <Input placeholder="seu@email.com" {...field} />
             </FormControl>
             <FormMessage />
           </FormItem>
         )}
       />
       <FormField
         control={form.control}
         name="password"
         render={({ field }) => (
           <FormItem>
             <FormLabel>Senha</FormLabel>
             <FormControl>
               <Input type="password" placeholder="••••••••" {...field} />
             </FormControl>
             <FormMessage />
           </FormItem>
         )}
       />

       {error && <p className="text-sm text-destructive">{error}</p>}

       <Button type="submit" className="w-full" disabled={isLoading}>
         {isLoading ? (
           <>
             <Loader2 className="mr-2 h-4 w-4 animate-spin" />
             Entrando...
           </>
         ) : (
           "Entrar"
         )}
       </Button>

       <div className="text-center text-sm">
         <Link href="/forgot-password" className="text-primary hover:underline">
           Esqueceu sua senha?
         </Link>
       </div>
     </form>
   </Form>
 )
}`}
                    </Code>
                  </div>

                  <div>
                    <h5 className="text-sm font-medium">SignupForm</h5>
                    <p className="text-xs text-muted-foreground mt-1">
                      Formulário de registro com validação e tratamento de erros.
                    </p>
                    <Code language="typescript" className="mt-2">
                      {`export function SignupForm({ initialPlan = "free" }: SignupFormProps) {
 const [isLoading, setIsLoading] = useState(false)
 const [error, setError] = useState<string | null>(null)
 const [selectedPlan, setSelectedPlan] = useState(initialPlan)
 const router = useRouter()
 const { toast } = useToast()

 const form = useForm<SignupFormValues>({
   resolver: zodResolver(signupSchema),
   defaultValues: {
     name: "",
     email: "",
     password: "",
     confirmPassword: "",
     acceptTerms: false,
   },
 })

 // Atualizar plano selecionado quando initialPlan mudar
 useEffect(() => {
   setSelectedPlan(initialPlan)
 }, [initialPlan])

 async function onSubmit(data: SignupFormValues) {
   setIsLoading(true)
   setError(null)

   try {
     const supabase = createClient()
     
     // Verificar se email já existe
     const { data: emailExists } = await supabase.functions.invoke("check-email-exists", {
       body: { email: data.email },
     })

     if (emailExists?.exists) {
       setError("Este email já está em uso")
       return
     }

     // Registrar usuário
     const { error: signUpError } = await supabase.auth.signUp({
       email: data.email,
       password: data.password,
       options: {
         data: {
           name: data.name,
           plan: selectedPlan,
         },
         emailRedirectTo: \`\${window.location.origin}/auth/verify\`,
       },
     })

     if (signUpError) {
       throw signUpError
     }

     // Redirecionar para página de verificação
     router.push("/signup/verify?email=" + encodeURIComponent(data.email))
     
     toast({
       title: "Registro concluído",
       description: "Verifique seu email para ativar sua conta",
     })
   } catch (error: any) {
     console.error("Erro de registro:", error)
     setError(error.message || "Ocorreu um erro ao criar sua conta")

     toast({
       variant: "destructive",
       title: "Erro de registro",
       description: error.message || "Ocorreu um erro ao criar sua conta",
     })
   } finally {
     setIsLoading(false)
   }
 }

 return (
   <Form {...form}>
     <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
       <FormField
         control={form.control}
         name="name"
         render={({ field }) => (
           <FormItem>
             <FormLabel>Nome completo</FormLabel>
             <FormControl>
               <Input placeholder="Seu nome completo" {...field} />
             </FormControl>
             <FormMessage />
           </FormItem>
         )}
       />

       <FormField
         control={form.control}
         name="email"
         render={({ field }) => (
           <FormItem>
             <FormLabel>Email</FormLabel>
             <FormControl>
               <Input placeholder="seu@email.com" {...field} />
             </FormControl>
             <FormMessage />
           </FormItem>
         )}
       />

       <FormField
         control={form.control}
         name="password"
         render={({ field }) => (
           <FormItem>
             <FormLabel>Senha</FormLabel>
             <FormControl>
               <Input type="password" placeholder="••••••••" {...field} />
             </FormControl>
             <FormMessage />
             <PasswordStrengthIndicator password={field.value} />
           </FormItem>
         )}
       />

       <FormField
         control={form.control}
         name="confirmPassword"
         render={({ field }) => (
           <FormItem>
             <FormLabel>Confirmar senha</FormLabel>
             <FormControl>
               <Input type="password" placeholder="••••••••" {...field} />
             </FormControl>
             <FormMessage />
           </FormItem>
         )}
       />

       <FormField
         control={form.control}
         name="acceptTerms"
         render={({ field }) => (
           <FormItem className="flex flex-row items-start space-x-3 space-y-0">
             <FormControl>
               <Checkbox
                 checked={field.value}
                 onCheckedChange={field.onChange}
               />
             </FormControl>
             <FormLabel className="text-sm font-normal">
               Eu aceito os <Link href="/termos" className="text-primary hover:underline">Termos de Uso</Link> e a{" "}
               <Link href="/privacidade" className="text-primary hover:underline">Política de Privacidade</Link>
             </FormLabel>
           </FormItem>
         )}
       />

       {error && <p className="text-sm text-destructive">{error}</p>}

       <Button type="submit" className="w-full" disabled={isLoading}>
         {isLoading ? (
           <>
             <Loader2 className="mr-2 h-4 w-4 animate-spin" />
             Criando conta...
           </>
         ) : (
           "Criar conta"
         )}
       </Button>
     </form>
   </Form>
 )
}`}
                    </Code>
                  </div>
                </div>

                <div>
                  <h4 className="text-base font-medium">Uso dos Componentes de Autenticação</h4>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Os componentes de autenticação são utilizados em várias partes da aplicação:
                  </p>
                  <ul className="mt-2 text-sm space-y-1 list-disc pl-5">
                    <li>Páginas de login e registro</li>
                    <li>Fluxos de redefinição de senha</li>
                    <li>Verificação de email</li>
                    <li>Gerenciamento de sessão</li>
                  </ul>
                </div>
              </TabsContent>

              <TabsContent value="admin-components" className="space-y-4 mt-4">
                <div>
                  <h4 className="text-base font-medium">Componentes Administrativos</h4>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Componentes para gerenciamento de usuários e perfis no painel administrativo.
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <h5 className="text-sm font-medium">AdminUsersList</h5>
                    <p className="text-xs text-muted-foreground mt-1">Lista de usuários com opções de gerenciamento.</p>
                    <Code language="typescript" className="mt-2">
                      {`export function AdminUsersList() {
 const [users, setUsers] = useState<User[]>([])
 const [loading, setLoading] = useState(true)
 const [error, setError] = useState<string | null>(null)
 
 useEffect(() => {
   async function loadUsers() {
     try {
       const response = await fetch('/api/admin/users')
       
       if (!response.ok) {
         throw new Error('Erro ao carregar usuários')
       }
       
       const data = await response.json()
       setUsers(data.users)
     } catch (err: any) {
       setError(err.message || 'Ocorreu um erro ao carregar os usuários')
     } finally {
       setLoading(false)
     }
   }
   
   loadUsers()
 }, [])
 
 if (loading) {
   return <div className="flex justify-center p-4"><Loader2 className="h-8 w-8 animate-spin" /></div>
 }
 
 if (error) {
   return <div className="text-destructive p-4">{error}</div>
 }
 
 return (
   <div className="space-y-4">
     <div className="flex justify-between items-center">
       <h2 className="text-xl font-semibold">Usuários</h2>
       <Button>
         <PlusIcon className="h-4 w-4 mr-2" />
         Adicionar Usuário
       </Button>
     </div>
     
     <div className="border rounded-md">
       <Table>
         <TableHeader>
           <TableRow>
             <TableHead>Nome</TableHead>
             <TableHead>Email</TableHead>
             <TableHead>Tipo</TableHead>
             <TableHead>Status</TableHead>
             <TableHead>Criado em</TableHead>
             <TableHead>Ações</TableHead>
           </TableRow>
         </TableHeader>
         <TableBody>
           {users.map((user) => (
             <TableRow key={user.id}>
               <TableCell>{user.name || '-'}</TableCell>
               <TableCell>{user.email}</TableCell>
               <TableCell>
                 <Badge variant={user.user_type === 'admin' ? 'default' : 'outline'}>
                   {user.user_type === 'admin' ? 'Admin' : 'Cliente'}
                 </Badge>
               </TableCell>
               <TableCell>
                 <Badge variant={user.status === 'active' ? 'success' : 'destructive'}>
                   {user.status === 'active' ? 'Ativo' : 'Inativo'}
                 </Badge>
               </TableCell>
               <TableCell>{new Date(user.created_at).toLocaleDateString()}</TableCell>
               <TableCell>
                 <DropdownMenu>
                   <DropdownMenuTrigger asChild>
                     <Button variant="ghost" size="icon">
                       <MoreHorizontalIcon className="h-4 w-4" />
                     </Button>
                   </DropdownMenuTrigger>
                   <DropdownMenuContent align="end">
                     <DropdownMenuItem>
                       <Link href={\`/admin/usuarios/\${user.id}\`} className="w-full">
                         Ver detalhes
                       </Link>
                     </DropdownMenuItem>
                     <DropdownMenuItem>Editar</DropdownMenuItem>
                     <DropdownMenuSeparator />
                     <DropdownMenuItem className="text-destructive">
                       Desativar
                     </DropdownMenuItem>
                   </DropdownMenuContent>
                 </DropdownMenu>
               </TableCell>
             </TableRow>
           ))}
         </TableBody>
       </Table>
     </div>
   </div>
 )
}`}
                    </Code>
                  </div>

                  <div>
                    <h5 className="text-sm font-medium">CreateUserModal</h5>
                    <p className="text-xs text-muted-foreground mt-1">
                      Modal para criação de novos usuários pelo administrador.
                    </p>
                    <Code language="typescript" className="mt-2">
                      {`export function CreateUserModal({ isOpen, onClose, onSuccess }: CreateUserModalProps) {
 const [isLoading, setIsLoading] = useState(false)
 const [error, setError] = useState<string | null>(null)
 const { toast } = useToast()
 
 const form = useForm<CreateUserFormValues>({
   resolver: zodResolver(createUserSchema),
   defaultValues: {
     nome: "",
     email: "",
     tipoAcesso: "client",
     plano: "free",
   },
 })
 
 async function onSubmit(data: CreateUserFormValues) {
   setIsLoading(true)
   setError(null)
   
   try {
     const response = await fetch('/api/users', {
       method: 'POST',
       headers: {
         'Content-Type': 'application/json',
       },
       body: JSON.stringify(data),
     })
     
     const result = await response.json()
     
     if (!response.ok) {
       throw new Error(result.error || 'Erro ao criar usuário')
     }
     
     toast({
       title: "Usuário criado",
       description: "O usuário foi criado com sucesso.",
     })
     
     form.reset()
     onSuccess?.(result)
     onClose()
   } catch (error: any) {
     console.error("Erro ao criar usuário:", error)
     setError(error.message || "Ocorreu um erro ao criar o usuário")
     
     toast({
       variant: "destructive",
       title: "Erro ao criar usuário",
       description: error.message || "Ocorreu um erro ao criar o usuário",
     })
   } finally {
     setIsLoading(false)
   }
 }
 
 return (
   <Dialog open={isOpen} onOpenChange={onClose}>
     <DialogContent className="sm:max-w-[425px]">
       <DialogHeader>
         <DialogTitle>Criar Novo Usuário</DialogTitle>
         <DialogDescription>
           Preencha os dados abaixo para criar um novo usuário no sistema.
         </DialogDescription>
       </DialogHeader>
       
       <Form {...form}>
         <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
           <FormField
             control={form.control}
             name="nome"
             render={({ field }) => (
               <FormItem>
                 <FormLabel>Nome</FormLabel>
                 <FormControl>
                   <Input placeholder="Nome completo" {...field} />
                 </FormControl>
                 <FormMessage />
               </FormItem>
             )}
           />
           
           <FormField
             control={form.control}
             name="email"
             render={({ field }) => (
               <FormItem>
                 <FormLabel>Email</FormLabel>
                 <FormControl>
                   <Input placeholder="email@exemplo.com" {...field} />
                 </FormControl>
                 <FormMessage />
               </FormItem>
             )}
           />
           
           <FormField
             control={form.control}
             name="tipoAcesso"
             render={({ field }) => (
               <FormItem>
                 <FormLabel>Tipo de Acesso</FormLabel>
                 <Select
                   onValueChange={field.onChange}
                   defaultValue={field.value}
                 >
                   <FormControl>
                     <SelectTrigger>
                       <SelectValue placeholder="Selecione o tipo de acesso" />
                     </SelectTrigger>
                   </FormControl>
                   <SelectContent>
                     <SelectItem value="client">Cliente</SelectItem>
                     <SelectItem value="admin">Administrador</SelectItem>
                   </SelectContent>
                 </Select>
                 <FormMessage />
               </FormItem>
             )}
           />
           
           <FormField
             control={form.control}
             name="plano"
             render={({ field }) => (
               <FormItem>
                 <FormLabel>Plano</FormLabel>
                 <Select
                   onValueChange={field.onChange}
                   defaultValue={field.value}
                   disabled={form.watch("tipoAcesso") === "admin"}
                 >
                   <FormControl>
                     <SelectTrigger>
                       <SelectValue placeholder="Selecione o plano" />
                     </SelectTrigger>
                   </FormControl>
                   <SelectContent>
                     <SelectItem value="free">Gratuito</SelectItem>
                     <SelectItem value="basic">Básico</SelectItem>
                     <SelectItem value="pro">Profissional</SelectItem>
                     <SelectItem value="enterprise">Empresarial</SelectItem>
                   </SelectContent>
                 </Select>
                 <FormMessage />
               </FormItem>
             )}
           />
           
           {error && <p className="text-sm text-destructive">{error}</p>}
           
           <DialogFooter>
             <Button type="button" variant="outline" onClick={onClose}>
               Cancelar
             </Button>
             <Button type="submit" disabled={isLoading}>
               {isLoading ? (
                 <>
                   <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                   Criando...
                 </>
               ) : (
                 "Criar Usuário"
               )}
             </Button>
           </DialogFooter>
         </form>
       </Form>
     </DialogContent>
   </Dialog>
 )
}`}
                    </Code>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

export default function ServicesDocs() {
  return <ServicesDocumentation />
}
