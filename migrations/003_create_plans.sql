-- Migração para criar e configurar os planos

-- Criar a tabela plans se não existir
CREATE TABLE IF NOT EXISTS plans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  interval TEXT NOT NULL DEFAULT 'month',
  features JSONB NOT NULL DEFAULT '[]'::jsonb,
  is_active BOOLEAN DEFAULT true,
  is_featured BOOLEAN DEFAULT false,
  sort_order INTEGER DEFAULT 0,
  max_solutions INTEGER DEFAULT 5,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Adicionar índices para pesquisa rápida
CREATE INDEX IF NOT EXISTS idx_plans_code ON plans(code);
CREATE INDEX IF NOT EXISTS idx_plans_is_active ON plans(is_active);
CREATE INDEX IF NOT EXISTS idx_plans_is_featured ON plans(is_featured);

-- Conceder permissões para a tabela plans
GRANT ALL ON plans TO authenticated;
GRANT ALL ON plans TO service_role;

-- Inserir planos padrão
INSERT INTO plans (code, name, description, price, interval, features, is_active, is_featured, sort_order, max_solutions)
VALUES
  ('starter', 'Starter', 'Ideal para pequenos negócios que estão começando', 49.90, 'month', 
   '[
     "Até 5 soluções ativas",
     "Suporte por e-mail",
     "Acesso à API básica",
     "Relatórios mensais"
   ]'::jsonb, 
   true, false, 1, 5),
   
  ('professional', 'Professional', 'Perfeito para empresas em crescimento', 99.90, 'month', 
   '[
     "Até 15 soluções ativas",
     "Suporte prioritário",
     "Acesso à API completa",
     "Relatórios semanais",
     "Integrações avançadas",
     "Personalização de soluções"
   ]'::jsonb, 
   true, true, 2, 15),
   
  ('enterprise', 'Enterprise', 'Solução completa para grandes empresas', 199.90, 'month', 
   '[
     "Soluções ilimitadas",
     "Suporte 24/7",
     "API dedicada",
     "Relatórios em tempo real",
     "Todas as integrações",
     "Personalização completa",
     "Gerente de conta dedicado",
     "Treinamento da equipe"
   ]'::jsonb, 
   true, false, 3, 999)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  interval = EXCLUDED.interval,
  features = EXCLUDED.features,
  is_active = EXCLUDED.is_active,
  is_featured = EXCLUDED.is_featured,
  sort_order = EXCLUDED.sort_order,
  max_solutions = EXCLUDED.max_solutions,
  updated_at = NOW();

-- Criar trigger para atualizar o campo updated_at
CREATE OR REPLACE FUNCTION public.update_plans_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Criar ou substituir o trigger
DROP TRIGGER IF EXISTS update_plans_updated_at_trigger ON public.plans;
CREATE TRIGGER update_plans_updated_at_trigger
BEFORE UPDATE ON public.plans
FOR EACH ROW
EXECUTE FUNCTION public.update_plans_updated_at();
