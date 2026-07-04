-- Rode isso no SQL Editor do Supabase — adiciona a personalização
-- de cor do sofá (sem afetar dados já existentes).

alter table profiles add column if not exists cor_sofa text default '#22405c';
