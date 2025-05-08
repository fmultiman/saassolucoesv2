import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { AdminNotificationsList } from "@/components/admin/admin-notifications-list";
import { NovaMensagemForm } from "./nova-mensagem-form";
import { CategoriasConfig } from "./categorias-config";

export function MensagensNotificacoesTabs() {
  return (
    <Tabs defaultValue="notificacoes" className="space-y-6">
      <TabsList className="w-full flex gap-2">
        <TabsTrigger value="notificacoes">Notificações</TabsTrigger>
        <TabsTrigger value="mensagens">Mensagens</TabsTrigger>
        <TabsTrigger value="configuracoes">Configurações</TabsTrigger>
      </TabsList>
      <TabsContent value="notificacoes">
        <AdminNotificationsList />
      </TabsContent>
      <TabsContent value="mensagens">
        <div className="mb-4">
          <NovaMensagemForm onCreated={() => {}} />
        </div>
        {/* Aqui pode-se colocar a tabela/listagem de mensagens já existentes, se desejar */}
      </TabsContent>
      <TabsContent value="configuracoes">
        <CategoriasConfig />
      </TabsContent>
    </Tabs>
  );
}
