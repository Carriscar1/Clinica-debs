# Clínica — Gestão de Pacientes

App de gestão de pacientes para clínica de psicologia, com hierarquia
chefe/psicóloga, sala de espera interativa na home, e integração com Supabase.

## Passo a passo

### 1. Instalar dependências
```bash
npm install
```

### 2. Configurar o Supabase
1. Copie `.env.local.example` para `.env.local` e preencha com a URL, a
   chave `anon` e a chave `service_role` do seu projeto Supabase
   (Settings → API). A `service_role` é nova nesta versão — necessária
   pra API `/api/buscar-chefe` funcionar (veja explicação mais abaixo).
   **Nunca** exponha a `service_role` com o prefixo `NEXT_PUBLIC_`.
2. Vá em **Authentication → Settings** no painel do Supabase e desative
   **"Confirm email"** (o cadastro já loga direto, sem verificação).
3. No **SQL Editor**, rode o arquivo `supabase-schema.sql` (projeto novo)
   ou os arquivos `supabase-migration*.sql` (se você já rodou uma versão
   anterior do schema).

### 3. Rodar localmente
```bash
npm run dev
```
Acesse `http://localhost:3000`.

### 4. Deploy no Vercel
1. Suba o projeto pro GitHub.
2. Importe o repositório no Vercel.
3. Nas variáveis de ambiente do projeto Vercel, adicione as três:
   `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` e
   `SUPABASE_SERVICE_ROLE_KEY`.
4. Deploy automático a cada push (igual o IASIS).

## Estrutura

```
app/
  login/          → tela de login
  cadastro/        → cadastro (psicóloga chefe ou vinculada a uma chefe)
  home/            → sala de espera interativa + menu
  pacientes/        → lista de pacientes
  pacientes/novo/   → cadastro de paciente
  pacientes/[id]/   → detalhe/edição/exclusão de paciente
  supervisao/       → visão da chefe sobre toda a equipe
components/
  SalaDeEspera.tsx → sofá + tapete interativos (framer-motion)
lib/
  supabase.ts      → cliente Supabase + tipos
  store.ts         → estado global (Zustand)
```

## Como funciona a hierarquia

- No cadastro, a psicóloga marca se é a **chefe** da clínica ou se está
  se vinculando a uma chefe já existente (por e-mail).
- **Chefe**: tem pacientes próprios normalmente, e ainda acessa
  `/supervisao`, onde vê todas as psicólogas vinculadas a ela e os
  pacientes de cada uma.
- **Psicóloga comum**: só enxerga e gerencia seus próprios pacientes —
  sem acesso a `/supervisao`.
- Tudo isso é reforçado no banco via **Row Level Security (RLS)**, não
  só na interface — então mesmo que alguém tente acessar dados de
  outra psicóloga direto pela API, o Supabase bloqueia.

## A sala de espera interativa

Na home, sofá, parede e tapete são clicáveis — cada um abre um seletor
de cores (bottom sheet) que salva a preferência da psicóloga no
Supabase (`profiles.cor_sofa`, `cor_parede`, `cor_tapete`).

## Por que existe uma API route (`app/api/buscar-chefe`)

Durante o cadastro, quando uma psicóloga se vincula a uma chefe já
existente, o app precisa confirmar que aquele e-mail pertence a uma
chefe — mas nesse momento a pessoa ainda não está autenticada (está
criando a conta agora). Por segurança, a tabela `profiles` só permite
leitura de usuários já autenticados (RLS). Pra resolver isso sem abrir
a tabela inteira pra qualquer pessoa não-logada, essa busca passa por
uma API route no servidor, que usa a chave `service_role` (nunca
exposta ao navegador) pra confirmar a existência do e-mail e devolver
só o `id` — nada de nome, e-mail ou qualquer outro dado.

## Próximos passos sugeridos
- Agenda de sessões (data/hora, recorrência)
- Anotações de sessão por paciente (histórico cronológico)
- Notificações de próxima sessão
- Upload de foto de perfil da psicóloga
