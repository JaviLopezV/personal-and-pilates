import { Box, Container, Typography } from "@mui/material";
import ConstructionIcon from "@mui/icons-material/Construction";
import { getTranslations } from "next-intl/server";
import FoLayout from "../(fo)/FoShellClient";

type PageStatus = "ACTIVE" | "UNDER_CONSTRUCTION" | "INACTIVE";

export default async function UnderConstructionPage() {
  const t = await getTranslations("underConstruction");
  const pageStatuses: Record<string, PageStatus> = {};
  return (
    <FoLayout pageStatuses={pageStatuses}>
      <Container maxWidth="sm" sx={{ textAlign: "center", pt: 16 }}>
        <Box mb={3}>
          <ConstructionIcon sx={{ fontSize: 90, color: "warning.main" }} />
        </Box>

        <Typography variant="h3" fontWeight={900} gutterBottom>
          {t("title")}
        </Typography>

        <Typography color="text.secondary" sx={{ mb: 4 }}>
          {t("subtitle")}
        </Typography>
      </Container>
    </FoLayout>
  );
}
