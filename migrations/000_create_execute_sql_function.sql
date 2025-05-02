-- Função para executar SQL dinâmico
CREATE OR REPLACE FUNCTION execute_sql(sql_query text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  EXECUTE sql_query;
END;
$$;

-- Conceder permissões para o papel de autenticação
GRANT EXECUTE ON FUNCTION execute_sql TO authenticated;
GRANT EXECUTE ON FUNCTION execute_sql TO service_role;

-- Função para recarregar o cache de esquema
CREATE OR REPLACE FUNCTION reload_schema_cache()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Esta função é um placeholder para recarregar o cache de esquema
  -- No Supabase, isso acontece automaticamente após alterações DDL
  NULL;
END;
$$;

-- Conceder permissões para a função de recarga de cache
GRANT EXECUTE ON FUNCTION reload_schema_cache TO authenticated;
GRANT EXECUTE ON FUNCTION reload_schema_cache TO service_role;

-- Criar tabela para rastrear migrações
CREATE TABLE IF NOT EXISTS migrations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  filename TEXT NOT NULL,
  executed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  executed_by UUID REFERENCES auth.users(id),
  status TEXT NOT NULL,
  execution_time INTEGER NOT NULL,
  error_message TEXT
);

-- Índice para pesquisa rápida por nome de arquivo
CREATE INDEX IF NOT EXISTS idx_migrations_filename ON migrations(filename);

-- Conceder permissões para a tabela de migrações
GRANT ALL ON migrations TO authenticated;
GRANT ALL ON migrations TO service_role;
