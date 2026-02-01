import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";

import "../globals.css";
import { Providers } from "../providers";
import ThemeRegistry from "../ThemeRegistry";
import MuiProviders from "../MuiProviders"; // ajusta ruta
import IntlProvider from "./IntlProvider";
import CookieBanner from "./components/CookieBanner";
import RegisterSW from "./components/RegisterSW";
import LegalFooter from "./components/LegalFooter";

import type { Metadata, Viewport } from "next";

export const metadata: Metadata = {
  title: "Arrow Apps",
  description: "Plataforma web personal",
  manifest: "/manifest.webmanifest",
};

export const viewport: Viewport = {
  themeColor: "#0b1220",
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as any)) notFound();
  setRequestLocale(locale);

  // 👇 Cargamos los mensajes del idioma para el provider cliente
  const messages = (await import(`../../messages/${locale}.json`)).default;

  return (
    <Providers>
      <MuiProviders>
        <IntlProvider locale={locale} messages={messages}>
          <RegisterSW />
          {children}
          <LegalFooter />
          <CookieBanner />
        </IntlProvider>
      </MuiProviders>
    </Providers>
  );
}
