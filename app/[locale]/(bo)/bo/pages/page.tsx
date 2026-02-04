import { prisma } from "@/app/lib/prisma";
import { ensureFoPagesExist } from "@/app/lib/pages";
import { getTranslations } from "next-intl/server";
import PagesAdminClient from "./pages-admin-client";
import BoPage from "../../components/BoPage";

type Props = { params: Promise<{ locale: string }> };

type PageRow = {
  path: string;
  name: string | null;
  status: "ACTIVE" | "UNDER_CONSTRUCTION" | "INACTIVE";
  updatedAt: string;
};

export default async function BoPagesPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations("bo.pages");

  // crea/actualiza registros para reflejar las páginas FO actuales
  await ensureFoPagesExist();

  const pages = await prisma.page.findMany({
    orderBy: { path: "asc" },
    select: { path: true, name: true, status: true, updatedAt: true },
  });

  const serializablePages: PageRow[] = pages.map((p) => ({
    path: p.path,
    name: p.name,
    status: p.status as PageRow["status"],
    updatedAt: p.updatedAt.toISOString(),
  }));

  return (
    <BoPage title={t("title")}>
      <PagesAdminClient locale={locale} pages={serializablePages} />
    </BoPage>
  );
}
