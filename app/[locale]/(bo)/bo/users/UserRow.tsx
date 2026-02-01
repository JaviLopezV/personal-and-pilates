// app/[locale]/bo/users/UserRow.tsx
import { Box, Button, Chip, MenuItem, Select, Typography } from "@mui/material";
import type { getTranslations } from "next-intl/server";
import { setUserDisabled, setUserRole } from "./actions";
import type { Role } from "./page";

type User = {
  id: string;
  email: string;
  name: string | null;
  role: Role;
  disabled: boolean;
};

type Props = {
  locale: string;
  t: Awaited<ReturnType<typeof getTranslations>>;
  actorRole: Role;
  actorId: string;
  user: User;
};

function canDisableTarget(actorRole: Role, targetRole: Role) {
  if (actorRole === "SUPERADMIN") return true;
  if (actorRole === "ADMIN") return targetRole === "CLIENT";
  return false;
}

function canEditRole(actorRole: Role, targetRole: Role) {
  if (actorRole === "SUPERADMIN") return true;
  // ADMIN: puede alternar CLIENT <-> ADMIN (nunca tocar SUPERADMIN)
  return actorRole === "ADMIN" && targetRole !== "SUPERADMIN";
}

function roleLabelKey(role: Role) {
  return `roles.${role}` as const;
}

export default function UserRow({
  locale,
  t,
  actorRole,
  actorId,
  user,
}: Props) {
  const isSelf = user.id === actorId;
  const canDisable = canDisableTarget(actorRole, user.role) && !isSelf;
  const canRoleChange = canEditRole(actorRole, user.role) && !isSelf;

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: { xs: "1fr", md: "1.2fr 0.9fr 140px 180px 1.2fr" },
        px: 3,
        py: 2,
        borderBottom: "1px solid",
        borderColor: "divider",
        alignItems: { xs: "start", md: "center" },
        gap: 2,
      }}
    >
      <Box>
        <Typography fontWeight={700}>{user.name || t("noName")}</Typography>
        <Typography variant="body2" color="text.secondary">
          {user.email}
        </Typography>
      </Box>

      <Box>
        <Chip
          size="small"
          label={t(roleLabelKey(user.role) as any)}
          variant="outlined"
        />
      </Box>

      <Box>
        <Chip
          size="small"
          label={user.disabled ? t("status.disabled") : t("status.enabled")}
          color={user.disabled ? "warning" : "success"}
          variant="outlined"
        />
      </Box>

      <Box>
        <form
          action={setUserDisabled.bind(null, locale, user.id)}
          style={{ display: "inline-flex", gap: 8, alignItems: "center" }}
        >
          <input
            type="hidden"
            name="disabled"
            value={user.disabled ? "false" : "true"}
          />
          <Button size="small" type="submit" disabled={!canDisable}>
            {user.disabled ? t("actions.enable") : t("actions.disable")}
          </Button>

          {isSelf && (
            <Typography variant="caption" color="text.secondary">
              {t("selfProtected")}
            </Typography>
          )}
        </form>
      </Box>

      <Box sx={{ justifySelf: { xs: "start", md: "end" } }}>
        {actorRole === "SUPERADMIN" ? (
          <form
            action={setUserRole.bind(null, locale, user.id)}
            style={{ display: "inline-flex", gap: 8, alignItems: "center" }}
          >
            <Select
              name="role"
              defaultValue={user.role}
              size="small"
              disabled={isSelf}
              sx={{ minWidth: 160 }}
            >
              <MenuItem value="SUPERADMIN">{t("roles.SUPERADMIN")}</MenuItem>
              <MenuItem value="ADMIN">{t("roles.ADMIN")}</MenuItem>
              <MenuItem value="CLIENT">{t("roles.CLIENT")}</MenuItem>
            </Select>

            <Button size="small" type="submit" disabled={isSelf}>
              {t("actions.saveRole")}
            </Button>
          </form>
        ) : (
          <form
            action={setUserRole.bind(null, locale, user.id)}
            style={{ display: "inline-flex", gap: 8 }}
          >
            <input
              type="hidden"
              name="role"
              value={user.role === "ADMIN" ? "CLIENT" : "ADMIN"}
            />
            <Button size="small" type="submit" disabled={!canRoleChange}>
              {user.role === "ADMIN"
                ? t("actions.removeAdmin")
                : t("actions.makeAdmin")}
            </Button>
          </form>
        )}
      </Box>
    </Box>
  );
}
