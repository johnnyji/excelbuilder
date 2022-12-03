import { Divider, Typography } from "@mui/material";

import InvalidSubscriptionBanner from "../shared/InvalidSubscriptionBanner";

export default function DashboardWrapper({ children, title }) {
  return (
    <>
      <Typography variant="h4" gutterBottom>
        <b>{title}</b>
      </Typography>
      <Divider sx={{ marginBottom: 3 }} />
      <InvalidSubscriptionBanner />
      {children}
    </>
  );
}
