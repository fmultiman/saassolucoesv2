-- Migração para corrigir a sincronização entre Auth e tabelas de usuários

-- 1. Verificar e corrigir a tabela users
DO $$
BEGIN
  -- Verificar se a tabela users existe
  IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'users') THEN
    CREATE TABLE public.users (
      id UUID PRIMARY KEY REFERENCES auth.users(id),
      email TEXT NOT NULL,
      name TEXT,
      user_type TEXT DEFAULT 'client',
      plan TEXT DEFAULT 'gratuito',
      status TEXT DEFAULT 'active',
      created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
    );
    
    -- Adicionar políticas de segurança para a tabela users
    ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
    
    CREATE POLICY "Usuários podem ver seus próprios dados" 
    ON public.users FOR SELECT 
    USING (auth.uid() = id);
    
    CREATE POLICY "Usuários podem atualizar seus próprios dados" 
    ON public.users FOR UPDATE 
    USING (auth.uid() = id);
    
    GRANT ALL ON public.users TO authenticated;
    GRANT ALL ON public.users TO service_role;
    GRANT ALL ON public.users TO postgres;
    GRANT ALL ON public.users TO anon;
  END IF;
END $$;

-- 2. Corrigir o trigger handle_new_user para inserir tanto em users quanto em profiles
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  user_type TEXT;
  user_plan TEXT;
BEGIN
  -- Extrair metadados do usuário
  user_type := COALESCE(NEW.raw_user_meta_data->>'tipo', 'client');
  user_plan := COALESCE(NEW.raw_user_meta_data->>'plano', 'gratuito');
  
  -- Inserir na tabela users com tratamento de erro
  BEGIN
    INSERT INTO public.users (id, email, name, user_type, plan, created_at, updated_at)
    VALUES (
      NEW.id, 
      NEW.email, 
      COALESCE(NEW.raw_user_meta_data->>'name', NEW.email),
      user_type,
      user_plan,
      NEW.created_at, 
      NEW.updated_at
    )
    ON CONFLICT (id) DO UPDATE SET
      email = NEW.email,
      updated_at = NEW.updated_at;
  EXCEPTION WHEN OTHERS THEN
    -- Registrar o erro, mas não falhar
    RAISE NOTICE 'Erro ao inserir usuário para o ID %: %', NEW.id, SQLERRM;
  END;
  
  -- Inserir na tabela profiles com tratamento de erro
  BEGIN
    INSERT INTO public.profiles (id, email, created_at, updated_at)
    VALUES (NEW.id, NEW.email, NEW.created_at, NEW.updated_at)
    ON CONFLICT (id) DO UPDATE SET
      email = NEW.email,
      updated_at = NEW.updated_at;
  EXCEPTION WHEN OTHERS THEN
    -- Registrar o erro, mas não falhar
    RAISE NOTICE 'Erro ao inserir perfil para o usuário %: %', NEW.id, SQLERRM;
  END;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Recriar o trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 4. Sincronizar usuários existentes
DO $$
DECLARE
  auth_user RECORD;
BEGIN
  FOR auth_user IN SELECT id, email, created_at, raw_user_meta_data FROM auth.users LOOP
    -- Sincronizar com a tabela users
    BEGIN
      INSERT INTO public.users (
        id, 
        email, 
        name, 
        user_type, 
        plan, 
        created_at, 
        updated_at
      )
      VALUES (
        auth_user.id, 
        auth_user.email, 
        COALESCE(auth_user.raw_user_meta_data->>'name', auth_user.email),
        COALESCE(auth_user.raw_user_meta_data->>'tipo', 'client'),
        COALESCE(auth_user.raw_user_meta_data->>'plano', 'gratuito'),
        auth_user.created_at, 
        now()
      )
      ON CONFLICT (id) DO UPDATE SET
        email = auth_user.email,
        updated_at = now();
    EXCEPTION WHEN OTHERS THEN
      RAISE NOTICE 'Erro ao sincronizar usuário %: %', auth_user.id, SQLERRM;
    END;
    
    -- Sincronizar com a tabela profiles
    BEGIN
      INSERT INTO public.profiles (id, email, created_at, updated_at)
      VALUES (auth_user.id, auth_user.email, auth_user.created_at, now())
      ON CONFLICT (id) DO UPDATE SET
        email = auth_user.email,
        updated_at = now();
    EXCEPTION WHEN OTHERS THEN
      RAISE NOTICE 'Erro ao sincronizar perfil para o usuário %: %', auth_user.id, SQLERRM;
    END;
  END LOOP;
END $$;

-- 5. Corrigir a view user_profiles_view para incluir mais campos da tabela users
DROP VIEW IF EXISTS public.user_profiles_view;
CREATE OR REPLACE VIEW public.user_profiles_view AS
SELECT
  u.id,
  u.email,
  u.name,
  u.user_type,
  u.plan,
  u.status,
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
  p.updated_at,
  CASE WHEN p.id IS NOT NULL THEN true ELSE false END as has_profile,
  CASE WHEN au.confirmed_at IS NOT NULL THEN true ELSE false END as verified
FROM
  public.users u
LEFT JOIN
  public.profiles p ON u.id = p.id
LEFT JOIN
  auth.users au ON u.id = au.id;

-- 6. Conceder permissões na view
GRANT SELECT ON public.user_profiles_view TO authenticated;
GRANT SELECT ON public.user_profiles_view TO service_role;
GRANT SELECT ON public.user_profiles_view TO anon;
