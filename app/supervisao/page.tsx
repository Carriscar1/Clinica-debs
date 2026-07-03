"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase, Profile, Paciente } from "@/lib/supabase";
import { BotaoVoltar } from "@/components/Botao";
import BottomNav from "@/components/BottomNav";

type PsicologaComPacientes = Profile & { pacientes: Paciente[] };

export default function SupervisaoPage() {
  const router = useRouter();
  const [equipe, setEquipe] = useState<PsicologaComPacientes[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [acessoNegado, setAcessoNegado] = useState(false);

  useEffect(() => {
    async function carregar() {
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData.session) {
        router.replace("/login");
        return;
      }

      const { data: perfil } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", sessionData.session.user.id)
        .single();

      if (!perfil || perfil.role !== "chefe") {
        setAcessoNegado(true);
        setCarregando(false);
        return;
      }

      const { data: psicologas } = await supabase
        .from("profiles")
        .select("*")
        .eq("chefe_id", perfil.id);

      const lista = psicologas || [];
      const equipeComPacientes: PsicologaComPacientes[] = [];

      for (const psi of lista) {
        const { data: pacientes } = await supabase
          .from("pacientes")
          .select("*")
          .eq("psicologa_id", psi.id);
        equipeComPacientes.push({ ...psi, pacientes: pacientes || [] });
      }

      setEquipe(equipeComPacientes);
      setCarregando(false);
    }

    carregar();
  }, [router]);

  if (carregando) {
    return (
      <div className="min-h-[100dvh] flex items-center justify-center bg-ink-950">
        <p className="text-mist-300 text-sm">Carregando equipe...</p>
      </div>
    );
  }

  if (acessoNegado) {
    return (
      <div className="min-h-[100dvh] flex flex-col items-center justify-center bg-ink-950 gap-4">
        <p className="text-mist-300 text-sm">
          Essa área é exclusiva da psicóloga chefe.
        </p>
        <BotaoVoltar href="/home" label="Voltar para a home" />
      </div>
    );
  }

  return (
    <div className="min-h-[100dvh] bg-ink-950 px-4 pb-28" style={{ paddingTop: "calc(1.5rem + env(safe-area-inset-top))" }}>
      <div className="max-w-md mx-auto">
        <div className="mb-4">
          <BotaoVoltar href="/home" label="Início" />
        </div>

        <h1 className="font-display text-2xl text-mist-100 mb-1">
          Supervisão da equipe
        </h1>
        <p className="text-mist-300 text-xs mb-6">
          {equipe.length} {equipe.length === 1 ? "psicóloga vinculada" : "psicólogas vinculadas"}
        </p>

        {equipe.length === 0 ? (
          <div className="text-center py-16 border border-dashed border-ink-800 rounded-2xl">
            <p className="text-mist-300 text-sm">
              Nenhuma psicóloga vinculada à sua clínica ainda.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {equipe.map((psi) => {
              const iniciais = psi.nome
                .split(" ")
                .slice(0, 2)
                .map((n) => n[0])
                .join("")
                .toUpperCase();
              return (
                <div
                  key={psi.id}
                  className="bg-ink-900/80 border border-ink-800 rounded-2xl p-4"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="shrink-0 w-9 h-9 rounded-full bg-dusk/15 border border-dusk/30 flex items-center justify-center">
                      <span className="text-dusk text-xs font-semibold">{iniciais}</span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-mist-100 text-sm font-medium truncate">{psi.nome}</p>
                    </div>
                    <span className="shrink-0 text-mist-300 text-xs">
                      {psi.pacientes.length}{" "}
                      {psi.pacientes.length === 1 ? "paciente" : "pacientes"}
                    </span>
                  </div>
                  {psi.pacientes.length > 0 && (
                    <ul className="space-y-1">
                      {psi.pacientes.map((p) => (
                        <li
                          key={p.id}
                          className="text-mist-300 text-xs flex justify-between border-t border-ink-800 pt-1.5"
                        >
                          <span>{p.nome}</span>
                          <span>{p.tipo_tratamento || "—"}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      <BottomNav ehChefe />
    </div>
  );
}
