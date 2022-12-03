import { Box, Divider, Typography } from "@mui/material";

import InvalidSubscriptionBanner from "../shared/InvalidSubscriptionBanner";

export default function DashboardWrapper({ children, title, subtitle }) {
  return (
    <>
      <Box mb={2}>
        <Typography variant="h4">
          <b>{title}</b>
        </Typography>
        {subtitle && <Typography variant="subtitle1">{subtitle}</Typography>}
      </Box>
      <Divider sx={{ marginBottom: 3 }} />
      <InvalidSubscriptionBanner />
      {children}
    </>
  );
}
