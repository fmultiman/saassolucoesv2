-- Criar a tabela users
CREATE TABLE public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  email TEXT NOT NULL,
  name TEXT NOT NULL,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
  plan TEXT DEFAULT 'free' CHECK (plan IN ('free', 'basic', 'pro', 'enterprise', 'starter', 'premium')),
  user_type TEXT NOT NULL CHECK (user_type IN ('admin', 'client')),
  active_solutions INTEGER DEFAULT 0,
  last_active TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Adicionar políticas de segurança RLS (Row Level Security)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Política para permitir que usuários vejam apenas seus próprios dados
CREATE POLICY "Usuários podem ver seus próprios dados" 
ON public.users 
FOR SELECT 
USING (auth.uid() = id);

-- Política para permitir que admins vejam todos os dados
CREATE POLICY "Admins podem ver todos os dados" 
ON public.users 
FOR SELECT 
USING (
  (SELECT (user_metadata->>'tipo')::text FROM auth.users WHERE id = auth.uid()) = 'admin'
);

-- Política para permitir que o serviço insira dados (usando a chave de serviço)
CREATE POLICY "Serviço pode inserir dados" 
ON public.users 
FOR INSERT 
WITH CHECK (true);

-- Política para permitir que admins atualizem dados
CREATE POLICY "Admins podem atualizar dados" 
ON public.users 
FOR UPDATE 
USING (
  (SELECT (user_metadata->>'tipo')::text FROM auth.users WHERE id = auth.uid()) = 'admin'
);
