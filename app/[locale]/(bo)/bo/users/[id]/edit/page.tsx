import { notFound } from "next/navigation";
import { prisma } from "@/app/lib/prisma";
import { getTranslations } from "next-intl/server";
import EditUserForm from "./EditUserForm";
import BoPage from "../../../../components/BoPage";
import UserNavTabs from "../UserNavTabs";

type Params = { params: Promise<{ id: string; locale: string }> };

export default async function EditUserPage({ params }: Params) {
  const { id, locale } = await params;
  const t = await getTranslations("bo.boEditUser");

  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      disabled: true,
      availableClasses: true,
    },
  });

  if (!user) return notFound();

  return (
    <BoPage
      title={t("title")}
      backHref="/bo/users"
      maxWidth={900}
      actions={<UserNavTabs id={id} active="edit" />}
    >
      <EditUserForm locale={locale} user={user as any} />
    </BoPage>
  );
}
