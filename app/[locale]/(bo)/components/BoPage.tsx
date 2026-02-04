import * as React from "react";
import { Box, IconButton, Stack, Typography } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Link } from "@/i18n/navigation";

type Props = {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  actions?: React.ReactNode;
  backHref?: string;
  maxWidth?: number | string;
  children: React.ReactNode;
};

export default function BoPage({
  title,
  subtitle,
  actions,
  backHref,
  maxWidth,
  children,
}: Props) {
  return (
    <Stack spacing={3} sx={maxWidth ? { maxWidth } : undefined}>
      <Stack
        spacing={1}
        direction={{ xs: "column", sm: "row" }}
        alignItems={{ xs: "flex-start", sm: "center" }}
        justifyContent="space-between"
      >
        <Stack direction="row" spacing={1} alignItems="center">
          {backHref ? (
            <IconButton
              component={Link as any}
              href={backHref}
              aria-label="back"
              size="small"
            >
              <ArrowBackIcon />
            </IconButton>
          ) : null}

          <Box>
            <Typography variant="h4" fontWeight={800}>
              {title}
            </Typography>
            {subtitle ? (
              <Typography color="text.secondary">{subtitle}</Typography>
            ) : null}
          </Box>
        </Stack>

        {actions ? <Box>{actions}</Box> : null}
      </Stack>

      {children}
    </Stack>
  );
}
