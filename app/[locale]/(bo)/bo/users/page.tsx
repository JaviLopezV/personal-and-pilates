// app/[locale]/bo/users/page.tsx
import { prisma } from "@/app/lib/prisma";
import { authOptions } from "@/app/lib/auth";
import { getServerSession } from "next-auth";
import { getTranslations } from "next-intl/server";
import { Box, Paper, Stack, Typography } from "@mui/material";
import RoleFilters from "./RoleFilters";
import UserRow from "./UserRow";

export type Role = "CLIENT" | "ADMIN" | "SUPERADMIN";
export type RoleFilter = Role | "ALL";

type Props = {
  params: Promise<{ locale: string }>;
  searchParams?: unknown;
};

function normalizeRoleFilter(v: unknown): RoleFilter {
  const s = String(v ?? "ALL");
  return s === "CLIENT" || s === "ADMIN" || s === "SUPERADMIN" ? s : "ALL";
}

function safeSearchParams(sp: unknown): Record<string, unknown> {
  // Some environments might hand you a Promise-like; treat it as empty.
  if (sp && typeof (sp as any)?.then === "function") return {};
  return (sp ?? {}) as Record<string, unknown>;
}

function roleWhere(filter: RoleFilter) {
  return filter === "ALL" ? {} : { role: filter as any };
}

export default async function BoUsersPage({ params, searchParams }: Props) {
  const { locale } = await params;
  const t = await getTranslations("bo.users");

  const sp = safeSearchParams(searchParams);
  const selectedRole = normalizeRoleFilter(sp.role);

  const session = await getServerSession(authOptions);
  const actorRole = ((session?.user as any)?.role ?? "CLIENT") as Role;
  const actorId = ((session?.user as any)?.id ?? "") as string;

  const users = await prisma.user.findMany({
    where: roleWhere(selectedRole),
    orderBy: [{ role: "asc" }, { email: "asc" }],
    select: { id: true, email: true, name: true, role: true, disabled: true },
  });

  return (
    <Stack spacing={3}>
      <Stack spacing={1}>
        <Typography variant="h4" fontWeight={800}>
          {t("title")}
        </Typography>
        <Typography color="text.secondary">{t("subtitle")}</Typography>
      </Stack>

      <RoleFilters
        locale={locale}
        selectedRole={selectedRole}
        labels={{
          roleLabel: t("filters.roleLabel"),
          allRoles: t("filters.allRoles"),
          superadmin: t("roles.SUPERADMIN"),
          admin: t("roles.ADMIN"),
          client: t("roles.CLIENT"),
        }}
      />

      <Paper variant="outlined">
        {users.length === 0 ? (
          <Box p={3}>
            <Typography color="text.secondary">{t("empty")}</Typography>
          </Box>
        ) : (
          <Box>
            {users.map((u) => (
              <UserRow
                key={u.id}
                locale={locale}
                t={t}
                actorRole={actorRole}
                actorId={actorId}
                user={{
                  id: u.id,
                  email: u.email,
                  name: u.name,
                  role: u.role as Role,
                  disabled: u.disabled,
                }}
              />
            ))}
          </Box>
        )}
      </Paper>
    </Stack>
  );
}
