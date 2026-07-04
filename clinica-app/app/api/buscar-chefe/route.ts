import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Esta rota roda no servidor (nunca no navegador), então pode usar a
// service_role key com segurança — ela nunca fica exposta ao público.
// É a forma correta de permitir essa busca por e-mail durante o
// cadastro, sem precisar abrir a tabela "profiles" inteira pra
// leitura anônima (o que exporia e-mail/nome de todo mundo via API).

export async function POST(req: NextRequest) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    console.error(
      "SUPABASE_SERVICE_ROLE_KEY não configurada nas variáveis de ambiente."
    );
    return NextResponse.json(
      { encontrada: false, erro: "Configuração do servidor incompleta." },
      { status: 500 }
    );
  }

  const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey);

  const { email } = await req.json();

  if (!email || typeof email !== "string") {
    return NextResponse.json({ encontrada: false });
  }

  const { data, error } = await supabaseAdmin
    .from("profiles")
    .select("id")
    .eq("email", email.trim().toLowerCase())
    .eq("role", "chefe")
    .maybeSingle();

  if (error || !data) {
    return NextResponse.json({ encontrada: false });
  }

  // Retorna só o id — nunca nome, e-mail ou qualquer outro dado da chefe
  return NextResponse.json({ encontrada: true, id: data.id });
}
