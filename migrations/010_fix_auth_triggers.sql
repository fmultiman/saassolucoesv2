-- Função para corrigir triggers de autenticação
CREATE OR REPLACE FUNCTION fix_auth_triggers()
RETURNS void AS $outer$
BEGIN
  -- Verificar e corrigir a função handle_new_user
  IF NOT EXISTS (
    SELECT 1 FROM pg_proc 
    WHERE proname = 'handle_new_user' 
    AND pronamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public')
  ) THEN
    -- Criar a função handle_new_user se não existir
    EXECUTE $inner_create$
    CREATE OR REPLACE FUNCTION public.handle_new_user()
    RETURNS trigger AS $body$
    BEGIN
      INSERT INTO public.profiles (id, updated_at, username, full_name, avatar_url)
      VALUES (new.id, now(), new.raw_user_meta_data->>'username', new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
      RETURN new;
    END;
    $body$ LANGUAGE plpgsql SECURITY DEFINER;
    $inner_create$;
  ELSE
    -- Atualizar a função handle_new_user existente
    EXECUTE $inner_update$
    CREATE OR REPLACE FUNCTION public.handle_new_user()
    RETURNS trigger AS $body$
    BEGIN
      INSERT INTO public.profiles (id, updated_at, username, full_name, avatar_url)
      VALUES (new.id, now(), new.raw_user_meta_data->>'username', new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
      RETURN new;
    END;
    $body$ LANGUAGE plpgsql SECURITY DEFINER;
    $inner_update$;
  END IF;

  -- Verificar e corrigir o trigger on_auth_user_created
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger 
    WHERE tgname = 'on_auth_user_created' 
    AND tgrelid = 'auth.users'::regclass
  ) THEN
    -- Criar o trigger on_auth_user_created se não existir
    EXECUTE 'CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();';
  END IF;

  -- Verificar e corrigir permissões da tabela profiles
  EXECUTE 'GRANT ALL ON public.profiles TO authenticated;';
  EXECUTE 'GRANT ALL ON public.profiles TO service_role;';

  -- Verificar e corrigir políticas de segurança para profiles
  EXECUTE 'DROP POLICY IF EXISTS "Usuários podem ver seus próprios perfis" ON public.profiles;';
  EXECUTE 'CREATE POLICY "Usuários podem ver seus próprios perfis"
  ON public.profiles
  FOR SELECT
  USING (auth.uid() = id);';

  EXECUTE 'DROP POLICY IF EXISTS "Usuários podem atualizar seus próprios perfis" ON public.profiles;';
  EXECUTE 'CREATE POLICY "Usuários podem atualizar seus próprios perfis"
  ON public.profiles
  FOR UPDATE
  USING (auth.uid() = id);';

  -- Verificar e corrigir a view user_profiles
  EXECUTE 'DROP VIEW IF EXISTS public.user_profiles_view;';
  EXECUTE $inner_view$
  CREATE OR REPLACE VIEW public.user_profiles_view AS
  SELECT
    u.id,
    u.email,
    p.username,
    p.full_name,
    p.avatar_url,
    p.website,
    p.bio,
    p.company,
    p.job_title,
    p.industry,
    p.company_size,
    p.phone,
    p.address,
    p.city,
    p.state,
    p.country,
    p.postal_code,
    p.location,
    u.created_at,
    p.updated_at
  FROM
    auth.users u
  LEFT JOIN
    public.profiles p ON u.id = p.id;
  $inner_view$;

  -- Conceder permissões na view
  EXECUTE 'GRANT SELECT ON public.user_profiles_view TO authenticated;';
  EXECUTE 'GRANT SELECT ON public.user_profiles_view TO service_role;';
END;
$outer$ LANGUAGE plpgsql SECURITY DEFINER;
