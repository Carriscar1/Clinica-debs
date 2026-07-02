import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Consultório | Gestão de Pacientes",
  description: "Aplicativo de gestão de pacientes para clínicas de psicologia",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Consultório",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#0e1215",
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
