-- Rode isso no SQL Editor do Supabase — adiciona a personalização
-- de cor da parede (sem afetar dados já existentes).

alter table profiles add column if not exists cor_parede text default '#1a2530';
