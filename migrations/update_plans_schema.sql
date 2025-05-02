-- Atualizar a estrutura da tabela plans para incluir o campo code
ALTER TABLE IF EXISTS plans
ADD COLUMN IF NOT EXISTS code VARCHAR(50);

-- Atualizar os planos existentes com os códigos corretos
UPDATE plans SET code = 'gratuito' WHERE name = 'Gratuito' OR name = 'Free';
UPDATE plans SET code = 'essencial' WHERE name = 'Essencial' OR name = 'Basic';
UPDATE plans SET code = 'profissional' WHERE name = 'Profissional' OR name = 'Pro';
UPDATE plans SET code = 'completo' WHERE name = 'Completo' OR name = 'Enterprise';

-- Garantir que todos os planos tenham um código
UPDATE plans SET code = lower(replace(replace(name, ' ', '-'), '.', '')) WHERE code IS NULL;

-- Atualizar a tabela users para usar os novos códigos de plano
UPDATE users SET plan = 'gratuito' WHERE plan = 'free';
UPDATE users SET plan = 'essencial' WHERE plan = 'basic';
UPDATE users SET plan = 'profissional' WHERE plan = 'pro';
UPDATE users SET plan = 'completo' WHERE plan = 'enterprise';

-- Criar índice para melhorar a performance de consultas por código de plano
CREATE INDEX IF NOT EXISTS idx_plans_code ON plans(code);
