import React, { useState } from "react";
import { Alert, Box, Dialog, Link } from "@mui/material";

import Emoji from "../ui/Emoji";

export default function TutorialBanner() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Box mb={2}>
        <Alert severity="info">
          <Link
            component="button"
            variant="body2"
            onClick={() => {
              setOpen(true);
            }}
          >
            Click here to watch the 1 min tutorial on how to use Excel
            Formulator <Emoji symbol="🎥" />
          </Link>
        </Alert>
      </Box>
      <Dialog
        onClose={() => {
          setOpen(false);
        }}
        open={open}
      >
        <iframe
          src="https://www.loom.com/embed/46908770d28d4e2c95ae5ad7e58767e9"
          title="tutorial"
          width="600"
          height="460"
          frameBorder="0"
          allowFullScreen
        ></iframe>
      </Dialog>
    </>
  );
}
