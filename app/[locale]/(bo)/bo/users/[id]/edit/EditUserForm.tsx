"use client";

import { useEffect } from "react";
import { useActionState } from "react";
import { useRouter } from "next/navigation";
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
import { updateUser, type UserActionState } from "../../actions";
import BoCard from "../../../../components/BoCard";

type Props = {
  locale: string;
  user: {
    id: string;
    email: string;
    name: string | null;
    notes: string | null;
    role: "CLIENT" | "ADMIN" | "SUPERADMIN";
    disabled: boolean;
    availableClasses: number;
  };
};

const initialState: UserActionState = { ok: true };

export default function EditUserForm({ locale, user }: Props) {
  const t = useTranslations("bo.boEditUser");
  const router = useRouter();

  const [state, formAction, isPending] = useActionState(
    updateUser.bind(null, locale, user.id),
    initialState,
  );

  useEffect(() => {
    if (state.ok && state.userId) {
      router.refresh();
    }
  }, [state, router]);

  return (
    <BoCard>
      <Box component="form" action={formAction}>
        <Stack spacing={2}>
          {state.ok === false && (state.formError || state.fieldErrors) && (
            <Alert severity="error">
              {state.formError ?? t("errors.reviewFields")}
            </Alert>
          )}

          <TextField label={t("fields.email")} value={user.email} disabled />

          <TextField
            name="name"
            label={t("fields.name")}
            defaultValue={user.name ?? ""}
            error={state.ok === false && !!state.fieldErrors?.name}
            helperText={state.ok === false ? state.fieldErrors?.name?.[0] : ""}
          />

          <TextField
            name="notes"
            label={t("fields.notes")}
            defaultValue={user.notes ?? ""}
            multiline
            minRows={3}
            placeholder={t("fields.notesPlaceholder")}
            error={state.ok === false && !!state.fieldErrors?.notes}
            helperText={state.ok === false ? state.fieldErrors?.notes?.[0] : ""}
          />

          <Box>
            <Typography variant="caption" color="text.secondary">
              {t("fields.role")}
            </Typography>
            <Select name="role" defaultValue={user.role} fullWidth>
              <MenuItem value="CLIENT">{t("roles.CLIENT")}</MenuItem>
              <MenuItem value="ADMIN">{t("roles.ADMIN")}</MenuItem>
              <MenuItem value="SUPERADMIN">{t("roles.SUPERADMIN")}</MenuItem>
            </Select>
          </Box>

          <Box>
            <Typography variant="caption" color="text.secondary">
              {t("fields.disabled")}
            </Typography>
            <Select
              name="disabled"
              defaultValue={user.disabled ? "true" : "false"}
              fullWidth
            >
              <MenuItem value="false">{t("status.enabled")}</MenuItem>
              <MenuItem value="true">{t("status.disabled")}</MenuItem>
            </Select>
          </Box>

          <TextField
            name="availableClasses"
            label={t("fields.availableClasses")}
            type="number"
            defaultValue={user.availableClasses}
            inputProps={{ min: 0 }}
            required
            error={state.ok === false && !!state.fieldErrors?.availableClasses}
            helperText={
              state.ok === false ? state.fieldErrors?.availableClasses?.[0] : ""
            }
          />

          <Button type="submit" variant="contained" size="large" disabled={isPending}>
            {isPending ? t("submit.pending") : t("submit.idle")}
          </Button>
        </Stack>
      </Box>
    </BoCard>
  );
}
