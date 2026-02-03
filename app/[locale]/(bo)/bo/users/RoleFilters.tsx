// app/[locale]/(bo)/bo/users/RoleFilters.tsx
"use client";

import { useRouter } from "next/navigation";
import { Box, Paper, Tab, Tabs, Typography } from "@mui/material";
import type { RoleFilter } from "./page";

type Props = {
  locale: string;
  // IMPORTANT: pass strings, not the `t` function
  labels: {
    roleLabel: string;
    allRoles: string;
    superadmin: string;
    admin: string;
    client: string;
  };
  selectedRole: RoleFilter;
};

function hrefFor(locale: string, role: RoleFilter) {
  const base = `/${locale}/bo/users`;
  return role === "ALL" ? base : `${base}?role=${role}`;
}

export default function RoleFilters({ locale, labels, selectedRole }: Props) {
  const router = useRouter();

  return (
    <Paper variant="outlined" sx={{ overflow: "hidden" }}>
      <Box sx={{ p: 2, pb: 1 }}>
        <Typography fontWeight={800}>{labels.roleLabel}</Typography>
      </Box>

      <Tabs
        value={selectedRole}
        onChange={(_, value) => router.push(hrefFor(locale, value as RoleFilter))}
        variant="scrollable"
        scrollButtons="auto"
        sx={{ px: 1 }}
      >
        <Tab value="ALL" label={labels.allRoles} />
        <Tab value="SUPERADMIN" label={labels.superadmin} />
        <Tab value="ADMIN" label={labels.admin} />
        <Tab value="CLIENT" label={labels.client} />
      </Tabs>
    </Paper>
  );
}
