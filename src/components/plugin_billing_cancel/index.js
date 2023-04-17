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

export default function PluginBillingCancel() {
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
            Payment not processed <Emoji symbol="❌" />
          </b>
        </Typography>
        <Typography variant="subtitle1" style={{ marginBottom: 16 }}>
          Oops... your subscription was not properly processed.
        </Typography>
        <Typography variant="subtitle1">
          Please head back into the {pluginTitle} and try to subscribe again. If
          this issue persists, please contact{" "}
          {process.env.REACT_APP_SUPPORT_EMAIL} and we'll sort this out for you!
        </Typography>
      </Box>
    </div>
  );
}
