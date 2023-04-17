import { Box, Typography } from "@mui/material";
import { useSearchParams } from "react-router-dom";

import Emoji from "../ui/Emoji";

const styles = {
  wrapper: {
    alignItems: "center",
    backgroundColor: "#FFF",
    display: "flex",
    height: "100vh",
    justifyContent: "center",
    left: 0,
    position: "absolute",
    top: 0,
    width: "100vw",
    // This will override the sidebar
    zIndex: 10000,
  },
  content: {
    alignItems: "flex-start",
    display: "flex",
    flexDirection: "column",
    maxWidth: 700,
    justifyContent: "center",
  },
};

export default function PluginBillingSuccess() {
  const [searchParams] = useSearchParams();
  const platform = searchParams.get("platform");

  let pluginTitle = "Excel Formulator plugin";
  if (platform === "MS")
    pluginTitle = "Excel Formulator Microsoft office plugin";

  return (
    <div style={styles.wrapper}>
      <Box sx={styles.content}>
        <Typography gutterBottom variant="h3">
          <b>
            Thank you for subscribing! <Emoji symbol="🥳" />
          </b>
        </Typography>
        <Typography variant="subtitle1" style={{ marginBottom: 16 }}>
          Your subscription has been successfully processed!
        </Typography>
        <Typography variant="subtitle1">
          Please go back to the {pluginTitle} and refresh that page in order to
          use Excel Formulator Pro. If you have any issues/questions, please
          contact {process.env.REACT_APP_SUPPORT_EMAIL} and we'll be here to
          help!
        </Typography>
      </Box>
    </div>
  );
}
