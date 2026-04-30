create table if not exists public.marketplace_items (
  id text primary key,
  name text not null,
  description text not null,
  type text not null default 'service',
  categories text[] not null default '{}',
  status text not null default 'active',
  requires_login boolean not null default false,
  created_at timestamptz default now(),
  views integer not null default 0,
  clicks integer not null default 0,
  activations integer not null default 0,
  last_access timestamptz,
  full_description text,
  category text,
  related_area text,
  min_plan text default 'free',
  client_action text default 'Ver mais',
  show_institutional boolean not null default true,
  show_dashboard boolean not null default true,
  display_status text not null default 'available',
  updated_at timestamptz default now()
);

drop trigger if exists marketplace_items_touch_updated_at on public.marketplace_items;
create trigger marketplace_items_touch_updated_at before update on public.marketplace_items
for each row execute function public.touch_updated_at();

alter table public.marketplace_items enable row level security;

do $$
begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'marketplace_items'
      and policyname = 'Public can read visible marketplace items'
  ) then
    create policy "Public can read visible marketplace items" on public.marketplace_items
      for select using (status <> 'hidden' and (show_institutional = true or show_dashboard = true));
  end if;
end $$;

grant select on public.marketplace_items to anon, authenticated;
grant all on public.marketplace_items to service_role;

insert into public.marketplace_items (
  id,
  name,
  description,
  type,
  categories,
  status,
  requires_login,
  full_description,
  category,
  related_area,
  min_plan,
  client_action,
  show_institutional,
  show_dashboard,
  display_status,
  views,
  clicks,
  activations,
  last_access
)
values
  ('1', 'Instancia Evolution API', 'Conecte seu numero de WhatsApp via API profissional.', 'tool', array['integration','external'], 'active', false, 'A Evolution API permite que voce conecte seu numero de WhatsApp a sistemas externos de forma profissional e escalavel. Ideal para empresas que precisam de uma solucao robusta de comunicacao.', 'integration', 'atendimento', 'pro', 'Solicitar', true, true, 'external', 245, 87, 32, now()),
  ('2', 'Whaticket (Sistema de Suporte Multiatendimento)', 'Atenda WhatsApp, Instagram e Facebook em um so lugar.', 'tool', array['integration','external'], 'active', false, 'O Whaticket e uma plataforma completa para atendimento multicanal, permitindo que sua equipe gerencie conversas de WhatsApp, Instagram e Facebook em uma unica interface.', 'integration', 'atendimento', 'pro', 'Contratar', true, true, 'external', 312, 145, 56, now()),
  ('3', 'Agenda Pro (Sistema de Agendamento)', 'Plataforma completa para gerenciamento de horarios.', 'tool', array['integration','external'], 'active', false, 'O Agenda Pro e uma solucao completa para gerenciamento de agendamentos, ideal para clinicas, saloes e profissionais que trabalham com horarios marcados.', 'integration', 'agendamento', 'pro', 'Solicitar acesso', true, true, 'external', 198, 76, 28, now()),
  ('4', 'Template Premium - Fluxo de Pascoa com IA', 'Campanha de Pascoa automatizada com IA para fidelizar clientes.', 'template', array['template','premium'], 'active', true, 'Template pronto para campanhas de Pascoa, com mensagens personalizadas por IA e fluxos de interacao para aumentar o engajamento dos clientes durante o periodo festivo.', 'template', 'marketing', 'pro', 'Acesse a plataforma', true, true, 'premium', 156, 67, 23, now()),
  ('5', 'Servico: Criamos o fluxo ideal pra voce', 'Nos diga sua necessidade e entregamos sua automacao pronta.', 'service', array['service','external'], 'active', false, 'Nossa equipe de especialistas analisa sua necessidade e desenvolve um fluxo de automacao personalizado para seu negocio, garantindo eficiencia e resultados.', 'service', 'all-areas', 'free', 'Solicitar proposta', true, true, 'external', 178, 89, 12, now()),
  ('6', 'Upgrade para Plano Avancado', 'Desbloqueie solucoes exclusivas, mais execucoes e IA avancada.', 'plan', array['plan','premium'], 'active', true, 'Aumente o potencial da sua conta com recursos avancados, maior capacidade de processamento e acesso a funcionalidades exclusivas de inteligencia artificial.', 'plan', 'all-areas', 'free', 'Ver planos', true, true, 'premium', 267, 134, 45, now()),
  ('7', 'Capacidade Extra - Execucoes Ilimitadas por 30 dias', 'Ideal para periodos de pico ou campanhas intensas.', 'capacity', array['capacity','premium'], 'coming-soon', true, 'Adicione capacidade ilimitada de execucoes por 30 dias, perfeito para periodos de alta demanda, campanhas sazonais ou lancamentos que exigem maior volume de interacoes.', 'capacity', 'all-areas', 'free', 'Ativar', true, true, 'coming-soon', 143, 56, 0, null),
  ('8', 'Integracao com Typebot Pro', 'Use seus bots do Typebot direto na nossa plataforma.', 'integration', array['integration','coming-soon'], 'coming-soon', true, 'Conecte seus fluxos criados no Typebot diretamente a nossa plataforma, aproveitando o melhor dos dois mundos para criar experiencias interativas poderosas.', 'integration', 'atendimento', 'pro', 'Conectar', true, true, 'coming-soon', 112, 34, 0, null),
  ('9', 'Modelo de Funil de Vendas com IA', 'Geracao de leads com conteudo automatizado.', 'template', array['template','recommended'], 'active', true, 'Template completo de funil de vendas com geracao de conteudo por IA, segmentacao automatica de leads e sequencias de follow-up personalizadas.', 'template', 'vendas', 'pro', 'Acesse a plataforma', true, true, 'included', 187, 78, 31, now()),
  ('10', 'Servico: Consultoria Express para montar seu fluxo ideal', 'Agende uma reuniao e saia com seu sistema funcionando.', 'service', array['service','external'], 'active', false, 'Consultoria rapida e pratica onde nossos especialistas ajudam a configurar seu fluxo de automacao em tempo real, garantindo que voce saia da reuniao com seu sistema funcionando.', 'service', 'all-areas', 'free', 'Agendar consultoria', true, true, 'external', 132, 67, 18, now()),
  ('11', 'Template Premium - Campanha Black Friday', 'Automacao completa para Black Friday com gatilhos de urgencia.', 'template', array['template','premium','recommended'], 'active', true, 'Automacao completa para Black Friday com gatilhos de urgencia, mensagens inteligentes e foco em conversao durante campanhas sazonais.', 'template', 'marketing', 'pro', 'Acesse a plataforma', true, true, 'premium', 0, 0, 0, null),
  ('12', 'Integracao com Zapier', 'Conecte a plataforma com mais de 3000 aplicativos.', 'integration', array['integration','recommended'], 'active', true, 'Conecte a plataforma com mais de 3000 aplicativos por meio do Zapier, expandindo os fluxos operacionais com automacoes adicionais.', 'integration', 'all-areas', 'pro', 'Ativar', true, true, 'included', 0, 0, 0, null),
  ('13', 'Template Premium - Campanha de Natal', 'Automacao para vendas de fim de ano com IA.', 'template', array['template','premium'], 'active', true, 'Automacao voltada para campanhas de fim de ano, com mensagens inteligentes e gatilhos para conversao em periodos festivos.', 'template', 'marketing', 'pro', 'Acesse a plataforma', true, true, 'premium', 0, 0, 0, null),
  ('14', 'Integracao com Hotmart', 'Conecte sua conta Hotmart para automacao de infoprodutos.', 'integration', array['integration','external'], 'active', false, 'Conecte sua conta Hotmart para automatizar jornadas ligadas a infoprodutos, acesso e relacionamento com compradores.', 'integration', 'vendas', 'free', 'Solicitar proposta', true, true, 'external', 0, 0, 0, null),
  ('15', 'Template - Reengajamento de Clientes Inativos', 'Recupere clientes que nao compram ha mais de 60 dias.', 'template', array['template','recommended'], 'active', true, 'Template voltado para reengajamento de clientes inativos com mensagens, triggers e conteudos inteligentes para recuperar oportunidades.', 'template', 'marketing', 'pro', 'Ativar', true, true, 'included', 0, 0, 0, null),
  ('16', 'Integracao com RD Station', 'Sincronize leads e automacoes com o RD Station.', 'integration', array['integration','coming-soon'], 'coming-soon', true, 'Sincronize leads e automacoes com o RD Station para alinhar operacao comercial, marketing e relacionamento na plataforma.', 'integration', 'marketing', 'pro', 'Conectar', true, true, 'coming-soon', 0, 0, 0, null)
on conflict (id) do update
set
  name = excluded.name,
  description = excluded.description,
  type = excluded.type,
  categories = excluded.categories,
  status = excluded.status,
  requires_login = excluded.requires_login,
  full_description = excluded.full_description,
  category = excluded.category,
  related_area = excluded.related_area,
  min_plan = excluded.min_plan,
  client_action = excluded.client_action,
  show_institutional = excluded.show_institutional,
  show_dashboard = excluded.show_dashboard,
  display_status = excluded.display_status,
  updated_at = now(),
  views = public.marketplace_items.views,
  clicks = public.marketplace_items.clicks,
  activations = public.marketplace_items.activations,
  last_access = coalesce(public.marketplace_items.last_access, excluded.last_access);
