import React, { useContext } from "react";
import { Alert, AlertTitle } from "@mui/material";
import { Link } from "react-router-dom";

import { RemainingCreditsContext } from "../../contexts/RemainingCredits";
import { UserContext } from "../../contexts/User";

const styles = {
  main: {
    padding: "8px",
    display: "flex",
    justifyContent: "space-between"
  }
};

export default function Header() {
  const user = useContext(UserContext);
  const remainingCredits = useContext(RemainingCreditsContext);

  return (
    <Alert severity="info">
      <AlertTitle>
        {user.subscriptionPlan !== "STARTER" ? (
          "Unlimited Credits"
        ) : (
          <Link to="/billing">{remainingCredits} credits left this month</Link>
        )}
      </AlertTitle>
      <Link to="/billing">
        Upgrade to the premium plan to access unlimited builds & explains!
      </Link>
    </Alert>
  );
}
