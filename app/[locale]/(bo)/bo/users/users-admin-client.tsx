"use client";

import * as React from "react";
import {
  Box,
  Chip,
  Divider,
  IconButton,
  Paper,
  Stack,
  Tab,
  Tabs,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";
import SearchIcon from "@mui/icons-material/Search";
import { useTranslations } from "next-intl";

import type { BoUserItem, Role, RoleFilter } from "./types";
import BoTableCard from "../../components/BoTableCard";
import UserRow from "./UserRow";

type Props = {
  locale: string;
  actorRole: Role;
  actorId: string;
  users: BoUserItem[];
};

function roleLabelKey(role: RoleFilter) {
  if (role === "ALL") return "filters.allRoles" as const;
  return `roles.${role}` as const;
}

export default function UsersAdminClient({
  locale,
  actorRole,
  actorId,
  users,
}: Props) {
  const t = useTranslations("bo.users");

  const [role, setRole] = React.useState<RoleFilter>("ALL");
  const [q, setQ] = React.useState("");

  const stats = React.useMemo(() => {
    const total = users.length;
    const byRole = {
      SUPERADMIN: 0,
      ADMIN: 0,
      CLIENT: 0,
    } as Record<Role, number>;
    const disabled = users.reduce((acc, u) => acc + (u.disabled ? 1 : 0), 0);
    for (const u of users) byRole[u.role] += 1;
    return { total, disabled, byRole };
  }, [users]);

  const filtered = React.useMemo(() => {
    const qNorm = q.trim().toLowerCase();
    return users
      .filter((u) => {
        if (role !== "ALL" && u.role !== role) return false;
        if (!qNorm) return true;
        const hay = `${u.email} ${u.name ?? ""}`.toLowerCase();
        return hay.includes(qNorm);
      })
      .sort((a, b) => {
        // Mantener agrupado por rol y luego por email
        if (a.role !== b.role) return a.role.localeCompare(b.role);
        return a.email.localeCompare(b.email);
      });
  }, [q, role, users]);

  const reset = () => {
    setRole("ALL");
    setQ("");
  };

  return (
    <Stack spacing={2}>
      <Paper
        variant="outlined"
        sx={{
          p: 2,
          position: "sticky",
          top: 0,
          zIndex: 10,
          bgcolor: "background.paper",
          backdropFilter: "blur(8px)",
        }}
      >
        <Stack spacing={1.5}>
          <Stack
            direction={{ xs: "column", md: "row" }}
            justifyContent="space-between"
            alignItems={{ xs: "stretch", md: "center" }}
            gap={1.5}
          >
            <Stack direction="row" gap={1} alignItems="center" flexWrap="wrap">
              <Chip
                label={`${t("filters.total")}: ${stats.total}`}
                variant="outlined"
              />
              <Chip
                label={`${t("roles.SUPERADMIN")}: ${stats.byRole.SUPERADMIN}`}
                variant="outlined"
              />
              <Chip
                label={`${t("roles.ADMIN")}: ${stats.byRole.ADMIN}`}
                variant="outlined"
              />
              <Chip
                label={`${t("roles.CLIENT")}: ${stats.byRole.CLIENT}`}
                color="primary"
                variant="outlined"
              />
              <Chip
                label={`${t("filters.disabled")}: ${stats.disabled}`}
                variant="outlined"
              />
            </Stack>

            <Stack
              direction="row"
              gap={1}
              alignItems="center"
              justifyContent="flex-end"
            >
              <Tooltip title={t("filters.reset")}>
                <span>
                  <IconButton onClick={reset} size="small" aria-label="Reset">
                    <ClearIcon fontSize="small" />
                  </IconButton>
                </span>
              </Tooltip>
            </Stack>
          </Stack>

          <Tabs
            value={role}
            onChange={(_, v) => setRole(v)}
            variant="scrollable"
            scrollButtons="auto"
            sx={{ minHeight: 40 }}
          >
            <Tab
              value="ALL"
              label={t(roleLabelKey("ALL") as any)}
              sx={{ minHeight: 40 }}
            />
            <Tab
              value="SUPERADMIN"
              label={t(roleLabelKey("SUPERADMIN") as any)}
              sx={{ minHeight: 40 }}
            />
            <Tab
              value="ADMIN"
              label={t(roleLabelKey("ADMIN") as any)}
              sx={{ minHeight: 40 }}
            />
            <Tab
              value="CLIENT"
              label={t(roleLabelKey("CLIENT") as any)}
              sx={{ minHeight: 40 }}
            />
          </Tabs>

          <Divider />

          <Stack
            direction={{ xs: "column", md: "row" }}
            gap={1.5}
            alignItems="center"
          >
            <TextField
              fullWidth
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder={t("filters.searchPlaceholder")}
              InputProps={{
                startAdornment: (<SearchIcon fontSize="small" />) as any,
              }}
            />
          </Stack>
        </Stack>
      </Paper>

      <BoTableCard
        isEmpty={filtered.length === 0}
        empty={t("empty")}
        header={
          <Typography variant="subtitle2" fontWeight={800}>
            {filtered.length}{" "}
            {filtered.length === 1 ? t("filters.user") : t("filters.users")}
          </Typography>
        }
      >
        <Box>
          {filtered.map((u) => (
            <UserRow
              key={u.id}
              locale={locale}
              actorRole={actorRole}
              actorId={actorId}
              user={u}
            />
          ))}
        </Box>
      </BoTableCard>
    </Stack>
  );
}
