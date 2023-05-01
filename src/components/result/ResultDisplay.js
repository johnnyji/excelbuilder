import React, { useContext, useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useSnackbar } from "notistack";
import delay from "delay";

import { Box, Button, Card, CircularProgress, Typography } from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";

import Emoji from "../ui/Emoji";

import { getGenerationByUid } from "../../firebase";

import { ConfettiContext } from "../../contexts/Confetti";

import colors from "../../config/colors";

export default function ResultDisplay() {
  const { enqueueSnackbar } = useSnackbar();
  const fireConfetti = useContext(ConfettiContext);
  const { id } = useParams();
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  useEffect(() => {
    const getCompletion = async () => {
      const completion = await getGenerationByUid(id);
      if (completion) {
        setResult(completion);
        await delay(1000);
        fireConfetti();
      } else {
        setError("Data not found");
      }
      setLoading(false);
    };

    setLoading(true);
    getCompletion();
  }, [fireConfetti, setLoading, setError, setResult, id]);

  const renderContent = () => {
    if (loading) return <CircularProgress />;

    if (error && error !== "Data not found") {
      return (
        <Typography color="error">
          Oops! Something went wrong, please reload the page to try again. If
          the issue persists, please contact{" "}
          {process.env.REACT_APP_SUPPORT_EMAIL}
        </Typography>
      );
    }

    if (!result) {
      return (
        <Typography color="error">
          <Emoji symbol="😅" /> It looks like this formula doesn't exist. Are
          you sure the URL is correct? You can also try to generate your own
          formulas for free by{" "}
          <Link
            to="/signin"
            style={{ color: colors.link, textDecoration: "underline" }}
          >
            clicking here!
          </Link>
        </Typography>
      );
    }

    return (
      <Typography
        style={{
          alignSelf: "center",
          fontFamily: "courier",
          overflowWrap: "anywhere"
        }}
        variant="h6"
      >
        {result.completion.text.replace(/\n/g, "")}
      </Typography>
    );
  };

  let wording = "an Excel formula";
  if (result?.system === "SHEETS") {
    wording = "a Google Sheets formula";
  } else if (result?.system === "AIRTABLE") {
    wording = "an Airtable formula";
  }

  return (
    <Box sx={{ margin: "32px 16px 0px 16px" }}>
      <Typography
        align="center"
        variant="h4"
        style={{ fontWeight: "600", marginBottom: 32 }}
      >
        Someone shared {wording} with you 🥳 🎉
      </Typography>

      <Card
        variant="outlined"
        style={{
          backgroundColor: "rgb(247, 247, 247)",
          display: "flex",
          flexDirection: "column",
          padding: 16,
          alignItems: "center"
        }}
      >
        {renderContent()}
      </Card>

      <Button
        disabled={loading || Boolean(error) || !Boolean(result)}
        onClick={() => {
          navigator.clipboard.writeText(result);
          enqueueSnackbar("Result copied to clipboard", {
            variant: "success",
            preventDuplicate: true
          });
        }}
        variant="contained"
        style={{ marginBottom: 16, marginTop: 16, width: "100%" }}
      >
        <ContentCopyIcon style={{ marginRight: 8 }} />
        Copy formula
      </Button>

      {!loading && !Boolean(error) && Boolean(result) && (
        <Card
          variant="outlined"
          style={{
            display: "flex",
            alignItems: "center",
            flexDirection: "column",
            padding: 32
          }}
        >
          <Typography variant="body2" style={{ marginBottom: 16 }}>
            Excel Formulator generated this formula from the question:
          </Typography>
          <span
            style={{
              alignSelf: "flex-start",
              fontSize: "2em",
              lineHeight: ".5em"
            }}
          >
            “
          </span>
          <Typography style={{ wordWrap: "break-all", padding: "0 16px" }}>
            {result.prompt}
          </Typography>
          <span
            style={{
              alignSelf: "flex-end",
              fontSize: "2em",
              lineHeight: ".5em"
            }}
          >
            ”
          </span>
        </Card>
      )}
    </Box>
  );
}
