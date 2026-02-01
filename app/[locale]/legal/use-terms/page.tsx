import LegalLayout from "../../components/LegalLayout";
import { getTranslations } from "next-intl/server";

export default async function Page() {
  const t = await getTranslations("legalUseTerms");
  const email = "arrow.apps.jlv@gmail.com";

  return (
    <LegalLayout title={t("title")}>
      <p>{t("intro")}</p>

      <h3>{t("s1Title")}</h3>
      <p>{t("s1Body")}</p>

      <h3>{t("s2Title")}</h3>
      <ul>
        <li>{t("s2Li1")}</li>
        <li>{t("s2Li2")}</li>
        <li>
          {t.rich("s2Li3", {
            email,
            b: (chunks) => <b>{chunks}</b>,
          })}
        </li>
      </ul>

      <h3>{t("s3Title")}</h3>
      <p>{t("s3Intro")}</p>
      <ul>
        <li>{t("s3Li1")}</li>
        <li>{t("s3Li2")}</li>
      </ul>

      <h3>{t("s4Title")}</h3>
      <p>{t("s4Intro")}</p>
      <ul>
        <li>{t("s4Li1")}</li>
        <li>{t("s4Li2")}</li>
        <li>{t("s4Li3")}</li>
        <li>{t("s4Li4")}</li>
      </ul>

      <h3>{t("s5Title")}</h3>
      <p>{t("s5Body")}</p>

      <h3>{t("s6Title")}</h3>
      <p>{t("s6Body")}</p>

      <h3>{t("s7Title")}</h3>
      <p>{t("s7Body")}</p>

      <h3>{t("s8Title")}</h3>
      <p>{t("s8Body")}</p>

      <h3>{t("s9Title")}</h3>
      <p>{t("s9Body")}</p>

      <h3>{t("s10Title")}</h3>
      <p>{t("s10Body")}</p>

      <h3>{t("s11Title")}</h3>
      <p>{t("s11Body")}</p>

      <p>
        {t.rich("contact", {
          email,
          b: (chunks) => <b>{chunks}</b>,
        })}
      </p>
    </LegalLayout>
  );
}
