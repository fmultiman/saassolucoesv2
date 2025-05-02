-- Migração para criar a tabela de associação entre planos e soluções

-- Criar a tabela plan_solutions se não existir
CREATE TABLE IF NOT EXISTS plan_solutions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  plan_id UUID NOT NULL REFERENCES plans(id) ON DELETE CASCADE,
  solution_id UUID NOT NULL REFERENCES solutions(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(plan_id, solution_id)
);

-- Adicionar índices para pesquisa rápida
CREATE INDEX IF NOT EXISTS idx_plan_solutions_plan_id ON plan_solutions(plan_id);
CREATE INDEX IF NOT EXISTS idx_plan_solutions_solution_id ON plan_solutions(solution_id);

-- Conceder permissões para a tabela plan_solutions
GRANT ALL ON plan_solutions TO authenticated;
GRANT ALL ON plan_solutions TO service_role;

-- Associar soluções premium aos planos correspondentes
DO $$
DECLARE
  professional_id UUID;
  enterprise_id UUID;
  solution_id UUID;
BEGIN
  -- Obter IDs dos planos
  SELECT id INTO professional_id FROM plans WHERE code = 'professional';
  SELECT id INTO enterprise_id FROM plans WHERE code = 'enterprise';
  
  -- Associar soluções Premium ao plano Professional
  FOR solution_id IN 
    SELECT id FROM solutions WHERE premium_plan = 'Premium'
  LOOP
    INSERT INTO plan_solutions (plan_id, solution_id)
    VALUES (professional_id, solution_id)
    ON CONFLICT (plan_id, solution_id) DO NOTHING;
  END LOOP;
  
  -- Associar todas as soluções Premium e Enterprise ao plano Enterprise
  FOR solution_id IN 
    SELECT id FROM solutions WHERE premium_plan IN ('Premium', 'Enterprise')
  LOOP
    INSERT INTO plan_solutions (plan_id, solution_id)
    VALUES (enterprise_id, solution_id)
    ON CONFLICT (plan_id, solution_id) DO NOTHING;
  END LOOP;
END;
$$;
