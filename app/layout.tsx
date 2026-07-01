import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Consultório | Gestão de Pacientes",
  description: "Aplicativo de gestão de pacientes para clínicas de psicologia",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
