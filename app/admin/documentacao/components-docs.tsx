"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Code } from "@/components/ui/code"

export function ComponentsDocumentation() {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Componentes do Sistema</CardTitle>
        <CardDescription>Documentação dos principais componentes reutilizáveis da aplicação</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid grid-cols-4 w-full">
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="ui-components">Componentes UI</TabsTrigger>
            <TabsTrigger value="form-components">Componentes de Formulário</TabsTrigger>
            <TabsTrigger value="data-components">Componentes de Dados</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4 mt-4">
            <div>
              <h3 className="text-lg font-medium">Arquitetura de Componentes</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                A aplicação SaaS Soluções utiliza uma arquitetura de componentes modular e reutilizável, baseada em
                React e TypeScript. Os componentes são organizados em categorias funcionais e seguem padrões
                consistentes de design e implementação.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-medium">Categorias de Componentes</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                <Card>
                  <CardHeader className="py-3">
                    <CardTitle className="text-base">Componentes UI</CardTitle>
                  </CardHeader>
                  <CardContent className="py-2">
                    <p className="text-sm text-muted-foreground">
                      Elementos básicos de interface como botões, cards, inputs e modais. Baseados na biblioteca
                      shadcn/ui com personalizações específicas para o projeto.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="py-3">
                    <CardTitle className="text-base">Componentes de Formulário</CardTitle>
                  </CardHeader>
                  <CardContent className="py-2">
                    <p className="text-sm text-muted-foreground">
                      Formulários completos e validados para operações específicas como login, cadastro, edição de
                      perfil e configurações.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="py-3">
                    <CardTitle className="text-base">Componentes de Dados</CardTitle>
                  </CardHeader>
                  <CardContent className="py-2">
                    <p className="text-sm text-muted-foreground">
                      Componentes para exibição e manipulação de dados, como tabelas, listas, gráficos e visualizações.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="py-3">
                    <CardTitle className="text-base">Componentes de Layout</CardTitle>
                  </CardHeader>
                  <CardContent className="py-2">
                    <p className="text-sm text-muted-foreground">
                      Estruturas de página como headers, sidebars, footers e containers que definem a organização visual
                      da aplicação.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium">Princípios de Design</h3>
              <ul className="mt-2 text-sm space-y-2 list-disc pl-5">
                <li>
                  <strong>Componentização</strong>: Componentes pequenos e focados que podem ser combinados para criar
                  interfaces complexas
                </li>
                <li>
                  <strong>Reutilização</strong>: Componentes projetados para serem reutilizados em diferentes contextos
                </li>
                <li>
                  <strong>Tipagem Forte</strong>: Uso consistente de TypeScript para definir props e estados
                </li>
                <li>
                  <strong>Acessibilidade</strong>: Conformidade com padrões WCAG e suporte a tecnologias assistivas
                </li>
                <li>
                  <strong>Responsividade</strong>: Adaptação a diferentes tamanhos de tela e dispositivos
                </li>
              </ul>
            </div>
          </TabsContent>

          <TabsContent value="ui-components" className="space-y-4 mt-4">
            <div>
              <h3 className="text-lg font-medium">Componentes UI</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Os componentes UI formam a base visual da aplicação e são utilizados para construir interfaces
                consistentes e acessíveis.
              </p>
            </div>

            <div className="space-y-6">
              <div>
                <h4 className="text-base font-medium">Button</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Componente de botão com suporte a diferentes variantes, tamanhos e estados.
                </p>
                <Code language="tsx" className="mt-2">
                  {`import { Button } from "@/components/ui/button"

// Exemplo de uso
<Button variant="default">Botão Padrão</Button>
<Button variant="destructive">Excluir</Button>
<Button variant="outline">Cancelar</Button>
<Button variant="ghost">Opções</Button>
<Button variant="link">Saiba mais</Button>

// Com ícone
<Button>
  <PlusIcon className="mr-2 h-4 w-4" />
  Adicionar
</Button>

// Estados
<Button disabled>Desabilitado</Button>
<Button isLoading>Carregando...</Button>`}
                </Code>
              </div>

              <div>
                <h4 className="text-base font-medium">Card</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Componente de card para agrupar conteúdo relacionado.
                </p>
                <Code language="tsx" className="mt-2">
                  {`import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card"

// Exemplo de uso
<Card>
  <CardHeader>
    <CardTitle>Título do Card</CardTitle>
    <CardDescription>Descrição ou subtítulo do card</CardDescription>
  </CardHeader>
  <CardContent>
    <p>Conteúdo principal do card.</p>
  </CardContent>
  <CardFooter>
    <Button>Ação Principal</Button>
  </CardFooter>
</Card>`}
                </Code>
              </div>

              <div>
                <h4 className="text-base font-medium">Dialog</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Componente de diálogo modal para exibir conteúdo sobreposto à interface principal.
                </p>
                <Code language="tsx" className="mt-2">
                  {`import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog"

// Exemplo de uso
<Dialog>
  <DialogTrigger asChild>
    <Button>Abrir Modal</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Título do Modal</DialogTitle>
      <DialogDescription>
        Descrição ou instruções para o usuário.
      </DialogDescription>
    </DialogHeader>
    <div className="py-4">
      {/* Conteúdo principal do modal */}
      <p>Conteúdo do modal aqui.</p>
    </div>
    <DialogFooter>
      <Button variant="outline" onClick={onClose}>Cancelar</Button>
      <Button onClick={onConfirm}>Confirmar</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>`}
                </Code>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="form-components" className="space-y-4 mt-4">
            <div>
              <h3 className="text-lg font-medium">Componentes de Formulário</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Componentes especializados para criação e gerenciamento de formulários, com suporte a validação e
                feedback de erro.
              </p>
            </div>

            <div className="space-y-6">
              <div>
                <h4 className="text-base font-medium">ProfileForm</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Formulário completo para edição de perfil de usuário.
                </p>
                <Code language="tsx" className="mt-2">
                  {`import { ProfileForm } from "@/components/profile-form"

// Exemplo de uso
<ProfileForm 
  profile={userProfile}
  userId={user.id}
  onUpdateProfile={handleProfileUpdate}
  isAdmin={false}
/>`}
                </Code>
                <p className="text-sm text-muted-foreground mt-2">
                  O componente <code>ProfileForm</code> gerencia todo o estado do formulário, validação e submissão dos
                  dados. Ele suporta os seguintes props:
                </p>
                <ul className="mt-2 text-sm space-y-1 list-disc pl-5">
                  <li>
                    <code>profile</code>: Dados atuais do perfil do usuário
                  </li>
                  <li>
                    <code>userId</code>: ID do usuário cujo perfil está sendo editado
                  </li>
                  <li>
                    <code>onUpdateProfile</code>: Função chamada quando o perfil é atualizado
                  </li>
                  <li>
                    <code>isAdmin</code>: Indica se o formulário está sendo usado em contexto administrativo
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="text-base font-medium">LoginForm</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Formulário de login com validação e tratamento de erros.
                </p>
                <Code language="tsx" className="mt-2">
                  {`import { LoginForm } from "@/components/login-form"

// Exemplo de uso
<LoginForm 
  onSuccess={handleLoginSuccess}
  redirectTo="/dashboard"
/>`}
                </Code>
                <p className="text-sm text-muted-foreground mt-2">
                  O componente <code>LoginForm</code> gerencia todo o processo de autenticação, incluindo:
                </p>
                <ul className="mt-2 text-sm space-y-1 list-disc pl-5">
                  <li>Validação de campos (email e senha)</li>
                  <li>Submissão do formulário para a API de autenticação</li>
                  <li>Tratamento de erros de autenticação</li>
                  <li>Feedback visual durante o processo de login</li>
                  <li>Redirecionamento após login bem-sucedido</li>
                </ul>
              </div>

              <div>
                <h4 className="text-base font-medium">SignupForm</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Formulário de registro com validação e seleção de plano.
                </p>
                <Code language="tsx" className="mt-2">
                  {`import { SignupForm } from "@/components/signup-form"

// Exemplo de uso
<SignupForm 
  initialPlan="basic"
  onSuccess={handleSignupSuccess}
/>`}
                </Code>
                <p className="text-sm text-muted-foreground mt-2">
                  O componente <code>SignupForm</code> gerencia todo o processo de registro, incluindo:
                </p>
                <ul className="mt-2 text-sm space-y-1 list-disc pl-5">
                  <li>Validação de campos (nome, email, senha)</li>
                  <li>Verificação de força de senha</li>
                  <li>Seleção de plano de assinatura</li>
                  <li>Aceitação de termos e condições</li>
                  <li>Submissão do formulário para a API de registro</li>
                  <li>Redirecionamento para verificação de email</li>
                </ul>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="data-components" className="space-y-4 mt-4">
            <div>
              <h3 className="text-lg font-medium">Componentes de Dados</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Componentes especializados para exibição e manipulação de dados, como tabelas, listas e visualizações.
              </p>
            </div>

            <div className="space-y-6">
              <div>
                <h4 className="text-base font-medium">AdminUsersList</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Componente para listar e gerenciar usuários no painel administrativo.
                </p>
                <Code language="tsx" className="mt-2">
                  {`import { AdminUsersList } from "@/components/admin/admin-users-list"

// Exemplo de uso
<AdminUsersList 
  initialPage={1}
  pageSize={10}
  onUserUpdate={handleUserUpdate}
/>`}
                </Code>
                <p className="text-sm text-muted-foreground mt-2">
                  O componente <code>AdminUsersList</code> oferece funcionalidades como:
                </p>
                <ul className="mt-2 text-sm space-y-1 list-disc pl-5">
                  <li>Listagem paginada de usuários</li>
                  <li>Filtragem por nome, email ou tipo</li>
                  <li>Ordenação por diferentes colunas</li>
                  <li>Ações rápidas (visualizar, editar, desativar)</li>
                  <li>Modal de confirmação para ações destrutivas</li>
                </ul>
              </div>

              <div>
                <h4 className="text-base font-medium">MetricaCard</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Componente para exibir métricas e estatísticas em formato de card.
                </p>
                <Code language="tsx" className="mt-2">
                  {`import { MetricaCard } from "@/components/metrica-card"

// Exemplo de uso
<MetricaCard 
  title="Usuários Ativos"
  value={1234}
  change={5.7}
  changeType="increase"
  description="Usuários ativos nos últimos 30 dias"
  icon={<UsersIcon className="h-4 w-4" />}
/>`}
                </Code>
                <p className="text-sm text-muted-foreground mt-2">
                  O componente <code>MetricaCard</code> é ideal para dashboards e exibe:
                </p>
                <ul className="mt-2 text-sm space-y-1 list-disc pl-5">
                  <li>Título da métrica</li>
                  <li>Valor principal com formatação adequada</li>
                  <li>Variação percentual (aumento ou diminuição)</li>
                  <li>Descrição ou período da métrica</li>
                  <li>Ícone representativo</li>
                </ul>
              </div>

              <div>
                <h4 className="text-base font-medium">AdminSolutionsChart</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Gráfico interativo para visualização de dados de soluções.
                </p>
                <Code language="tsx" className="mt-2">
                  {`import { AdminSolutionsChart } from "@/components/admin/admin-solutions-chart"

// Exemplo de uso
<AdminSolutionsChart 
  data={solutionsData}
  period="monthly"
  showLegend={true}
/>`}
                </Code>
                <p className="text-sm text-muted-foreground mt-2">
                  O componente <code>AdminSolutionsChart</code> utiliza a biblioteca Recharts e oferece:
                </p>
                <ul className="mt-2 text-sm space-y-1 list-disc pl-5">
                  <li>Visualização de dados em diferentes formatos (linha, barra, área)</li>
                  <li>Suporte a diferentes períodos (diário, semanal, mensal)</li>
                  <li>Interatividade com tooltip e zoom</li>
                  <li>Personalização de cores e estilos</li>
                  <li>Responsividade para diferentes tamanhos de tela</li>
                </ul>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

export default function ComponentsDocs() {
  return <ComponentsDocumentation />
}
