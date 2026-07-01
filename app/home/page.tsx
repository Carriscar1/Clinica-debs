"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { supabase, Profile } from "@/lib/supabase";
import SalaDeEspera from "@/components/SalaDeEspera";

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
    await supabase
      .from("profiles")
      .update({ cor_tapete: cor })
      .eq("id", profile.id);
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    router.replace("/login");
  }

  if (carregando || !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-night-950">
        <p className="text-mist-200 text-sm">Preparando sua sala...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-night-950 px-4 sm:px-8 py-6 sm:py-10">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
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
          <button
            onClick={handleLogout}
            className="text-mist-300 hover:text-clay text-xs border border-night-700 rounded-full px-3 py-1.5 transition-colors"
          >
            Sair
          </button>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <SalaDeEspera
            corTapeteInicial={profile.cor_tapete || "#c97b5e"}
            onSalvarCor={salvarCorTapete}
          />
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-6">
          <button
            onClick={() => router.push("/pacientes")}
            className="bg-night-900 border border-night-800 hover:border-clay/60 rounded-2xl p-4 text-left transition-colors relative"
          >
            <span className="text-2xl">📋</span>
            <p className="text-mist-100 text-sm mt-2">Meus pacientes</p>
            {totalPacientes !== null && (
              <span className="absolute top-3 right-3 bg-clay/20 text-clay text-[11px] rounded-full px-2 py-0.5">
                {totalPacientes}
              </span>
            )}
          </button>

          <button
            onClick={() => router.push("/pacientes/novo")}
            className="bg-night-900 border border-night-800 hover:border-clay/60 rounded-2xl p-4 text-left transition-colors"
          >
            <span className="text-2xl">➕</span>
            <p className="text-mist-100 text-sm mt-2">Novo paciente</p>
          </button>

          {profile.role === "chefe" && (
            <button
              onClick={() => router.push("/supervisao")}
              className="bg-night-900 border border-night-800 hover:border-clay/60 rounded-2xl p-4 text-left transition-colors"
            >
              <span className="text-2xl">🧭</span>
              <p className="text-mist-100 text-sm mt-2">Supervisão da equipe</p>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
