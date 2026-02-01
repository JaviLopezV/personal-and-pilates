"use client";

import { NextIntlClientProvider } from "next-intl";

export default function IntlProvider({
  locale,
  messages,
  children,
}: {
  locale: string;
  messages: any;
  children: React.ReactNode;
}) {
  return (
    <NextIntlClientProvider
      locale={locale}
      messages={messages}
      timeZone="Europe/Madrid"
    >
      {children}
    </NextIntlClientProvider>
  );
}
