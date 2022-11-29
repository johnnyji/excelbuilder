import React from "react";
import { Button, Card, Typography } from "@mui/material";

import { signInWithGoogle } from "../../firebase";

export default function Login() {
  return (
    <Card>
      <Typography variant="subtitle1">Airtable Formula Builder</Typography>
      <Button onClick={signInWithGoogle}>Sign in with Google</Button>
    </Card>
  );
}
