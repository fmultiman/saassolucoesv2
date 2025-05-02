-- Migração para resetar e reconstruir o sistema de autenticação
-- Mantém a estrutura das tabelas mas recria triggers, políticas e funções

-- 1. Remover triggers existentes
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS on_auth_user_updated ON auth.users;
DROP TRIGGER IF EXISTS on_auth_user_deleted ON auth.users;

-- 2. Remover funções existentes
DROP FUNCTION IF EXISTS public.handle_new_user();
DROP FUNCTION IF EXISTS public.handle_user_update();
DROP FUNCTION IF EXISTS public.handle_user_delete();

-- 3. Remover políticas existentes da tabela users
DROP POLICY IF EXISTS "Usuários podem ver seus próprios dados" ON public.users;
DROP POLICY IF EXISTS "Usuários podem atualizar seus próprios dados" ON public.users;
DROP POLICY IF EXISTS "Usuários podem inserir seus próprios dados" ON public.users;
DROP POLICY IF EXISTS "Administradores podem ver todos os usuários" ON public.users;
DROP POLICY IF EXISTS "Administradores podem atualizar todos os usuários" ON public.users;
DROP POLICY IF EXISTS "Administradores podem inserir usuários" ON public.users;

-- 4. Remover políticas existentes da tabela profiles
DROP POLICY IF EXISTS "Usuários podem ver seus próprios perfis" ON public.profiles;
DROP POLICY IF EXISTS "Usuários podem atualizar seus próprios perfis" ON public.profiles;
DROP POLICY IF EXISTS "Usuários podem inserir seus próprios perfis" ON public.profiles;
DROP POLICY IF EXISTS "Administradores podem ver todos os perfis" ON public.profiles;
DROP POLICY IF EXISTS "Administradores podem atualizar todos os perfis" ON public.profiles;
DROP POLICY IF EXISTS "Administradores podem inserir perfis" ON public.profiles;

-- 5. Garantir que as tabelas tenham as colunas necessárias
-- Tabela users
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
      last_sign_in_at TIMESTAMP WITH TIME ZONE,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
    );
  ELSE
    -- Verificar e adicionar colunas que podem estar faltando
    IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'users' AND column_name = 'last_sign_in_at') THEN
      ALTER TABLE public.users ADD COLUMN last_sign_in_at TIMESTAMP WITH TIME ZONE;
    END IF;
  END IF;
END $$;

-- Tabela profiles
DO $$
BEGIN
  -- Verificar se a tabela profiles existe
  IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'profiles') THEN
    CREATE TABLE public.profiles (
      id UUID PRIMARY KEY REFERENCES auth.users(id),
      username TEXT,
      full_name TEXT,
      avatar_url TEXT,
      bio TEXT,
      phone TEXT,
      job_title TEXT,
      company TEXT,
      website TEXT,
      location TEXT,
      preferences JSONB,
      company_name TEXT,
      company_size TEXT,
      industry TEXT,
      address TEXT,
      city TEXT,
      state TEXT,
      country TEXT,
      postal_code TEXT,
      social_links JSONB,
      email TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
    );
  ELSE
    -- Verificar e adicionar colunas que podem estar faltando
    IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'profiles' AND column_name = 'email') THEN
      ALTER TABLE public.profiles ADD COLUMN email TEXT;
    END IF;
  END IF;
END $$;

-- 6. Recriar a view user_profiles_view
DROP VIEW IF EXISTS public.user_profiles_view;
CREATE OR REPLACE VIEW public.user_profiles_view AS
SELECT
  u.id,
  u.email,
  u.name,
  u.user_type,
  u.plan,
  u.status,
  u.last_sign_in_at,
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
  p.social_links,
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

-- 7. Habilitar RLS nas tabelas
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 8. Criar função simplificada para lidar com novos usuários
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  user_type TEXT;
  user_plan TEXT;
  user_name TEXT;
BEGIN
  -- Extrair metadados do usuário de forma segura
  user_type := COALESCE(NEW.raw_user_meta_data->>'tipo', 'client');
  user_plan := COALESCE(NEW.raw_user_meta_data->>'plano', 'gratuito');
  user_name := COALESCE(NEW.raw_user_meta_data->>'name', NEW.email);
  
  -- Inserir na tabela users
  INSERT INTO public.users (
    id, 
    email, 
    name, 
    user_type, 
    plan, 
    status,
    created_at, 
    updated_at
  )
  VALUES (
    NEW.id, 
    NEW.email, 
    user_name,
    user_type,
    user_plan,
    'active',
    NEW.created_at, 
    NEW.updated_at
  );
  
  -- Inserir na tabela profiles
  INSERT INTO public.profiles (
    id, 
    email,
    full_name,
    created_at, 
    updated_at
  )
  VALUES (
    NEW.id, 
    NEW.email,
    user_name,
    NEW.created_at, 
    NEW.updated_at
  );
  
  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  -- Log do erro e continuar
  RAISE LOG 'Erro ao criar usuário/perfil: %', SQLERRM;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 9. Criar função para atualizar o último login
CREATE OR REPLACE FUNCTION public.handle_user_login()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.users
  SET last_sign_in_at = now(), updated_at = now()
  WHERE id = NEW.id;
  
  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  -- Log do erro e continuar
  RAISE LOG 'Erro ao atualizar último login: %', SQLERRM;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 10. Criar triggers
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

CREATE TRIGGER on_auth_user_login
AFTER UPDATE OF last_sign_in_at ON auth.users
FOR EACH ROW
WHEN (OLD.last_sign_in_at IS DISTINCT FROM NEW.last_sign_in_at)
EXECUTE FUNCTION public.handle_user_login();

-- 11. Criar políticas de segurança simples e eficazes
-- Políticas para users
CREATE POLICY "Usuários podem ver seus próprios dados"
ON public.users FOR SELECT
USING (auth.uid() = id);

CREATE POLICY "Usuários podem atualizar seus próprios dados"
ON public.users FOR UPDATE
USING (auth.uid() = id);

CREATE POLICY "Administradores podem ver todos os usuários"
ON public.users FOR SELECT
USING (auth.jwt() ->> 'role' = 'service_role' OR (SELECT user_type FROM public.users WHERE id = auth.uid()) = 'admin');

CREATE POLICY "Administradores podem atualizar todos os usuários"
ON public.users FOR UPDATE
USING (auth.jwt() ->> 'role' = 'service_role' OR (SELECT user_type FROM public.users WHERE id = auth.uid()) = 'admin');

-- Políticas para profiles
CREATE POLICY "Usuários podem ver seus próprios perfis"
ON public.profiles FOR SELECT
USING (auth.uid() = id);

CREATE POLICY "Usuários podem atualizar seus próprios perfis"
ON public.profiles FOR UPDATE
USING (auth.uid() = id);

CREATE POLICY "Administradores podem ver todos os perfis"
ON public.profiles FOR SELECT
USING (auth.jwt() ->> 'role' = 'service_role' OR (SELECT user_type FROM public.users WHERE id = auth.uid()) = 'admin');

CREATE POLICY "Administradores podem atualizar todos os perfis"
ON public.profiles FOR UPDATE
USING (auth.jwt() ->> 'role' = 'service_role' OR (SELECT user_type FROM public.users WHERE id = auth.uid()) = 'admin');

-- 12. Conceder permissões
GRANT ALL ON public.users TO authenticated;
GRANT ALL ON public.users TO service_role;
GRANT ALL ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
GRANT SELECT ON public.user_profiles_view TO authenticated;
GRANT SELECT ON public.user_profiles_view TO service_role;

-- 13. Sincronizar usuários existentes
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
      INSERT INTO public.profiles (
        id, 
        email, 
        full_name,
        created_at, 
        updated_at
      )
      VALUES (
        auth_user.id, 
        auth_user.email,
        COALESCE(auth_user.raw_user_meta_data->>'name', auth_user.email),
        auth_user.created_at, 
        now()
      )
      ON CONFLICT (id) DO UPDATE SET
        email = auth_user.email,
        updated_at = now();
    EXCEPTION WHEN OTHERS THEN
      RAISE NOTICE 'Erro ao sincronizar perfil para o usuário %: %', auth_user.id, SQLERRM;
    END;
  END LOOP;
END $$;
