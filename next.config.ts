import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin(); // usa i18n/request.ts por defecto

const nextConfig: NextConfig = {
  // Si estás en Next 15, esto evita problemas con Turbopack en algunos casos:
  turbopack: {}
};

export default withNextIntl(nextConfig);
