import * as React from "react";
import { Box, Typography } from "@mui/material";

export default function BoEmptyState({ children }: { children: React.ReactNode }) {
  return (
    <Box sx={{ p: 3 }}>
      <Typography color="text.secondary">{children}</Typography>
    </Box>
  );
}
