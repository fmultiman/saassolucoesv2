-- Configurar permissões de armazenamento para o bucket user-content

-- Criar bucket se não existir
INSERT INTO storage.buckets (id, name, public, avif_autodetection, file_size_limit, allowed_mime_types)
VALUES ('user-content', 'user-content', false, false, 5242880, '{image/jpeg,image/png,image/gif,image/webp}')
ON CONFLICT (id) DO NOTHING;

-- Remover políticas existentes para evitar conflitos
DROP POLICY IF EXISTS "Allow public read access" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated uploads" ON storage.objects;
DROP POLICY IF EXISTS "Allow owner updates" ON storage.objects;
DROP POLICY IF EXISTS "Allow owner deletes" ON storage.objects;

-- Criar política de leitura pública
CREATE POLICY "Allow public read access" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'user-content');

-- Criar política de upload para usuários autenticados
CREATE POLICY "Allow authenticated uploads" 
ON storage.objects 
FOR INSERT 
TO authenticated 
WITH CHECK (bucket_id = 'user-content');


-- Criar política de atualização para proprietários
create policy "Allow owner updates" on storage.objects
for update
  using (auth.uid ()::text = owner::text);

-- Criar política de exclusão para proprietários
create policy "Allow owner deletes" on storage.objects for delete using (auth.uid ()::text = owner::text);
