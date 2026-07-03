"use client";

import SalaDeEspera from "./SalaDeEspera";

export default function FundoSalaDesfocado() {
  return (
    <div className="absolute inset-0 overflow-hidden bg-ink-950">
      <div
        className="absolute inset-0 scale-110"
        style={{ filter: "blur(22px) saturate(1.1) brightness(0.7)" }}
      >
        <SalaDeEspera
          corTapeteInicial="#c97b5e"
          interativo={false}
          className="relative w-full h-full select-none touch-none"
        />
      </div>
      {/* Camada escura extra pra garantir contraste com o formulário */}
      <div className="absolute inset-0 bg-ink-950/55" />
    </div>
  );
}
