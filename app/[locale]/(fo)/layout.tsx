import { ReactNode } from "react";
import FoShellClient from "./FoShellClient";
import { FO_PAGES, getFoPageStatus } from "@/app/lib/pages";

export default async function FoLayout({ children }: { children: ReactNode }) {
  const entries = await Promise.all(
    FO_PAGES.map(async (p) => [p.path, await getFoPageStatus(p.path)] as const),
  );

  const pageStatuses = Object.fromEntries(entries);

  return <FoShellClient pageStatuses={pageStatuses}>{children}</FoShellClient>;
}
