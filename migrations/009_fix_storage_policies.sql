-- Remover políticas existentes para evitar conflitos
DROP POLICY IF EXISTS "Allow public read access" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated uploads" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated updates" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated deletes" ON storage.objects;

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

-- Criar política de atualização para usuários autenticados
CREATE POLICY "Allow authenticated updates" 
ON storage.objects 
FOR UPDATE 
TO authenticated
USING (bucket_id = 'user-content');

-- Criar política de exclusão para usuários autenticados
CREATE POLICY "Allow authenticated deletes" 
ON storage.objects 
FOR DELETE 
TO authenticated
USING (bucket_id = 'user-content');

-- Garantir que o RLS está habilitado na tabela de objetos
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;
