import * as React from "react";
import { Box, Stack, Typography } from "@mui/material";

type Props = {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  actions?: React.ReactNode;
};

export default function BoToolbar({ title, subtitle, actions }: Props) {
  return (
    <Stack
      spacing={1}
      direction={{ xs: "column", sm: "row" }}
      alignItems={{ xs: "flex-start", sm: "center" }}
      justifyContent="space-between"
    >
      <Box>
        <Typography variant="h4" fontWeight={800}>
          {title}
        </Typography>
        {subtitle ? (
          <Typography color="text.secondary">{subtitle}</Typography>
        ) : null}
      </Box>

      {actions ? <Box>{actions}</Box> : null}
    </Stack>
  );
}
