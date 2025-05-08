import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";

// GET: Busca notificação tipo 'modal' não lida para o usuário atual
export async function GET(req: NextRequest) {
  const supabase = createServerClient(cookies());
  // Autenticação
  const {
    data: { session },
    error: sessionError,
  } = await supabase.auth.getSession();
  if (!session || sessionError) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  }
  const userId = session.user.id;
  // Busca notificações tipo modal, não lidas, não expiradas
  // Consulta: notificações do tipo modal, não expiradas, destinadas ao usuário, plano, role ou geral,
  // e que ainda não estão marcadas como lidas em user_notifications
  const now = new Date().toISOString();
  const { data, error } = await supabase
    .from("notifications")
    .select("*, user_notifications!left(read_at)")
    .eq("type", "modal")
    .or(`user_target.is.null,user_target.eq.${userId}`)
    .or(`expires_at.is.null,expires_at.gt.${now}`)
    .order("created_at", { ascending: false })
    .limit(1);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  // Filtra para retornar apenas as não lidas
  const modal = data?.find((n) => !n.user_notifications?.read_at);
  return NextResponse.json(modal || null);
}
