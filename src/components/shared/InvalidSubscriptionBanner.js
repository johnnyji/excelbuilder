import React, { useContext } from "react";
import { Alert, Box } from "@mui/material";
import { Link, useLocation } from "react-router-dom";

import { UserContext } from "../../contexts/User";

export default function InvalidSubscriptionBanner() {
  const user = useContext(UserContext);
  const location = useLocation();

  if (!user.paymentDelinquent) return null;

  const billingPageLink =
    location.pathname === "/billing" ? (
      'update your billing info below by clicking "Manage/Renew Plan"'
    ) : (
      <Link to="/billing">update your billing information here</Link>
    );

  return (
    <Box mb={2}>
      <Alert severity="error">
        Oh no! There was an issue proccessing your payment, please{" "}
        {billingPageLink} order to continue using{" "}
        {process.env.REACT_APP_APP_NAME}
      </Alert>
    </Box>
  );
}
