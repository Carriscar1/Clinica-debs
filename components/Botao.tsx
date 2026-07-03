"use client";

import { ReactNode } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

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
      className={`text-sm font-medium rounded-full px-4 py-2.5 transition-all active:scale-[0.97] disabled:opacity-60 disabled:active:scale-100 ${ESTILOS[variante]} ${className}`}
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
      className="inline-flex items-center gap-1.5 text-mist-300 hover:text-clay active:scale-95 text-xs font-medium border border-ink-700 hover:border-clay/50 rounded-full pl-2.5 pr-3.5 py-1.5 transition-all"
    >
      <ArrowLeft size={14} strokeWidth={2.2} aria-hidden />
      {label}
    </button>
  );
}
