import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type NotificationCategory = {
  key: string
  label: string
}

const DEFAULT_CATEGORIES: NotificationCategory[] = [
  { key: "sistema", label: "Sistema" },
  { key: "usuarios", label: "Usuários" },
  { key: "metricas", label: "Métricas" },
  { key: "outros", label: "Outros" },
];

export function CategoriasConfig() {
  const [categories, setCategories] = useState<NotificationCategory[]>(
    () => JSON.parse(localStorage.getItem("notificationCategories") || "null") || DEFAULT_CATEGORIES
  );
  const [editing, setEditing] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");

  const handleEdit = (key: string, label: string) => {
    setEditing(key);
    setEditValue(label);
  };

  const handleSave = () => {
    setCategories((prev: NotificationCategory[]) => {
      const updated = prev.map((cat: NotificationCategory) =>
        cat.key === editing ? { ...cat, label: editValue } : cat
      );
      localStorage.setItem("notificationCategories", JSON.stringify(updated));
      return updated;
    });
    setEditing(null);
    setEditValue("");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Configuração das Categorias</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {categories.map((cat: NotificationCategory) => (
            <div key={cat.key} className="flex items-center gap-2">
              <span className="w-32 text-sm font-medium">{cat.key}</span>
              {editing === cat.key ? (
                <>
                  <Input
                    value={editValue}
                    onChange={e => setEditValue(e.target.value)}
                    className="w-48"
                  />
                  <Button size="sm" onClick={handleSave}>
                    Salvar
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => setEditing(null)}>
                    Cancelar
                  </Button>
                </>
              ) : (
                <>
                  <span className="w-48">{cat.label}</span>
                  <Button size="sm" variant="outline" onClick={() => handleEdit(cat.key, cat.label)}>
                    Editar
                  </Button>
                </>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
