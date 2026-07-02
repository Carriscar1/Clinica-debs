"use client";

import { ReactNode } from "react";
import { useRouter } from "next/navigation";

type Variante = "primario" | "secundario" | "contorno" | "fantasma";

const ESTILOS: Record<Variante, string> = {
  primario:
    "bg-clay hover:bg-clay/90 text-white shadow-soft",
  secundario:
    "bg-sage/15 hover:bg-sage/25 text-sage border border-sage/40",
  contorno:
    "bg-transparent hover:bg-ink-800 text-mist-200 border border-ink-700",
  fantasma:
    "bg-transparent hover:text-clay text-mist-300",
};

export function Botao({
  children,
  onClick,
  type = "button",
  variante = "primario",
  disabled,
  className = "",
}: {
  children: ReactNode;
  onClick?: () => void;
  type?: "button" | "submit";
  variante?: Variante;
  disabled?: boolean;
  className?: string;
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`text-sm font-medium rounded-full px-4 py-2.5 transition-colors disabled:opacity-60 ${ESTILOS[variante]} ${className}`}
    >
      {children}
    </button>
  );
}

export function BotaoVoltar({
  href,
  label = "Voltar",
}: {
  href: string;
  label?: string;
}) {
  const router = useRouter();
  return (
    <button
      onClick={() => router.push(href)}
      className="inline-flex items-center gap-1.5 text-mist-300 hover:text-clay text-xs font-medium border border-ink-700 hover:border-clay/50 rounded-full px-3 py-1.5 transition-colors"
    >
      <span aria-hidden>←</span>
      {label}
    </button>
  );
}
