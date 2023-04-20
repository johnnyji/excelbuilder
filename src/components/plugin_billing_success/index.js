import { Box, Button, Typography } from "@mui/material";
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
    zIndex: 10000
  },
  content: {
    alignItems: "flex-start",
    display: "flex",
    flexDirection: "column",
    maxWidth: 700,
    justifyContent: "center"
  }
};

export default function PluginBillingSuccess() {
  const [searchParams] = useSearchParams();
  const platform = searchParams.get("platform");
  const redirect = searchParams.get("redirect");
  let platformWording = "Excel";
  if (platform === "MS") platformWording = "Excel";

  return (
    <div style={styles.wrapper}>
      <Box sx={styles.content}>
        <Typography gutterBottom variant="h3">
          <b>
            Thank you for subscribing! <Emoji symbol="🥳" />
          </b>
        </Typography>
        <Typography variant="subtitle1">
          You and now go back to your {platformWording} tab and refresh the page
          to see the newly upgraded version of Excel Formulator.{" "}
          {redirect ? "Or click the button here:" : ""}
        </Typography>
        <Button
          onClick={() => {
            window.open(redirect, "_blank");
          }}
          variant="outlined"
          style={{ marginTop: 16, marginBottom: 16 }}
        >
          Click here to open {platformWording}
        </Button>
        <Typography variant="caption">
          If you have any questions, please don't hesitate to contact us at
          excelformulator@gmail.com
        </Typography>
      </Box>
    </div>
  );
}
