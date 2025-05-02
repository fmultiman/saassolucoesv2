-- Primeiro, vamos garantir que a tabela solutions existe
CREATE TABLE IF NOT EXISTS solutions (
  id SERIAL PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT,
  icon TEXT,
  color TEXT,
  is_active BOOLEAN DEFAULT false,
  is_recommended BOOLEAN DEFAULT false,
  is_premium BOOLEAN DEFAULT false,
  premium_plan TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Agora, vamos inserir as soluções
INSERT INTO solutions (slug, name, description, category, icon, color, is_active, is_recommended, is_premium, premium_plan)
VALUES
  ('autoatendimento-ia', 'Autoatendimento com IA', 'Cliente interage com um fluxo que entende a intenção e responde sozinho.', 'atendimento', 'Bot', 'bg-blue-500/10 text-blue-500', true, false, false, null),
  ('recuperar-cliente', 'Recuperar Cliente Inativo', 'Reativa contatos que pararam de responder com mensagem personalizada.', 'vendas', 'Users', 'bg-green-500/10 text-green-500', true, false, false, null),
  ('agendamento-rapido', 'Agendamento Rápido', 'Permite que o cliente marque um horário via mensagem automática.', 'agendamento', 'Calendar', 'bg-purple-500/10 text-purple-500', false, false, false, null),
  ('pesquisa-satisfacao', 'Pesquisa de Satisfação', 'Coleta avaliação de atendimento ou serviço com emojis ou notas.', 'feedback', 'ThumbsUp', 'bg-orange-500/10 text-orange-500', false, false, false, null),
  ('email-marketing', 'E-mail Marketing Automatizado', 'Envia campanhas automáticas como boas-vindas e promoções em datas especiais.', 'vendas', 'Mail', 'bg-red-500/10 text-red-500', false, false, true, 'Premium'),
  ('funil-vendas', 'Funil de Vendas Automatizado', 'Alimenta o cliente com conteúdo até a compra com mensagens automáticas.', 'vendas', 'PieChart', 'bg-cyan-500/10 text-cyan-500', false, false, true, 'Enterprise'),
  ('bot-comentarios', 'Bot para Interações em Comentários', 'Responde automaticamente comentários no Instagram/Facebook com base em palavras-chave.', 'atendimento', 'Zap', 'bg-yellow-500/10 text-yellow-500', true, true, false, null),
  ('confirmacao-consulta', 'Confirmação de Consulta', 'Lembra o cliente da consulta com botão para confirmar ou reagendar.', 'agendamento', 'Clock', 'bg-indigo-500/10 text-indigo-500', true, true, false, null),
  ('resposta-automatica', 'Resposta Automática Inteligente', 'Responde perguntas frequentes com base em um banco de conhecimento personalizado.', 'atendimento', 'MessageSquare', 'bg-blue-500/10 text-blue-500', false, false, false, null),
  ('qualificacao-leads', 'Qualificação de Leads', 'Identifica e classifica potenciais clientes com base em critérios personalizados.', 'vendas', 'Filter', 'bg-green-500/10 text-green-500', false, false, false, null)
ON CONFLICT (slug) 
DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  category = EXCLUDED.category,
  icon = EXCLUDED.icon,
  color = EXCLUDED.color,
  is_active = EXCLUDED.is_active,
  is_recommended = EXCLUDED.is_recommended,
  is_premium = EXCLUDED.is_premium,
  premium_plan = EXCLUDED.premium_plan,
  updated_at = NOW();

-- Inserindo mais soluções
INSERT INTO solutions (slug, name, description, category, icon, color, is_active, is_recommended, is_premium, premium_plan)
VALUES
  ('lembretes-aniversario', 'Lembretes de Aniversário', 'Envia mensagens automáticas de felicitações em datas especiais dos clientes.', 'relacionamento', 'Gift', 'bg-pink-500/10 text-pink-500', false, false, false, null),
  ('notificacoes-estoque', 'Notificações de Estoque', 'Avisa clientes quando produtos desejados voltam ao estoque.', 'vendas', 'Package', 'bg-amber-500/10 text-amber-500', false, false, true, 'Premium'),
  ('campanhas-sazonais', 'Campanhas Sazonais', 'Cria e gerencia campanhas automáticas para datas comemorativas.', 'marketing', 'Calendar', 'bg-red-500/10 text-red-500', false, false, true, 'Premium'),
  ('reengajamento-clientes', 'Reengajamento de Clientes', 'Recupera clientes inativos com ofertas personalizadas baseadas em histórico.', 'relacionamento', 'RefreshCw', 'bg-violet-500/10 text-violet-500', false, false, false, null),
  ('analise-sentimento', 'Análise de Sentimento', 'Monitora e analisa o sentimento das interações com clientes.', 'feedback', 'BarChart2', 'bg-orange-500/10 text-orange-500', false, false, true, 'Enterprise'),
  ('segmentacao-clientes', 'Segmentação de Clientes', 'Agrupa clientes com base em comportamento, histórico e preferências.', 'marketing', 'Users', 'bg-emerald-500/10 text-emerald-500', false, false, true, 'Premium'),
  ('chatbot-whatsapp', 'Chatbot para WhatsApp', 'Automatiza conversas no WhatsApp com respostas inteligentes.', 'atendimento', 'MessageCircle', 'bg-green-500/10 text-green-500', false, false, false, null),
    'atendimento', 'MessageCircle', 'bg-green-500/10 text-green-500', false, false, false, null),
  ('pesquisa-nps', 'Pesquisa NPS', 'Coleta e analisa o Net Promoter Score dos seus clientes.', 'feedback', 'Star', 'bg-yellow-500/10 text-yellow-500', false, false, false, null),
  ('cupons-personalizados', 'Cupons Personalizados', 'Gera e envia cupons de desconto baseados no perfil do cliente.', 'vendas', 'Tag', 'bg-blue-500/10 text-blue-500', false, false, true, 'Premium'),
  ('onboarding-clientes', 'Onboarding de Clientes', 'Guia novos clientes com mensagens sequenciais educativas.', 'relacionamento', 'UserPlus', 'bg-indigo-500/10 text-indigo-500', false, false, false, null),
  ('notificacoes-eventos', 'Notificações de Eventos', 'Envia lembretes automáticos sobre eventos, webinars e lançamentos.', 'marketing', 'Bell', 'bg-purple-500/10 text-purple-500', false, false, false, null)
ON CONFLICT (slug) 
DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  category = EXCLUDED.category,
  icon = EXCLUDED.icon,
  color = EXCLUDED.color,
  is_active = EXCLUDED.is_active,
  is_recommended = EXCLUDED.is_recommended,
  is_premium = EXCLUDED.is_premium,
  premium_plan = EXCLUDED.premium_plan,
  updated_at = NOW();

-- Inserindo o restante das soluções
INSERT INTO solutions (slug, name, description, category, icon, color, is_active, is_recommended, is_premium, premium_plan)
VALUES
  ('recuperacao-carrinho', 'Recuperação de Carrinho', 'Resgata vendas perdidas com lembretes de carrinho abandonado.', 'vendas', 'ShoppingCart', 'bg-red-500/10 text-red-500', false, false, true, 'Premium'),
  ('cross-selling', 'Cross-Selling Automático', 'Sugere produtos complementares com base nas compras anteriores.', 'vendas', 'GitBranch', 'bg-cyan-500/10 text-cyan-500', false, false, true, 'Enterprise'),
  ('up-selling', 'Up-Selling Inteligente', 'Oferece versões premium de produtos com base no interesse do cliente.', 'vendas', 'TrendingUp', 'bg-emerald-500/10 text-emerald-500', false, false, true, 'Enterprise'),
  ('fidelizacao-clientes', 'Programa de Fidelização', 'Gerencia pontos, recompensas e níveis de fidelidade automaticamente.', 'relacionamento', 'Award', 'bg-amber-500/10 text-amber-500', false, false, true, 'Premium'),
  ('recomendacao-produtos', 'Recomendação de Produtos', 'Sugere produtos personalizados com base no histórico e preferências.', 'vendas', 'Gift', 'bg-pink-500/10 text-pink-500', false, false, true, 'Premium'),
  ('monitoramento-redes', 'Monitoramento de Redes Sociais', 'Acompanha e responde menções da sua marca nas redes sociais.', 'redes-sociais', 'Activity', 'bg-blue-500/10 text-blue-500', false, false, true, 'Enterprise'),
  ('publicacao-automatica', 'Publicação Automática', 'Programa e publica conteúdo nas redes sociais automaticamente.', 'redes-sociais', 'Clock', 'bg-indigo-500/10 text-indigo-500', false, false, true, 'Premium'),
  ('gerenciamento-comentarios', 'Gerenciamento de Comentários', 'Monitora e responde comentários nas redes sociais automaticamente.', 'redes-sociais', 'MessageCircle', 'bg-purple-500/10 text-purple-500', false, false, true, 'Premium'),
  ('analise-concorrentes', 'Análise de Concorrentes', 'Monitora e compara sua presença digital com a dos concorrentes.', 'marketing', 'TrendingUp', 'bg-red-500/10 text-red-500', false, false, true, 'Enterprise'),
  ('geracao-leads', 'Geração de Leads', 'Captura e qualifica leads através de formulários e chatbots.', 'vendas', 'UserPlus', 'bg-green-500/10 text-green-500', false, false, false, null),
  ('automacao-email', 'Automação de E-mail', 'Cria fluxos de e-mails automáticos baseados em gatilhos.', 'marketing', 'Mail', 'bg-amber-500/10 text-amber-500', false, false, true, 'Premium'),
  ('pesquisa-mercado', 'Pesquisa de Mercado', 'Coleta e analisa dados de mercado para insights estratégicos.', 'marketing', 'Search', 'bg-violet-500/10 text-violet-500', false, false, true, 'Enterprise'),
  ('gestao-projetos', 'Gestão de Projetos', 'Automatiza tarefas e fluxos de trabalho em projetos.', 'administracao', 'Clipboard', 'bg-slate-500/10 text-slate-500', false, false, true, 'Premium'),
  ('automacao-financeira', 'Automação Financeira', 'Automatiza cobranças, faturas e lembretes de pagamento.', 'administracao', 'DollarSign', 'bg-emerald-500/10 text-emerald-500', false, false, true, 'Enterprise'),
  ('gestao-estoque', 'Gestão de Estoque', 'Monitora e alerta sobre níveis de estoque automaticamente.', 'administracao', 'Package', 'bg-orange-500/10 text-orange-500', false, false, true, 'Premium'),
  ('analise-vendas', 'Análise de Vendas', 'Gera relatórios e insights automáticos sobre desempenho de vendas.', 'vendas', 'BarChart', 'bg-blue-500/10 text-blue-500', false, false, true, 'Premium'),
  ('automacao-rh', 'Automação de RH', 'Automatiza processos de recrutamento, onboarding e gestão de equipe.', 'administracao', 'Users', 'bg-pink-500/10 text-pink-500', false, false, true, 'Enterprise'),
  ('gestao-leads', 'Gestão de Leads', 'Organiza e prioriza leads com base em critérios personalizados.', 'vendas', 'List', 'bg-indigo-500/10 text-indigo-500', false, false, false, null),
  ('automacao-suporte', 'Automação de Suporte', 'Classifica e encaminha tickets de suporte automaticamente.', 'atendimento', 'LifeBuoy', 'bg-cyan-500/10 text-cyan-500', false, false, false, null),
  ('chatbot-site', 'Chatbot para Site', 'Implementa um assistente virtual inteligente no seu site.', 'atendimento', 'MessageSquare', 'bg-green-500/10 text-green-500', false, false, false, null),
  ('automacao-documentos', 'Automação de Documentos', 'Gera e envia documentos personalizados automaticamente.', 'administracao', 'FileText', 'bg-amber-500/10 text-amber-500', false, false, true, 'Premium'),
  ('integracao-crm', 'Integração com CRM', 'Sincroniza dados entre plataformas de comunicação e seu CRM.', 'administracao', 'RefreshCw', 'bg-violet-500/10 text-violet-500', false, false, true, 'Enterprise'),
  ('analise-atendimento', 'Análise de Atendimento', 'Monitora e avalia a qualidade dos atendimentos automaticamente.', 'atendimento', 'PieChart', 'bg-red-500/10 text-red-500', false, false, true, 'Premium'),
  ('automacao-marketing', 'Automação de Marketing', 'Cria e gerencia campanhas de marketing multicanal.', 'marketing', 'Zap', 'bg-emerald-500/10 text-emerald-500', false, false, true, 'Premium'),
  ('gestao-reputacao', 'Gestão de Reputação', 'Monitora e gerencia avaliações online da sua empresa.', 'marketing', 'Star', 'bg-yellow-500/10 text-yellow-500', false, false, true, 'Premium')
ON CONFLICT (slug) 
DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  category = EXCLUDED.category,
  icon = EXCLUDED.icon,
  color = EXCLUDED.color,
  is_active = EXCLUDED.is_active,
  is_recommended = EXCLUDED.is_recommended,
  is_premium = EXCLUDED.is_premium,
  premium_plan = EXCLUDED.premium_plan,
  updated_at = NOW();
