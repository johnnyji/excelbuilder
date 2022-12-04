import React from "react";
import { Box, Button, Paper, Typography } from "@mui/material";

import { signInWithGoogle } from "../../firebase";
import GoogleIcon from "@mui/icons-material/Google";

export default function Login() {
  return (
    <Box
      style={{
        alignItems: "center",
        backgroundColor: "#F7F7F7",
        display: "flex",
        height: "100vh",
        justifyContent: "center",
        width: "100vw"
      }}
    >
      <Paper
        style={{
          paddingTop: 64,
          paddingBottom: 64,
          paddingLeft: 48,
          paddingRight: 48,
          display: "flex",
          flexDirection: "column",
          alignItems: "center"
        }}
        variant="outlined"
      >
        <Typography variant="h4" gutterBottom>
          <b>Excel Formulator</b>
        </Typography>
        <Typography variant="subtitle1" gutterBottom>
          Generate any Excel/Sheets/Airtable formula using AI
        </Typography>
        <Button
          onClick={signInWithGoogle}
          startIcon={<GoogleIcon />}
          variant="outlined"
          size="large"
          style={{ marginTop: 24 }}
        >
          Sign in with Google
        </Button>
      </Paper>
    </Box>
  );
}
