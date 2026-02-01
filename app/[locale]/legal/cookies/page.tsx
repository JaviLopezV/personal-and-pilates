import LegalLayout from "../../components/LegalLayout";
import { getTranslations } from "next-intl/server";

export default async function Page() {
  const t = await getTranslations("legalCookies");

  return (
    <LegalLayout title={t("title")}>
      <p>{t("p1")}</p>
      <p>{t("p2")}</p>
      <p>{t("p3")}</p>
    </LegalLayout>
  );
}
