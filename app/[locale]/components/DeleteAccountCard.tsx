"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  Alert,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Stack,
  Typography,
} from "@mui/material";
import { useTranslations } from "next-intl";

export default function DeleteAccountCard() {
  const t = useTranslations("account.delete");

  const router = useRouter();
  const params = useParams();
  const locale = (params?.locale as string) || "es";

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [ok, setOk] = useState<string | null>(null);

  async function onDelete() {
    setErr(null);
    setOk(null);
    setLoading(true);

    try {
      const res = await fetch("/api/account", { method: "DELETE" });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setErr("DELETE_FAILED");
        return;
      }

      setOk(t("success"));

      setOpen(false);

      await signOut({ redirect: false });
      router.replace(`/${locale}/auth`);
    } catch {
      setErr("DELETE_FAILED");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Card elevation={0} sx={{ border: "1px solid", borderColor: "divider" }}>
        <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
          <Stack spacing={2}>
            <Typography variant="h5" fontWeight={900}>
              {t("title")}
            </Typography>

            <Alert severity="warning">{t("warning")}</Alert>

            {err && <Alert severity="error">{t(err)}</Alert>}

            {ok && <Alert severity="success">{ok}</Alert>}

            <Button
              variant="contained"
              color="error"
              disabled={loading}
              onClick={() => setOpen(true)}
              endIcon={
                loading ? (
                  <CircularProgress size={18} color="inherit" />
                ) : undefined
              }
            >
              {t("cta")}
            </Button>
          </Stack>
        </CardContent>
      </Card>

      <Dialog open={open} onClose={() => (!loading ? setOpen(false) : null)}>
        <DialogTitle>{t("dialogTitle")}</DialogTitle>
        <DialogContent>
          <DialogContentText>{t("dialogText")}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button disabled={loading} onClick={() => setOpen(false)}>
            {t("cancel")}
          </Button>
          <Button
            disabled={loading}
            color="error"
            variant="contained"
            onClick={onDelete}
            endIcon={
              loading ? (
                <CircularProgress size={18} color="inherit" />
              ) : undefined
            }
          >
            {loading ? t("confirmLoading") : t("confirm")}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
