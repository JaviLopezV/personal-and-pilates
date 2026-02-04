"use client";
import { useEffect, useMemo, useState } from "react";
import { useActionState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Alert, Box, Button, Stack, TextField } from "@mui/material";
import { createClassSession, type ClassActionState } from "../actions";
import { useTranslations } from "next-intl";
import BoPage from "../../../components/BoPage";
import BoCard from "../../../components/BoCard";

const initialState: ClassActionState = { ok: true };

export default function NewClassPage() {
  const t = useTranslations("bo.boNewClass");

  const today = useMemo(() => {
    const d = new Date();
    const pad = (n: number) => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  }, []);

  const [startDate, setStartDate] = useState(today);
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("10:00");

  const router = useRouter();
  const params = useParams();
  const locale = (params?.locale as string) || "es";

  const [state, formAction, isPending] = useActionState(
    createClassSession.bind(null, locale),
    initialState,
  );

  useEffect(() => {
    if (state.ok && state.classId) {
      router.push(`/${locale}/bo/classes/${state.classId}/edit`);
      router.refresh();
    }
  }, [state, router, locale]);

  return (
    <BoPage title={t("title")} backHref="/bo/classes" maxWidth={900}>
      <BoCard>
        <Box component="form" action={formAction}>
          <Stack spacing={2}>
            {state.ok === false && (state.formError || state.fieldErrors) && (
              <Alert severity="error">
                {state.formError ?? t("errors.reviewFields")}
              </Alert>
            )}

            <TextField
              name="title"
              label={t("fields.title")}
              required
              error={state.ok === false && !!state.fieldErrors?.title}
              helperText={state.ok === false ? state.fieldErrors?.title?.[0] : ""}
            />

            <TextField
              name="type"
              label={t("fields.type")}
              required
              error={state.ok === false && !!state.fieldErrors?.type}
              helperText={state.ok === false ? state.fieldErrors?.type?.[0] : ""}
            />

            <TextField name="instructor" label={t("fields.instructor")} />
            <TextField
              name="notes"
              label={t("fields.notes")}
              multiline
              minRows={2}
            />

            <TextField
              name="startDate"
              label={t("fields.startDate")}
              type="date"
              InputLabelProps={{ shrink: true }}
              required
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              inputProps={{ min: today }}
              error={state.ok === false && !!state.fieldErrors?.startDate}
              helperText={state.ok === false ? state.fieldErrors?.startDate?.[0] : ""}
            />

            <TextField
              name="startTime"
              label={t("fields.startTime")}
              type="time"
              InputLabelProps={{ shrink: true }}
              required
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              error={state.ok === false && !!state.fieldErrors?.startTime}
              helperText={state.ok === false ? state.fieldErrors?.startTime?.[0] : ""}
            />

<TextField
  name="endDate_display"
  type="date"
  label={t("fields.endDate")}
  value={startDate}
  disabled
  InputLabelProps={{ shrink: true }}
/>

            <input type="hidden" name="endDate" value={startDate} />

            <TextField
              name="endTime"
              label={t("fields.endTime")}
              type="time"
              InputLabelProps={{ shrink: true }}
              required
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              error={state.ok === false && !!state.fieldErrors?.endTime}
              helperText={state.ok === false ? state.fieldErrors?.endTime?.[0] : ""}
            />

            <TextField
              name="capacity"
              label={t("fields.capacity")}
              type="number"
              defaultValue={10}
              inputProps={{ min: 1 }}
              required
              error={state.ok === false && !!state.fieldErrors?.capacity}
              helperText={state.ok === false ? state.fieldErrors?.capacity?.[0] : ""}
            />

            <Button type="submit" variant="contained" size="large" disabled={isPending}>
              {isPending ? t("submit.pending") : t("submit.idle")}
            </Button>
          </Stack>
        </Box>
      </BoCard>
    </BoPage>
  );
}
