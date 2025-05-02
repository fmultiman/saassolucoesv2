-- Migração para criar a view user_profiles_view
-- Esta view combina dados das tabelas users e profiles para facilitar consultas

-- Criar a view
CREATE OR REPLACE VIEW public.user_profiles_view AS
SELECT 
  u.id,
  u.email,
  u.user_type,
  u.plan,
  u.status,
  u.created_at,
  u.last_sign_in_at,
  p.name,
  p.bio,
  p.phone,
  p.job_title,
  p.company,
  p.website,
  p.location,
  p.avatar_url,
  p.preferences,
  p.profile_complete,
  p.company_name,
  p.company_size,
  p.industry,
  p.address,
  p.city,
  p.state,
  p.country,
  p.postal_code,
  p.social_links,
  p.created_at AS profile_created_at,
  p.updated_at AS profile_updated_at
FROM 
  public.users u
INNER JOIN 
  public.profiles p ON u.id = p.id;

-- Comentários para documentação
COMMENT ON VIEW public.user_profiles_view IS 'View que combina dados de usuários e seus perfis para facilitar consultas';
COMMENT ON COLUMN public.user_profiles_view.id IS 'ID único do usuário';
COMMENT ON COLUMN public.user_profiles_view.email IS 'Email do usuário';
COMMENT ON COLUMN public.user_profiles_view.profile_created_at IS 'Data de criação do perfil';
COMMENT ON COLUMN public.user_profiles_view.profile_updated_at IS 'Data da última atualização do perfil';

-- Registrar a migração
INSERT INTO public.migrations (name, success)
VALUES ('008_create_user_profiles_view', true);
