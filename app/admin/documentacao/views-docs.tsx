"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function ViewsDocumentation() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Views no Sistema SaaS Soluções</CardTitle>
          <CardDescription>Documentação sobre o uso de views na arquitetura do banco de dados</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <section>
            <h3 className="text-lg font-semibold mb-2">Visão Geral das Views</h3>
            <p>
              Views são consultas SQL armazenadas que funcionam como tabelas virtuais, permitindo simplificar consultas
              complexas e fornecer uma camada de abstração sobre os dados. No SaaS Soluções, utilizamos views para
              facilitar o acesso a dados relacionados e melhorar a performance de consultas frequentes.
            </p>
          </section>

          <section>
            <h3 className="text-lg font-semibold mb-2">Views Disponíveis</h3>

            <div className="space-y-4">
              <div>
                <h4 className="font-medium">user_profiles_view</h4>
                <p className="text-sm text-muted-foreground">
                  Combina dados de usuários (auth.users) com seus perfis (public.profiles).
                </p>
                <div className="mt-2 bg-muted p-3 rounded-md">
                  <p className="text-xs font-mono">Definição:</p>
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
                  <p className="text-sm font-medium">Casos de uso:</p>
                  <ul className="list-disc pl-6 text-sm">
                    <li>Exibição de informações completas do usuário em um único lugar</li>
                    <li>Simplificação de consultas que precisam de dados de ambas as tabelas</li>
                    <li>Relatórios administrativos sobre usuários</li>
                  </ul>
                </div>
                <div className="mt-2">
                  <p className="text-sm font-medium">Exemplos de consulta:</p>
                  <pre className="text-xs bg-muted p-2 rounded-md">
                    {`// Buscar todos os usuários com seus perfis
const { data, error } = await supabase
  .from('user_profiles_view')
  .select('*');

// Buscar usuários de uma empresa específica
const { data, error } = await supabase
  .from('user_profiles_view')
  .select('*')
  .eq('empresa', 'Empresa XYZ');

// Buscar usuário por ID com perfil completo
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

          <section>
            <h3 className="text-lg font-semibold mb-2">Benefícios das Views</h3>
            <ul className="list-disc pl-6 text-sm">
              <li>
                <strong>Simplificação de consultas</strong>: Reduz a complexidade de JOINs repetitivos
              </li>
              <li>
                <strong>Abstração de dados</strong>: Esconde a complexidade da estrutura do banco de dados
              </li>
              <li>
                <strong>Segurança</strong>: Pode ser usada para limitar o acesso a colunas específicas
              </li>
              <li>
                <strong>Consistência</strong>: Garante que a mesma lógica seja aplicada em todas as consultas
              </li>
              <li>
                <strong>Performance</strong>: Pode melhorar o desempenho de consultas complexas frequentes
              </li>
            </ul>
          </section>

          <section>
            <h3 className="text-lg font-semibold mb-2">Melhores Práticas</h3>
            <ul className="list-disc pl-6 text-sm">
              <li>
                <strong>Nomenclatura clara</strong>: Use o sufixo "_view" para identificar facilmente as views
              </li>
              <li>
                <strong>Documentação</strong>: Mantenha a documentação atualizada sobre o propósito de cada view
              </li>
              <li>
                <strong>Índices</strong>: Certifique-se de que as tabelas base tenham índices apropriados
              </li>
              <li>
                <strong>Atualizações</strong>: Atualize as views quando a estrutura das tabelas base mudar
              </li>
            </ul>
          </section>

          <section>
            <h3 className="text-lg font-semibold mb-2">Criação de Novas Views</h3>
            <p className="text-sm mb-2">Para criar uma nova view no sistema, siga estes passos:</p>
            <ol className="list-decimal pl-6 text-sm">
              <li>Crie um arquivo de migração numerado sequencialmente (ex: 009_create_new_view.sql)</li>
              <li>Defina a view usando a sintaxe CREATE OR REPLACE VIEW</li>
              <li>Execute a migração através do painel administrativo</li>
              <li>Atualize a documentação para incluir a nova view</li>
            </ol>
            <div className="mt-2 bg-muted p-3 rounded-md">
              <p className="text-xs font-mono">Exemplo de migração para criar uma view:</p>
              <pre className="text-xs overflow-x-auto">
                {`-- Arquivo: migrations/009_create_active_subscriptions_view.sql
CREATE OR REPLACE VIEW public.active_subscriptions_view AS
SELECT 
  s.id,
  s.user_id,
  s.plan_id,
  p.name as plan_name,
  p.price,
  s.start_date,
  s.end_date,
  u.email as user_email,
  pr.nome_completo as user_name
FROM public.subscriptions s
JOIN public.plans p ON s.plan_id = p.id
JOIN auth.users u ON s.user_id = u.id
LEFT JOIN public.profiles pr ON u.id = pr.id
WHERE s.status = 'active' AND s.end_date >= CURRENT_DATE;`}
              </pre>
            </div>
          </section>
        </CardContent>
      </Card>
    </div>
  )
}

export default function ViewsDocs() {
  return <ViewsDocumentation />
}
