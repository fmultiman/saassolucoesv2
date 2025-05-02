-- Adicionar novos campos à tabela users
ALTER TABLE public.users
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS avatar_url TEXT,
ADD COLUMN IF NOT EXISTS bio TEXT,
ADD COLUMN IF NOT EXISTS phone TEXT,
ADD COLUMN IF NOT EXISTS job_title TEXT,
ADD COLUMN IF NOT EXISTS company TEXT,
ADD COLUMN IF NOT EXISTS website TEXT,
ADD COLUMN IF NOT EXISTS location TEXT,
ADD COLUMN IF NOT EXISTS preferences JSONB;

-- Criar bucket para armazenar avatares e outros conteúdos de usuário
INSERT INTO storage.buckets (id, name, public)
VALUES ('user-content', 'user-content', true)
ON CONFLICT (id) DO NOTHING;

-- Criar política para permitir acesso público de leitura
CREATE POLICY IF NOT EXISTS "Public Read Access"
ON storage.objects FOR SELECT
USING (bucket_id = 'user-content');

-- Criar política para permitir que usuários autenticados façam upload
CREATE POLICY IF NOT EXISTS "Authenticated Users Can Upload"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'user-content');

-- Criar política para permitir que usuários autenticados atualizem seus próprios arquivos
CREATE POLICY IF NOT EXISTS "Users Can Update Own Files"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'user-content' AND (storage.foldername(name))[1] = 'avatars');

-- Criar política para permitir que usuários autenticados excluam seus próprios arquivos
CREATE POLICY IF NOT EXISTS "Users Can Delete Own Files"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'user-content' AND (storage.foldername(name))[1] = 'avatars');

-- Adicionar campos de perfil à tabela de usuários
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS bio TEXT,
ADD COLUMN IF NOT EXISTS phone VARCHAR(20),
ADD COLUMN IF NOT EXISTS job_title VARCHAR(100),
ADD COLUMN IF NOT EXISTS company VARCHAR(100),
ADD COLUMN IF NOT EXISTS website VARCHAR(255),
ADD COLUMN IF NOT EXISTS location VARCHAR(100),
ADD COLUMN IF NOT EXISTS avatar_url TEXT,
ADD COLUMN IF NOT EXISTS preferences JSONB;

-- Comentários para documentação
COMMENT ON COLUMN users.bio IS 'Biografia do usuário';
COMMENT ON COLUMN users.phone IS 'Número de telefone do usuário';
COMMENT ON COLUMN users.job_title IS 'Cargo do usuário';
COMMENT ON COLUMN users.company IS 'Empresa do usuário';
COMMENT ON COLUMN users.website IS 'Website do usuário';
COMMENT ON COLUMN users.location IS 'Localização do usuário';
COMMENT ON COLUMN users.avatar_url IS 'URL da imagem de perfil do usuário';
COMMENT ON COLUMN users.preferences IS 'Preferências do usuário em formato JSON';
