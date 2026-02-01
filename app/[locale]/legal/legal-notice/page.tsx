import LegalLayout from "../../components/LegalLayout";
import { getTranslations } from "next-intl/server";

export default async function Page() {
  const t = await getTranslations("legalNotice");

  const email = "arrow.apps.jlv@gmail.com";
  const domain = "https://arrow-blog.vercel.app";

  const Bold = (chunks: React.ReactNode) => <b>{chunks}</b>;

  return (
    <LegalLayout title={t("title")}>
      <p>{t.rich("owner", { b: Bold })}</p>
      <p>{t.rich("email", { b: Bold, email })}</p>
      <p>{t.rich("activity", { b: Bold })}</p>
      <p>{t.rich("domain", { b: Bold, domain })}</p>

      <p>{t("p1")}</p>
      <p>{t("p2")}</p>
      <p>{t("p3")}</p>
    </LegalLayout>
  );
}
