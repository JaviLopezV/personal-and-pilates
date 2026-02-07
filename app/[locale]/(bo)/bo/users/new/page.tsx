"use client";

import { useEffect } from "react";
import { useActionState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Alert,
  Box,
  Button,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useTranslations } from "next-intl";
import { createUser, type UserActionState } from "../actions";
import BoPage from "../../../components/BoPage";
import BoCard from "../../../components/BoCard";

const initialState: UserActionState = { ok: true };

export default function NewUserPage() {
  const t = useTranslations("bo.boNewUser");

  const router = useRouter();
  const params = useParams();
  const locale = (params?.locale as string) || "es";

  const [state, formAction, isPending] = useActionState(
    createUser.bind(null, locale),
    initialState,
  );

  useEffect(() => {
    if (state.ok && state.userId) {
      router.push(`/${locale}/bo/users/${state.userId}/edit`);
      router.refresh();
    }
  }, [state, router, locale]);

  return (
    <BoPage title={t("title")} backHref="/bo/users" maxWidth={900}>
      <BoCard>
        <Box component="form" action={formAction}>
          <Stack spacing={2}>
            {state.ok === false && (state.formError || state.fieldErrors) && (
              <Alert severity="error">
                {state.formError ?? t("errors.reviewFields")}
              </Alert>
            )}

            <TextField
              name="email"
              label={t("fields.email")}
              required
              error={state.ok === false && !!state.fieldErrors?.email}
              helperText={
                state.ok === false ? state.fieldErrors?.email?.[0] : ""
              }
            />

            <TextField
              name="name"
              label={t("fields.name")}
              error={state.ok === false && !!state.fieldErrors?.name}
              helperText={
                state.ok === false ? state.fieldErrors?.name?.[0] : ""
              }
            />

            <TextField
              name="notes"
              label={t("fields.notes")}
              multiline
              minRows={3}
              placeholder={t("fields.notesPlaceholder")}
              error={state.ok === false && !!state.fieldErrors?.notes}
              helperText={
                state.ok === false ? state.fieldErrors?.notes?.[0] : ""
              }
            />

            <Box>
              <Typography variant="caption" color="text.secondary">
                {t("fields.role")}
              </Typography>
              <Select name="role" defaultValue="CLIENT" fullWidth>
                <MenuItem value="CLIENT">{t("roles.CLIENT")}</MenuItem>
                <MenuItem value="ADMIN">{t("roles.ADMIN")}</MenuItem>
                <MenuItem value="SUPERADMIN">{t("roles.SUPERADMIN")}</MenuItem>
              </Select>
            </Box>

            <Box>
              <Typography variant="caption" color="text.secondary">
                {t("fields.disabled")}
              </Typography>
              <Select name="disabled" defaultValue="false" fullWidth>
                <MenuItem value="false">{t("status.enabled")}</MenuItem>
                <MenuItem value="true">{t("status.disabled")}</MenuItem>
              </Select>
            </Box>

            <TextField
              name="availableClasses"
              label={t("fields.availableClasses")}
              type="number"
              defaultValue={0}
              inputProps={{ min: 0 }}
              required
              error={
                state.ok === false && !!state.fieldErrors?.availableClasses
              }
              helperText={
                state.ok === false
                  ? state.fieldErrors?.availableClasses?.[0]
                  : ""
              }
            />

            <Button
              type="submit"
              variant="contained"
              size="large"
              disabled={isPending}
            >
              {isPending ? t("submit.pending") : t("submit.idle")}
            </Button>
          </Stack>
        </Box>
      </BoCard>
    </BoPage>
  );
}
