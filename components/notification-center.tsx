import { useEffect, useState } from "react";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Categoria {
  key: string;
  label: string;
}
interface Notification {
  id: string | number;
  title: string;
  message: string;
  type?: string;
  category?: string;
  read_at?: string | null;
  created_at?: string;
  [key: string]: any;
}

function getCategoriasPersonalizadas(): Categoria[] {
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem("notificationCategories");
    if (stored) return JSON.parse(stored) as Categoria[];
  }
  return [
    { key: "sistema", label: "Sistema" },
    { key: "usuarios", label: "Usuários" },
    { key: "metricas", label: "Métricas" },
    { key: "outros", label: "Outros" },
  ];
}

function getCategoria(n: Notification): string {
  if (n.category?.toLowerCase() === "sistema") return "sistema";
  if (n.category?.toLowerCase() === "usuários" || n.category?.toLowerCase() === "usuarios") return "usuarios";
  if (n.category?.toLowerCase() === "métricas" || n.category?.toLowerCase() === "metricas") return "metricas";
  return "outros";
}

export function NotificationCenter() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [open, setOpen] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [categoriaAtiva, setCategoriaAtiva] = useState<string>("sistema");
  const [categorias, setCategorias] = useState<Categoria[]>(() => getCategoriasPersonalizadas());

  useEffect(() => {
    // Atualiza categorias personalizadas ao abrir o NotificationCenter
    if (open) {
      setCategorias(getCategoriasPersonalizadas());
    }
  }, [open]);

  useEffect(() => {
    const fetchNotifications = async () => {
      setLoading(true);
      setError("");
      try {
        // Busca apenas notificações relevantes para admin (role_target = 'admin' ou 'all')
        const res = await fetch("/api/notifications", { method: "GET" });
        if (!res.ok) throw new Error("Erro ao buscar notificações");
        const data = await res.json();
        setNotifications(data.filter((n: any) => n.role_target === 'admin' || n.role_target === 'all'));
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    if (open) fetchNotifications();
  }, [open]);

  // Agrupa notificações por categoria
  const agrupadas = categorias.reduce<Record<string, Notification[]>>((acc, cat) => {
    acc[cat.key] = notifications.filter((n) => getCategoria(n) === cat.key);
    return acc;
  }, {});

  // Badge de não lidas por categoria
  const unreadByCat = (cat: string) => agrupadas[cat]?.filter((n) => !n.read_at).length || 0;
  const unreadCount = Object.values(agrupadas).reduce((sum, arr) => sum + arr.filter((n) => !n.read_at).length, 0);

  return (
    <div className="relative">
      <Button variant="ghost" size="icon" onClick={() => setOpen((v) => !v)} aria-label="Notificações">
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full text-xs px-1.5 py-0.5">
            {unreadCount}
          </span>
        )}
      </Button>
      {open && (
        <div className="absolute right-0 mt-2 w-96 bg-background border rounded-md shadow-lg z-50">
          <div className="p-4 border-b font-semibold">Notificações</div>
          <div className="flex border-b">
            {categorias.map((cat) => (
              <button
                key={cat.key}
                className={`flex-1 px-3 py-2 text-sm font-medium border-b-2 transition-colors ${categoriaAtiva === cat.key ? "border-primary text-primary" : "border-transparent text-muted-foreground"}`}
                onClick={() => setCategoriaAtiva(cat.key)}
              >
                {cat.label}
                {unreadByCat(cat.key) > 0 && (
                  <span className="ml-1 inline-block bg-red-500 text-white rounded-full text-xs px-1.5 py-0.5">{unreadByCat(cat.key)}</span>
                )}
              </button>
            ))}
          </div>
          <div className="max-h-72 overflow-y-auto">
            {loading ? (
              <div className="p-4 text-center text-muted-foreground">Carregando...</div>
            ) : error ? (
              <div className="p-4 text-red-500">{error}</div>
            ) : agrupadas[categoriaAtiva]?.length === 0 ? (
              <div className="p-4 text-muted-foreground text-center">Nenhuma notificação nesta categoria</div>
            ) : (
              agrupadas[categoriaAtiva].map((n) => (
                <div key={n.id} className={`p-3 border-b last:border-b-0 ${!n.read_at ? "bg-accent" : ""}`}>
                  <div className="font-medium">{n.title}</div>
                  <div className="text-xs text-muted-foreground">{n.message}</div>
                  <div className="text-xs text-right text-muted-foreground mt-1">
                    {n.created_at ? new Date(n.created_at).toLocaleString() : ""}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
