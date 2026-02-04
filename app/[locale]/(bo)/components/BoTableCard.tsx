import * as React from "react";
import { Box, Paper, type PaperProps } from "@mui/material";
import BoEmptyState from "./BoEmptyState";

type Props = PaperProps & {
  header?: React.ReactNode;
  isEmpty?: boolean;
  empty?: React.ReactNode;
};

export default function BoTableCard({
  header,
  isEmpty,
  empty,
  sx,
  children,
  ...rest
}: Props) {
  return (
    <Paper
      variant="outlined"
      sx={{ overflow: "hidden", ...(sx as any) }}
      {...rest}
    >
      {header ? (
        <Box
          sx={{
            px: { xs: 2, md: 3 },
            py: 1.5,
            bgcolor: "action.hover",
            borderBottom: "1px solid",
            borderColor: "divider",
          }}
        >
          {header}
        </Box>
      ) : null}

      {isEmpty ? <BoEmptyState>{empty ?? "—"}</BoEmptyState> : children}
    </Paper>
  );
}
