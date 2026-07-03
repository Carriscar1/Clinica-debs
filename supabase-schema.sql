-- ============================================
-- SCHEMA: Clínica de Psicologia
-- ============================================

-- Tabela de perfis (psicólogas)
create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  nome text not null,
  email text,
  crp text,
  role text not null check (role in ('chefe', 'psicologa')) default 'psicologa',
  chefe_id uuid references profiles(id) on delete set null,
  cor_tapete text default '#c97b5e',
  cor_parede text default '#1a2530',
  created_at timestamptz default now()
);

-- Tabela de pacientes
create table pacientes (
  id uuid primary key default gen_random_uuid(),
  psicologa_id uuid not null references profiles(id) on delete cascade,
  nome text not null,
  idade int,
  observacoes text,
  medicamentos text,
  tipo_tratamento text,
  created_at timestamptz default now()
);

-- ============================================
-- TRIGGER: cria profile automático no signup
-- ============================================
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, nome, email, crp, role, chefe_id)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'nome', 'Sem nome'),
    new.email,
    new.raw_user_meta_data->>'crp',
    coalesce(new.raw_user_meta_data->>'role', 'psicologa'),
    nullif(new.raw_user_meta_data->>'chefe_id', '')::uuid
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============================================
-- RLS: Row Level Security
-- ============================================
alter table profiles enable row level security;
alter table pacientes enable row level security;

-- Profiles: qualquer usuário autenticado pode ler perfis
-- (necessário para localizar a chefe pelo e-mail no cadastro,
-- e para a chefe listar sua equipe)
create policy "profiles_select_authenticated"
  on profiles for select
  to authenticated
  using (true);

-- Profiles: usuário só edita o próprio perfil
create policy "profiles_update_own"
  on profiles for update
  to authenticated
  using (id = auth.uid());

-- Pacientes: psicóloga vê os próprios pacientes OU
-- a chefe vê os pacientes de quem está vinculado a ela
create policy "pacientes_select"
  on pacientes for select
  to authenticated
  using (
    psicologa_id = auth.uid()
    or psicologa_id in (
      select id from profiles where chefe_id = auth.uid()
    )
  );

-- Pacientes: só a própria psicóloga cadastra para si mesma
create policy "pacientes_insert"
  on pacientes for insert
  to authenticated
  with check (psicologa_id = auth.uid());

-- Pacientes: só a própria psicóloga edita seus pacientes
create policy "pacientes_update"
  on pacientes for update
  to authenticated
  using (psicologa_id = auth.uid());

-- Pacientes: só a própria psicóloga exclui seus pacientes
create policy "pacientes_delete"
  on pacientes for delete
  to authenticated
  using (psicologa_id = auth.uid());
