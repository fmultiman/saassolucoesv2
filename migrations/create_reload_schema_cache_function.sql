-- Função para recarregar o cache de esquema do Supabase
CREATE OR REPLACE FUNCTION public.reload_schema_cache()
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Recarregar o cache de esquema do Supabase
  NOTIFY pgrst, 'reload schema';
END;
$$;

-- Permissões
GRANT EXECUTE ON FUNCTION public.reload_schema_cache TO service_role;

-- Comentário
COMMENT ON FUNCTION public.reload_schema_cache IS 'Função para recarregar o cache de esquema do Supabase após alterações no banco de dados';
