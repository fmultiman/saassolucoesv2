import { type NextRequest, NextResponse } from "next/server"
import { createServiceRoleClient } from "@/lib/supabase/service-role"
import { requireAdminMaintenanceMode } from "@/lib/admin-maintenance"
import { requireAdminApiUser } from "@/lib/api-auth"
import fs from "fs/promises"
import path from "path"

export async function POST(request: NextRequest) {
  const maintenanceModeError = requireAdminMaintenanceMode()
  if (maintenanceModeError) return maintenanceModeError
  const authError = await requireAdminApiUser()
  if (authError) return authError

  try {
    // Ler o arquivo SQL
    const filePath = path.join(process.cwd(), "migrations", "000_create_execute_sql_function.sql")
    const sqlContent = await fs.readFile(filePath, "utf-8")

    // Criar cliente Supabase com service role
    const supabase = createServiceRoleClient()

    // Tentar executar SQL diretamente usando a API PostgreSQL do Supabase
    const { error } = await supabase
      .rpc("pg_query", { query: sqlContent })
      .catch(() => ({ error: { message: "Função pg_query não disponível" } }))

    if (error) {
      console.log("Erro ao usar pg_query:", error.message)

      // Tentar criar a função execute_sql diretamente
      try {
        // Usar fetch diretamente para o endpoint SQL
        const response = await fetch(`${process.env.SUPABASE_URL}/rest/v1/sql`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            apikey: process.env.SUPABASE_SERVICE_ROLE_KEY || "",
            Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY || ""}`,
          },
          body: JSON.stringify({
            query: `
              -- Criar função para executar SQL dinâmico
              CREATE OR REPLACE FUNCTION public.execute_sql(sql_query text)
              RETURNS void AS $$
              BEGIN
                EXECUTE sql_query;
              END;
              $$ LANGUAGE plpgsql SECURITY DEFINER;
              
              -- Criar tabela de migrações
              CREATE TABLE IF NOT EXISTS public.migrations (
                id SERIAL PRIMARY KEY,
                name TEXT NOT NULL,
                executed_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
                success BOOLEAN NOT NULL
              );
            `,
          }),
        })

        if (!response.ok) {
          const errorText = await response.text()
          console.error("Erro na resposta SQL:", errorText)
          return NextResponse.json(
            {
              error: "Não foi possível configurar as migrações automaticamente. Por favor, execute manualmente.",
              sqlToExecute: sqlContent,
            },
            { status: 500 },
          )
        }

        return NextResponse.json({
          success: true,
          message: "Função de migração configurada com sucesso",
        })
      } catch (fetchError: any) {
        console.error("Erro ao fazer fetch:", fetchError)
        return NextResponse.json(
          {
            error: "Não foi possível configurar as migrações automaticamente. Por favor, execute manualmente.",
            sqlToExecute: sqlContent,
          },
          { status: 500 },
        )
      }
    }

    return NextResponse.json({
      success: true,
      message: "Função de migração configurada com sucesso",
    })
  } catch (error: any) {
    console.error("Erro ao configurar função de migração:", error)
    return NextResponse.json(
      {
        error: `Erro ao configurar função de migração: ${error.message}`,
        manualSql: `
        -- Execute este SQL manualmente no seu console SQL do Supabase:
        
        -- Criar função para executar SQL dinâmico
        CREATE OR REPLACE FUNCTION public.execute_sql(sql_query text)
        RETURNS void AS $$
        BEGIN
          EXECUTE sql_query;
        END;
        $$ LANGUAGE plpgsql SECURITY DEFINER;
        
        -- Criar tabela de migrações
        CREATE TABLE IF NOT EXISTS public.migrations (
          id SERIAL PRIMARY KEY,
          name TEXT NOT NULL,
          executed_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
          success BOOLEAN NOT NULL
        );
      `,
      },
      { status: 500 },
    )
  }
}
