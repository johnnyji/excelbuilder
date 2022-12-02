import { Button, Box, Typography } from "@mui/material";

import Emoji from "./Emoji";

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

export default function FullPageError() {
  return (
    <div style={styles.wrapper}>
      <Box sx={styles.content}>
        <Typography gutterBottom variant="h3">
          <b>
            Oops, something went wrong... <Emoji symbol="😅" />
          </b>
        </Typography>
        <Typography variant="subtitle1">
          Please bear with us, maybe refreshing the page will help? If not,
          please contact {process.env.REACT_APP_SUPPORT_EMAIL} and we'll sort
          this out for you!
        </Typography>
        <Box mt={3}>
          <Button
            onClick={() => {
              window.location.reload();
            }}
            variant="outlined"
          >
            Refresh Page
          </Button>
        </Box>
      </Box>
    </div>
  );
}
