// app/[locale]/(bo)/bo/users/UserRow.tsx
"use client";

import { Link } from "@/i18n/navigation";
import {
  Avatar,
  Box,
  Button,
  Chip,
  Divider,
  MenuItem,
  Select,
  Stack,
  Typography,
} from "@mui/material";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import AdminPanelSettingsOutlinedIcon from "@mui/icons-material/AdminPanelSettingsOutlined";
import BlockOutlinedIcon from "@mui/icons-material/BlockOutlined";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { useTranslations } from "next-intl";
import { setUserDisabled, setUserRole } from "./actions";
import type { BoUserItem, Role } from "./types";

type Props = {
  locale: string;
  actorRole: Role;
  actorId: string;
  user: BoUserItem;
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

function initials(name: string | null, email: string) {
  const base = (name || email).trim();
  const parts = base.split(/\s+/).filter(Boolean);
  const a = (parts[0]?.[0] ?? email[0] ?? "?").toUpperCase();
  const b = (parts[1]?.[0] ?? parts[0]?.[1] ?? "").toUpperCase();
  return (a + b).slice(0, 2);
}

export default function UserRow({ locale, actorRole, actorId, user }: Props) {
  const t = useTranslations("bo.users");
  const isSelf = user.id === actorId;
  const canDisable = canDisableTarget(actorRole, user.role) && !isSelf;
  const canRoleChange = canEditRole(actorRole, user.role) && !isSelf;

  return (
    <Box
      sx={{
        px: { xs: 2, md: 3 },
        py: 2,
      }}
    >
      <Stack
        direction={{ xs: "column", md: "row" }}
        spacing={{ xs: 1.5, md: 2 }}
        alignItems={{ xs: "stretch", md: "center" }}
        justifyContent="space-between"
      >
        {/* Left: identity */}
        <Stack direction="row" spacing={1.5} alignItems="center" minWidth={0}>
          <Avatar sx={{ width: 40, height: 40, fontWeight: 800 }}>
            {initials(user.name, user.email)}
          </Avatar>

          <Box minWidth={0}>
            <Typography fontWeight={800} noWrap>
              {user.name || t("noName")}
            </Typography>
            <Typography variant="body2" color="text.secondary" noWrap>
              {user.email}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {t("availableClassesLabel", { n: user.availableClasses })}
            </Typography>
          </Box>
        </Stack>

        {/* Middle: meta */}
        <Stack
          direction="row"
          spacing={1}
          alignItems="center"
          flexWrap="wrap"
          justifyContent={{ xs: "flex-start", md: "center" }}
          sx={{ minWidth: { md: 260 } }}
        >
          <Chip size="small" label={t(roleLabelKey(user.role) as any)} variant="outlined" />
          <Chip
            size="small"
            label={user.disabled ? t("status.disabled") : t("status.enabled")}
            color={user.disabled ? "warning" : "success"}
            variant="outlined"
            icon={user.disabled ? <BlockOutlinedIcon /> : <CheckCircleOutlineIcon />}
          />
          {isSelf && (
            <Chip size="small" label={t("selfProtected")} variant="outlined" />
          )}
        </Stack>

        {/* Right: actions */}
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={1}
          alignItems={{ xs: "stretch", sm: "center" }}
          justifyContent="flex-end"
        >
          <form action={setUserDisabled.bind(null, locale, user.id)}>
            <input type="hidden" name="disabled" value={user.disabled ? "false" : "true"} />
            <Button
              size="small"
              type="submit"
              disabled={!canDisable}
              variant="outlined"
              startIcon={user.disabled ? <CheckCircleOutlineIcon /> : <BlockOutlinedIcon />}
            >
              {user.disabled ? t("actions.enable") : t("actions.disable")}
            </Button>
          </form>

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
                sx={{ minWidth: 170 }}
              >
                <MenuItem value="SUPERADMIN">{t("roles.SUPERADMIN")}</MenuItem>
                <MenuItem value="ADMIN">{t("roles.ADMIN")}</MenuItem>
                <MenuItem value="CLIENT">{t("roles.CLIENT")}</MenuItem>
              </Select>

              <Button size="small" type="submit" disabled={isSelf} variant="contained">
                {t("actions.saveRole")}
              </Button>
            </form>
          ) : (
            <form action={setUserRole.bind(null, locale, user.id)}>
              <input
                type="hidden"
                name="role"
                value={user.role === "ADMIN" ? "CLIENT" : "ADMIN"}
              />
              <Button
                size="small"
                type="submit"
                disabled={!canRoleChange}
                variant="outlined"
                startIcon={<AdminPanelSettingsOutlinedIcon />}
              >
                {user.role === "ADMIN" ? t("actions.removeAdmin") : t("actions.makeAdmin")}
              </Button>
            </form>
          )}

          <Link href={`/bo/users/${user.id}/edit`} style={{ textDecoration: "none" }}>
            <Button size="small" variant="text" startIcon={<EditOutlinedIcon />}>
              {t("actions.edit")}
            </Button>
          </Link>
        </Stack>
      </Stack>

      <Divider sx={{ mt: 2 }} />
    </Box>
  );
}
