import { Button, Box, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

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

export default function NoMatch() {
  const navigate = useNavigate();

  return (
    <div style={styles.wrapper}>
      <Box sx={styles.content}>
        <Typography gutterBottom variant="h3">
          <b>
            Error 404, out the door! <Emoji symbol="😅" />
          </b>
        </Typography>
        <Typography variant="subtitle1">
          It looks like this page doesn't exist. If you think it should and this
          is a mistake, please contact {process.env.REACT_APP_SUPPORT_EMAIL} and
          we'll sort this out for you!
        </Typography>
        <Box mt={3}>
          <Button
            onClick={() => {
              navigate("/");
            }}
            variant="outlined"
          >
            Go back to Dashboard
          </Button>
        </Box>
      </Box>
    </div>
  );
}
