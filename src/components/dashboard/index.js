import React, { useCallback } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import isMobile from "ismobilejs";
import {
  Box,
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography
} from "@mui/material";

import BillingIcon from "@mui/icons-material/CreditCard";
import HelpIcon from "@mui/icons-material/Help";
import LogoutIcon from "@mui/icons-material/Logout";
import ExplainerIcon from "@mui/icons-material/Plagiarism";
import GeneratorIcon from "@mui/icons-material/Superscript";
import LogoIcon from "@mui/icons-material/Task";

import RemainingCreditsContext from "../../contexts/RemainingCredits";

import colors from "../../config/colors";
import { logout } from "../../firebase";

const isPhone = isMobile().phone;
const drawerWidth = isPhone ? 56 : 240;

export default function Dashboard({ children }) {
  const location = useLocation();
  const navigate = useNavigate();

  const handleHelpDesk = useCallback(() => {
    window.open(
      "https://rich-pencil-9ae.notion.site/Excel-Formulator-85ac0eae6d5247bf9f491d9d718ebede",
      "_blank"
    );
  }, []);

  const handleNavGenerator = useCallback(
    e => {
      navigate("/app");
    },
    [navigate]
  );

  const handleNavExplainer = useCallback(
    e => {
      navigate("/app/explainer");
    },
    [navigate]
  );

  const handleNavBilling = useCallback(
    e => {
      navigate("/app/billing");
    },
    [navigate]
  );

  const handleLogout = useCallback(() => {
    navigate("/");
    logout();
  }, [navigate]);

  return (
    <RemainingCreditsContext>
      <Box sx={{ display: "flex" }}>
        <Drawer
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            "& .MuiDrawer-paper": {
              width: drawerWidth,
              boxSizing: "border-box"
            },
            display: "flex",
            flexDirection: "column"
          }}
          variant="permanent"
          anchor="left"
        >
          <div style={{ flex: "1 1 auto" }}>
            <Box mb={2} mt={2}>
              <ListItem>
                <ListItemIcon>
                  <LogoIcon sx={{ color: colors.brandPrimary }} />
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Typography
                      variant="subtitle1"
                      style={{
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis"
                      }}
                    >
                      <b>{process.env.REACT_APP_APP_NAME}</b>
                    </Typography>
                  }
                />
              </ListItem>
            </Box>
            <Divider />
            <List>
              <ListItem disablePadding>
                <ListItemButton
                  onClick={handleNavGenerator}
                  selected={location.pathname === "/"}
                >
                  <ListItemIcon>
                    <GeneratorIcon />
                  </ListItemIcon>
                  {!isPhone && <ListItemText primary="Builder" />}
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding>
                <ListItemButton
                  onClick={handleNavExplainer}
                  selected={location.pathname === "/explainer"}
                >
                  <ListItemIcon>
                    <ExplainerIcon />
                  </ListItemIcon>
                  {!isPhone && <ListItemText primary="Explainer" />}
                </ListItemButton>
              </ListItem>
            </List>
            <Divider />
            <List>
              <ListItem disablePadding>
                <ListItemButton onClick={handleHelpDesk}>
                  <ListItemIcon>
                    <HelpIcon />
                  </ListItemIcon>
                  {!isPhone && <ListItemText primary="Help Desk" />}
                </ListItemButton>
              </ListItem>

              <ListItem disablePadding>
                <ListItemButton
                  onClick={handleNavBilling}
                  selected={location.pathname === "/app/billing"}
                >
                  <ListItemIcon>
                    <BillingIcon />
                  </ListItemIcon>
                  {!isPhone && <ListItemText primary="Billing" />}
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding>
                <ListItemButton onClick={handleLogout}>
                  <ListItemIcon>
                    <LogoutIcon />
                  </ListItemIcon>
                  {!isPhone && <ListItemText primary="Logout" />}
                </ListItemButton>
              </ListItem>
            </List>
          </div>
        </Drawer>
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          <Outlet />
        </Box>
      </Box>
    </RemainingCreditsContext>
  );
}
