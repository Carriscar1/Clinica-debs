"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { supabase, Paciente } from "@/lib/supabase";
import { Botao, BotaoVoltar } from "@/components/Botao";

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
      <div className="min-h-[100dvh] flex items-center justify-center bg-ink-950">
        <p className="text-mist-300 text-sm">Carregando...</p>
      </div>
    );
  }

  if (!paciente) {
    return (
      <div className="min-h-[100dvh] flex items-center justify-center bg-ink-950">
        <p className="text-mist-300 text-sm">Paciente não encontrado.</p>
      </div>
    );
  }

  return (
    <div className="min-h-[100dvh] bg-ink-950 px-4 sm:px-8 py-6 sm:py-10">
      <div className="max-w-lg mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="font-display text-2xl text-mist-100">
            {paciente.nome}
          </h1>
          {!editando && (
            <Botao onClick={() => setEditando(true)} variante="secundario">
              Editar
            </Botao>
          )}
        </div>

        {!editando ? (
          <div className="bg-ink-900 border border-ink-800 rounded-2xl p-6 space-y-4">
            <Campo label="Idade" valor={paciente.idade ? `${paciente.idade} anos` : "—"} />
            <Campo label="Tipo de tratamento" valor={paciente.tipo_tratamento || "—"} />
            <Campo label="Medicamentos" valor={paciente.medicamentos || "—"} />
            <Campo label="Observações" valor={paciente.observacoes || "—"} multilinha />

            <button
              onClick={handleExcluir}
              className="text-xs text-dusk hover:text-clay pt-2 transition-colors"
            >
              Excluir paciente
            </button>
          </div>
        ) : (
          <form
            onSubmit={handleSalvar}
            className="bg-ink-900 border border-ink-800 rounded-2xl p-6 space-y-4"
          >
            <div>
              <label className="block text-mist-300 text-xs mb-1.5">Nome</label>
              <input
                value={paciente.nome}
                onChange={(e) =>
                  setPaciente({ ...paciente, nome: e.target.value })
                }
                className="w-full bg-ink-800 border border-ink-700 rounded-lg px-3 py-2.5 text-mist-100 text-base sm:text-sm outline-none focus:border-clay"
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
                className="w-full bg-ink-800 border border-ink-700 rounded-lg px-3 py-2.5 text-mist-100 text-base sm:text-sm outline-none focus:border-clay"
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
                className="w-full bg-ink-800 border border-ink-700 rounded-lg px-3 py-2.5 text-mist-100 text-base sm:text-sm outline-none focus:border-clay"
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
                className="w-full bg-ink-800 border border-ink-700 rounded-lg px-3 py-2.5 text-mist-100 text-base sm:text-sm outline-none focus:border-clay"
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
                className="w-full bg-ink-800 border border-ink-700 rounded-lg px-3 py-2.5 text-mist-100 text-base sm:text-sm outline-none focus:border-clay resize-none"
              />
            </div>

            <div className="flex gap-2 pt-2">
              <Botao
                type="button"
                variante="contorno"
                onClick={() => setEditando(false)}
                className="flex-1"
              >
                Cancelar
              </Botao>
              <Botao
                type="submit"
                variante="primario"
                disabled={salvando}
                className="flex-1"
              >
                {salvando ? "Salvando..." : "Salvar alterações"}
              </Botao>
            </div>
          </form>
        )}

        <div className="mt-6">
          <BotaoVoltar href="/pacientes" label="Voltar para a lista" />
        </div>
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
