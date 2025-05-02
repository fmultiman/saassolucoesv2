-- Criar tabela de perfis
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT,
  bio TEXT,
  phone TEXT,
  job_title TEXT,
  company TEXT,
  website TEXT,
  location TEXT,
  avatar_url TEXT,
  preferences JSONB,
  profile_complete BOOLEAN DEFAULT false,
  company_name TEXT,
  company_size TEXT,
  industry TEXT,
  address TEXT,
  city TEXT,
  state TEXT,
  country TEXT,
  postal_code TEXT,
  social_links JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Criar índice para melhorar performance
CREATE INDEX IF NOT EXISTS idx_profiles_name ON public.profiles(name);

-- Migrar dados da tabela users para profiles
INSERT INTO public.profiles (
  id, name, bio, phone, job_title, company, website, location, avatar_url, 
  preferences, profile_complete, company_name, company_size, industry, 
  address, city, state, country, postal_code, social_links
)
SELECT 
  id, name, bio, phone, job_title, company, website, location, avatar_url, 
  preferences, profile_complete, company_name, company_size, industry, 
  address, city, state, country, postal_code, social_links
FROM 
  public.users
WHERE 
  id IS NOT NULL
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  bio = EXCLUDED.bio,
  phone = EXCLUDED.phone,
  job_title = EXCLUDED.job_title,
  company = EXCLUDED.company,
  website = EXCLUDED.website,
  location = EXCLUDED.location,
  avatar_url = EXCLUDED.avatar_url,
  preferences = EXCLUDED.preferences,
  profile_complete = EXCLUDED.profile_complete,
  company_name = EXCLUDED.company_name,
  company_size = EXCLUDED.company_size,
  industry = EXCLUDED.industry,
  address = EXCLUDED.address,
  city = EXCLUDED.city,
  state = EXCLUDED.state,
  country = EXCLUDED.country,
  postal_code = EXCLUDED.postal_code,
  social_links = EXCLUDED.social_links,
  updated_at = now();

-- Criar trigger para atualizar o campo updated_at
CREATE OR REPLACE FUNCTION update_profile_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Adicionar trigger
DROP TRIGGER IF EXISTS trigger_update_profile_timestamp ON public.profiles;
CREATE TRIGGER trigger_update_profile_timestamp
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION update_profile_timestamp();

-- Criar trigger para atualizar profile_complete
CREATE OR REPLACE FUNCTION update_profile_complete()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.name IS NOT NULL AND 
     NEW.company_name IS NOT NULL AND 
     NEW.industry IS NOT NULL AND 
     NEW.job_title IS NOT NULL AND 
     NEW.phone IS NOT NULL THEN
    NEW.profile_complete := true;
  ELSE
    NEW.profile_complete := false;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Adicionar trigger
DROP TRIGGER IF EXISTS trigger_update_profile_complete ON public.profiles;
CREATE TRIGGER trigger_update_profile_complete
BEFORE INSERT OR UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION update_profile_complete();

-- Criar trigger para criar perfil automaticamente quando um novo usuário for criado
CREATE OR REPLACE FUNCTION create_profile_for_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, name)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'name')
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Adicionar trigger na tabela auth.users
DROP TRIGGER IF EXISTS trigger_create_profile_for_new_user ON auth.users;
CREATE TRIGGER trigger_create_profile_for_new_user
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION create_profile_for_new_user();

-- Configurar políticas de segurança para a tabela profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Política para permitir que usuários vejam seu próprio perfil
CREATE POLICY "Usuários podem ver seu próprio perfil"
  ON public.profiles
  FOR SELECT
  USING (auth.uid() = id);

-- Política para permitir que usuários atualizem seu próprio perfil
CREATE POLICY "Usuários podem atualizar seu próprio perfil"
  ON public.profiles
  FOR UPDATE
  USING (auth.uid() = id);

-- Política para permitir que administradores vejam todos os perfis
CREATE POLICY "Administradores podem ver todos os perfis"
  ON public.profiles
  FOR SELECT
  USING ((SELECT user_type FROM public.users WHERE id = auth.uid()) = 'admin');

-- Política para permitir que administradores atualizem todos os perfis
CREATE POLICY "Administradores podem atualizar todos os perfis"
  ON public.profiles
  FOR UPDATE
  USING ((SELECT user_type FROM public.users WHERE id = auth.uid()) = 'admin');

-- Política para permitir que administradores insiram perfis
CREATE POLICY "Administradores podem inserir perfis"
  ON public.profiles
  FOR INSERT
  WITH CHECK ((SELECT user_type FROM public.users WHERE id = auth.uid()) = 'admin');
