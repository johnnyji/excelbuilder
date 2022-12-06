import React from "react";
import {
  Box,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
} from "@mui/material";

import LogoIcon from "@mui/icons-material/Task";

import LoginCard from "./LoginCard";

import landingExample from "./landing_example.gif";

import colors from "../../config/colors";

export default function Login() {
  return (
    <Box
      style={{
        display: "flex",
        justifyContent: "space-around",
        flexWrap: "wrap",
        alignItems: "center",
        backgroundColor: "#F7F7F7F7",
        minHeight: "100vh",
        padding: 32,
        position: "relative",
      }}
    >
      <div style={{ paddingBottom: 32 }}>
        <header>
          <ListItem disableGutters>
            <ListItemAvatar>
              <LogoIcon
                fontSize="large"
                sx={{ color: colors.brandPrimary, marginRight: 2 }}
              />
            </ListItemAvatar>
            <ListItemText
              primary={
                <Typography
                  align="center"
                  variant="h5"
                  sx={{ display: "flex", alignItems: "center" }}
                >
                  <b>{process.env.REACT_APP_APP_NAME}</b>
                </Typography>
              }
              secondary={
                <Typography variant="subtitle2" gutterBottom>
                  Generate any Excel, Google Sheets or Airtable formula using AI
                </Typography>
              }
            />
          </ListItem>
        </header>

        <img src={landingExample} alt="excel formulator demo" />
      </div>
      <Box
        style={{
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <LoginCard />
      </Box>
    </Box>
  );
}
