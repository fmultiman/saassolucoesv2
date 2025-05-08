import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";

// POST: Marca uma notificação como lida para o usuário atual
export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
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
  const notificationId = params.id;
  // Marca como lida (upsert em user_notifications)
  // Primeiro tenta encontrar, se não existir, cria
  const { data: existing, error: findError } = await supabase
    .from("user_notifications")
    .select("id")
    .eq("user_id", userId)
    .eq("notification_id", notificationId)
    .single();
  if (findError && findError.code !== "PGRST116") {
    return NextResponse.json({ error: findError.message }, { status: 500 });
  }
  if (existing) {
    // Atualiza read_at
    const { error: updateError } = await supabase
      .from("user_notifications")
      .update({ read_at: new Date().toISOString() })
      .eq("id", existing.id);
    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }
    return NextResponse.json({ success: true });
  } else {
    // Cria registro de leitura
    const { error: insertError } = await supabase
      .from("user_notifications")
      .insert({
        user_id: userId,
        notification_id: notificationId,
        read_at: new Date().toISOString(),
      });
    if (insertError) {
      return NextResponse.json({ error: insertError.message }, { status: 500 });
    }
    return NextResponse.json({ success: true });
  }
}
