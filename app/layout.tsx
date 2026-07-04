import type { Metadata, Viewport } from "next";
import "./globals.css";
import RegistrarServiceWorker from "@/components/RegistrarServiceWorker";

export const metadata: Metadata = {
  title: "Consultório | Gestão de Pacientes",
  description: "Aplicativo de gestão de pacientes para clínicas de psicologia",
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
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
      <body>
        {children}
        <RegistrarServiceWorker />
        <div
          className="fixed left-1/2 -translate-x-1/2 z-[60] pointer-events-none select-none"
          style={{ top: "calc(env(safe-area-inset-top) + 4px)" }}
        >
          <span className="text-[9px] text-mist-300/40 tracking-wide">
            para você, Débora 🤍
          </span>
        </div>
      </body>
    </html>
  );
}
