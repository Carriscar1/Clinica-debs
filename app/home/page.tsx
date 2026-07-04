"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Users, UserPlus, ShieldCheck, LogOut, type LucideIcon } from "lucide-react";
import { supabase, Profile } from "@/lib/supabase";
import SalaDeEspera from "@/components/SalaDeEspera";
import BottomNav from "@/components/BottomNav";

export default function HomePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [totalPacientes, setTotalPacientes] = useState<number | null>(null);
  const [seletorAberto, setSeletorAberto] = useState(false);

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

  async function salvarCorParede(cor: string) {
    if (!profile) return;
    await supabase.from("profiles").update({ cor_parede: cor }).eq("id", profile.id);
  }

  async function salvarCorSofa(cor: string) {
    if (!profile) return;
    await supabase.from("profiles").update({ cor_sofa: cor }).eq("id", profile.id);
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

  const primeiroNome = profile.nome.split(" ")[0];
  const iniciais = profile.nome
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <div className="relative min-h-[100dvh]">
      {/* Fundo fixo — cobre a tela toda independente de scroll do conteúdo */}
      <div className="fixed inset-0 overflow-hidden">
        <SalaDeEspera
          corTapeteInicial={profile.cor_tapete || "#c97b5e"}
          corParedeInicial={profile.cor_parede || "#1a2530"}
          corSofaInicial={profile.cor_sofa || "#22405c"}
          onSalvarCorTapete={salvarCorTapete}
          onSalvarCorParede={salvarCorParede}
          onSalvarCorSofa={salvarCorSofa}
          onAreaAtivaChange={setSeletorAberto}
          className="absolute inset-0 w-full h-full select-none touch-none"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-ink-950/80 via-ink-950/25 to-ink-950/90 pointer-events-none" />
      </div>

      {/* Conteúdo — rola independente se não couber na tela, nunca corta.
          pointer-events-none aqui é essencial: essa camada cobre a tela
          inteira, inclusive o espaço "vazio" sobre o sofá — sem isso, ela
          bloqueia o toque na cena por trás mesmo onde não há nada desenhado. */}
      <div
        className="relative z-10 min-h-[100dvh] flex flex-col px-4 pointer-events-none"
        style={{ paddingTop: "calc(1.25rem + env(safe-area-inset-top))", paddingBottom: "7.5rem" }}
      >
        <div className="max-w-md w-full mx-auto flex-1 flex flex-col pointer-events-none">
          {/* Cabeçalho */}
          <div className="pointer-events-auto flex items-center justify-between gap-3 bg-ink-950/45 backdrop-blur-md rounded-2xl px-4 py-3 border border-ink-800/60 shadow-soft">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 shrink-0 rounded-full bg-clay/20 border border-clay/40 flex items-center justify-center">
                <span className="text-clay text-sm font-semibold">{iniciais}</span>
              </div>
              <div className="min-w-0">
                <p className="text-mist-300 text-[11px] tracking-wide uppercase">
                  {new Date().toLocaleDateString("pt-BR", {
                    weekday: "long",
                    day: "2-digit",
                    month: "long",
                  })}
                </p>
                <h1 className="font-display text-lg sm:text-xl text-mist-100 truncate">
                  Olá, Dra. {primeiroNome}
                </h1>
              </div>
            </div>
            <button
              onClick={handleLogout}
              aria-label="Sair da conta"
              className="shrink-0 w-9 h-9 flex items-center justify-center rounded-full text-mist-300 hover:text-clay active:scale-95 border border-ink-700 hover:border-clay/50 transition-all"
            >
              <LogOut size={16} strokeWidth={2} />
            </button>
          </div>

          <p className="pointer-events-none text-center text-mist-300/70 text-[11px] mt-3 px-4">
            Toque no sofá, na parede ou no tapete da cena pra personalizar as cores
          </p>

          {/* Cards de ação — recolhem com uma animação suave enquanto
              o seletor de cores está aberto, pra nunca disputar espaço
              com o bottom sheet */}
          <motion.div
            animate={
              seletorAberto
                ? { opacity: 0, y: 16, scale: 0.97 }
                : { opacity: 1, y: 0, scale: 1 }
            }
            initial={{ opacity: 0, y: 12 }}
            transition={{ duration: 0.35, ease: "easeInOut" }}
            className={`mt-auto pt-8 space-y-2.5 ${seletorAberto ? "pointer-events-none" : "pointer-events-auto"}`}
          >
            <CartaoAcao
              icone={Users}
              titulo="Meus pacientes"
              subtitulo={
                totalPacientes === null
                  ? "Carregando..."
                  : `${totalPacientes} ${totalPacientes === 1 ? "paciente" : "pacientes"} acompanhados`
              }
              corAcento="clay"
              onClick={() => router.push("/pacientes")}
            />
            <CartaoAcao
              icone={UserPlus}
              titulo="Novo paciente"
              subtitulo="Cadastrar um novo acompanhamento"
              corAcento="sage"
              onClick={() => router.push("/pacientes/novo")}
            />
            {profile.role === "chefe" && (
              <CartaoAcao
                icone={ShieldCheck}
                titulo="Supervisão da equipe"
                subtitulo="Acompanhe as psicólogas vinculadas"
                corAcento="dusk"
                onClick={() => router.push("/supervisao")}
              />
            )}
          </motion.div>
        </div>
      </div>

      <BottomNav ehChefe={profile.role === "chefe"} />
    </div>
  );
}

function CartaoAcao({
  icone: Icone,
  titulo,
  subtitulo,
  corAcento,
  onClick,
}: {
  icone: LucideIcon;
  titulo: string;
  subtitulo: string;
  corAcento: "clay" | "sage" | "dusk";
  onClick: () => void;
}) {
  const cores = {
    clay: "bg-clay/15 text-clay border-clay/30 group-hover:border-clay/60",
    sage: "bg-sage/15 text-sage border-sage/30 group-hover:border-sage/60",
    dusk: "bg-dusk/15 text-dusk border-dusk/30 group-hover:border-dusk/60",
  }[corAcento];

  return (
    <button
      onClick={onClick}
      className="group w-full flex items-center gap-3.5 bg-ink-900/75 backdrop-blur-sm border border-ink-700 hover:border-ink-600 active:scale-[0.98] rounded-2xl px-4 py-3.5 text-left transition-all shadow-soft"
    >
      <div className={`shrink-0 w-11 h-11 rounded-xl border flex items-center justify-center transition-colors ${cores}`}>
        <Icone size={20} strokeWidth={2} />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-mist-100 text-sm font-medium">{titulo}</p>
        <p className="text-mist-300 text-xs mt-0.5 truncate">{subtitulo}</p>
      </div>
    </button>
  );
}
