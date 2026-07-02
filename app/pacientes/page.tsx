"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase, Paciente } from "@/lib/supabase";
import { Botao, BotaoVoltar } from "@/components/Botao";

export default function PacientesPage() {
  const router = useRouter();
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [busca, setBusca] = useState("");
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    async function carregar() {
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData.session) {
        router.replace("/login");
        return;
      }

      const { data, error } = await supabase
        .from("pacientes")
        .select("*")
        .eq("psicologa_id", sessionData.session.user.id)
        .order("nome", { ascending: true });

      if (!error && data) setPacientes(data);
      setCarregando(false);
    }
    carregar();
  }, [router]);

  const filtrados = pacientes.filter((p) =>
    p.nome.toLowerCase().includes(busca.toLowerCase())
  );

  return (
    <div className="min-h-[100dvh] bg-ink-950 px-4 sm:px-8 py-6 sm:py-10">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="font-display text-2xl text-mist-100">
            Meus pacientes
          </h1>
          <Botao onClick={() => router.push("/pacientes/novo")} variante="primario">
            + Novo
          </Botao>
        </div>

        <input
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          placeholder="Buscar por nome..."
          className="w-full bg-ink-900 border border-ink-800 rounded-xl px-4 py-2.5 text-mist-100 text-base sm:text-sm outline-none focus:border-clay mb-4"
        />

        {carregando ? (
          <p className="text-mist-300 text-sm">Carregando...</p>
        ) : filtrados.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-mist-300 text-sm">
              Nenhum paciente cadastrado ainda.
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {filtrados.map((p) => (
              <button
                key={p.id}
                onClick={() => router.push(`/pacientes/${p.id}`)}
                className="w-full text-left bg-ink-900 border border-ink-800 hover:border-clay/60 rounded-xl px-4 py-3 transition-colors flex items-center justify-between"
              >
                <div>
                  <p className="text-mist-100 text-sm font-medium">
                    {p.nome}
                  </p>
                  {p.tipo_tratamento && (
                    <p className="text-mist-300 text-xs mt-0.5">
                      {p.tipo_tratamento}
                    </p>
                  )}
                </div>
                {p.idade && (
                  <span className="text-mist-300 text-xs">{p.idade} anos</span>
                )}
              </button>
            ))}
          </div>
        )}

        <div className="mt-8">
          <BotaoVoltar href="/home" label="Voltar para a sala de espera" />
        </div>
      </div>
    </div>
  );
}
