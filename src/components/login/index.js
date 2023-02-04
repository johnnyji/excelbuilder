import React from "react";
import { Box } from "@mui/material";

import LoginCard from "./LoginCard";

export default function Login() {
  return (
    <Box
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#F7F7F7F7",
        minHeight: "100vh",
        padding: 32,
        position: "relative"
      }}
    >
      <LoginCard />
    </Box>
  );
}
