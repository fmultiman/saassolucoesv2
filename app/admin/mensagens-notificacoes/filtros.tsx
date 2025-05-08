import { useState } from "react";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Input } from "@/components/ui/input";

export interface FiltrosProps {
  filtros: {
    tipo: string;
    expiracao: string;
  };
  setFiltros: (f: { tipo: string; expiracao: string }) => void;
}

export function Filtros({ filtros, setFiltros }: FiltrosProps) {
  return (
    <div className="flex flex-wrap gap-4 items-end mb-4">
      <div>
        <label className="block text-xs mb-1">Tipo</label>
        <Select value={filtros.tipo} onValueChange={v => setFiltros({ ...filtros, tipo: v })}>
          <SelectTrigger className="w-32">
            <SelectValue placeholder="Todos" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Todos</SelectItem>
            <SelectItem value="modal">Modal</SelectItem>
            <SelectItem value="notification">Notificação</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <label className="block text-xs mb-1">Expiração</label>
        <Select value={filtros.expiracao} onValueChange={v => setFiltros({ ...filtros, expiracao: v })}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Todas" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Todas</SelectItem>
            <SelectItem value="ativas">Ativas</SelectItem>
            <SelectItem value="expiradas">Expiradas</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
