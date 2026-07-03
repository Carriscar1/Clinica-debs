"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { supabase, Paciente } from "@/lib/supabase";
import { usePerfil } from "@/lib/usePerfil";
import { Botao } from "@/components/Botao";
import BottomNav from "@/components/BottomNav";

export default function PacientesPage() {
  const router = useRouter();
  const { profile, carregando: carregandoPerfil } = usePerfil();
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [busca, setBusca] = useState("");
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    if (!profile) return;
    async function carregar() {
      const { data, error } = await supabase
        .from("pacientes")
        .select("*")
        .eq("psicologa_id", profile!.id)
        .order("nome", { ascending: true });

      if (!error && data) setPacientes(data);
      setCarregando(false);
    }
    carregar();
  }, [profile]);

  const filtrados = pacientes.filter((p) =>
    p.nome.toLowerCase().includes(busca.toLowerCase())
  );

  if (carregandoPerfil || !profile) {
    return (
      <div className="min-h-[100dvh] flex items-center justify-center bg-ink-950">
        <p className="text-mist-300 text-sm">Carregando...</p>
      </div>
    );
  }

  return (
    <div className="min-h-[100dvh] bg-ink-950 px-4 pb-28" style={{ paddingTop: "calc(1.5rem + env(safe-area-inset-top))" }}>
      <div className="max-w-md mx-auto">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h1 className="font-display text-2xl text-mist-100">Pacientes</h1>
            <p className="text-mist-300 text-xs mt-0.5">
              {pacientes.length} {pacientes.length === 1 ? "cadastrado" : "cadastrados"}
            </p>
          </div>
          <Botao onClick={() => router.push("/pacientes/novo")} variante="primario">
            + Novo
          </Botao>
        </div>

        <div className="relative mb-4">
          <Search
            size={16}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-mist-300"
          />
          <input
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            placeholder="Buscar por nome..."
            className="w-full bg-ink-900 border border-ink-800 rounded-xl pl-10 pr-4 py-2.5 text-mist-100 text-base sm:text-sm outline-none focus:border-clay transition-colors"
          />
        </div>

        {carregando ? (
          <p className="text-mist-300 text-sm">Carregando pacientes...</p>
        ) : filtrados.length === 0 ? (
          <div className="text-center py-16 border border-dashed border-ink-800 rounded-2xl">
            <p className="text-mist-300 text-sm">
              {busca ? "Nenhum paciente encontrado." : "Nenhum paciente cadastrado ainda."}
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {filtrados.map((p) => {
              const iniciais = p.nome
                .split(" ")
                .slice(0, 2)
                .map((n) => n[0])
                .join("")
                .toUpperCase();
              return (
                <button
                  key={p.id}
                  onClick={() => router.push(`/pacientes/${p.id}`)}
                  className="w-full text-left bg-ink-900/80 border border-ink-800 hover:border-clay/50 active:scale-[0.98] rounded-2xl px-3.5 py-3 transition-all flex items-center gap-3"
                >
                  <div className="shrink-0 w-10 h-10 rounded-full bg-ink-800 border border-ink-700 flex items-center justify-center">
                    <span className="text-mist-200 text-xs font-semibold">{iniciais}</span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-mist-100 text-sm font-medium truncate">{p.nome}</p>
                    {p.tipo_tratamento && (
                      <p className="text-mist-300 text-xs mt-0.5 truncate">
                        {p.tipo_tratamento}
                      </p>
                    )}
                  </div>
                  {p.idade && (
                    <span className="shrink-0 text-mist-300 text-xs">{p.idade} anos</span>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>

      <BottomNav ehChefe={profile.role === "chefe"} />
    </div>
  );
}
