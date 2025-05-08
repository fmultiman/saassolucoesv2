'use client';

import { NovaMensagemForm } from "./nova-mensagem-form";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";

import { useState, useCallback } from "react";
import { Filtros } from "./filtros";

import React from "react";
import { MensagensNotificacoesTabs } from "./tabs";

export default function MensagensNotificacoesPage() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [error, setError] = useState<string>("");
  const [filtros, setFiltros] = useState({ tipo: "", expiracao: "" });

  const fetchNotifications = useCallback(async () => {
    setError("");
    try {
      const res = await fetch("/api/notifications");
      if (!res.ok) throw new Error("Erro ao buscar notificações");
      const data = await res.json();
      setNotifications(data);
    } catch (err: any) {
      setError(err.message);
    }
  }, []);

  // Carrega notificações ao montar
  React.useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  // Filtragem client-side
  const filteredNotifications = notifications.filter((n: any) => {
    let tipoOk = !filtros.tipo || n.type === filtros.tipo;
    let expOk = true;
    if (filtros.expiracao === "ativas") {
      expOk = !n.expires_at || new Date(n.expires_at) > new Date();
    } else if (filtros.expiracao === "expiradas") {
      expOk = n.expires_at && new Date(n.expires_at) <= new Date();
    }
    return tipoOk && expOk;
  });

  return (
    <div className="max-w-4xl mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Mensagens e Notificações</h1>
      <MensagensNotificacoesTabs />
    </div>
  );
}
