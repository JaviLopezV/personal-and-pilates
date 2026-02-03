"use client";

import {
  Alert,
  Box,
  Chip,
  CircularProgress,
  Divider,
  IconButton,
  InputAdornment,
  MenuItem,
  Paper,
  Select,
  Snackbar,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { useMemo, useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { updatePageStatus } from "./actions";

type PageStatus = "ACTIVE" | "UNDER_CONSTRUCTION" | "INACTIVE";

export type PageRow = {
  path: string;
  name: string | null;
  status: PageStatus;
  updatedAt: string; // ISO
};

type Props = {
  locale: string;
  pages: PageRow[];
};

type Snack = { open: boolean; severity: "success" | "error"; message: string };

function statusChipColor(status: PageStatus): "success" | "warning" | "default" {
  if (status === "ACTIVE") return "success";
  if (status === "UNDER_CONSTRUCTION") return "warning";
  return "default";
}

export default function PagesAdminClient({ locale, pages }: Props) {
  const t = useTranslations("bo.pages");
  const [query, setQuery] = useState("");
  const [rows, setRows] = useState<PageRow[]>(pages);
  const [savingPaths, setSavingPaths] = useState<Set<string>>(new Set());
  const [snack, setSnack] = useState<Snack>({
    open: false,
    severity: "success",
    message: "",
  });
  const [, startTransition] = useTransition();

  const dtf = useMemo(() => {
    try {
      return new Intl.DateTimeFormat(locale, {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return new Intl.DateTimeFormat(undefined, {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      });
    }
  }, [locale]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter((r) => {
      const name = (r.name ?? "").toLowerCase();
      const path = r.path.toLowerCase();
      return name.includes(q) || path.includes(q);
    });
  }, [query, rows]);

  function setSaving(path: string, value: boolean) {
    setSavingPaths((prev) => {
      const next = new Set(prev);
      if (value) next.add(path);
      else next.delete(path);
      return next;
    });
  }

  async function persistStatus(path: string, status: PageStatus) {
    const fd = new FormData();
    fd.set("status", status);

    const result = await updatePageStatus(locale, path, fd);
    return result; // {status, updatedAt} | null
  }

  function handleChange(path: string, status: PageStatus) {
    // Optimistic UI
    setRows((prev) =>
      prev.map((r) => (r.path === path ? { ...r, status } : r)),
    );

    setSaving(path, true);

    startTransition(async () => {
      try {
        const res = await persistStatus(path, status);
        if (!res) throw new Error("invalid");

        setRows((prev) =>
          prev.map((r) =>
            r.path === path
              ? { ...r, status: res.status, updatedAt: res.updatedAt }
              : r,
          ),
        );

        setSnack({
          open: true,
          severity: "success",
          message: t("toast.saved"),
        });
      } catch {
        setSnack({
          open: true,
          severity: "error",
          message: t("toast.error"),
        });
      } finally {
        setSaving(path, false);
      }
    });
  }

  return (
    <Stack spacing={2}>
      <Paper variant="outlined" sx={{ p: { xs: 2, sm: 2.5 } }}>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={1.5}
          alignItems={{ xs: "stretch", sm: "center" }}
          justifyContent="space-between"
        >
          <TextField
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t("search.placeholder")}
            size="small"
            fullWidth
            sx={{ maxWidth: { sm: 420 } }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" />
                </InputAdornment>
              ),
              endAdornment: query ? (
                <InputAdornment position="end">
                  <IconButton
                    aria-label={t("search.clear")}
                    size="small"
                    onClick={() => setQuery("")}
                  >
                    <CloseIcon fontSize="small" />
                  </IconButton>
                </InputAdornment>
              ) : null,
            }}
          />

          <Typography variant="body2" color="text.secondary">
            {t("search.count", { count: filtered.length })}
          </Typography>
        </Stack>
      </Paper>

      <Paper variant="outlined">
        {/* Header (solo desktop) */}
        <Box
          sx={{
            display: { xs: "none", md: "grid" },
            gridTemplateColumns: "minmax(260px, 1fr) 260px 160px",
            px: 3,
            py: 1.5,
            borderBottom: "1px solid",
            borderColor: "divider",
            bgcolor: "action.hover",
          }}
        >
          <Typography variant="subtitle2" color="text.secondary">
            {t("columns.page")}
          </Typography>
          <Typography variant="subtitle2" color="text.secondary">
            {t("columns.status")}
          </Typography>
          <Typography
            variant="subtitle2"
            color="text.secondary"
            sx={{ justifySelf: "end" }}
          >
            {t("columns.updated")}
          </Typography>
        </Box>

        <Box>
          {filtered.length === 0 ? (
            <Box sx={{ p: 3 }}>
              <Typography color="text.secondary">{t("search.empty")}</Typography>
            </Box>
          ) : (
            filtered.map((p, idx) => {
              const saving = savingPaths.has(p.path);
              const updatedLabel = dtf.format(new Date(p.updatedAt));

              return (
                <Box key={p.path}>
                  <Box
                    sx={{
                      display: "grid",
                      gridTemplateColumns: {
                        xs: "1fr",
                        sm: "1fr 220px",
                        md: "minmax(260px, 1fr) 260px 160px",
                      },
                      px: { xs: 2, sm: 2.5, md: 3 },
                      py: { xs: 2, md: 1.75 },
                      gap: { xs: 1.5, md: 2 },
                      alignItems: "center",
                    }}
                  >
                    {/* Page */}
                    <Box sx={{ minWidth: 0 }}>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Typography fontWeight={800} noWrap>
                          {p.name ?? p.path}
                        </Typography>
                        <Chip
                          size="small"
                          label={t(`status.${p.status}`)}
                          color={statusChipColor(p.status)}
                          variant="outlined"
                        />
                      </Stack>

                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ wordBreak: "break-word" }}
                      >
                        {p.path}
                      </Typography>

                      {/* Updated (solo mobile/tablet) */}
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ display: { xs: "block", md: "none" }, mt: 0.5 }}
                      >
                        {t("columns.updated")}: {updatedLabel}
                      </Typography>
                    </Box>

                    {/* Status control */}
                    <Stack
                      direction="row"
                      spacing={1}
                      alignItems="center"
                      justifyContent={{
                        xs: "stretch",
                        sm: "flex-end",
                        md: "flex-start",
                      }}
                      sx={{ width: "100%" }}
                    >
                      <Select
                        size="small"
                        value={p.status}
                        onChange={(e) =>
                          handleChange(p.path, e.target.value as PageStatus)
                        }
                        sx={{
                          width: { xs: "100%", sm: 220, md: 240 },
                        }}
                      >
                        <MenuItem value="ACTIVE">{t("status.ACTIVE")}</MenuItem>
                        <MenuItem value="UNDER_CONSTRUCTION">
                          {t("status.UNDER_CONSTRUCTION")}
                        </MenuItem>
                        <MenuItem value="INACTIVE">{t("status.INACTIVE")}</MenuItem>
                      </Select>

                      {saving ? (
                        <CircularProgress size={18} />
                      ) : (
                        <CheckCircleIcon fontSize="small" color="disabled" />
                      )}
                    </Stack>

                    {/* Updated (solo desktop) */}
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        justifySelf: "end",
                        display: { xs: "none", md: "block" },
                      }}
                    >
                      {updatedLabel}
                    </Typography>
                  </Box>

                  {idx !== filtered.length - 1 ? <Divider /> : null}
                </Box>
              );
            })
          )}
        </Box>
      </Paper>

      <Snackbar
        open={snack.open}
        autoHideDuration={2200}
        onClose={() => setSnack((s) => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnack((s) => ({ ...s, open: false }))}
          severity={snack.severity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {snack.message}
        </Alert>
      </Snackbar>
    </Stack>
  );
}
