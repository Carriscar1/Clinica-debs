-- Rode isso SÓ SE você já executou o schema que te mandei antes
-- (o que não tinha as colunas "email" e "cor_tapete").
-- Se ainda não criou as tabelas, ignore este arquivo e use supabase-schema.sql direto.

alter table profiles add column if not exists email text;
alter table profiles add column if not exists cor_tapete text default '#c97b5e';

-- Recria a função do trigger com os novos campos
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

-- Garante as policies (idempotente: apaga e recria)
drop policy if exists "profiles_select_authenticated" on profiles;
create policy "profiles_select_authenticated"
  on profiles for select to authenticated using (true);

drop policy if exists "profiles_update_own" on profiles;
create policy "profiles_update_own"
  on profiles for update to authenticated using (id = auth.uid());
