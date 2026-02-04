import { prisma } from "@/app/lib/prisma";
import { authOptions } from "@/app/lib/auth";
import { getServerSession } from "next-auth";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Button } from "@mui/material";

import BoPage from "../../components/BoPage";
import UsersAdminClient from "./users-admin-client";
import type { BoUserItem, Role } from "./types";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function BoUsersPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations("bo.users");

  const session = await getServerSession(authOptions);
  const actorRole = ((session?.user as any)?.role ?? "CLIENT") as Role;
  const actorId = ((session?.user as any)?.id ?? "") as string;

  const users = await prisma.user.findMany({
    where: { deleted: false },
    orderBy: [{ role: "asc" }, { email: "asc" }],
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      disabled: true,
      availableClasses: true,
    },
    take: 500,
  });

  const items: BoUserItem[] = users.map((u) => ({
    id: u.id,
    email: u.email,
    name: u.name,
    role: u.role as Role,
    disabled: u.disabled,
    availableClasses: u.availableClasses,
  }));

  return (
    <BoPage
      title={t("title")}
      subtitle={t("subtitle")}
      actions={
        <Link href="/bo/users/new" style={{ textDecoration: "none" }}>
          <Button variant="contained">{t("actions.create")}</Button>
        </Link>
      }
    >
      <UsersAdminClient
        locale={locale}
        actorRole={actorRole}
        actorId={actorId}
        users={items}
      />
    </BoPage>
  );
}
