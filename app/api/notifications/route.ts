import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";

// GET: Lista todas as notificações (admin)
export async function GET(req: NextRequest) {
  const supabase = createServerClient(await cookies());
  // Autenticação e autorização admin
  const {
    data: { session },
    error: sessionError,
  } = await supabase.auth.getSession();
  if (!session || sessionError) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  }
  // Verifica se é admin
  const { data: userData } = await supabase
    .from("users")
    .select("user_type")
    .eq("id", session.user.id)
    .single();
  if (userData?.user_type !== "admin") {
    return NextResponse.json({ error: "Apenas admins podem acessar" }, { status: 403 });
  }
  // Busca notificações
  const { data: notifications, error } = await supabase
    .from("notifications")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json(notifications);
}

// POST: Cria uma nova notificação (admin)
export async function POST(req: NextRequest) {
  const supabase = createServerClient(await cookies());
  const body = await req.json();
  // Autenticação e autorização admin
  const {
    data: { session },
    error: sessionError,
  } = await supabase.auth.getSession();
  if (!session || sessionError) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  }
  // Verifica se é admin
  const { data: userData } = await supabase
    .from("users")
    .select("user_type")
    .eq("id", session.user.id)
    .single();
  if (userData?.user_type !== "admin") {
    return NextResponse.json({ error: "Apenas admins podem criar notificações" }, { status: 403 });
  }
  // Cria notificação
  const { data, error } = await supabase.from("notifications").insert([body]).select().single();
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json(data, { status: 201 });
}
