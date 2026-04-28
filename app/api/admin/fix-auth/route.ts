import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/admin"
import { requireAdminMaintenanceMode } from "@/lib/admin-maintenance"
import { requireAdminApiUser } from "@/lib/api-auth"
import fs from "fs"
import path from "path"

export async function POST() {
  const maintenanceModeError = requireAdminMaintenanceMode()
  if (maintenanceModeError) return maintenanceModeError
  const authError = await requireAdminApiUser()
  if (authError) return authError

  try {
    const supabase = createClient()

    // Ler o arquivo de migração
    const migrationPath = path.join(process.cwd(), "migrations", "011_fix_auth_system.sql")
    let sql = ""

    try {
      sql = fs.readFileSync(migrationPath, "utf8")
    } catch (error) {
      // Se o arquivo não existir, usar o SQL embutido
      sql = `
      -- Migração para corrigir problemas no sistema de autenticação

      -- 1. Verificar a estrutura da tabela profiles
      DO $$
      DECLARE
        column_exists BOOLEAN;
      BEGIN
        -- Verificar se a coluna email existe na tabela profiles
        SELECT EXISTS (
          SELECT 1 FROM information_schema.columns 
          WHERE table_schema = 'public' 
          AND table_name = 'profiles' 
          AND column_name = 'email'
        ) INTO column_exists;
        
        -- Se a coluna email não existir, adicioná-la
        IF NOT column_exists THEN
          EXECUTE 'ALTER TABLE public.profiles ADD COLUMN email TEXT';
        END IF;
        
        -- Verificar se a coluna created_at existe na tabela profiles
        SELECT EXISTS (
          SELECT 1 FROM information_schema.columns 
          WHERE table_schema = 'public' 
          AND table_name = 'profiles' 
          AND column_name = 'created_at'
        ) INTO column_exists;
        
        -- Se a coluna created_at não existir, adicioná-la
        IF NOT column_exists THEN
          EXECUTE 'ALTER TABLE public.profiles ADD COLUMN created_at TIMESTAMP WITH TIME ZONE DEFAULT now()';
        END IF;
        
        -- Verificar se a coluna updated_at existe na tabela profiles
        SELECT EXISTS (
          SELECT 1 FROM information_schema.columns 
          WHERE table_schema = 'public' 
          AND table_name = 'profiles' 
          AND column_name = 'updated_at'
        ) INTO column_exists;
        
        -- Se a coluna updated_at não existir, adicioná-la
        IF NOT column_exists THEN
          EXECUTE 'ALTER TABLE public.profiles ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()';
        END IF;
        
        -- Verificar se a coluna username existe na tabela profiles
        SELECT EXISTS (
          SELECT 1 FROM information_schema.columns 
          WHERE table_schema = 'public' 
          AND table_name = 'profiles' 
          AND column_name = 'username'
        ) INTO column_exists;
        
        -- Se a coluna username não existir, adicioná-la
        IF NOT column_exists THEN
          EXECUTE 'ALTER TABLE public.profiles ADD COLUMN username TEXT';
        END IF;
        
        -- Verificar se a coluna full_name existe na tabela profiles
        SELECT EXISTS (
          SELECT 1 FROM information_schema.columns 
          WHERE table_schema = 'public' 
          AND table_name = 'profiles' 
          AND column_name = 'full_name'
        ) INTO column_exists;
        
        -- Se a coluna full_name não existir, adicioná-la
        IF NOT column_exists THEN
          EXECUTE 'ALTER TABLE public.profiles ADD COLUMN full_name TEXT';
        END IF;
        
        -- Verificar se a coluna avatar_url existe na tabela profiles
        SELECT EXISTS (
          SELECT 1 FROM information_schema.columns 
          WHERE table_schema = 'public' 
          AND table_name = 'profiles' 
          AND column_name = 'avatar_url'
        ) INTO column_exists;
        
        -- Se a coluna avatar_url não existir, adicioná-la
        IF NOT column_exists THEN
          EXECUTE 'ALTER TABLE public.profiles ADD COLUMN avatar_url TEXT';
        END IF;
        
        -- Verificar se a coluna website existe na tabela profiles
        SELECT EXISTS (
          SELECT 1 FROM information_schema.columns 
          WHERE table_schema = 'public' 
          AND table_name = 'profiles' 
          AND column_name = 'website'
        ) INTO column_exists;
        
        -- Se a coluna website não existir, adicioná-la
        IF NOT column_exists THEN
          EXECUTE 'ALTER TABLE public.profiles ADD COLUMN website TEXT';
        END IF;
        
        -- Verificar se a coluna bio existe na tabela profiles
        SELECT EXISTS (
          SELECT 1 FROM information_schema.columns 
          WHERE table_schema = 'public' 
          AND table_name = 'profiles' 
          AND column_name = 'bio'
        ) INTO column_exists;
        
        -- Se a coluna bio não existir, adicioná-la
        IF NOT column_exists THEN
          EXECUTE 'ALTER TABLE public.profiles ADD COLUMN bio TEXT';
        END IF;
        
        -- Verificar se a coluna company existe na tabela profiles
        SELECT EXISTS (
          SELECT 1 FROM information_schema.columns 
          WHERE table_schema = 'public' 
          AND table_name = 'profiles' 
          AND column_name = 'company'
        ) INTO column_exists;
        
        -- Se a coluna company não existir, adicioná-la
        IF NOT column_exists THEN
          EXECUTE 'ALTER TABLE public.profiles ADD COLUMN company TEXT';
        END IF;
        
        -- Verificar se a coluna job_title existe na tabela profiles
        SELECT EXISTS (
          SELECT 1 FROM information_schema.columns 
          WHERE table_schema = 'public' 
          AND table_name = 'profiles' 
          AND column_name = 'job_title'
        ) INTO column_exists;
        
        -- Se a coluna job_title não existir, adicioná-la
        IF NOT column_exists THEN
          EXECUTE 'ALTER TABLE public.profiles ADD COLUMN job_title TEXT';
        END IF;
        
        -- Verificar se a coluna industry existe na tabela profiles
        SELECT EXISTS (
          SELECT 1 FROM information_schema.columns 
          WHERE table_schema = 'public' 
          AND table_name = 'profiles' 
          AND column_name = 'industry'
        ) INTO column_exists;
        
        -- Se a coluna industry não existir, adicioná-la
        IF NOT column_exists THEN
          EXECUTE 'ALTER TABLE public.profiles ADD COLUMN industry TEXT';
        END IF;
        
        -- Verificar se a coluna company_size existe na tabela profiles
        SELECT EXISTS (
          SELECT 1 FROM information_schema.columns 
          WHERE table_schema = 'public' 
          AND table_name = 'profiles' 
          AND column_name = 'company_size'
        ) INTO column_exists;
        
        -- Se a coluna company_size não existir, adicioná-la
        IF NOT column_exists THEN
          EXECUTE 'ALTER TABLE public.profiles ADD COLUMN company_size TEXT';
        END IF;
        
        -- Verificar se a coluna phone existe na tabela profiles
        SELECT EXISTS (
          SELECT 1 FROM information_schema.columns 
          WHERE table_schema = 'public' 
          AND table_name = 'profiles' 
          AND column_name = 'phone'
        ) INTO column_exists;
        
        -- Se a coluna phone não existir, adicioná-la
        IF NOT column_exists THEN
          EXECUTE 'ALTER TABLE public.profiles ADD COLUMN phone TEXT';
        END IF;
        
        -- Verificar se a coluna address existe na tabela profiles
        SELECT EXISTS (
          SELECT 1 FROM information_schema.columns 
          WHERE table_schema = 'public' 
          AND table_name = 'profiles' 
          AND column_name = 'address'
        ) INTO column_exists;
        
        -- Se a coluna address não existir, adicioná-la
        IF NOT column_exists THEN
          EXECUTE 'ALTER TABLE public.profiles ADD COLUMN address TEXT';
        END IF;
        
        -- Verificar se a coluna city existe na tabela profiles
        SELECT EXISTS (
          SELECT 1 FROM information_schema.columns 
          WHERE table_schema = 'public' 
          AND table_name = 'profiles' 
          AND column_name = 'city'
        ) INTO column_exists;
        
        -- Se a coluna city não existir, adicioná-la
        IF NOT column_exists THEN
          EXECUTE 'ALTER TABLE public.profiles ADD COLUMN city TEXT';
        END IF;
        
        -- Verificar se a coluna state existe na tabela profiles
        SELECT EXISTS (
          SELECT 1 FROM information_schema.columns 
          WHERE table_schema = 'public' 
          AND table_name = 'profiles' 
          AND column_name = 'state'
        ) INTO column_exists;
        
        -- Se a coluna state não existir, adicioná-la
        IF NOT column_exists THEN
          EXECUTE 'ALTER TABLE public.profiles ADD COLUMN state TEXT';
        END IF;
        
        -- Verificar se a coluna country existe na tabela profiles
        SELECT EXISTS (
          SELECT 1 FROM information_schema.columns 
          WHERE table_schema = 'public' 
          AND table_name = 'profiles' 
          AND column_name = 'country'
        ) INTO column_exists;
        
        -- Se a coluna country não existir, adicioná-la
        IF NOT column_exists THEN
          EXECUTE 'ALTER TABLE public.profiles ADD COLUMN country TEXT';
        END IF;
        
        -- Verificar se a coluna postal_code existe na tabela profiles
        SELECT EXISTS (
          SELECT 1 FROM information_schema.columns 
          WHERE table_schema = 'public' 
          AND table_name = 'profiles' 
          AND column_name = 'postal_code'
        ) INTO column_exists;
        
        -- Se a coluna postal_code não existir, adicioná-la
        IF NOT column_exists THEN
          EXECUTE 'ALTER TABLE public.profiles ADD COLUMN postal_code TEXT';
        END IF;
        
        -- Verificar se a coluna location existe na tabela profiles
        SELECT EXISTS (
          SELECT 1 FROM information_schema.columns 
          WHERE table_schema = 'public' 
          AND table_name = 'profiles' 
          AND column_name = 'location'
        ) INTO column_exists;
        
        -- Se a coluna location não existir, adicioná-la
        IF NOT column_exists THEN
          EXECUTE 'ALTER TABLE public.profiles ADD COLUMN location TEXT';
        END IF;
      END $$;

      -- 2. Corrigir o trigger handle_new_user
      CREATE OR REPLACE FUNCTION public.handle_new_user()
      RETURNS TRIGGER AS $$
      BEGIN
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

      -- 4. Corrigir permissões
      GRANT ALL ON public.profiles TO authenticated;
      GRANT ALL ON public.profiles TO service_role;
      GRANT ALL ON public.profiles TO postgres;
      GRANT ALL ON public.profiles TO anon;

      -- 5. Corrigir políticas de segurança
      DROP POLICY IF EXISTS "Usuários podem ver seus próprios perfis" ON public.profiles;
      CREATE POLICY "Usuários podem ver seus próprios perfis"
      ON public.profiles FOR SELECT
      TO authenticated
      USING (auth.uid() = id);

      DROP POLICY IF EXISTS "Usuários podem atualizar seus próprios perfis" ON public.profiles;
      CREATE POLICY "Usuários podem atualizar seus próprios perfis"
      ON public.profiles FOR UPDATE
      TO authenticated
      USING (auth.uid() = id);

      DROP POLICY IF EXISTS "Usuários podem inserir seus próprios perfis" ON public.profiles;
      CREATE POLICY "Usuários podem inserir seus próprios perfis"
      ON public.profiles FOR INSERT
      TO authenticated
      WITH CHECK (auth.uid() = id);

      -- 6. Corrigir a view user_profiles_view
      DROP VIEW IF EXISTS public.user_profiles_view;
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

      -- 7. Conceder permissões na view
      GRANT SELECT ON public.user_profiles_view TO authenticated;
      GRANT SELECT ON public.user_profiles_view TO service_role;
      GRANT SELECT ON public.user_profiles_view TO anon;

      -- 8. Sincronizar dados existentes
      DO $$
      DECLARE
        user_record RECORD;
      BEGIN
        FOR user_record IN SELECT id, email, created_at FROM auth.users LOOP
          BEGIN
            INSERT INTO public.profiles (id, email, created_at, updated_at)
            VALUES (user_record.id, user_record.email, user_record.created_at, now())
            ON CONFLICT (id) DO UPDATE SET
              email = user_record.email,
              updated_at = now();
          EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Erro ao sincronizar perfil para o usuário %: %', user_record.id, SQLERRM;
          END;
        END LOOP;
      END $$;
      `
    }

    // Executar o SQL usando a API de migração
    const { data, error } = await supabase.from("_migrations").select("*").limit(1)

    if (error) {
      console.error("Erro ao verificar tabela de migrações:", error)
      return NextResponse.json(
        {
          success: false,
          message: `Erro ao verificar tabela de migrações: ${error.message}`,
        },
        { status: 500 },
      )
    }

    // Usar a API de migração para executar o SQL
    const response = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/rpc/execute_sql`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: process.env.SUPABASE_SERVICE_ROLE_KEY || "",
        Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY || ""}`,
      },
      body: JSON.stringify({ sql }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error("Erro ao executar SQL via API:", errorText)

      return NextResponse.json(
        {
          success: false,
          message: `Erro ao executar SQL via API: ${errorText}`,
        },
        { status: 500 },
      )
    }

    return NextResponse.json({
      success: true,
      message: "Correção aplicada com sucesso",
    })
  } catch (error: any) {
    console.error("Erro ao corrigir autenticação:", error)
    return NextResponse.json(
      {
        success: false,
        message: `Erro interno do servidor: ${error.message || "Erro desconhecido"}`,
      },
      { status: 500 },
    )
  }
}
