import React, { useContext } from "react";
import { Alert, Box } from "@mui/material";
import { Link } from "react-router-dom";

import { RemainingCreditsContext } from "../../contexts/RemainingCredits";
import { UserContext } from "../../contexts/User";

export default function RemainingCreditsBanner() {
  const user = useContext(UserContext);
  const remainingCredits = useContext(RemainingCreditsContext);

  if (user.subscriptionPlanKey !== "STARTER") return null;

  return (
    <Box mb={2}>
      <Alert severity={remainingCredits === 0 ? "error" : "info"}>
        {remainingCredits} credits left this month —{" "}
        <Link to="/billing">Get more credits here!</Link>
      </Alert>
    </Box>
  );
}
