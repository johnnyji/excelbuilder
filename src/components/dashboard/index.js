import React, { useCallback, useContext } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import {
  Avatar,
  Box,
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography
} from "@mui/material";

import BillingIcon from "@mui/icons-material/CreditCard";
import LogoutIcon from "@mui/icons-material/Logout";
import ExplainerIcon from "@mui/icons-material/Plagiarism";
import GeneratorIcon from "@mui/icons-material/Superscript";

import RemainingCreditsContext from "../../contexts/RemainingCredits";

import { UserContext } from "../../contexts/User";

import { logout } from "../../firebase";

const drawerWidth = 240;

export default function Dashboard({ children }) {
  const location = useLocation();
  const navigate = useNavigate();
  const user = useContext(UserContext);

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

  const handleNavBilling = useCallback(
    e => {
      navigate("/billing");
    },
    [navigate]
  );

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
          <Toolbar>
            <Avatar src={user.photoURL} />
            <Typography variant="subtitle">{user.displayName}</Typography>
          </Toolbar>
          <Divider />
          <List>
            <ListItem disablePadding selected={location.pathname === "/"}>
              <ListItemButton onClick={handleNavGenerator}>
                <ListItemIcon>
                  <GeneratorIcon />
                </ListItemIcon>
                <ListItemText primary="Builder" />
              </ListItemButton>
            </ListItem>
            <ListItem
              disablePadding
              selected={location.pathname === "/explainer"}
            >
              <ListItemButton onClick={handleNavExplainer}>
                <ListItemIcon>
                  <ExplainerIcon />
                </ListItemIcon>
                <ListItemText primary="Explainer" />
              </ListItemButton>
            </ListItem>
          </List>
          <Divider />
          <List>
            <ListItem
              disablePadding
              selected={location.pathname === "/billing"}
            >
              <ListItemButton onClick={handleNavBilling}>
                <ListItemIcon>
                  <BillingIcon />
                </ListItemIcon>
                <ListItemText primary="Billing" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton onClick={handleLogout}>
                <ListItemIcon>
                  <LogoutIcon />
                </ListItemIcon>
                <ListItemText primary="Logout" />
              </ListItemButton>
            </ListItem>
          </List>
        </Drawer>
        <Box
          component="main"
          sx={{ flexGrow: 1, bgcolor: "background.default", p: 3 }}
        >
          <Outlet />
        </Box>
      </Box>
    </RemainingCreditsContext>
  );
}
