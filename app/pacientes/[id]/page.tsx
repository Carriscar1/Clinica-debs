"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { supabase, Paciente } from "@/lib/supabase";

export default function DetalhePacientePage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [paciente, setPaciente] = useState<Paciente | null>(null);
  const [editando, setEditando] = useState(false);
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    async function carregar() {
      const { data, error } = await supabase
        .from("pacientes")
        .select("*")
        .eq("id", id)
        .single();

      if (!error && data) setPaciente(data);
      setCarregando(false);
    }
    carregar();
  }, [id]);

  async function handleSalvar(e: React.FormEvent) {
    e.preventDefault();
    if (!paciente) return;
    setSalvando(true);

    const { error } = await supabase
      .from("pacientes")
      .update({
        nome: paciente.nome,
        idade: paciente.idade,
        tipo_tratamento: paciente.tipo_tratamento,
        medicamentos: paciente.medicamentos,
        observacoes: paciente.observacoes,
      })
      .eq("id", paciente.id);

    setSalvando(false);
    if (!error) setEditando(false);
  }

  async function handleExcluir() {
    if (!paciente) return;
    const confirmar = window.confirm(
      `Excluir o cadastro de ${paciente.nome}? Essa ação não pode ser desfeita.`
    );
    if (!confirmar) return;

    await supabase.from("pacientes").delete().eq("id", paciente.id);
    router.push("/pacientes");
  }

  if (carregando) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-night-950">
        <p className="text-mist-300 text-sm">Carregando...</p>
      </div>
    );
  }

  if (!paciente) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-night-950">
        <p className="text-mist-300 text-sm">Paciente não encontrado.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-night-950 px-4 sm:px-8 py-6 sm:py-10">
      <div className="max-w-lg mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="font-display text-2xl text-mist-100">
            {paciente.nome}
          </h1>
          {!editando && (
            <button
              onClick={() => setEditando(true)}
              className="text-clay text-xs border border-clay/40 rounded-full px-3 py-1.5"
            >
              Editar
            </button>
          )}
        </div>

        {!editando ? (
          <div className="bg-night-900 border border-night-800 rounded-2xl p-6 space-y-4">
            <Campo label="Idade" valor={paciente.idade ? `${paciente.idade} anos` : "—"} />
            <Campo label="Tipo de tratamento" valor={paciente.tipo_tratamento || "—"} />
            <Campo label="Medicamentos" valor={paciente.medicamentos || "—"} />
            <Campo label="Observações" valor={paciente.observacoes || "—"} multilinha />

            <button
              onClick={handleExcluir}
              className="text-xs text-clay/80 hover:text-clay pt-2"
            >
              Excluir paciente
            </button>
          </div>
        ) : (
          <form
            onSubmit={handleSalvar}
            className="bg-night-900 border border-night-800 rounded-2xl p-6 space-y-4"
          >
            <div>
              <label className="block text-mist-300 text-xs mb-1.5">Nome</label>
              <input
                value={paciente.nome}
                onChange={(e) =>
                  setPaciente({ ...paciente, nome: e.target.value })
                }
                className="w-full bg-night-800 border border-night-700 rounded-lg px-3 py-2.5 text-mist-100 text-sm outline-none focus:border-clay"
              />
            </div>
            <div>
              <label className="block text-mist-300 text-xs mb-1.5">Idade</label>
              <input
                type="number"
                value={paciente.idade ?? ""}
                onChange={(e) =>
                  setPaciente({
                    ...paciente,
                    idade: e.target.value ? parseInt(e.target.value) : null,
                  })
                }
                className="w-full bg-night-800 border border-night-700 rounded-lg px-3 py-2.5 text-mist-100 text-sm outline-none focus:border-clay"
              />
            </div>
            <div>
              <label className="block text-mist-300 text-xs mb-1.5">
                Tipo de tratamento
              </label>
              <input
                value={paciente.tipo_tratamento ?? ""}
                onChange={(e) =>
                  setPaciente({ ...paciente, tipo_tratamento: e.target.value })
                }
                className="w-full bg-night-800 border border-night-700 rounded-lg px-3 py-2.5 text-mist-100 text-sm outline-none focus:border-clay"
              />
            </div>
            <div>
              <label className="block text-mist-300 text-xs mb-1.5">
                Medicamentos
              </label>
              <input
                value={paciente.medicamentos ?? ""}
                onChange={(e) =>
                  setPaciente({ ...paciente, medicamentos: e.target.value })
                }
                className="w-full bg-night-800 border border-night-700 rounded-lg px-3 py-2.5 text-mist-100 text-sm outline-none focus:border-clay"
              />
            </div>
            <div>
              <label className="block text-mist-300 text-xs mb-1.5">
                Observações
              </label>
              <textarea
                rows={4}
                value={paciente.observacoes ?? ""}
                onChange={(e) =>
                  setPaciente({ ...paciente, observacoes: e.target.value })
                }
                className="w-full bg-night-800 border border-night-700 rounded-lg px-3 py-2.5 text-mist-100 text-sm outline-none focus:border-clay resize-none"
              />
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setEditando(false)}
                className="flex-1 border border-night-700 text-mist-300 text-sm rounded-lg py-2.5"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={salvando}
                className="flex-1 bg-clay hover:bg-clay/90 text-white text-sm rounded-lg py-2.5 disabled:opacity-60"
              >
                {salvando ? "Salvando..." : "Salvar alterações"}
              </button>
            </div>
          </form>
        )}

        <button
          onClick={() => router.push("/pacientes")}
          className="mt-6 text-mist-300 text-xs hover:text-clay"
        >
          ← Voltar para a lista
        </button>
      </div>
    </div>
  );
}

function Campo({
  label,
  valor,
  multilinha,
}: {
  label: string;
  valor: string;
  multilinha?: boolean;
}) {
  return (
    <div>
      <p className="text-mist-300 text-xs mb-1">{label}</p>
      <p
        className={`text-mist-100 text-sm ${
          multilinha ? "whitespace-pre-wrap leading-relaxed" : ""
        }`}
      >
        {valor}
      </p>
    </div>
  );
}
