"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase, Profile } from "./supabase";

export function usePerfil() {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    let ativo = true;

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

      if (!ativo) return;

      if (error || !perfilData) {
        router.replace("/login");
        return;
      }

      setProfile(perfilData);
      setCarregando(false);
    }

    carregar();
    return () => {
      ativo = false;
    };
  }, [router]);

  return { profile, carregando };
}
