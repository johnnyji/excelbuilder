import { Button, Box, Typography } from "@mui/material";

import Emoji from "./Emoji";

const styles = {
  wrapper: {
    alignItems: "center",
    paddingTop: 16,
    paddingBottom: 16,
    zIndex: 10000
  },
  content: {
    alignItems: "flex-start",
    display: "flex",
    flexDirection: "column",
    maxWidth: 400,
    justifyContent: "center"
  }
};

export default function DashboardError({ message }) {
  return (
    <div style={styles.wrapper}>
      <Box sx={styles.content}>
        <Typography gutterBottom variant="h4">
          <b>
            Oops, something went wrong... <Emoji symbol="😅" />
          </b>
        </Typography>
        {message && <Typography variant="subtitle2">{message}</Typography>}
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
