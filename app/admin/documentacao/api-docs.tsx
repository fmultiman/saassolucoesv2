"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Code } from "@/components/ui/code"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { InfoIcon } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export function ApiDocumentation() {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Documentação de API</CardTitle>
        <CardDescription>Referência completa das APIs disponíveis no sistema SaaS Soluções</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid grid-cols-5 w-full">
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="users-api">API de Usuários</TabsTrigger>
            <TabsTrigger value="profiles-api">API de Perfis</TabsTrigger>
            <TabsTrigger value="auth-api">API de Autenticação</TabsTrigger>
            <TabsTrigger value="admin-api">API Administrativa</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4 mt-4">
            <div>
              <h3 className="text-lg font-medium">Visão Geral da API</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                O SaaS Soluções oferece um conjunto abrangente de APIs RESTful para interação com o sistema. Todas as
                APIs seguem padrões consistentes de design, autenticação e tratamento de erros.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-medium">Autenticação</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Todas as APIs protegidas requerem autenticação via token JWT. O token deve ser incluído no header
                <code>Authorization</code> no formato <code>Bearer [token]</code>.
              </p>
              <Code language="bash" className="mt-2">
                {`# Exemplo de requisição autenticada
curl -X GET https://api.saas-solucoes.com/api/user/profile \\
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."`}
              </Code>
            </div>

            <div>
              <h3 className="text-lg font-medium">Formato de Resposta</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Todas as APIs retornam respostas no formato JSON com estrutura consistente:
              </p>
              <Code language="json" className="mt-2">
                {`// Resposta de sucesso
{
  "data": { ... },  // Dados da resposta
  "meta": { ... }   // Metadados (paginação, etc.)
}

// Resposta de erro
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Dados inválidos",
    "details": { ... }
  }
}`}
              </Code>
            </div>

            <div>
              <h3 className="text-lg font-medium">Códigos de Status HTTP</h3>
              <div className="overflow-x-auto">
                <Table className="mt-2">
                  <TableHeader>
                    <TableRow>
                      <TableHead>Código</TableHead>
                      <TableHead>Descrição</TableHead>
                      <TableHead>Uso</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>200 OK</TableCell>
                      <TableCell>Requisição bem-sucedida</TableCell>
                      <TableCell>GET, PUT, PATCH com sucesso</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>201 Created</TableCell>
                      <TableCell>Recurso criado com sucesso</TableCell>
                      <TableCell>POST com sucesso</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>204 No Content</TableCell>
                      <TableCell>Operação bem-sucedida sem conteúdo de retorno</TableCell>
                      <TableCell>DELETE com sucesso</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>400 Bad Request</TableCell>
                      <TableCell>Requisição inválida</TableCell>
                      <TableCell>Erros de validação</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>401 Unauthorized</TableCell>
                      <TableCell>Autenticação necessária</TableCell>
                      <TableCell>Token ausente ou inválido</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>403 Forbidden</TableCell>
                      <TableCell>Acesso negado</TableCell>
                      <TableCell>Permissões insuficientes</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>404 Not Found</TableCell>
                      <TableCell>Recurso não encontrado</TableCell>
                      <TableCell>ID inválido ou recurso inexistente</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>429 Too Many Requests</TableCell>
                      <TableCell>Limite de requisições excedido</TableCell>
                      <TableCell>Rate limiting</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>500 Internal Server Error</TableCell>
                      <TableCell>Erro interno do servidor</TableCell>
                      <TableCell>Falhas inesperadas</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </div>

            <Alert>
              <InfoIcon className="h-4 w-4" />
              <AlertTitle>Rate Limiting</AlertTitle>
              <AlertDescription>
                Todas as APIs estão sujeitas a limites de taxa para garantir a estabilidade do sistema. Os limites
                variam de acordo com o endpoint e o plano do usuário. Os headers <code>X-RateLimit-Limit</code> e
                <code>X-RateLimit-Remaining</code> são incluídos em todas as respostas.
              </AlertDescription>
            </Alert>
          </TabsContent>

          <TabsContent value="users-api" className="space-y-4 mt-4">
            <div>
              <h3 className="text-lg font-medium">API de Usuários</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Endpoints para gerenciamento de usuários, incluindo criação, atualização e busca.
              </p>
            </div>

            <div className="space-y-6">
              <div>
                <h4 className="text-base font-medium">GET /api/users</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Lista usuários com suporte a paginação e filtragem.
                </p>
                <div className="mt-2 space-y-2">
                  <div>
                    <h5 className="text-sm font-medium">Parâmetros de Query</h5>
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Parâmetro</TableHead>
                            <TableHead>Tipo</TableHead>
                            <TableHead>Descrição</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          <TableRow>
                            <TableCell>page</TableCell>
                            <TableCell>number</TableCell>
                            <TableCell>Número da página (padrão: 1)</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>limit</TableCell>
                            <TableCell>number</TableCell>
                            <TableCell>Itens por página (padrão: 10, máx: 100)</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>search</TableCell>
                            <TableCell>string</TableCell>
                            <TableCell>Termo de busca (nome ou email)</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>status</TableCell>
                            <TableCell>string</TableCell>
                            <TableCell>Filtro por status (active, inactive)</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>type</TableCell>
                            <TableCell>string</TableCell>
                            <TableCell>Filtro por tipo (client, admin)</TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </div>
                  </div>

                  <div>
                    <h5 className="text-sm font-medium">Resposta</h5>
                    <Code language="json" className="mt-1">
                      {`{
  "data": [
    {
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "email": "usuario@exemplo.com",
      "name": "Nome do Usuário",
      "user_type": "client",
      "plan": "basic",
      "status": "active",
      "created_at": "2023-01-15T14:30:00Z"
    },
    // ...mais usuários
  ],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 42,
    "pages": 5
  }
}`}
                    </Code>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-base font-medium">GET /api/users/:id</h4>
                <p className="text-sm text-muted-foreground mt-1">Busca um usuário específico pelo ID.</p>
                <div className="mt-2 space-y-2">
                  <div>
                    <h5 className="text-sm font-medium">Parâmetros de URL</h5>
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Parâmetro</TableHead>
                            <TableHead>Tipo</TableHead>
                            <TableHead>Descrição</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          <TableRow>
                            <TableCell>id</TableCell>
                            <TableCell>string</TableCell>
                            <TableCell>ID do usuário (UUID)</TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </div>
                  </div>

                  <div>
                    <h5 className="text-sm font-medium">Resposta</h5>
                    <Code language="json" className="mt-1">
                      {`{
  "data": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "email": "usuario@exemplo.com",
    "name": "Nome do Usuário",
    "user_type": "client",
    "plan": "basic",
    "status": "active",
    "created_at": "2023-01-15T14:30:00Z",
    "last_sign_in_at": "2023-03-10T09:15:22Z"
  }
}`}
                    </Code>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-base font-medium">POST /api/users</h4>
                <p className="text-sm text-muted-foreground mt-1">Cria um novo usuário.</p>
                <div className="mt-2 space-y-2">
                  <div>
                    <h5 className="text-sm font-medium">Corpo da Requisição</h5>
                    <Code language="json" className="mt-1">
                      {`{
  "nome": "Nome do Usuário",
  "email": "usuario@exemplo.com",
  "tipoAcesso": "client",  // "client" ou "admin"
  "plano": "basic",        // "free", "basic", "pro", "enterprise"
  "forceCreate": false     // opcional, força criação mesmo se email existir
}`}
                    </Code>
                  </div>

                  <div>
                    <h5 className="text-sm font-medium">Resposta</h5>
                    <Code language="json" className="mt-1">
                      {`{
  "message": "Usuário criado com sucesso",
  "userId": "123e4567-e89b-12d3-a456-426614174000",
  "action": "created"
}`}
                    </Code>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-base font-medium">PUT /api/users/:id</h4>
                <p className="text-sm text-muted-foreground mt-1">Atualiza um usuário existente.</p>
                <div className="mt-2 space-y-2">
                  <div>
                    <h5 className="text-sm font-medium">Parâmetros de URL</h5>
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Parâmetro</TableHead>
                            <TableHead>Tipo</TableHead>
                            <TableHead>Descrição</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          <TableRow>
                            <TableCell>id</TableCell>
                            <TableCell>string</TableCell>
                            <TableCell>ID do usuário (UUID)</TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </div>
                  </div>

                  <div>
                    <h5 className="text-sm font-medium">Corpo da Requisição</h5>
                    <Code language="json" className="mt-1">
                      {`{
  "name": "Novo Nome",
  "email": "novo.email@exemplo.com",
  "user_type": "client",
  "plan": "pro",
  "status": "active"
}`}
                    </Code>
                  </div>

                  <div>
                    <h5 className="text-sm font-medium">Resposta</h5>
                    <Code language="json" className="mt-1">
                      {`{
  "user": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "email": "novo.email@exemplo.com",
    "name": "Novo Nome",
    "user_type": "client",
    "plan": "pro",
    "status": "active",
    "created_at": "2023-01-15T14:30:00Z",
    "updated_at": "2023-03-20T11:45:30Z"
  }
}`}
                    </Code>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-base font-medium">DELETE /api/users/:id</h4>
                <p className="text-sm text-muted-foreground mt-1">Desativa ou remove um usuário.</p>
                <div className="mt-2 space-y-2">
                  <div>
                    <h5 className="text-sm font-medium">Parâmetros de URL</h5>
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Parâmetro</TableHead>
                            <TableHead>Tipo</TableHead>
                            <TableHead>Descrição</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          <TableRow>
                            <TableCell>id</TableCell>
                            <TableCell>string</TableCell>
                            <TableCell>ID do usuário (UUID)</TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </div>
                  </div>

                  <div>
                    <h5 className="text-sm font-medium">Parâmetros de Query</h5>
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Parâmetro</TableHead>
                            <TableHead>Tipo</TableHead>
                            <TableHead>Descrição</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          <TableRow>
                            <TableCell>hard</TableCell>
                            <TableCell>boolean</TableCell>
                            <TableCell>Se true, remove permanentemente. Se false (padrão), apenas desativa.</TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </div>
                  </div>

                  <div>
                    <h5 className="text-sm font-medium">Resposta</h5>
                    <Code language="json" className="mt-1">
                      {`{
  "success": true,
  "message": "Usuário desativado com sucesso"
}`}
                    </Code>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="profiles-api" className="space-y-4 mt-4">
            <div>
              <h3 className="text-lg font-medium">API de Perfis</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Endpoints para gerenciamento de perfis de usuário, incluindo atualização e busca de informações de
                perfil.
              </p>
            </div>

            <div className="space-y-6">
              <div>
                <h4 className="text-base font-medium">GET /api/user/profile</h4>
                <p className="text-sm text-muted-foreground mt-1">Busca o perfil do usuário autenticado.</p>
                <div className="mt-2 space-y-2">
                  <div>
                    <h5 className="text-sm font-medium">Resposta</h5>
                    <Code language="json" className="mt-1">
                      {`{
  "user": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "email": "usuario@exemplo.com",
    "user_type  {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "email": "usuario@exemplo.com",
    "user_type": "client",
    "plan": "basic",
    "status": "active",
    "created_at": "2023-01-15T14:30:00Z"
  },
  "profile": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "name": "Nome do Usuário",
    "bio": "Breve biografia do usuário",
    "phone": "+55 11 98765-4321",
    "job_title": "Desenvolvedor",
    "company_name": "Empresa XYZ",
    "avatar_url": "https://exemplo.com/avatar.jpg",
    "profile_complete": true,
    "created_at": "2023-01-15T14:35:00Z",
    "updated_at": "2023-03-20T11:45:30Z"
  }
}`}
                    </Code>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-base font-medium">PUT /api/user/profile</h4>
                <p className="text-sm text-muted-foreground mt-1">Atualiza o perfil do usuário autenticado.</p>
                <div className="mt-2 space-y-2">
                  <div>
                    <h5 className="text-sm font-medium">Corpo da Requisição</h5>
                    <Code language="json" className="mt-1">
                      {`{
  "name": "Novo Nome",
  "bio": "Nova biografia",
  "phone": "+55 11 91234-5678",
  "job_title": "Gerente de Projetos",
  "company_name": "Nova Empresa",
  "website": "https://meusite.com",
  "location": "São Paulo, SP",
  "avatar_url": "https://exemplo.com/novo-avatar.jpg",
  "company_size": "11-50",
  "industry": "Tecnologia"
}`}
                    </Code>
                  </div>

                  <div>
                    <h5 className="text-sm font-medium">Resposta</h5>
                    <Code language="json" className="mt-1">
                      {`{
  "success": true,
  "message": "Perfil atualizado com sucesso"
}`}
                    </Code>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-base font-medium">GET /api/admin/users/:id/profile</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Busca o perfil de um usuário específico (acesso administrativo).
                </p>
                <div className="mt-2 space-y-2">
                  <div>
                    <h5 className="text-sm font-medium">Parâmetros de URL</h5>
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Parâmetro</TableHead>
                            <TableHead>Tipo</TableHead>
                            <TableHead>Descrição</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          <TableRow>
                            <TableCell>id</TableCell>
                            <TableCell>string</TableCell>
                            <TableCell>ID do usuário (UUID)</TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </div>
                  </div>

                  <div>
                    <h5 className="text-sm font-medium">Resposta</h5>
                    <Code language="json" className="mt-1">
                      {`{
  "profile": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "email": "usuario@exemplo.com",
    "user_type": "client",
    "plan": "basic",
    "status": "active",
    "created_at": "2023-01-15T14:30:00Z",
    "name": "Nome do Usuário",
    "bio": "Breve biografia do usuário",
    "phone": "+55 11 98765-4321",
    "job_title": "Desenvolvedor",
    "company_name": "Empresa XYZ",
    "avatar_url": "https://exemplo.com/avatar.jpg",
    "profile_complete": true,
    "profile_created_at": "2023-01-15T14:35:00Z",
    "profile_updated_at": "2023-03-20T11:45:30Z"
  }
}`}
                    </Code>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-base font-medium">PATCH /api/admin/users/:id/profile</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Atualiza o perfil de um usuário específico (acesso administrativo).
                </p>
                <div className="mt-2 space-y-2">
                  <div>
                    <h5 className="text-sm font-medium">Parâmetros de URL</h5>
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Parâmetro</TableHead>
                            <TableHead>Tipo</TableHead>
                            <TableHead>Descrição</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          <TableRow>
                            <TableCell>id</TableCell>
                            <TableCell>string</TableCell>
                            <TableCell>ID do usuário (UUID)</TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </div>
                  </div>

                  <div>
                    <h5 className="text-sm font-medium">Corpo da Requisição</h5>
                    <Code language="json" className="mt-1">
                      {`{
  "name": "Nome Atualizado",
  "profile_complete": true,
  "company_name": "Empresa Atualizada"
}`}
                    </Code>
                  </div>

                  <div>
                    <h5 className="text-sm font-medium">Resposta</h5>
                    <Code language="json" className="mt-1">
                      {`{
  "success": true,
  "message": "Perfil atualizado com sucesso"
}`}
                    </Code>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="auth-api" className="space-y-4 mt-4">
            <div>
              <h3 className="text-lg font-medium">API de Autenticação</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Endpoints para gerenciar autenticação, verificação de email e redefinição de senha.
              </p>
            </div>

            <div className="space-y-6">
              <div>
                <h4 className="text-base font-medium">POST /api/auth/signup</h4>
                <p className="text-sm text-muted-foreground mt-1">Registra um novo usuário no sistema.</p>
                <div className="mt-2 space-y-2">
                  <div>
                    <h5 className="text-sm font-medium">Corpo da Requisição</h5>
                    <Code language="json" className="mt-1">
                      {`{
  "name": "Nome do Usuário",
  "email": "usuario@exemplo.com",
  "password": "Senha@123",
  "plan": "basic",
  "acceptTerms": true
}`}
                    </Code>
                  </div>

                  <div>
                    <h5 className="text-sm font-medium">Resposta</h5>
                    <Code language="json" className="mt-1">
                      {`{
  "success": true,
  "message": "Usuário registrado com sucesso. Verifique seu email para ativar sua conta.",
  "userId": "123e4567-e89b-12d3-a456-426614174000"
}`}
                    </Code>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-base font-medium">POST /api/auth/login</h4>
                <p className="text-sm text-muted-foreground mt-1">Autentica um usuário e retorna um token de sessão.</p>
                <div className="mt-2 space-y-2">
                  <div>
                    <h5 className="text-sm font-medium">Corpo da Requisição</h5>
                    <Code language="json" className="mt-1">
                      {`{
  "email": "usuario@exemplo.com",
  "password": "Senha@123"
}`}
                    </Code>
                  </div>

                  <div>
                    <h5 className="text-sm font-medium">Resposta</h5>
                    <Code language="json" className="mt-1">
                      {`{
  "success": true,
  "user": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "email": "usuario@exemplo.com",
    "user_type": "client"
  },
  "session": {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refresh_token": "ey5KhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expires_at": 1679328000000
  }
}`}
                    </Code>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-base font-medium">POST /api/auth/logout</h4>
                <p className="text-sm text-muted-foreground mt-1">Encerra a sessão do usuário atual.</p>
                <div className="mt-2 space-y-2">
                  <div>
                    <h5 className="text-sm font-medium">Resposta</h5>
                    <Code language="json" className="mt-1">
                      {`{
  "success": true,
  "message": "Logout realizado com sucesso"
}`}
                    </Code>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-base font-medium">POST /api/auth/refresh</h4>
                <p className="text-sm text-muted-foreground mt-1">Renova o token de acesso usando o refresh token.</p>
                <div className="mt-2 space-y-2">
                  <div>
                    <h5 className="text-sm font-medium">Corpo da Requisição</h5>
                    <Code language="json" className="mt-1">
                      {`{
  "refresh_token": "ey5KhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}`}
                    </Code>
                  </div>

                  <div>
                    <h5 className="text-sm font-medium">Resposta</h5>
                    <Code language="json" className="mt-1">
                      {`{
  "success": true,
  "session": {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refresh_token": "ey5KhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expires_at": 1679328000000
  }
}`}
                    </Code>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-base font-medium">POST /api/auth/forgot-password</h4>
                <p className="text-sm text-muted-foreground mt-1">Inicia o processo de redefinição de senha.</p>
                <div className="mt-2 space-y-2">
                  <div>
                    <h5 className="text-sm font-medium">Corpo da Requisição</h5>
                    <Code language="json" className="mt-1">
                      {`{
  "email": "usuario@exemplo.com"
}`}
                    </Code>
                  </div>

                  <div>
                    <h5 className="text-sm font-medium">Resposta</h5>
                    <Code language="json" className="mt-1">
                      {`{
  "success": true,
  "message": "Se o email existir, enviaremos instruções para redefinir sua senha."
}`}
                    </Code>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-base font-medium">POST /api/auth/reset-password</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Redefine a senha do usuário usando o token recebido por email.
                </p>
                <div className="mt-2 space-y-2">
                  <div>
                    <h5 className="text-sm font-medium">Corpo da Requisição</h5>
                    <Code language="json" className="mt-1">
                      {`{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "password": "NovaSenha@123",
  "confirmPassword": "NovaSenha@123"
}`}
                    </Code>
                  </div>

                  <div>
                    <h5 className="text-sm font-medium">Resposta</h5>
                    <Code language="json" className="mt-1">
                      {`{
  "success": true,
  "message": "Senha redefinida com sucesso. Você já pode fazer login."
}`}
                    </Code>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="admin-api" className="space-y-4 mt-4">
            <div>
              <h3 className="text-lg font-medium">API Administrativa</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Endpoints administrativos para gerenciamento do sistema, disponíveis apenas para usuários com permissões
                de administrador.
              </p>
            </div>

            <div className="space-y-6">
              <div>
                <h4 className="text-base font-medium">GET /api/admin/dashboard</h4>
                <p className="text-sm text-muted-foreground mt-1">Retorna dados para o dashboard administrativo.</p>
                <div className="mt-2 space-y-2">
                  <div>
                    <h5 className="text-sm font-medium">Parâmetros de Query</h5>
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Parâmetro</TableHead>
                            <TableHead>Tipo</TableHead>
                            <TableHead>Descrição</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          <TableRow>
                            <TableCell>period</TableCell>
                            <TableCell>string</TableCell>
                            <TableCell>Período dos dados (day, week, month, year)</TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </div>
                  </div>

                  <div>
                    <h5 className="text-sm font-medium">Resposta</h5>
                    <Code language="json" className="mt-1">
                      {`{
  "users": {
    "total": 1250,
    "active": 980,
    "new": 45,
    "growth": 3.7
  },
  "revenue": {
    "total": 25000.00,
    "recurring": 22500.00,
    "oneTime": 2500.00,
    "growth": 5.2
  },
  "solutions": {
    "total": 15,
    "active": 12,
    "mostUsed": [
      { "id": "sol-1", "name": "Solução A", "users": 450 },
      { "id": "sol-2", "name": "Solução B", "users": 320 },
      { "id": "sol-3", "name": "Solução C", "users": 210 }
    ]
  },
  "plans": {
    "distribution": [
      { "name": "Free", "count": 500, "percentage": 40 },
      { "name": "Basic", "count": 350, "percentage": 28 },
      { "name": "Pro", "count": 250, "percentage": 20 },
      { "name": "Enterprise", "count": 150, "percentage": 12 }
    ]
  }
}`}
                    </Code>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-base font-medium">GET /api/admin/analytics</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Retorna dados analíticos detalhados para análise administrativa.
                </p>
                <div className="mt-2 space-y-2">
                  <div>
                    <h5 className="text-sm font-medium">Parâmetros de Query</h5>
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Parâmetro</TableHead>
                            <TableHead>Tipo</TableHead>
                            <TableHead>Descrição</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          <TableRow>
                            <TableCell>startDate</TableCell>
                            <TableCell>string</TableCell>
                            <TableCell>Data inicial (YYYY-MM-DD)</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>endDate</TableCell>
                            <TableCell>string</TableCell>
                            <TableCell>Data final (YYYY-MM-DD)</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>metric</TableCell>
                            <TableCell>string</TableCell>
                            <TableCell>Métrica específica (users, revenue, solutions)</TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </div>
                  </div>

                  <div>
                    <h5 className="text-sm font-medium">Resposta</h5>
                    <Code language="json" className="mt-1">
                      {`{
  "data": [
    {
      "date": "2023-03-01",
      "users": 1200,
      "revenue": 24000.00,
      "activeSolutions": 11
    },
    {
      "date": "2023-03-02",
      "users": 1210,
      "revenue": 24200.00,
      "activeSolutions": 11
    },
    // ... mais dados diários
  ],
  "summary": {
    "totalUsers": 1250,
    "totalRevenue": 25000.00,
    "averageDailyUsers": 1225,
    "averageDailyRevenue": 24500.00,
    "userGrowth": 3.7,
    "revenueGrowth": 5.2
  }
}`}
                    </Code>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-base font-medium">POST /api/admin/migrations/execute</h4>
                <p className="text-sm text-muted-foreground mt-1">Executa uma migração de banco de dados.</p>
                <div className="mt-2 space-y-2">
                  <div>
                    <h5 className="text-sm font-medium">Corpo da Requisição</h5>
                    <Code language="json" className="mt-1">
                      {`{
  "migrationFile": "008_create_user_profiles_view.sql"
}`}
                    </Code>
                  </div>

                  <div>
                    <h5 className="text-sm font-medium">Resposta</h5>
                    <Code language="json" className="mt-1">
                      {`{
  "success": true,
  "message": "Migração executada com sucesso",
  "details": {
    "file": "008_create_user_profiles_view.sql",
    "executedAt": "2023-03-20T15:30:45Z",
    "duration": 235
  }
}`}
                    </Code>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-base font-medium">GET /api/admin/migrations</h4>
                <p className="text-sm text-muted-foreground mt-1">Lista todas as migrações disponíveis e seu status.</p>
                <div className="mt-2 space-y-2">
                  <div>
                    <h5 className="text-sm font-medium">Resposta</h5>
                    <Code language="json" className="mt-1">
                      {`{
  "migrations": [
    {
      "id": 1,
      "file": "000_create_execute_sql_function.sql",
      "applied": true,
      "appliedAt": "2023-01-10T10:15:30Z"
    },
    {
      "id": 2,
      "file": "001_insert_solutions.sql",
      "applied": true,
      "appliedAt": "2023-01-15T11:20:45Z"
    },
    // ... mais migrações
    {
      "id": 9,
      "file": "008_create_user_profiles_view.sql",
      "applied": true,
      "appliedAt": "2023-03-20T15:30:45Z"
    },
    {
      "id": 10,
      "file": "009_add_user_preferences.sql",
      "applied": false,
      "appliedAt": null
    }
  ]
}`}
                    </Code>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

export default function ApiDocs() {
  return <ApiDocumentation />
}
