"use client";

import { useState, useRef, useId } from "react";
import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";
import SeletorCorSheet from "./SeletorCorSheet";

const CORES_TAPETE = [
  { nome: "Terracota", valor: "#b5623f", escuro: "#8a4630" },
  { nome: "Mostarda", valor: "#c99a3d", escuro: "#9c7328" },
  { nome: "Verde-oliva", valor: "#6b7a4f", escuro: "#4d5838" },
  { nome: "Vinho", valor: "#7c3b46", escuro: "#5a2530" },
  { nome: "Areia", valor: "#bfab84", escuro: "#8f7d5c" },
];

const CORES_PAREDE = [
  { nome: "Grafite", valor: "#1a2530" },
  { nome: "Petróleo", valor: "#1c333a" },
  { nome: "Verde-musgo", valor: "#26302a" },
  { nome: "Ameixa", valor: "#2a2334" },
  { nome: "Areia-escura", valor: "#332c22" },
];

const CORES_SOFA = [
  { nome: "Azul-marinho", valor: "#22405c", claro: "#3a638a", escuro: "#152c40" },
  { nome: "Grafite", valor: "#3a3f47", claro: "#565c66", escuro: "#24272c" },
  { nome: "Verde-caça", valor: "#3c4a3a", claro: "#566b53", escuro: "#252e24" },
  { nome: "Vinho", valor: "#5a2f38", claro: "#7a4550", escuro: "#3c1f26" },
  { nome: "Camel", valor: "#8a6a4a", claro: "#a68763", escuro: "#5f4830" },
];

export default function SalaDeEsperaIlustrada({
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
  const uid = useId().replace(/:/g, "");
  const [corTapete, setCorTapete] = useState(corTapeteInicial);
  const [corParede, setCorParede] = useState(corParedeInicial || "#1a2530");
  const [corSofaObj, setCorSofaObj] = useState(
    () => CORES_SOFA.find((c) => c.valor === corSofaInicial) || CORES_SOFA[0]
  );
  const [corEscuraTapete, setCorEscuraTapete] = useState(
    CORES_TAPETE.find((c) => c.valor === corTapeteInicial)?.escuro || "#8a4630"
  );
  const [areaAtiva, setAreaAtivaState] = useState<"tapete" | "parede" | "sofa" | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  function setAreaAtiva(
    valor:
      | "tapete"
      | "parede"
      | "sofa"
      | null
      | ((v: "tapete" | "parede" | "sofa" | null) => "tapete" | "parede" | "sofa" | null)
  ) {
    setAreaAtivaState((atual) => {
      const novo = typeof valor === "function" ? valor(atual) : valor;
      onAreaAtivaChange?.(novo !== null);
      return novo;
    });
  }

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 100, damping: 16 });
  const springY = useSpring(y, { stiffness: 100, damping: 16 });

  const cushionTiltL = useTransform(springX, [-150, 150], [-3, 3]);
  const cushionTiltR = useTransform(springX, [-150, 150], [3, -3]);
  const cushionDepthL = useTransform(springY, [-100, 100], [1.03, 0.97]);
  const cushionDepthR = useTransform(springY, [-100, 100], [0.97, 1.03]);
  const lightBg = useTransform([springX, springY], ([lx, ly]: number[]) =>
    `radial-gradient(circle 260px at calc(50% + ${lx * 0.5}px) calc(45% + ${ly * 0.5}px), rgba(240,211,172,0.55), transparent 70%)`
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

  function escolherCorTapete(c: (typeof CORES_TAPETE)[number]) {
    setCorTapete(c.valor);
    setCorEscuraTapete(c.escuro);
    setAreaAtiva(null);
    onSalvarCorTapete?.(c.valor);
  }

  function escolherCorParede(c: (typeof CORES_PAREDE)[number]) {
    setCorParede(c.valor);
    setAreaAtiva(null);
    onSalvarCorParede?.(c.valor);
  }

  function escolherCorSofa(c: (typeof CORES_SOFA)[number]) {
    setCorSofaObj(c);
    setAreaAtiva(null);
    onSalvarCorSofa?.(c.valor);
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
      <svg
        viewBox="0 0 800 500"
        className="absolute inset-0 w-full h-full"
        preserveAspectRatio="xMidYMax slice"
      >
        <defs>
          <linearGradient id={`parede-${uid}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={corParede} stopOpacity="0.9" />
            <stop offset="60%" stopColor={corParede} />
            <stop offset="100%" stopColor="#0f1e2c" />
          </linearGradient>

          <linearGradient id={`piso-${uid}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3a2a20" />
            <stop offset="100%" stopColor="#241811" />
          </linearGradient>

          <linearGradient id={`sofaBase-${uid}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={corSofaObj.claro} />
            <stop offset="45%" stopColor={corSofaObj.valor} />
            <stop offset="100%" stopColor={corSofaObj.escuro} />
          </linearGradient>
          <linearGradient id={`sofaEncosto-${uid}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={corSofaObj.claro} />
            <stop offset="100%" stopColor={corSofaObj.valor} />
          </linearGradient>
          <radialGradient id={`almofadaLuz-${uid}`} cx="35%" cy="25%" r="75%">
            <stop offset="0%" stopColor="#5a86ab" stopOpacity="0.9" />
            <stop offset="45%" stopColor="#274d6e" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#0f2536" stopOpacity="0" />
          </radialGradient>

          <radialGradient id={`tapeteGrad-${uid}`} cx="50%" cy="35%" r="70%">
            <stop offset="0%" stopColor={corTapete} />
            <stop offset="100%" stopColor={corEscuraTapete} />
          </radialGradient>
          <pattern
            id={`tapeteTextura-${uid}`}
            width="6"
            height="6"
            patternUnits="userSpaceOnUse"
            patternTransform="rotate(20)"
          >
            <rect width="6" height="6" fill="transparent" />
            <line x1="0" y1="0" x2="0" y2="6" stroke="#000" strokeOpacity="0.06" strokeWidth="1" />
          </pattern>

          <radialGradient id={`luzAmbiente-${uid}`} cx="50%" cy="15%" r="60%">
            <stop offset="0%" stopColor="#f0d3ac" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#f0d3ac" stopOpacity="0" />
          </radialGradient>

          <filter id={`sombraSuave-${uid}`} x="-30%" y="-30%" width="160%" height="160%">
            <feDropShadow dx="0" dy="8" stdDeviation="10" floodColor="#000" floodOpacity="0.35" />
          </filter>
          <filter id={`sombraTapete-${uid}`} x="-30%" y="-30%" width="160%" height="160%">
            <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#000" floodOpacity="0.3" />
          </filter>
        </defs>

        <rect
          x="0"
          y="0"
          width="800"
          height="330"
          fill={`url(#parede-${uid})`}
          onClick={() => interativo && setAreaAtiva((v) => (v === "parede" ? null : "parede"))}
          style={{ cursor: interativo ? "pointer" : "default" }}
        />
        <rect x="0" y="322" width="800" height="8" fill="#0a1622" opacity="0.6" />
        <rect x="0" y="330" width="800" height="170" fill={`url(#piso-${uid})`} />
        {[0, 1, 2, 3, 4, 5, 6].map((i) => (
          <line
            key={i}
            x1={i * 130}
            y1="330"
            x2={i * 130 - 60}
            y2="500"
            stroke="#000"
            strokeOpacity="0.15"
            strokeWidth="2"
          />
        ))}

        <rect x="345" y="55" width="110" height="75" rx="3" fill="#0d1e2c" stroke="#3a5876" strokeWidth="3" />
        <rect x="352" y="62" width="96" height="61" rx="2" fill="#1c3348" />

        <line x1="660" y1="150" x2="660" y2="330" stroke="#4a3626" strokeWidth="4" />
        <ellipse cx="660" cy="330" rx="22" ry="6" fill="#241811" />
        <path d="M 630 150 L 690 150 L 675 110 L 645 110 Z" fill="#f0d3ac" opacity="0.85" />
        <ellipse cx="660" cy="128" rx="45" ry="55" fill={`url(#luzAmbiente-${uid})`} />

        <rect x="60" y="70" width="90" height="140" rx="4" fill="#2a4560" stroke="#0f1e2c" strokeWidth="5" />
        <line x1="105" y1="70" x2="105" y2="210" stroke="#0f1e2c" strokeWidth="4" />
        <line x1="60" y1="140" x2="150" y2="140" stroke="#0f1e2c" strokeWidth="4" />
        <rect x="60" y="70" width="90" height="140" fill="#e8c9a8" opacity="0.06" />

        <motion.g
          onClick={() => interativo && setAreaAtiva((v) => (v === "tapete" ? null : "tapete"))}
          style={{ cursor: interativo ? "pointer" : "default" }}
          whileTap={interativo ? { scale: 0.98 } : undefined}
        >
          <ellipse
            cx="400"
            cy="430"
            rx="230"
            ry="52"
            fill={`url(#tapeteGrad-${uid})`}
            filter={`url(#sombraTapete-${uid})`}
          />
          <ellipse cx="400" cy="430" rx="230" ry="52" fill={`url(#tapeteTextura-${uid})`} />
          <ellipse
            cx="400"
            cy="430"
            rx="230"
            ry="52"
            fill="none"
            stroke={corEscuraTapete}
            strokeOpacity="0.5"
            strokeWidth="2"
          />
          <ellipse
            cx="400"
            cy="416"
            rx="190"
            ry="34"
            fill="none"
            stroke="#fff"
            strokeOpacity="0.08"
            strokeWidth="6"
          />
        </motion.g>

        <rect x="230" y="410" width="10" height="22" rx="2" fill="#12222f" />
        <rect x="560" y="410" width="10" height="22" rx="2" fill="#12222f" />

        <g filter={`url(#sombraSuave-${uid})`}>
          <rect x="215" y="330" width="370" height="95" rx="26" fill={`url(#sofaBase-${uid})`} />
        </g>

        <rect x="205" y="235" width="390" height="120" rx="30" fill={`url(#sofaEncosto-${uid})`} />
        <rect x="205" y="235" width="390" height="120" rx="30" fill={`url(#almofadaLuz-${uid})`} />

        <rect x="195" y="290" width="55" height="130" rx="20" fill={corSofaObj.escuro} />
        <rect x="550" y="290" width="55" height="130" rx="20" fill={corSofaObj.escuro} />
        <rect x="195" y="290" width="55" height="130" rx="20" fill={`url(#almofadaLuz-${uid})`} />
        <rect x="550" y="290" width="55" height="130" rx="20" fill={`url(#almofadaLuz-${uid})`} />

        <motion.g style={{ rotate: cushionTiltL, scaleY: cushionDepthL, originX: 0.35, originY: 1 }}>
          <rect x="260" y="260" width="130" height="105" rx="22" fill={corSofaObj.escuro} />
          <rect x="260" y="260" width="130" height="105" rx="22" fill={`url(#almofadaLuz-${uid})`} />
          <rect x="260" y="260" width="130" height="105" rx="22" fill="none" stroke="#0d1e2c" strokeOpacity="0.5" strokeWidth="2" />
        </motion.g>

        <motion.g style={{ rotate: cushionTiltR, scaleY: cushionDepthR, originX: 0.65, originY: 1 }}>
          <rect x="410" y="260" width="130" height="105" rx="22" fill={corSofaObj.escuro} />
          <rect x="410" y="260" width="130" height="105" rx="22" fill={`url(#almofadaLuz-${uid})`} />
          <rect x="410" y="260" width="130" height="105" rx="22" fill="none" stroke="#0d1e2c" strokeOpacity="0.5" strokeWidth="2" />
        </motion.g>

        {/* Área clicável cobrindo o sofá inteiro (encosto + base + braços) */}
        <rect
          x="195"
          y="235"
          width="410"
          height="190"
          fill="transparent"
          onClick={() => interativo && setAreaAtiva((v) => (v === "sofa" ? null : "sofa"))}
          style={{ cursor: interativo ? "pointer" : "default" }}
        />

        <line x1="325" y1="270" x2="325" y2="355" stroke="#0d1e2c" strokeOpacity="0.35" strokeWidth="1.5" />
        <line x1="475" y1="270" x2="475" y2="355" stroke="#0d1e2c" strokeOpacity="0.35" strokeWidth="1.5" />

        <g transform="translate(90, 300)">
          <rect x="-14" y="70" width="28" height="30" rx="3" fill="#1c3348" />
          <path
            d="M 0 70 C -18 40 -22 10 -6 -20 C 4 0 8 20 0 45 C 14 15 20 -10 8 -35 C 22 -8 28 25 12 55 C 6 65 2 70 0 70 Z"
            fill="#4d6b45"
          />
          <path d="M 0 70 C -18 40 -22 10 -6 -20 C 4 0 8 20 0 45" fill="#3c5836" />
        </g>
      </svg>

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
            "radial-gradient(ellipse at center, transparent 55%, rgba(5,10,16,0.55) 100%)",
        }}
      />

      {interativo && (
        <SeletorCorSheet
          aberto={areaAtiva !== null}
          titulo={
            areaAtiva === "tapete"
              ? "Cor do tapete"
              : areaAtiva === "parede"
              ? "Cor da parede"
              : "Cor do sofá"
          }
          opcoes={
            areaAtiva === "tapete" ? CORES_TAPETE : areaAtiva === "parede" ? CORES_PAREDE : CORES_SOFA
          }
          onEscolher={(c) => {
            if (areaAtiva === "tapete") {
              const encontrada = CORES_TAPETE.find((x) => x.valor === c.valor);
              if (encontrada) escolherCorTapete(encontrada);
            } else if (areaAtiva === "parede") {
              const encontrada = CORES_PAREDE.find((x) => x.valor === c.valor);
              if (encontrada) escolherCorParede(encontrada);
            } else {
              const encontrada = CORES_SOFA.find((x) => x.valor === c.valor);
              if (encontrada) escolherCorSofa(encontrada);
            }
          }}
          onFechar={() => setAreaAtiva(null)}
        />
      )}
    </div>
  );
}
