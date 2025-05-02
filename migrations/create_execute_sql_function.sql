-- Função para executar SQL dinamicamente
CREATE OR REPLACE FUNCTION public.execute_sql(sql_query TEXT)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  EXECUTE sql_query;
END;
$$;

-- Permissões
GRANT EXECUTE ON FUNCTION public.execute_sql TO service_role;

-- Comentário
COMMENT ON FUNCTION public.execute_sql IS 'Função para executar SQL dinamicamente (apenas para administradores)';
