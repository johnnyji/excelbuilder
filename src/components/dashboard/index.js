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

// TODO(Billing): Change this back when we enable billing
// import BillingIcon from "@mui/icons-material/CreditCard";
import LogoutIcon from "@mui/icons-material/Logout";
import ExplainerIcon from "@mui/icons-material/Plagiarism";
import GeneratorIcon from "@mui/icons-material/Superscript";
import LogoIcon from "@mui/icons-material/Task";

import RemainingCreditsContext from "../../contexts/RemainingCredits";

import { logout } from "../../firebase";

import colors from "../../config/colors";

const isPhone = isMobile().phone;
const drawerWidth = isPhone ? 56 : 240;

export default function Dashboard({ children }) {
  const location = useLocation();
  const navigate = useNavigate();

  const handleNavGenerator = useCallback(
    e => {
      navigate("/");
    },
    [navigate]
  );

  const handleNavExplainer = useCallback(
    e => {
      navigate("/explainer");
    },
    [navigate]
  );

  // TODO(Billing): Change this back when we enable billing
  // const handleNavBilling = useCallback(
  //   e => {
  //     navigate("/billing");
  //   },
  //   [navigate]
  // );

  const handleLogout = useCallback(() => {
    navigate("/signin");
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
            }
          }}
          variant="permanent"
          anchor="left"
        >
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
            {/* TODO(Billing): Change this back when we enable billing */}
            {/*
              <ListItem disablePadding>
                <ListItemButton
                  onClick={handleNavBilling}
                  selected={location.pathname === "/billing"}
                >
                  <ListItemIcon>
                    <BillingIcon />
                  </ListItemIcon>
                  {!isPhone && <ListItemText primary="Billing" />}
                </ListItemButton>
              </ListItem>
            */}
            <ListItem disablePadding>
              <ListItemButton onClick={handleLogout}>
                <ListItemIcon>
                  <LogoutIcon />
                </ListItemIcon>
                {!isPhone && <ListItemText primary="Logout" />}
              </ListItemButton>
            </ListItem>
          </List>
        </Drawer>
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          <Outlet />
        </Box>
      </Box>
    </RemainingCreditsContext>
  );
}
