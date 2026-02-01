"use client";

import * as React from "react";
import {
  AppBar,
  Box,
  Container,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Stack,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";

import { Link } from "@/i18n/navigation";
import LogoutButton from "../components/LogoutButton";
import LocaleSwitcher from "../components/LocaleSwitcher";
import { useTranslations } from "next-intl";
import { showLegalFooter } from "@/app/stores/sharedStore";

type PageStatus = "ACTIVE" | "UNDER_CONSTRUCTION" | "INACTIVE";

type Props = {
  children: React.ReactNode;
  pageStatuses: Record<string, PageStatus>;
};

export default function FoLayout({ children, pageStatuses }: Props) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const t = useTranslations("foLayout");
  const theme = useTheme();
  React.useEffect(() => {
    showLegalFooter();
  }, []);

  const isInactive = (path: string) => pageStatuses?.[path] === "INACTIVE";

  const isSmUp = useMediaQuery(theme.breakpoints.up("sm"));

  const open = Boolean(anchorEl);

  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) =>
    setAnchorEl(event.currentTarget);
  const handleCloseMenu = () => setAnchorEl(null);

  return (
    <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <AppBar position="sticky" elevation={0}>
        <Container maxWidth="lg">
          <Toolbar
            disableGutters
            sx={{
              minHeight: { xs: 56, sm: 64 },
              gap: { xs: 1, sm: 1.5 },
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              py: { xs: 0.5, sm: 0 },
            }}
          >
            {/* Left: Brand */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                minWidth: 0,
              }}
            >
              {!isSmUp && (
                <>
                  <IconButton
                    color="inherit"
                    aria-label={t("nav.openMenuAria")}
                    onClick={handleOpenMenu}
                    size="large"
                    sx={{ mr: 0.5 }}
                  >
                    <MenuIcon />
                  </IconButton>

                  <Menu
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleCloseMenu}
                    keepMounted
                    anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
                    transformOrigin={{ vertical: "top", horizontal: "left" }}
                  >
                    <MenuItem
                      component={Link as any}
                      href="/home"
                      onClick={handleCloseMenu}
                    >
                      {t("nav.home")}
                    </MenuItem>

                    <MenuItem
                      component={Link as any}
                      href="/classes"
                      onClick={handleCloseMenu}
                      disabled={isInactive("/classes")}
                    >
                      {t("nav.classes")}
                    </MenuItem>

                    <MenuItem
                      component={Link as any}
                      href="/account/bookings"
                      onClick={handleCloseMenu}
                      disabled={isInactive("/account/bookings")}
                    >
                      {t("nav.bookings")}
                    </MenuItem>

                    <MenuItem
                      component={Link as any}
                      href="/blog"
                      onClick={handleCloseMenu}
                      disabled={isInactive("/blog")}
                    >
                      {t("nav.blog")}
                    </MenuItem>

                    <MenuItem
                      component={Link as any}
                      href="/games"
                      onClick={handleCloseMenu}
                      disabled={isInactive("/games")}
                    >
                      {t("nav.games")}
                    </MenuItem>

                    <MenuItem
                      component={Link as any}
                      href="/account/settings"
                      onClick={handleCloseMenu}
                    >
                      {t("nav.settings")}
                    </MenuItem>

                    <MenuItem onClick={handleCloseMenu} sx={{ py: 0 }}>
                      <Box sx={{ width: "100%" }}>
                        <LogoutButton />
                      </Box>
                    </MenuItem>
                  </Menu>
                </>
              )}

              <Typography
                variant="h6"
                noWrap
                component={Link as any}
                href="/home"
                sx={{
                  fontWeight: 800,
                  minWidth: 0,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  fontSize: { xs: "1rem", sm: "1.1rem" },
                  color: "inherit",
                  textDecoration: "none",
                  cursor: "pointer",
                  "&:hover": { opacity: 0.85 },
                }}
              >
                {t("brand")}
              </Typography>
            </Box>

            {/* Right: Actions */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: { xs: 1, sm: 1.5 },
              }}
            >
              {isSmUp && (
                <Stack direction="row" spacing={1} alignItems="center">
                  <Button
                    color="inherit"
                    component={Link as any}
                    href="/home"
                    sx={{ whiteSpace: "nowrap" }}
                  >
                    {t("nav.home")}
                  </Button>

                  <Button
                    color="inherit"
                    component={Link as any}
                    href="/classes"
                    sx={{ whiteSpace: "nowrap" }}
                  >
                    {t("nav.classes")}
                  </Button>

                  <Button
                    color="inherit"
                    component={Link as any}
                    href="/account/bookings"
                    sx={{ whiteSpace: "nowrap" }}
                    disabled={isInactive("/account/bookings")}
                  >
                    {t("nav.bookings")}
                  </Button>

                  <Button
                    color="inherit"
                    component={Link as any}
                    href="/blog"
                    sx={{ whiteSpace: "nowrap" }}
                    disabled={isInactive("/blog")}
                  >
                    {t("nav.blog")}
                  </Button>

                  <Button
                    color="inherit"
                    component={Link as any}
                    href="/games"
                    sx={{ whiteSpace: "nowrap" }}
                    disabled={isInactive("/games")}
                  >
                    {t("nav.games")}
                  </Button>

                  <Button
                    color="inherit"
                    component={Link as any}
                    href="/account/settings"
                    sx={{ whiteSpace: "nowrap" }}
                  >
                    {t("nav.settings")}
                  </Button>

                  <LogoutButton />
                </Stack>
              )}

              <LocaleSwitcher />
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      <Container
        maxWidth="lg"
        sx={{
          flex: 1,
          py: { xs: 2, sm: 3, md: 4 },
        }}
      >
        {children}
      </Container>
    </Box>
  );
}
