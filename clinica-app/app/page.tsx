"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function RootPage() {
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) {
        router.replace("/home");
      } else {
        router.replace("/login");
      }
    });
  }, [router]);

  return (
    <div className="min-h-[100dvh] flex items-center justify-center bg-ink-950">
      <p className="text-mist-200 font-body text-sm tracking-wide">
        Carregando...
      </p>
    </div>
  );
}
