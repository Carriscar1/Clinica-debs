"use client";

import { usePathname, useRouter } from "next/navigation";
import { Home, Users, UserPlus, ShieldCheck } from "lucide-react";

export default function BottomNav({ ehChefe }: { ehChefe: boolean }) {
  const pathname = usePathname();
  const router = useRouter();

  const itens = [
    { href: "/home", label: "Início", icone: Home },
    { href: "/pacientes", label: "Pacientes", icone: Users },
    { href: "/pacientes/novo", label: "Novo", icone: UserPlus },
    ...(ehChefe ? [{ href: "/supervisao", label: "Equipe", icone: ShieldCheck }] : []),
  ];

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-30 bg-ink-950/85 backdrop-blur-lg border-t border-ink-800"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="max-w-md mx-auto flex items-stretch justify-around px-2">
        {itens.map((item) => {
          const ativo =
            item.href === "/pacientes"
              ? pathname === "/pacientes" || /^\/pacientes\/[^/]+$/.test(pathname || "")
              : pathname === item.href;
          const Icone = item.icone;
          return (
            <button
              key={item.href}
              onClick={() => router.push(item.href)}
              className="flex flex-col items-center justify-center gap-1 py-2.5 px-3 min-w-[64px] active:scale-90 transition-transform"
            >
              <Icone
                size={22}
                strokeWidth={ativo ? 2.4 : 1.8}
                className={ativo ? "text-clay" : "text-mist-300"}
              />
              <span
                className={`text-[10px] font-medium ${
                  ativo ? "text-clay" : "text-mist-300"
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
