"use client";

import * as React from "react";
import {
  Box,
  Chip,
  Divider,
  Paper,
  Stack,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import { useTranslations } from "next-intl";

type UserDto = {
  id: string;
  email: string;
  name: string | null;
  role: string;
  disabled: boolean;
  availableClasses: number;
  createdAt: string;
  updatedAt: string;
};

type BookingDto = {
  id: string;
  status: "ACTIVE" | "CANCELED";
  createdAt: string;
  canceledAt: string | null;
  session: {
    id: string;
    title: string;
    type: string;
    instructor: string | null;
    startsAt: string;
    endsAt: string;
  };
};

function fmtDateTime(iso: string) {
  const d = new Date(iso);
  return new Intl.DateTimeFormat(undefined, {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(d);
}

function fmtShort(iso: string) {
  const d = new Date(iso);
  return new Intl.DateTimeFormat(undefined, {
    weekday: "short",
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(d);
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <Stack direction={{ xs: "column", sm: "row" }} spacing={1}>
      <Typography sx={{ width: { sm: 220 }, fontWeight: 800 }}>{label}</Typography>
      {/*
        Typography renders as <p> by default. Some values (e.g. MUI <Chip/>) render as <div>,
        and <div> inside <p> is invalid HTML and causes hydration warnings in Next.js.
      */}
      <Typography component="div" color="text.secondary" sx={{ wordBreak: "break-word" }}>
        {value}
      </Typography>
    </Stack>
  );
}

function BookingList({ items }: { items: BookingDto[] }) {
  const t = useTranslations("bo.boViewUser");

  if (items.length === 0) {
    return (
      <Paper variant="outlined">
        <Box p={3}>
          <Typography color="text.secondary">{t("history.empty")}</Typography>
        </Box>
      </Paper>
    );
  }

  return (
    <Paper variant="outlined">
      <Stack>
        {items.map((b) => {
          const s = b.session;
          return (
            <Box key={b.id} px={3} py={2}>
              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={1}
                alignItems={{ xs: "flex-start", sm: "center" }}
                justifyContent="space-between"
              >
                <Box>
                  <Typography fontWeight={900}>
                    {s.title}{" "}
                    <Typography component="span" color="text.secondary">
                      · {s.type}
                    </Typography>
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {fmtShort(s.startsAt)} – {fmtShort(s.endsAt)}
                    {s.instructor ? ` · ${t("history.instructor")}: ${s.instructor}` : ""}
                  </Typography>
                </Box>

                <Stack direction="row" spacing={1} alignItems="center">
                  <Chip
                    size="small"
                    label={b.status === "ACTIVE" ? t("history.status.active") : t("history.status.canceled")}
                    color={b.status === "ACTIVE" ? "success" : "default"}
                    variant="outlined"
                  />
                </Stack>
              </Stack>

              <Divider sx={{ mt: 2 }} />
            </Box>
          );
        })}
      </Stack>
    </Paper>
  );
}

export default function ViewUserClient({
  user,
  bookings,
}: {
  user: UserDto;
  bookings: BookingDto[];
}) {
  const t = useTranslations("bo.boViewUser");
  const [tab, setTab] = React.useState<"details" | "history">("details");

  const now = Date.now();
  const upcoming = bookings
    .filter((b) => new Date(b.session.startsAt).getTime() >= now)
    .sort((a, b) => new Date(a.session.startsAt).getTime() - new Date(b.session.startsAt).getTime());
  const past = bookings
    .filter((b) => new Date(b.session.startsAt).getTime() < now)
    .sort((a, b) => new Date(b.session.startsAt).getTime() - new Date(a.session.startsAt).getTime());

  return (
    <Stack spacing={2}>
      <Paper variant="outlined" sx={{ px: 2, pt: 1 }}>
        <Tabs
          value={tab}
          onChange={(_, v) => setTab(v)}
          aria-label={t("tabs.aria")}
        >
          <Tab value="details" label={t("tabs.details")} />
          <Tab value="history" label={t("tabs.history")} />
        </Tabs>
      </Paper>

      {tab === "details" ? (
        <Paper variant="outlined">
          <Stack spacing={2} p={3}>
            <Row label={t("details.id")} value={user.id} />
            <Row label={t("details.email")} value={user.email} />
            <Row label={t("details.name")} value={user.name || t("details.noName")} />
            <Row label={t("details.role")} value={user.role} />
            <Row
              label={t("details.access")}
              value={
                user.disabled ? (
                  <Chip size="small" label={t("details.disabled")} variant="outlined" />
                ) : (
                  <Chip size="small" label={t("details.enabled")} variant="outlined" color="success" />
                )
              }
            />
            <Row
              label={t("details.availableClasses")}
              value={t("details.availableClassesValue", { n: user.availableClasses })}
            />
            <Divider />
            <Row label={t("details.createdAt")} value={fmtDateTime(user.createdAt)} />
            <Row label={t("details.updatedAt")} value={fmtDateTime(user.updatedAt)} />
          </Stack>
        </Paper>
      ) : (
        <Stack spacing={2}>
          <Box>
            <Typography variant="h6" fontWeight={900} sx={{ mb: 1 }}>
              {t("history.upcoming")}
            </Typography>
            <BookingList items={upcoming} />
          </Box>

          <Box>
            <Typography variant="h6" fontWeight={900} sx={{ mb: 1 }}>
              {t("history.past")}
            </Typography>
            <BookingList items={past} />
          </Box>
        </Stack>
      )}
    </Stack>
  );
}
