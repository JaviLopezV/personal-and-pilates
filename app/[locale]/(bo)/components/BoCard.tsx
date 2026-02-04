import * as React from "react";
import { Paper, type PaperProps } from "@mui/material";

type Props = PaperProps & {
  /** Paper padding. Default: 3 */
  p?: number | { xs?: number; sm?: number; md?: number };
};

export default function BoCard({ p = 3, sx, children, ...rest }: Props) {
  return (
    <Paper
      variant="outlined"
      sx={{
        p,
        ...(sx as any),
      }}
      {...rest}
    >
      {children}
    </Paper>
  );
}
