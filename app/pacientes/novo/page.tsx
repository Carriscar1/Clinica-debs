"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function NovoPacientePage() {
  const router = useRouter();
  const [nome, setNome] = useState("");
  const [idade, setIdade] = useState("");
  const [tipoTratamento, setTipoTratamento] = useState("");
  const [medicamentos, setMedicamentos] = useState("");
  const [observacoes, setObservacoes] = useState("");
  const [erro, setErro] = useState<string | null>(null);
  const [salvando, setSalvando] = useState(false);

  async function handleSalvar(e: React.FormEvent) {
    e.preventDefault();
    setErro(null);
    setSalvando(true);

    const { data: sessionData } = await supabase.auth.getSession();
    if (!sessionData.session) {
      router.replace("/login");
      return;
    }

    const { error } = await supabase.from("pacientes").insert({
      psicologa_id: sessionData.session.user.id,
      nome,
      idade: idade ? parseInt(idade) : null,
      tipo_tratamento: tipoTratamento || null,
      medicamentos: medicamentos || null,
      observacoes: observacoes || null,
    });

    setSalvando(false);

    if (error) {
      setErro("Não foi possível salvar. Tente novamente.");
      return;
    }

    router.push("/pacientes");
  }

  return (
    <div className="min-h-screen bg-night-950 px-4 sm:px-8 py-6 sm:py-10">
      <div className="max-w-lg mx-auto">
        <h1 className="font-display text-2xl text-mist-100 mb-6">
          Novo paciente
        </h1>

        <form
          onSubmit={handleSalvar}
          className="bg-night-900 border border-night-800 rounded-2xl p-6 space-y-4"
        >
          {erro && (
            <div className="bg-clay/10 border border-clay/40 text-clay text-sm rounded-lg px-3 py-2">
              {erro}
            </div>
          )}

          <div>
            <label className="block text-mist-300 text-xs mb-1.5">
              Nome completo *
            </label>
            <input
              required
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              className="w-full bg-night-800 border border-night-700 rounded-lg px-3 py-2.5 text-mist-100 text-sm outline-none focus:border-clay"
            />
          </div>

          <div>
            <label className="block text-mist-300 text-xs mb-1.5">
              Idade
            </label>
            <input
              type="number"
              min={0}
              value={idade}
              onChange={(e) => setIdade(e.target.value)}
              className="w-full bg-night-800 border border-night-700 rounded-lg px-3 py-2.5 text-mist-100 text-sm outline-none focus:border-clay"
            />
          </div>

          <div>
            <label className="block text-mist-300 text-xs mb-1.5">
              Tipo de tratamento
            </label>
            <input
              value={tipoTratamento}
              onChange={(e) => setTipoTratamento(e.target.value)}
              placeholder="ex: Terapia cognitivo-comportamental"
              className="w-full bg-night-800 border border-night-700 rounded-lg px-3 py-2.5 text-mist-100 text-sm outline-none focus:border-clay"
            />
          </div>

          <div>
            <label className="block text-mist-300 text-xs mb-1.5">
              Medicamentos em uso
            </label>
            <input
              value={medicamentos}
              onChange={(e) => setMedicamentos(e.target.value)}
              placeholder="ex: Sertralina 50mg"
              className="w-full bg-night-800 border border-night-700 rounded-lg px-3 py-2.5 text-mist-100 text-sm outline-none focus:border-clay"
            />
          </div>

          <div>
            <label className="block text-mist-300 text-xs mb-1.5">
              Observações
            </label>
            <textarea
              value={observacoes}
              onChange={(e) => setObservacoes(e.target.value)}
              rows={4}
              className="w-full bg-night-800 border border-night-700 rounded-lg px-3 py-2.5 text-mist-100 text-sm outline-none focus:border-clay resize-none"
            />
          </div>

          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={() => router.push("/pacientes")}
              className="flex-1 border border-night-700 text-mist-300 text-sm rounded-lg py-2.5 hover:border-clay/60"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={salvando}
              className="flex-1 bg-clay hover:bg-clay/90 text-white text-sm rounded-lg py-2.5 disabled:opacity-60"
            >
              {salvando ? "Salvando..." : "Salvar paciente"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
