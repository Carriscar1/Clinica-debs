import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

export type Profile = {
  id: string;
  nome: string;
  crp: string | null;
  role: "chefe" | "psicologa";
  chefe_id: string | null;
  cor_tapete: string | null;
  cor_parede: string | null;
  cor_sofa: string | null;
  created_at: string;
};

export type Paciente = {
  id: string;
  psicologa_id: string;
  nome: string;
  idade: number | null;
  observacoes: string | null;
  medicamentos: string | null;
  tipo_tratamento: string | null;
  created_at: string;
};
