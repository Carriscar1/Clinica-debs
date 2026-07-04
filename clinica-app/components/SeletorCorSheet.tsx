"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";

type CorOpcao = { nome: string; valor: string };

export default function SeletorCorSheet({
  aberto,
  titulo,
  opcoes,
  onEscolher,
  onFechar,
}: {
  aberto: boolean;
  titulo: string;
  opcoes: CorOpcao[];
  onEscolher: (opcao: CorOpcao) => void;
  onFechar: () => void;
}) {
  // Só renderiza o portal depois de montar no navegador — document não
  // existe durante a renderização no servidor (Next.js SSR).
  const [montado, setMontado] = useState(false);
  useEffect(() => setMontado(true), []);

  if (!montado) return null;

  return createPortal(
    <AnimatePresence>
      {aberto && (
        <>
          {/* Fundo escurecido — cobre tudo, inclusive cards e menu inferior */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onFechar}
            className="fixed inset-0 z-[100] bg-black/60"
          />

          {/* Bottom sheet — renderizado direto no <body>, fora de qualquer
              contêiner "fixed" aninhado, garantindo que sempre fica acima
              de qualquer outra camada da página (ex: menu inferior) */}
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 320 }}
            className="fixed left-0 right-0 bottom-0 z-[101] bg-ink-900 border-t border-ink-700 rounded-t-3xl px-5 pt-3 shadow-soft"
            style={{ paddingBottom: "calc(1.75rem + env(safe-area-inset-bottom))" }}
          >
            <div className="w-10 h-1 bg-ink-700 rounded-full mx-auto mb-5" />
            <p className="text-mist-100 text-sm font-semibold text-center mb-5">{titulo}</p>
            <div className="flex gap-4 justify-center flex-wrap pb-1">
              {opcoes.map((c) => (
                <button
                  key={c.valor}
                  onClick={() => onEscolher(c)}
                  className="flex flex-col items-center gap-1.5 active:scale-95 transition-transform"
                >
                  <span
                    className="w-12 h-12 rounded-full border-2 border-white/20"
                    style={{ backgroundColor: c.valor }}
                  />
                  <span className="text-mist-300 text-[10px]">{c.nome}</span>
                </button>
              ))}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body
  );
}
