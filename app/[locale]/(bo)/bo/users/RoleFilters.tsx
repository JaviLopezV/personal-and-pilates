// app/[locale]/(bo)/bo/users/RoleFilters.tsx
import Link from "next/link";
import { Box, Button, Paper, Typography } from "@mui/material";
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

function hrefFor(locale: string, qs?: string) {
  const base = `/${locale}/bo/users`;
  return qs ? `${base}?role=${qs}` : base;
}

export default function RoleFilters({ locale, labels, selectedRole }: Props) {
  return (
    <Paper variant="outlined">
      <Box
        sx={{
          p: 2,
          display: "flex",
          gap: 1,
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        <Typography fontWeight={700} sx={{ mr: 1 }}>
          {labels.roleLabel}:
        </Typography>

        <Link
          href={hrefFor(locale)}
          prefetch={false}
          style={{ textDecoration: "none" }}
        >
          <Button
            size="small"
            variant={selectedRole === "ALL" ? "contained" : "text"}
          >
            {labels.allRoles}
          </Button>
        </Link>

        <Link
          href={hrefFor(locale, "SUPERADMIN")}
          prefetch={false}
          style={{ textDecoration: "none" }}
        >
          <Button
            size="small"
            variant={selectedRole === "SUPERADMIN" ? "contained" : "text"}
          >
            {labels.superadmin}
          </Button>
        </Link>

        <Link
          href={hrefFor(locale, "ADMIN")}
          prefetch={false}
          style={{ textDecoration: "none" }}
        >
          <Button
            size="small"
            variant={selectedRole === "ADMIN" ? "contained" : "text"}
          >
            {labels.admin}
          </Button>
        </Link>

        <Link
          href={hrefFor(locale, "CLIENT")}
          prefetch={false}
          style={{ textDecoration: "none" }}
        >
          <Button
            size="small"
            variant={selectedRole === "CLIENT" ? "contained" : "text"}
          >
            {labels.client}
          </Button>
        </Link>
      </Box>
    </Paper>
  );
}
