import React from "react";
import { useSnackbar } from "notistack";

import {
  Button,
  Card,
  Dialog,
  DialogContent,
  DialogTitle,
  Typography
} from "@mui/material";

import Emoji from "../ui/Emoji";
import ShareIcon from "@mui/icons-material/IosShare";

export default function ShareDialog({ onClose, open, link }) {
  const { enqueueSnackbar } = useSnackbar();

  return (
    <Dialog maxWidth="md" onClose={onClose} open={open}>
      <DialogTitle>
        <b>Sharing Link</b>
      </DialogTitle>
      <DialogContent
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start"
        }}
      >
        <Typography variant="body2">
          Copy the link below to share your generated formula with anyone:
        </Typography>

        <Card
          variant="outlined"
          style={{
            marginTop: 8,
            backgroundColor: "rgb(247, 247, 247)",
            padding: 8,
            workBreak: "break-word"
          }}
        >
          {link}
        </Card>

        <Button
          color="success"
          onClick={() => {
            navigator.clipboard.writeText(link);
            enqueueSnackbar("Sharing link copied!", {
              variant: "success",
              preventDuplicate: true
            });
            onClose();
          }}
          variant="outlined"
          style={{ marginTop: 16, marginBottom: 8 }}
        >
          <ShareIcon style={{ marginRight: 8 }} /> Click to copy link
        </Button>

        <Typography variant="caption">
          <Emoji symbol="🔐" /> This is a secure public link that has no
          association with your account, your data will be 100% safe
        </Typography>
      </DialogContent>
    </Dialog>
  );
}
