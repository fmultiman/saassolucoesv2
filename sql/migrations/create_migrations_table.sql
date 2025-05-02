-- Tabela para rastrear migrações executadas
CREATE TABLE IF NOT EXISTS migrations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  filename TEXT NOT NULL,
  executed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  executed_by UUID REFERENCES auth.users(id),
  status TEXT NOT NULL CHECK (status IN ('success', 'error')),
  execution_time INTEGER NOT NULL,
  error_message TEXT
);

-- Índice para consultas por nome de arquivo
CREATE INDEX IF NOT EXISTS migrations_filename_idx ON migrations (filename);

-- Índice para consultas por status
CREATE INDEX IF NOT EXISTS migrations_status_idx ON migrations (status);

-- Função para verificar se uma migração já foi executada com sucesso
CREATE OR REPLACE FUNCTION migration_already_executed(p_filename TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM migrations 
    WHERE filename = p_filename 
    AND status = 'success'
  );
END;
$$ LANGUAGE plpgsql;
