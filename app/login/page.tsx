"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import FundoSalaDesfocado from "@/components/FundoSalaDesfocado";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setErro(null);
    setCarregando(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password: senha,
    });

    setCarregando(false);

    if (error) {
      setErro("E-mail ou senha incorretos.");
      return;
    }

    router.push("/home");
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center px-6">
      <FundoSalaDesfocado />

      <div className="relative w-full max-w-sm">
        <div className="text-center mb-10">
          <h1 className="font-display text-3xl text-mist-100 mb-2">
            Consultório
          </h1>
          <p className="text-mist-300 text-sm">
            Entre com sua conta profissional
          </p>
        </div>

        <form
          onSubmit={handleLogin}
          className="bg-night-900/80 backdrop-blur-md border border-night-800 rounded-2xl p-6 shadow-soft space-y-4"
        >
          {erro && (
            <div className="bg-clay/10 border border-clay/40 text-clay text-sm rounded-lg px-3 py-2">
              {erro}
            </div>
          )}

          <div>
            <label className="block text-mist-300 text-xs mb-1.5 tracking-wide">
              E-mail
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-night-800 border border-night-700 rounded-lg px-3 py-2.5 text-mist-100 text-sm outline-none focus:border-clay transition-colors"
              placeholder="voce@email.com"
            />
          </div>

          <div>
            <label className="block text-mist-300 text-xs mb-1.5 tracking-wide">
              Senha
            </label>
            <input
              type="password"
              required
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              className="w-full bg-night-800 border border-night-700 rounded-lg px-3 py-2.5 text-mist-100 text-sm outline-none focus:border-clay transition-colors"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={carregando}
            className="w-full bg-clay hover:bg-clay/90 text-white text-sm font-medium rounded-lg py-2.5 transition-colors disabled:opacity-60"
          >
            {carregando ? "Entrando..." : "Entrar"}
          </button>

          <p className="text-center text-mist-300 text-xs pt-2">
            Ainda não tem conta?{" "}
            <Link href="/cadastro" className="text-clay hover:underline">
              Cadastre-se
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
