import { Container, Box } from "@mui/material";
import DeleteAccountCard from "@/app/[locale]/components/DeleteAccountCard";

export default function Page() {
  return (
    <Box sx={{ minHeight: "70vh", display: "flex", alignItems: "center" }}>
      <Container maxWidth="sm">
        <DeleteAccountCard />
      </Container>
    </Box>
  );
}
