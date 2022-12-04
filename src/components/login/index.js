import React from "react";
import { Box, Button, Chip, Paper, Typography } from "@mui/material";

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
        width: "100vw",
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
          alignItems: "center",
          maxWidth: 500,
        }}
        variant="outlined"
      >
        <Typography align="center" variant="h4" gutterBottom>
          <b>Excel Formulator</b>
        </Typography>
        <Typography align="center" variant="subtitle1" gutterBottom>
          Generate any Excel/Sheets/Airtable formula using AI
        </Typography>
        <Box mt={2} mb={1}>
          <Chip
            label="✅ 100% Free, No Credit Card Required"
            variant="outlined"
            color="success"
          />
        </Box>
        <Button
          onClick={signInWithGoogle}
          startIcon={<GoogleIcon />}
          variant="contained"
          size="large"
          style={{ marginTop: 24 }}
        >
          Sign in with Google
        </Button>
        <Box mt={6} sx={{ textAlign: "center" }}>
          <Typography
            variant="caption"
            align="center"
            style={{ color: "rgba(0,0,0,0.5)" }}
          >
            Your info is 100% private/secure. We will never send you
            marketing/unsolicited emails, nor share your email with anyone else.
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
}
