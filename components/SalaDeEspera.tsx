"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from "framer-motion";
import SalaDeEsperaIlustrada from "./SalaDeEsperaIlustrada";

export const CORES_TAPETE = [
  { nome: "Terracota", valor: "#b5623f" },
  { nome: "Mostarda", valor: "#c99a3d" },
  { nome: "Verde-oliva", valor: "#6b7a4f" },
  { nome: "Vinho", valor: "#7c3b46" },
  { nome: "Areia", valor: "#bfab84" },
];

export const CORES_PAREDE = [
  { nome: "Grafite", valor: "#1a2530" },
  { nome: "Petróleo", valor: "#1c333a" },
  { nome: "Verde-musgo", valor: "#26302a" },
  { nome: "Ameixa", valor: "#2a2334" },
  { nome: "Areia-escura", valor: "#332c22" },
];

export const CORES_SOFA = [
  { nome: "Azul-marinho", valor: "#22405c" },
  { nome: "Grafite", valor: "#3a3f47" },
  { nome: "Verde-caça", valor: "#3c4a3a" },
  { nome: "Vinho", valor: "#5a2f38" },
  { nome: "Camel", valor: "#8a6a4a" },
];

const CAMINHO_FOTO = "/scene/ambiente.jpg";

export default function SalaDeEspera({
  corTapeteInicial,
  corParedeInicial,
  corSofaInicial,
  onSalvarCorTapete,
  onSalvarCorParede,
  onSalvarCorSofa,
  onAreaAtivaChange,
  interativo = true,
  className,
}: {
  corTapeteInicial: string;
  corParedeInicial?: string;
  corSofaInicial?: string;
  onSalvarCorTapete?: (cor: string) => void;
  onSalvarCorParede?: (cor: string) => void;
  onSalvarCorSofa?: (cor: string) => void;
  onAreaAtivaChange?: (aberto: boolean) => void;
  interativo?: boolean;
  className?: string;
}) {
  const [temFoto, setTemFoto] = useState<boolean | null>(null);

  useEffect(() => {
    const img = new Image();
    img.onload = () => setTemFoto(true);
    img.onerror = () => setTemFoto(false);
    img.src = CAMINHO_FOTO;
  }, []);

  if (temFoto !== true) {
    return (
      <SalaDeEsperaIlustrada
        corTapeteInicial={corTapeteInicial}
        corParedeInicial={corParedeInicial}
        corSofaInicial={corSofaInicial}
        onSalvarCorTapete={onSalvarCorTapete}
        onSalvarCorParede={onSalvarCorParede}
        onSalvarCorSofa={onSalvarCorSofa}
        onAreaAtivaChange={onAreaAtivaChange}
        interativo={interativo}
        className={className}
      />
    );
  }

  return (
    <SalaDeEsperaFoto
      corTapeteInicial={corTapeteInicial}
      corParedeInicial={corParedeInicial || "#1a2530"}
      corSofaInicial={corSofaInicial || "#22405c"}
      onSalvarCorTapete={onSalvarCorTapete}
      onSalvarCorParede={onSalvarCorParede}
      onSalvarCorSofa={onSalvarCorSofa}
      onAreaAtivaChange={onAreaAtivaChange}
      interativo={interativo}
      className={className}
    />
  );
}

type AreaAtiva = "tapete" | "parede" | "sofa" | null;

function SalaDeEsperaFoto({
  corTapeteInicial,
  corParedeInicial,
  corSofaInicial,
  onSalvarCorTapete,
  onSalvarCorParede,
  onSalvarCorSofa,
  onAreaAtivaChange,
  interativo,
  className,
}: {
  corTapeteInicial: string;
  corParedeInicial: string;
  corSofaInicial: string;
  onSalvarCorTapete?: (cor: string) => void;
  onSalvarCorParede?: (cor: string) => void;
  onSalvarCorSofa?: (cor: string) => void;
  onAreaAtivaChange?: (aberto: boolean) => void;
  interativo: boolean;
  className?: string;
}) {
  const [corTapete, setCorTapete] = useState(corTapeteInicial);
  const [corParede, setCorParede] = useState(corParedeInicial);
  const [corSofa, setCorSofa] = useState(corSofaInicial);
  const [areaAtiva, setAreaAtivaState] = useState<AreaAtiva>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  function setAreaAtiva(valor: AreaAtiva | ((v: AreaAtiva) => AreaAtiva)) {
    setAreaAtivaState((atual) => {
      const novo = typeof valor === "function" ? valor(atual) : valor;
      onAreaAtivaChange?.(novo !== null);
      return novo;
    });
  }

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 90, damping: 18 });
  const springY = useSpring(y, { stiffness: 90, damping: 18 });

  const parallaxX = useTransform(springX, [-150, 150], [-8, 8]);
  const parallaxY = useTransform(springY, [-100, 100], [-6, 6]);
  const parallaxScale = useTransform(springY, [-100, 0, 100], [1.03, 1.0, 1.03]);
  const lightBg = useTransform([springX, springY], ([lx, ly]: number[]) =>
    `radial-gradient(circle 300px at calc(50% + ${lx * 0.6}px) calc(45% + ${ly * 0.6}px), rgba(240,211,172,0.35), transparent 70%)`
  );

  function handlePointerMove(e: React.PointerEvent<HTMLDivElement>) {
    if (!interativo) return;
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    x.set(e.clientX - rect.left - rect.width / 2);
    y.set(e.clientY - rect.top - rect.height / 2);
  }

  function handlePointerLeave() {
    x.set(0);
    y.set(0);
  }

  function escolherCorTapete(cor: string) {
    setCorTapete(cor);
    setAreaAtiva(null);
    onSalvarCorTapete?.(cor);
  }

  function escolherCorParede(cor: string) {
    setCorParede(cor);
    setAreaAtiva(null);
    onSalvarCorParede?.(cor);
  }

  function escolherCorSofa(cor: string) {
    setCorSofa(cor);
    setAreaAtiva(null);
    onSalvarCorSofa?.(cor);
  }

  return (
    <div
      ref={containerRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className={
        className ??
        "relative w-full aspect-[4/3] sm:aspect-[16/9] rounded-3xl overflow-hidden select-none touch-none"
      }
    >
      <motion.div
        className="absolute inset-0"
        style={{
          x: parallaxX,
          y: parallaxY,
          scale: parallaxScale,
          backgroundImage: `url(${CAMINHO_FOTO})`,
          backgroundSize: "cover",
          backgroundPosition: "40% center",
        }}
      />

      {/* Área da parede — recolorável */}
      <motion.button
        type="button"
        aria-label="Trocar a cor da parede"
        onClick={() => interativo && setAreaAtiva((v) => (v === "parede" ? null : "parede"))}
        className="absolute mix-blend-color"
        style={{
          left: "0%",
          top: "0%",
          width: "100%",
          height: "40%",
          backgroundColor: corParede,
          opacity: 0.6,
          cursor: interativo ? "pointer" : "default",
          border: "none",
          padding: 0,
          WebkitMaskImage: "linear-gradient(to bottom, black 70%, transparent 100%)",
          maskImage: "linear-gradient(to bottom, black 70%, transparent 100%)",
        }}
        whileTap={interativo ? { scale: 0.99 } : undefined}
      />

      {/* Área do sofá — recolorável, encaixada entre a parede e o tapete */}
      <motion.button
        type="button"
        aria-label="Trocar a cor do sofá"
        onClick={() => interativo && setAreaAtiva((v) => (v === "sofa" ? null : "sofa"))}
        className="absolute mix-blend-color"
        style={{
          left: "0%",
          top: "40%",
          width: "100%",
          height: "23%",
          backgroundColor: corSofa,
          opacity: 0.5,
          cursor: interativo ? "pointer" : "default",
          border: "none",
          padding: 0,
          WebkitMaskImage:
            "linear-gradient(to bottom, transparent 0%, black 25%, black 75%, transparent 100%)",
          maskImage:
            "linear-gradient(to bottom, transparent 0%, black 25%, black 75%, transparent 100%)",
        }}
        whileTap={interativo ? { scale: 0.98 } : undefined}
      />

      {/* Área do tapete — recolorável */}
      <motion.button
        type="button"
        aria-label="Trocar a cor do tapete"
        onClick={() => interativo && setAreaAtiva((v) => (v === "tapete" ? null : "tapete"))}
        className="absolute mix-blend-color"
        style={{
          left: "0%",
          top: "63%",
          width: "100%",
          height: "30%",
          backgroundColor: corTapete,
          opacity: 0.55,
          cursor: interativo ? "pointer" : "default",
          border: "none",
          padding: 0,
          WebkitMaskImage:
            "linear-gradient(to bottom, transparent 0%, black 30%, black 100%)",
          maskImage:
            "linear-gradient(to bottom, transparent 0%, black 30%, black 100%)",
        }}
        whileTap={interativo ? { scale: 0.98 } : undefined}
      />

      {interativo && (
        <motion.div
          className="absolute inset-0 pointer-events-none mix-blend-soft-light"
          style={{ background: lightBg }}
        />
      )}

      {/* Vinheta puramente decorativa — pointer-events-none é essencial,
          senão ela bloqueia os toques nas áreas clicáveis acima */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 55%, rgba(5,10,16,0.5) 100%)",
        }}
      />

      {interativo && (
        <AnimatePresence>
          {areaAtiva && (
            <>
              {/* Fundo escurecido — cobre tudo, inclusive os cards, deixando
                  claro que é um seletor modal, não um elemento solto na tela */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setAreaAtiva(null)}
                className="fixed inset-0 z-40 bg-black/60"
              />

              {/* Bottom sheet — sobe do fundo da tela, sempre na mesma
                  posição relativa ao aparelho, nunca colide com nada */}
              <motion.div
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "100%" }}
                transition={{ type: "spring", damping: 30, stiffness: 320 }}
                className="fixed left-0 right-0 bottom-0 z-50 bg-ink-900 border-t border-ink-700 rounded-t-3xl px-5 pt-3 shadow-soft"
                style={{ paddingBottom: "calc(1.75rem + env(safe-area-inset-bottom))" }}
              >
                <div className="w-10 h-1 bg-ink-700 rounded-full mx-auto mb-5" />
                <p className="text-mist-100 text-sm font-semibold text-center mb-5">
                  {areaAtiva === "tapete"
                    ? "Cor do tapete"
                    : areaAtiva === "parede"
                    ? "Cor da parede"
                    : "Cor do sofá"}
                </p>
                <div className="flex gap-4 justify-center flex-wrap pb-1">
                  {(areaAtiva === "tapete"
                    ? CORES_TAPETE
                    : areaAtiva === "parede"
                    ? CORES_PAREDE
                    : CORES_SOFA
                  ).map((c) => (
                    <button
                      key={c.valor}
                      onClick={() => {
                        if (areaAtiva === "tapete") escolherCorTapete(c.valor);
                        else if (areaAtiva === "parede") escolherCorParede(c.valor);
                        else escolherCorSofa(c.valor);
                      }}
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
        </AnimatePresence>
      )}
    </div>
  );
}
