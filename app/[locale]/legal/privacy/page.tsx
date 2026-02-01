import LegalLayout from "../../components/LegalLayout";
import { getTranslations } from "next-intl/server";

export default async function Page() {
  const t = await getTranslations("legalPrivacy");

  const Bold = (chunks: React.ReactNode) => <b>{chunks}</b>;

  return (
    <LegalLayout title={t("title")}>
      <p>{t.rich("owner", { b: Bold })}</p>
      <p>{t.rich("email", { b: Bold })}</p>
      <p>{t.rich("site", { b: Bold })}</p>

      <p>{t("p1")}</p>

      <p>{t.rich("dataTitle", { b: Bold })}</p>
      <ul>
        <li>{t("data1")}</li>
        <li>{t("data2")}</li>
        <li>{t("data3")}</li>
        <li>{t("data4")}</li>
      </ul>

      <p>{t.rich("purposeTitle", { b: Bold })}</p>
      <ul>
        <li>{t("purpose1")}</li>
        <li>{t("purpose2")}</li>
        <li>{t("purpose3")}</li>
      </ul>

      <p>{t("p2")}</p>
      <p>{t("p3")}</p>
    </LegalLayout>
  );
}
