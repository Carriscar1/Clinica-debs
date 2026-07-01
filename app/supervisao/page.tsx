"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase, Profile, Paciente } from "@/lib/supabase";

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
      <div className="min-h-screen flex items-center justify-center bg-night-950">
        <p className="text-mist-300 text-sm">Carregando equipe...</p>
      </div>
    );
  }

  if (acessoNegado) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-night-950 gap-4">
        <p className="text-mist-300 text-sm">
          Essa área é exclusiva da psicóloga chefe.
        </p>
        <button
          onClick={() => router.push("/home")}
          className="text-clay text-sm"
        >
          Voltar para a home
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-night-950 px-4 sm:px-8 py-6 sm:py-10">
      <div className="max-w-2xl mx-auto">
        <h1 className="font-display text-2xl text-mist-100 mb-6">
          Supervisão da equipe
        </h1>

        {equipe.length === 0 ? (
          <p className="text-mist-300 text-sm">
            Nenhuma psicóloga vinculada à sua clínica ainda.
          </p>
        ) : (
          <div className="space-y-4">
            {equipe.map((psi) => (
              <div
                key={psi.id}
                className="bg-night-900 border border-night-800 rounded-2xl p-5"
              >
                <div className="flex items-center justify-between mb-3">
                  <p className="text-mist-100 text-sm font-medium">
                    {psi.nome}
                  </p>
                  <span className="text-mist-300 text-xs">
                    {psi.pacientes.length}{" "}
                    {psi.pacientes.length === 1 ? "paciente" : "pacientes"}
                  </span>
                </div>
                {psi.pacientes.length > 0 && (
                  <ul className="space-y-1">
                    {psi.pacientes.map((p) => (
                      <li
                        key={p.id}
                        className="text-mist-300 text-xs flex justify-between border-t border-night-800 pt-1.5"
                      >
                        <span>{p.nome}</span>
                        <span>{p.tipo_tratamento || "—"}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        )}

        <button
          onClick={() => router.push("/home")}
          className="mt-8 text-mist-300 text-xs hover:text-clay"
        >
          ← Voltar para a sala de espera
        </button>
      </div>
    </div>
  );
}
