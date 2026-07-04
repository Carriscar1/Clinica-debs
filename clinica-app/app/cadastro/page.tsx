"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import FundoSalaDesfocado from "@/components/FundoSalaDesfocado";
import { Botao } from "@/components/Botao";

export default function CadastroPage() {
  const router = useRouter();
  const [nome, setNome] = useState("");
  const [crp, setCrp] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [ehChefe, setEhChefe] = useState(true);
  const [emailChefe, setEmailChefe] = useState("");
  const [erro, setErro] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(false);

  async function handleCadastro(e: React.FormEvent) {
    e.preventDefault();
    setErro(null);
    setCarregando(true);

    let chefeId: string | null = null;

    // Se a psicóloga não é chefe, busca o id da chefe pelo e-mail informado.
    // Passa por uma API route porque, nesse momento, a pessoa ainda não
    // está autenticada (está se cadastrando agora), então não tem
    // permissão de leitura direta na tabela de perfis.
    if (!ehChefe) {
      const resposta = await fetch("/api/buscar-chefe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: emailChefe }),
      });

      const resultado = await resposta.json();

      if (!resposta.ok || !resultado.encontrada) {
        setErro("Não encontramos uma psicóloga chefe com esse e-mail.");
        setCarregando(false);
        return;
      }
      chefeId = resultado.id;
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password: senha,
      options: {
        data: {
          nome,
          crp,
          role: ehChefe ? "chefe" : "psicologa",
          chefe_id: chefeId,
        },
      },
    });

    setCarregando(false);

    if (error) {
      setErro(error.message);
      return;
    }

    // Sem verificação de e-mail: login automático já ocorre pelo signUp
    if (data.session) {
      router.push("/home");
    } else {
      router.push("/login");
    }
  }

  return (
    <div className="relative min-h-[100dvh] flex items-center justify-center px-6 py-12">
      <FundoSalaDesfocado />

      <div className="relative w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="font-display text-3xl text-mist-100 mb-2">
            Criar conta
          </h1>
          <p className="text-mist-300 text-sm">
            Cadastre seu acesso profissional
          </p>
        </div>

        <form
          onSubmit={handleCadastro}
          className="bg-ink-900/80 backdrop-blur-md border border-ink-800 rounded-2xl p-6 shadow-soft space-y-4"
        >
          {erro && (
            <div className="bg-clay/10 border border-clay/40 text-clay text-sm rounded-lg px-3 py-2">
              {erro}
            </div>
          )}

          <div>
            <label className="block text-mist-300 text-xs mb-1.5">
              Nome completo
            </label>
            <input
              required
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              className="w-full bg-ink-800 border border-ink-700 rounded-lg px-3 py-2.5 text-mist-100 text-base sm:text-sm outline-none focus:border-clay"
              placeholder="Dra. Nome Sobrenome"
            />
          </div>

          <div>
            <label className="block text-mist-300 text-xs mb-1.5">
              CRP (opcional)
            </label>
            <input
              value={crp}
              onChange={(e) => setCrp(e.target.value)}
              className="w-full bg-ink-800 border border-ink-700 rounded-lg px-3 py-2.5 text-mist-100 text-base sm:text-sm outline-none focus:border-clay"
              placeholder="00/00000"
            />
          </div>

          <div>
            <label className="block text-mist-300 text-xs mb-1.5">
              E-mail
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-ink-800 border border-ink-700 rounded-lg px-3 py-2.5 text-mist-100 text-base sm:text-sm outline-none focus:border-clay"
              placeholder="voce@email.com"
            />
          </div>

          <div>
            <label className="block text-mist-300 text-xs mb-1.5">
              Senha
            </label>
            <input
              type="password"
              required
              minLength={6}
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              className="w-full bg-ink-800 border border-ink-700 rounded-lg px-3 py-2.5 text-mist-100 text-base sm:text-sm outline-none focus:border-clay"
              placeholder="mín. 6 caracteres"
            />
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="ehChefe"
              checked={ehChefe}
              onChange={(e) => setEhChefe(e.target.checked)}
              className="accent-clay w-4 h-4"
            />
            <label htmlFor="ehChefe" className="text-mist-300 text-xs">
              Sou a psicóloga responsável (chefe) da clínica
            </label>
          </div>

          {!ehChefe && (
            <div>
              <label className="block text-mist-300 text-xs mb-1.5">
                E-mail da psicóloga chefe
              </label>
              <input
                type="email"
                required
                value={emailChefe}
                onChange={(e) => setEmailChefe(e.target.value)}
                className="w-full bg-ink-800 border border-ink-700 rounded-lg px-3 py-2.5 text-mist-100 text-base sm:text-sm outline-none focus:border-clay"
                placeholder="chefe@clinica.com"
              />
            </div>
          )}

          <Botao type="submit" variante="primario" disabled={carregando} className="w-full">
            {carregando ? "Criando conta..." : "Criar conta"}
          </Botao>

          <p className="text-center text-mist-300 text-xs pt-2">
            Já tem conta?{" "}
            <Link href="/login" className="text-clay hover:underline">
              Entrar
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
