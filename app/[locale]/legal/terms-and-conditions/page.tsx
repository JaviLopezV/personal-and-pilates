import LegalLayout from "../../components/LegalLayout";
import { getTranslations } from "next-intl/server";

export default async function Page() {
  const t = await getTranslations("legalTermsAndConditions");

  return (
    <LegalLayout title={t("title")}>
      <p>{t("intro")}</p>

      <h3>{t("s1Title")}</h3>
      <p>{t("s1Body")}</p>

      <h3>{t("s2Title")}</h3>
      <ul>
        <li>{t("s2Li1")}</li>
        <li>{t("s2Li2")}</li>
        <li>{t("s2Li3")}</li>
      </ul>

      <h3>{t("s3Title")}</h3>
      <p>{t("s3Body")}</p>

      <h3>{t("s4Title")}</h3>
      <p>{t("s4Body")}</p>

      <h3>{t("s5Title")}</h3>
      <p>{t("s5Body")}</p>

      <h3>{t("s6Title")}</h3>
      <p>{t("s6Body")}</p>

      <h3>{t("s7Title")}</h3>
      <p>{t("s7Body")}</p>

      <h3>{t("s8Title")}</h3>
      <p>{t("s8Body")}</p>
    </LegalLayout>
  );
}
