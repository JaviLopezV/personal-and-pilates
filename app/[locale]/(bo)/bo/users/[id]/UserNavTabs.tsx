"use client";

import * as React from "react";
import { Tabs, Tab } from "@mui/material";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";

type Props = {
  id: string;
  active: "view" | "edit";
};

export default function UserNavTabs({ id, active }: Props) {
  const t = useTranslations("bo.boViewUser");

  return (
    <Tabs
      value={active}
      aria-label={t("nav.aria")}
      sx={{ minHeight: 40, "& .MuiTab-root": { minHeight: 40 } }}
    >
      <Tab
        value="view"
        label={t("nav.view")}
        component={Link as any}
        href={`/bo/users/${id}`}
      />
      <Tab
        value="edit"
        label={t("nav.edit")}
        component={Link as any}
        href={`/bo/users/${id}/edit`}
      />
    </Tabs>
  );
}
