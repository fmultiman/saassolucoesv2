-- Criar tabela para rastrear migrações executadas
CREATE TABLE IF NOT EXISTS public.migrations (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  executed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  executed_by UUID REFERENCES auth.users(id),
  status VARCHAR(50) NOT NULL,
  duration_ms INTEGER,
  log TEXT
);

-- Adicionar índice para melhorar a performance de consultas
CREATE INDEX IF NOT EXISTS idx_migrations_name ON public.migrations(name);

-- Adicionar comentários para documentação
COMMENT ON TABLE public.migrations IS 'Registro de migrações SQL executadas no sistema';
COMMENT ON COLUMN public.migrations.name IS 'Nome do arquivo de migração';
COMMENT ON COLUMN public.migrations.executed_at IS 'Data e hora da execução';
COMMENT ON COLUMN public.migrations.executed_by IS 'Usuário que executou a migração';
COMMENT ON COLUMN public.migrations.status IS 'Status da execução (success, error)';
COMMENT ON COLUMN public.migrations.duration_ms IS 'Duração da execução em milissegundos';
COMMENT ON COLUMN public.migrations.log IS 'Log detalhado da execução';
