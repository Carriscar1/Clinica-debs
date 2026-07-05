"use client";

import { useEffect, useState, useRef } from "react";
import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";
import SalaDeEsperaIlustrada from "./SalaDeEsperaIlustrada";
import SeletorCorSheet from "./SeletorCorSheet";

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
  { nome: "Azul-marinho", valor: "#22405c", imagem: "/scene/ambiente.jpg" },
  { nome: "Grafite", valor: "#3a3f47", imagem: "/scene/ambiente-sofa-grafite.jpg" },
  { nome: "Verde-caça", valor: "#3c4a3a", imagem: "/scene/ambiente-sofa-verde.jpg" },
  { nome: "Vinho", valor: "#5a2f38", imagem: "/scene/ambiente-sofa-vinho.jpg" },
  { nome: "Camel", valor: "#8a6a4a", imagem: "/scene/ambiente-sofa-camel.jpg" },
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
  const [fotosSofaDisponiveis, setFotosSofaDisponiveis] = useState<Record<string, boolean>>(
    () => {
      // A cor padrão (que usa a própria ambiente.jpg) já nasce marcada
      // como disponível, sem precisar esperar nenhum carregamento —
      // isso evita um lampejo do tingimento antigo logo na abertura.
      const inicial: Record<string, boolean> = {};
      CORES_SOFA.forEach((c) => {
        if (c.imagem === CAMINHO_FOTO) inicial[c.valor] = true;
      });
      return inicial;
    }
  );
  const containerRef = useRef<HTMLDivElement>(null);

  // Verifica, uma vez, quais fotos específicas de cada cor do sofá já
  // existem — assim que uma imagem real for adicionada, o app troca
  // pra ela automaticamente. Enquanto não existir, usa o tingimento
  // por cima da foto padrão (comportamento atual, nunca quebra).
  useEffect(() => {
    CORES_SOFA.forEach((c) => {
      if (c.imagem === CAMINHO_FOTO) return; // já marcada como disponível acima
      const img = new Image();
      img.onload = () => setFotosSofaDisponiveis((prev) => ({ ...prev, [c.valor]: true }));
      img.onerror = () => setFotosSofaDisponiveis((prev) => ({ ...prev, [c.valor]: false }));
      img.src = c.imagem;
    });
  }, []);

  const corSofaAtual = CORES_SOFA.find((c) => c.valor === corSofa);
  const temFotoDoSofa = !!corSofaAtual && fotosSofaDisponiveis[corSofa] === true;
  const imagemFundo = temFotoDoSofa && corSofaAtual ? corSofaAtual.imagem : CAMINHO_FOTO;

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

  // Antes, esse efeito de luz recalculava uma string de gradiente CSS
  // inteira a cada frame (propriedade "background"), o que força o
  // navegador a repintar tudo sem parar — pesado demais, especialmente
  // no Android. Agora o gradiente é fixo (calculado uma única vez) e
  // só a POSIÇÃO se move via "transform", que a GPU acelera de graça.
  const luzX = useTransform(springX, (v) => v * 0.6);
  const luzY = useTransform(springY, (v) => v * 0.6);

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
          backgroundImage: `url(${imagemFundo})`,
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

      {/* Área do sofá — clicável sempre. Só aplica o tingimento por cima
          quando ainda não existe uma foto real daquela cor específica;
          assim que a foto existir, a cor já vem certinha da própria
          imagem, sem precisar de nenhum efeito.
          A máscara agora é um gradiente radial em CSS puro (antes usava
          uma imagem PNG externa — se ela falhasse ao carregar em
          produção, o navegador ignorava a máscara e mostrava o
          retângulo inteiro, sem recorte nenhum, virando um "bloco" feio). */}
      <motion.button
        type="button"
        aria-label="Trocar a cor do sofá"
        onClick={() => interativo && setAreaAtiva((v) => (v === "sofa" ? null : "sofa"))}
        className={`absolute ${temFotoDoSofa ? "" : "mix-blend-color"}`}
        style={{
          left: "6%",
          top: "38%",
          width: "88%",
          height: "26%",
          backgroundColor: temFotoDoSofa ? "transparent" : corSofa,
          opacity: temFotoDoSofa ? 1 : 0.42,
          cursor: interativo ? "pointer" : "default",
          border: "none",
          padding: 0,
          ...(temFotoDoSofa
            ? {}
            : {
                WebkitMaskImage:
                  "radial-gradient(ellipse 62% 60% at 50% 48%, black 0%, black 45%, transparent 88%)",
                maskImage:
                  "radial-gradient(ellipse 62% 60% at 50% 48%, black 0%, black 45%, transparent 88%)",
              }),
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
        <div className="absolute inset-0 pointer-events-none overflow-hidden mix-blend-soft-light">
          <motion.div
            className="absolute rounded-full"
            style={{
              width: 600,
              height: 600,
              left: "50%",
              top: "45%",
              marginLeft: -300,
              marginTop: -300,
              x: luzX,
              y: luzY,
              background:
                "radial-gradient(circle, rgba(240,211,172,0.35), transparent 70%)",
            }}
          />
        </div>
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
            if (areaAtiva === "tapete") escolherCorTapete(c.valor);
            else if (areaAtiva === "parede") escolherCorParede(c.valor);
            else escolherCorSofa(c.valor);
          }}
          onFechar={() => setAreaAtiva(null)}
        />
      )}
    </div>
  );
}
