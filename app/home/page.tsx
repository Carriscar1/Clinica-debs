"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { supabase, Profile } from "@/lib/supabase";
import SalaDeEspera from "@/components/SalaDeEspera";
import { Botao } from "@/components/Botao";

export default function HomePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [totalPacientes, setTotalPacientes] = useState<number | null>(null);

  useEffect(() => {
    async function carregar() {
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData.session) {
        router.replace("/login");
        return;
      }

      const { data: perfilData, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", sessionData.session.user.id)
        .single();

      if (error || !perfilData) {
        router.replace("/login");
        return;
      }

      setProfile(perfilData);

      const { count } = await supabase
        .from("pacientes")
        .select("id", { count: "exact", head: true })
        .eq("psicologa_id", perfilData.id);

      setTotalPacientes(count ?? 0);
      setCarregando(false);
    }

    carregar();
  }, [router]);

  async function salvarCorTapete(cor: string) {
    if (!profile) return;
    await supabase.from("profiles").update({ cor_tapete: cor }).eq("id", profile.id);
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    router.replace("/login");
  }

  if (carregando || !profile) {
    return (
      <div className="min-h-[100dvh] flex items-center justify-center bg-ink-950">
        <p className="text-mist-200 text-sm">Preparando sua sala...</p>
      </div>
    );
  }

  return (
    <div className="relative min-h-[100dvh] overflow-hidden">
      {/* Sala de espera preenchendo a tela inteira, interativa */}
      <SalaDeEspera
        corTapeteInicial={profile.cor_tapete || "#c97b5e"}
        onSalvarCor={salvarCorTapete}
        className="absolute inset-0 w-full h-full select-none touch-none"
      />

      {/* Camada de contraste pra legibilidade do conteúdo por cima */}
      <div className="absolute inset-0 bg-gradient-to-b from-ink-950/75 via-ink-950/20 to-ink-950/85 pointer-events-none" />

      {/* Conteúdo flutuando sobre a cena */}
      <div className="relative z-10 min-h-[100dvh] flex flex-col px-4 sm:px-8 py-6 sm:py-10">
        <div className="max-w-3xl w-full mx-auto flex-1 flex flex-col">
          <div className="flex items-start justify-between">
            <div className="bg-ink-950/40 backdrop-blur-sm rounded-2xl px-4 py-3">
              <p className="text-mist-300 text-xs tracking-wide uppercase mb-1">
                {new Date().toLocaleDateString("pt-BR", {
                  weekday: "long",
                  day: "2-digit",
                  month: "long",
                })}
              </p>
              <h1 className="font-display text-2xl sm:text-3xl text-mist-100">
                Bem-vinda, Dra. {profile.nome.split(" ")[0]}
              </h1>
            </div>
            <Botao
              onClick={handleLogout}
              variante="contorno"
              className="bg-ink-950/40 backdrop-blur-sm"
            >
              Sair
            </Botao>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-auto pt-10"
          >
            <button
              onClick={() => router.push("/pacientes")}
              className="bg-ink-900/70 backdrop-blur-sm border border-ink-700 hover:border-clay/60 rounded-2xl p-4 text-left transition-colors relative"
            >
              <span className="text-2xl">📋</span>
              <p className="text-mist-100 text-sm mt-2">Meus pacientes</p>
              {totalPacientes !== null && (
                <span className="absolute top-3 right-3 bg-clay/25 text-clay text-[11px] rounded-full px-2 py-0.5">
                  {totalPacientes}
                </span>
              )}
            </button>

            <button
              onClick={() => router.push("/pacientes/novo")}
              className="bg-ink-900/70 backdrop-blur-sm border border-ink-700 hover:border-sage/60 rounded-2xl p-4 text-left transition-colors"
            >
              <span className="text-2xl">➕</span>
              <p className="text-mist-100 text-sm mt-2">Novo paciente</p>
            </button>

            {profile.role === "chefe" && (
              <button
                onClick={() => router.push("/supervisao")}
                className="bg-ink-900/70 backdrop-blur-sm border border-ink-700 hover:border-dusk/60 rounded-2xl p-4 text-left transition-colors"
              >
                <span className="text-2xl">🧭</span>
                <p className="text-mist-100 text-sm mt-2">Supervisão da equipe</p>
              </button>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
