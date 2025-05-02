// Este arquivo é apenas para documentação
// Você precisa remover manualmente as referências ao NextAuth no seu projeto

/*
Referências comuns ao NextAuth que devem ser removidas:

1. Arquivos:
   - pages/api/auth/[...nextauth].ts ou app/api/auth/[...nextauth]/route.ts
   - Qualquer arquivo que importe de 'next-auth'
   - Qualquer arquivo que importe de 'next-auth/react'

2. Componentes:
   - <SessionProvider> em _app.tsx ou layout.tsx
   - useSession() hooks
   - getServerSession() em funções do servidor

3. Middleware:
   - Qualquer referência a NextAuth no middleware.ts

4. Configuração:
   - NEXTAUTH_SECRET e NEXTAUTH_URL em .env ou .env.local
*/

export {}
