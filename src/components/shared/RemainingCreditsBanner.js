import React, { useContext } from "react";
import { Alert, Box } from "@mui/material";
import { Link } from "react-router-dom";

import Emoji from "../ui/Emoji";

import { RemainingCreditsContext } from "../../contexts/RemainingCredits";
import { UserContext } from "../../contexts/User";
import { subscriptionPlanKey } from "../../config/billing";

export default function RemainingCreditsBanner() {
  const user = useContext(UserContext);
  const { remainingCredits } = useContext(RemainingCreditsContext);

  if (user.subscriptionPlanKey !== subscriptionPlanKey.STARTER) return null;

  if (remainingCredits === 0) {
    return (
      <Box mb={2}>
        <Alert severity="error">
          You're out of credits for the month <Emoji symbol="😢" /> Credits
          reset on the 1st of every month. If you would like unlimited credits,
          you can{" "}
          <Link to="/app/billing" style={{ textDecoration: "underline" }}>
            upgrade your plan here!
          </Link>
        </Alert>
      </Box>
    );
  }

  return (
    <Box mb={2}>
      <Alert severity={remainingCredits === 0 ? "error" : "warning"}>
        {remainingCredits} credits left this month —{" "}
        <Link to="/app/billing" style={{ textDecoration: "underline" }}>
          Get more credits here!
        </Link>
      </Alert>
    </Box>
  );
}
