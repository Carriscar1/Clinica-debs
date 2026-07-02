"use client";

import { useEffect, useState, useRef } from "react";
import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";
import SalaDeEsperaIlustrada from "./SalaDeEsperaIlustrada";

const CORES_TAPETE = [
  { nome: "Terracota", valor: "#b5623f" },
  { nome: "Mostarda", valor: "#c99a3d" },
  { nome: "Verde-oliva", valor: "#6b7a4f" },
  { nome: "Vinho", valor: "#7c3b46" },
  { nome: "Areia", valor: "#bfab84" },
];

const CAMINHO_FOTO = "/scene/ambiente.jpg";

export default function SalaDeEspera({
  corTapeteInicial,
  onSalvarCor,
  interativo = true,
  className,
}: {
  corTapeteInicial: string;
  onSalvarCor?: (cor: string) => void;
  interativo?: boolean;
  className?: string;
}) {
  const [temFoto, setTemFoto] = useState<boolean | null>(null); // null = ainda checando

  useEffect(() => {
    const img = new Image();
    img.onload = () => setTemFoto(true);
    img.onerror = () => setTemFoto(false);
    img.src = CAMINHO_FOTO;
  }, []);

  // Enquanto checa (ou se não achar a foto), usa a versão ilustrada —
  // que já é o comportamento atual do app, sem quebrar nada.
  if (temFoto !== true) {
    return (
      <SalaDeEsperaIlustrada
        corTapeteInicial={corTapeteInicial}
        onSalvarCor={onSalvarCor}
        interativo={interativo}
        className={className}
      />
    );
  }

  return (
    <SalaDeEsperaFoto
      corTapeteInicial={corTapeteInicial}
      onSalvarCor={onSalvarCor}
      interativo={interativo}
      className={className}
    />
  );
}

function SalaDeEsperaFoto({
  corTapeteInicial,
  onSalvarCor,
  interativo,
  className,
}: {
  corTapeteInicial: string;
  onSalvarCor?: (cor: string) => void;
  interativo: boolean;
  className?: string;
}) {
  const [corTapete, setCorTapete] = useState(corTapeteInicial);
  const [mostrarCores, setMostrarCores] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 90, damping: 18 });
  const springY = useSpring(y, { stiffness: 90, damping: 18 });

  // leve efeito de paralaxe na foto, como se a câmera reagisse ao toque
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

  function escolherCor(c: (typeof CORES_TAPETE)[number]) {
    setCorTapete(c.valor);
    setMostrarCores(false);
    onSalvarCor?.(c.valor);
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

      {/* Overlay de recoloração do tapete, alinhado sobre a foto real.
          Ajuste top/left/width/height em % pra encaixar no seu tapete. */}
      <motion.button
        type="button"
        aria-label="Trocar a cor do tapete"
        onClick={() => interativo && setMostrarCores((v) => !v)}
        className="absolute mix-blend-color"
        style={{
          left: "0%",
          top: "63%",
          width: "100%",
          height: "30%",
          borderRadius: "0",
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

      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 55%, rgba(5,10,16,0.5) 100%)",
        }}
      />

      {interativo && (
        <>
          <div className="absolute top-3 right-3 text-mist-300/70 text-[10px] sm:text-xs bg-ink-950/40 backdrop-blur px-2 py-1 rounded-full">
            toque no tapete para trocar a cor · arraste na sala
          </div>

          {mostrarCores && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2 bg-ink-950/70 backdrop-blur px-3 py-2 rounded-full"
            >
              {CORES_TAPETE.map((c) => (
                <button
                  key={c.valor}
                  onClick={() => escolherCor(c)}
                  title={c.nome}
                  className="w-6 h-6 rounded-full border-2 border-white/30 hover:scale-110 transition-transform"
                  style={{ backgroundColor: c.valor }}
                />
              ))}
            </motion.div>
          )}
        </>
      )}
    </div>
  );
}
