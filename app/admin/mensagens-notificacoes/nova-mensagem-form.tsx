import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

interface NovaMensagemFormProps {
  onCreated?: () => void;
}

export function NovaMensagemForm({ onCreated }: NovaMensagemFormProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: "",
    message: "",
    type: "modal",
    category: "",
    user_target: "",
    plan_target: "",
    role_target: "user",
    expires_at: ""
  });
  const [error, setError] = useState("");

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSelect = (name: string, value: string) => {
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/notifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          user_target: form.user_target || null,
          plan_target: form.plan_target || null,
          expires_at: form.expires_at || null
        })
      });
      if (!res.ok) throw new Error("Erro ao criar mensagem");
      setOpen(false);
      setForm({
        title: "",
        message: "",
        type: "modal",
        category: "",
        user_target: "",
        plan_target: "",
        role_target: "user",
        expires_at: ""
      });
      if (onCreated) onCreated();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default">Criar Nova Mensagem</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Criar Nova Mensagem</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input name="title" placeholder="Título" required value={form.title} onChange={handleChange} />
          <Input name="message" placeholder="Mensagem" required value={form.message} onChange={handleChange} />
          <Select value={form.type} onValueChange={(v) => handleSelect("type", v)}>
            <SelectTrigger><SelectValue placeholder="Tipo" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="modal">Modal</SelectItem>
              <SelectItem value="notification">Notificação</SelectItem>
            </SelectContent>
          </Select>
          <Input name="category" placeholder="Categoria" value={form.category} onChange={handleChange} />
          <Input name="user_target" placeholder="Usuário específico (UUID)" value={form.user_target} onChange={handleChange} />
          <Input name="plan_target" placeholder="Plano específico" value={form.plan_target} onChange={handleChange} />
          <Select value={form.role_target} onValueChange={(v) => handleSelect("role_target", v)}>
            <SelectTrigger><SelectValue placeholder="Role alvo" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="user">Usuário</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="all">Todos</SelectItem>
            </SelectContent>
          </Select>
          <Input name="expires_at" type="datetime-local" placeholder="Expiração" value={form.expires_at} onChange={handleChange} />
          {error && <div className="text-red-500 text-sm">{error}</div>}
          <DialogFooter>
            <Button type="submit" disabled={loading}>{loading ? "Enviando..." : "Enviar"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
