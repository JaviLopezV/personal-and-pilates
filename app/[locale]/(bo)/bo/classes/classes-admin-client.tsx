"use client";

import {
  Box,
  Button,
  Chip,
  Divider,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  Tab,
  Tabs,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import OpenInNewOutlinedIcon from "@mui/icons-material/OpenInNewOutlined";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import { Link } from "@/i18n/navigation";
import * as React from "react";
import { useTranslations } from "next-intl";

type SessionItem = {
  id: string;
  title: string;
  type: string;
  startsAt: string; // ISO
  endsAt: string; // ISO
  capacity: number;
  bookedActive: number;
};

type Props = {
  items: SessionItem[];
  emptyLabel: string;
  editLabel: string;
};

function startOfTodayLocal() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

function fmt(d: Date) {
  return new Intl.DateTimeFormat(undefined, {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(d);
}

function toDateInputValue(d: Date) {
  // YYYY-MM-DD in local time
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

function parseDateInputValue(v: string) {
  // Interpret as local date at start of day
  if (!v) return null;
  const [y, m, d] = v.split("-").map(Number);
  if (!y || !m || !d) return null;
  const dt = new Date(y, m - 1, d);
  dt.setHours(0, 0, 0, 0);
  return dt;
}

export default function ClassesAdminClient({ items, emptyLabel, editLabel }: Props) {
  const t = useTranslations("bo.boClasses.filters");
  const today = React.useMemo(() => startOfTodayLocal(), []);

  // UI state
  const [tab, setTab] = React.useState<"active" | "all" | "past">("active");
  const [q, setQ] = React.useState("");
  const [type, setType] = React.useState<string>("all");
  const [availability, setAvailability] = React.useState<"all" | "spots" | "full">(
    "all",
  );
  const [from, setFrom] = React.useState<string>(toDateInputValue(today));
  const [to, setTo] = React.useState<string>("");
  const [sort, setSort] = React.useState<"startsAsc" | "startsDesc">("startsAsc");

  const allTypes = React.useMemo(() => {
    const uniq = new Set(items.map((i) => i.type).filter(Boolean));
    return Array.from(uniq).sort((a, b) => a.localeCompare(b));
  }, [items]);

  const stats = React.useMemo(() => {
    const t0 = today.getTime();
    let upcoming = 0;
    let past = 0;
    let full = 0;
    for (const i of items) {
      const s = new Date(i.startsAt).getTime();
      if (s >= t0) upcoming += 1;
      else past += 1;
      if (i.bookedActive >= i.capacity) full += 1;
    }
    return { total: items.length, upcoming, past, full };
  }, [items, today]);

  const filtered = React.useMemo(() => {
    const qNorm = q.trim().toLowerCase();
    const fromD = parseDateInputValue(from);
    const toD = parseDateInputValue(to);
    const todayMs = today.getTime();

    const out = items
      .filter((i) => {
        const starts = new Date(i.startsAt);
        const startsMs = starts.getTime();
        const isPast = startsMs < todayMs;

        if (tab === "active" && isPast) return false;
        if (tab === "past" && !isPast) return false;

        if (fromD && startsMs < fromD.getTime()) return false;
        if (toD) {
          // inclusive end date: compare < nextDay
          const next = new Date(toD);
          next.setDate(next.getDate() + 1);
          if (startsMs >= next.getTime()) return false;
        }

        if (type !== "all" && i.type !== type) return false;

        if (availability !== "all") {
          const hasSpots = i.bookedActive < i.capacity;
          if (availability === "spots" && !hasSpots) return false;
          if (availability === "full" && hasSpots) return false;
        }

        if (!qNorm) return true;
        const hay = `${i.title} ${i.type}`.toLowerCase();
        return hay.includes(qNorm);
      })
      .sort((a, b) => {
        const da = new Date(a.startsAt).getTime();
        const db = new Date(b.startsAt).getTime();
        return sort === "startsAsc" ? da - db : db - da;
      });

    return out;
  }, [availability, from, items, q, sort, tab, to, today, type]);

  const reset = () => {
    setTab("active");
    setQ("");
    setType("all");
    setAvailability("all");
    setFrom(toDateInputValue(today));
    setTo("");
    setSort("startsAsc");
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
              <Chip label={`${t("total")}: ${stats.total}`} variant="outlined" />
              <Chip
                label={`${t("active")}: ${stats.upcoming}`}
                color="primary"
                variant="outlined"
              />
              <Chip label={`${t("past")}: ${stats.past}`} variant="outlined" />
              <Chip label={`${t("full")}: ${stats.full}`} variant="outlined" />
            </Stack>

            <Stack direction="row" gap={1} alignItems="center" justifyContent="flex-end">
              <Tooltip title={t("reset")}>
                <span>
                  <IconButton onClick={reset} size="small" aria-label="Reset">
                    <ClearIcon fontSize="small" />
                  </IconButton>
                </span>
              </Tooltip>
            </Stack>
          </Stack>

          <Tabs
            value={tab}
            onChange={(_, v) => setTab(v)}
            sx={{ minHeight: 40 }}
          >
            <Tab value="active" label={t("tabActive")} sx={{ minHeight: 40 }} />
            <Tab value="all" label={t("tabAll")} sx={{ minHeight: 40 }} />
            <Tab value="past" label={t("tabPast")} sx={{ minHeight: 40 }} />
          </Tabs>

          <Divider />

          <Stack
            direction={{ xs: "column", lg: "row" }}
            gap={1.5}
            alignItems={{ xs: "stretch", lg: "center" }}
          >
            <TextField
              size="small"
              placeholder={t("searchPlaceholder")}
              value={q}
              onChange={(e) => setQ(e.target.value)}
              InputProps={{
                startAdornment: (
                  <Box sx={{ display: "flex", alignItems: "center", pr: 1 }}>
                    <SearchIcon fontSize="small" />
                  </Box>
                ),
              }}
              sx={{ flex: 1, minWidth: 260 }}
            />

            <FormControl size="small" sx={{ minWidth: 180 }}>
              <InputLabel>{t("type")}</InputLabel>
              <Select value={type} label={t("type")} onChange={(e) => setType(String(e.target.value))}>
                <MenuItem value="all">{t("all")}</MenuItem>
                {allTypes.map((t) => (
                  <MenuItem key={t} value={t}>
                    {t}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl size="small" sx={{ minWidth: 200 }}>
              <InputLabel>{t("capacity")}</InputLabel>
              <Select
                value={availability}
                label={t("capacity")}
                onChange={(e) => setAvailability(e.target.value as any)}
              >
                <MenuItem value="all">{t("all")}</MenuItem>
                <MenuItem value="spots">{t("hasSpots")}</MenuItem>
                <MenuItem value="full">{t("isFull")}</MenuItem>
              </Select>
            </FormControl>

            <TextField
              size="small"
              label={t("from")}
              type="date"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              InputLabelProps={{ shrink: true }}
              sx={{ minWidth: 170 }}
            />
            <TextField
              size="small"
              label={t("to")}
              type="date"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              InputLabelProps={{ shrink: true }}
              sx={{ minWidth: 170 }}
            />

            <FormControl size="small" sx={{ minWidth: 200 }}>
              <InputLabel>{t("sort")}</InputLabel>
              <Select value={sort} label={t("sort")} onChange={(e) => setSort(e.target.value as any)}>
                <MenuItem value="startsAsc">{t("sortAsc")}</MenuItem>
                <MenuItem value="startsDesc">{t("sortDesc")}</MenuItem>
              </Select>
            </FormControl>
          </Stack>
        </Stack>
      </Paper>

      <Paper variant="outlined" sx={{ overflow: "hidden" }}>
        {filtered.length === 0 ? (
          <Box p={3}>
            <Typography color="text.secondary">{emptyLabel}</Typography>
          </Box>
        ) : (
          <Stack divider={<Divider flexItem />}>
            {filtered.map((s) => {
              const starts = new Date(s.startsAt);
              const ends = new Date(s.endsAt);
              const isPast = starts.getTime() < today.getTime();
              const isFull = s.bookedActive >= s.capacity;
              const occupancy = `${s.bookedActive}/${s.capacity}`;

              return (
                <Box
                  key={s.id}
                  sx={{
                    px: 2.5,
                    py: 2,
                    display: "grid",
                    gridTemplateColumns: { xs: "1fr", md: "1fr auto" },
                    gap: 2,
                    alignItems: "center",
                  }}
                >
                  <Stack spacing={0.75}>
                    <Stack direction="row" gap={1} alignItems="center" flexWrap="wrap">
                      <Typography fontWeight={900}>{s.title}</Typography>
                      <Chip label={s.type} size="small" variant="outlined" />
                      <Chip
                        label={isPast ? t("statusPast") : t("statusActive")}
                        size="small"
                        color={isPast ? "default" : "primary"}
                        variant={isPast ? "outlined" : "filled"}
                      />
                      <Chip
                        label={
                          isFull
                            ? `${t("statusFull")} (${occupancy})`
                            : `${t("statusSpots")} (${occupancy})`
                        }
                        size="small"
                        color={isFull ? "warning" : "success"}
                        variant="outlined"
                      />
                    </Stack>

                    <Typography variant="body2" color="text.secondary">
                      {fmt(starts)} – {fmt(ends)}
                    </Typography>
                  </Stack>

                  <Stack
                    direction="row"
                    gap={1}
                    justifyContent={{ xs: "flex-start", md: "flex-end" }}
                    alignItems="center"
                    flexWrap="wrap"
                  >
                    <Link href={`/bo/classes/${s.id}`} style={{ textDecoration: "none" }}>
                      <Button
                        size="small"
                        variant="outlined"
                        startIcon={<OpenInNewOutlinedIcon fontSize="small" />}
                      >
                        {t("view")}
                      </Button>
                    </Link>
                    <Link href={`/bo/classes/${s.id}/edit`} style={{ textDecoration: "none" }}>
                      <Button
                        size="small"
                        variant="contained"
                        startIcon={<EditOutlinedIcon fontSize="small" />}
                      >
                        {editLabel}
                      </Button>
                    </Link>
                  </Stack>
                </Box>
              );
            })}
          </Stack>
        )}
      </Paper>
    </Stack>
  );
}
