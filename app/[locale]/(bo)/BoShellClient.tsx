"use client";

import * as React from "react";
import {
  AppBar,
  Box,
  Drawer,
  Toolbar,
  Typography,
  List,
  ListItemButton,
  ListItemText,
  IconButton,
  Divider,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { Link } from "@/i18n/navigation";

import LogoutButton from "../components/LogoutButton";
import LocaleSwitcher from "../components/LocaleSwitcher";
import { useTranslations } from "next-intl";
import { showLegalFooter } from "@/app/stores/sharedStore";

const drawerWidth = 260;

export default function BoShellClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const t = useTranslations("boLayout");

  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));
  const [mobileOpen, setMobileOpen] = React.useState(false);
  React.useEffect(() => {
    showLegalFooter();
  }, []);
  const toggleDrawer = () => setMobileOpen(!mobileOpen);

  const DrawerContent = (
    <Box>
      <Toolbar />
      <Box sx={{ px: 1 }}>
        <Typography sx={{ px: 2, py: 1, fontWeight: 800 }}>
          {t("drawerTitle")}
        </Typography>

        <Divider sx={{ mb: 1 }} />

        <List>
          <ListItemButton
            onClick={!isDesktop && toggleDrawer}
            component={Link as any}
            href="/bo/pages"
          >
            <ListItemText primary={t("nav.pages")} />
          </ListItemButton>

          <ListItemButton
            onClick={!isDesktop && toggleDrawer}
            component={Link as any}
            href="/bo/classes"
          >
            <ListItemText primary={t("nav.classes")} />
          </ListItemButton>

          <ListItemButton
            onClick={!isDesktop && toggleDrawer}
            component={Link as any}
            href="/bo/blogs"
          >
            <ListItemText primary={t("nav.blogs")} />
          </ListItemButton>

          <ListItemButton
            onClick={!isDesktop && toggleDrawer}
            component={Link as any}
            href="/bo/users"
          >
            <ListItemText primary={t("nav.users")} />
          </ListItemButton>

          <ListItemButton
            onClick={!isDesktop && toggleDrawer}
            component={Link as any}
            href="/bo/account/settings"
          >
            <ListItemText primary={t("nav.settings")} />
          </ListItemButton>

          <ListItemButton>
            <LogoutButton />
          </ListItemButton>

          <ListItemButton>
            <LocaleSwitcher />
          </ListItemButton>
        </List>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ minHeight: "100vh", display: "flex" }}>
      {/* Sidebar */}
      <Drawer
        variant={isDesktop ? "permanent" : "temporary"}
        open={isDesktop || mobileOpen}
        onClose={toggleDrawer}
        ModalProps={{ keepMounted: true }}
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
      >
        {DrawerContent}
      </Drawer>

      {/* Main */}
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="sticky" elevation={0}>
          <Toolbar>
            {!isDesktop && (
              <IconButton
                color="inherit"
                edge="start"
                onClick={toggleDrawer}
                aria-label={t("openMenuAria")}
                sx={{ mr: 1 }}
              >
                <MenuIcon />
              </IconButton>
            )}
            <Typography variant="h6" sx={{ fontWeight: 800 }}>
              {t("topbarTitle")}
            </Typography>
          </Toolbar>
        </AppBar>

        <Box
          sx={{
            p: { xs: 2, sm: 3, md: 4 },
            maxWidth: 1400,
            mx: "auto",
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
}
