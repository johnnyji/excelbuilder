import React, { useCallback, useContext, useEffect, useState } from "react";
import * as Sentry from "@sentry/react";
import { Link, useLocation } from "react-router-dom";
import { useLocalStorage, usePrevious } from "react-use";
import { useSnackbar } from "notistack";
import {
  Alert,
  Button,
  ButtonGroup,
  Paper,
  TextField,
  Typography
} from "@mui/material";
import delay from "delay";
import { httpsCallable } from "firebase/functions";
import { functions } from "../../firebase";

import { createGeneration, getGenerationByPrompt } from "../../firebase";

import RemainingCreditsBanner from "../shared/RemainingCreditsBanner";
import TutorialBanner from "../shared/TutorialBanner";

import DashboardWrapper from "../ui/DashboardWrapper";
import Emoji from "../ui/Emoji";

import { ConfettiContext } from "../../contexts/Confetti";
import { RemainingCreditsContext } from "../../contexts/RemainingCredits";
import { UserContext } from "../../contexts/User";

const styles = {
  generator: {
    marginTop: "16px",
    display: "flex",
    flexDirection: "column"
  },
  generateButton: {
    marginTop: "16px",
    marginBottom: "16px"
  },
  result: {
    background: "#F7F7F7",
    padding: "16px",
    "&:hover": {
      background: "#FFF",
      cursor: "pointer"
    }
  }
};

const getSystemWording = system => {
  if (system === "EXCEL") return "Excel formula";
  if (system === "SHEETS") return "Google Sheets formula";
  if (system === "AIRTABLE") return "Airtable formula";
};

// Take first name of name column, add a "@gmail.com" to the end and put that into the email column

export default function Generator() {
  const user = useContext(UserContext);
  const location = useLocation();
  const fireConfetti = useContext(ConfettiContext);
  const { enqueueSnackbar } = useSnackbar();
  const [genStatus, setGenStatus] = useState("IDLE");
  const [system, setSystem] = useLocalStorage("ebExplainerSystem", "EXCEL");
  const [result, setResult] = useLocalStorage("ebExplainerResult", "");
  const [prompt, setPrompt] = useLocalStorage("ebExplainerPrompt", "");
  const [promptError, setPromptError] = useState(null);
  const { remainingCredits, updateRemainingCredits } = useContext(
    RemainingCreditsContext
  );
  const outOfCredits = remainingCredits === 0;
  const prevGenStatus = usePrevious(genStatus);

  useEffect(() => {
    if (prevGenStatus !== "ERROR" && genStatus === "ERROR") {
      enqueueSnackbar(
        "Oops, something went wrong. Please double check your input or just simply try again!",
        {
          variant: "error",
          preventDuplicate: true
        }
      );
    }

    if (prevGenStatus !== "GENERATING" && genStatus === "GENERATING") {
      const processPrompt = async () => {
        try {
          const existing = await getGenerationByPrompt(user, prompt, system);
          if (existing) {
            await delay(1000);
            fireConfetti();
            setResult(existing.completion.text);
            // TODO: If I decide to enable this again, I need to rework this
            // as the `result` here is not the same
            // createGeneration(user, prompt, result);
            updateRemainingCredits();
            enqueueSnackbar("Woohoo! Formula explained ✅", {
              variant: "success",
              preventDuplicate: true
            });
            setGenStatus("DONE");
            return;
          }

          const call = httpsCallable(functions, "explain");
          const { data: result } = await call({
            prompt,
            system
          });

          if (result) {
            setResult(result.text);
            fireConfetti();
            createGeneration(user, prompt, result, system);
            updateRemainingCredits();
            enqueueSnackbar("Woohoo! Explanation generated ✅", {
              variant: "success",
              preventDuplicate: true
            });
            setGenStatus("DONE");
          }
        } catch (err) {
          Sentry.captureException(err, {
            page: location.pathname,
            prompt,
            user: user
          });
          setGenStatus("ERROR");
        }
      };

      processPrompt();
    }
  }, [
    enqueueSnackbar,
    fireConfetti,
    location.pathname,
    genStatus,
    prevGenStatus,
    setGenStatus,
    setResult,
    prompt,
    updateRemainingCredits,
    user,
    system
  ]);

  const handleGenerate = useCallback(() => {
    if (prompt.length === 0) {
      setPromptError("Please enter a valid formula");
    } else {
      setGenStatus("GENERATING");
    }
  }, [prompt, setGenStatus, setPromptError]);

  const handleSetPrompt = useCallback(
    e => {
      setPrompt(e.target.value);
    },
    [setPrompt]
  );

  const handleSetSystem = useCallback(
    e => {
      setSystem(e.target.name);
    },
    [setSystem]
  );

  const generating = genStatus === "GENERATING";

  return (
    <DashboardWrapper
      title="Explain Formula"
      subtitle="Paste a Excel/Sheets/Airtable formula you want explained to you in plain english 🎓"
    >
      <RemainingCreditsBanner />
      <TutorialBanner />

      <Typography variant="subtitle1" gutterBottom>
        What type of system is this for?
      </Typography>
      <ButtonGroup>
        <Button
          onClick={handleSetSystem}
          name="EXCEL"
          variant={system === "EXCEL" ? "contained" : "outlined"}
        >
          Excel
        </Button>
        <Button
          onClick={handleSetSystem}
          name="SHEETS"
          variant={system === "SHEETS" ? "contained" : "outlined"}
        >
          Sheets
        </Button>
        <Button
          onClick={handleSetSystem}
          name="AIRTABLE"
          variant={system === "AIRTABLE" ? "contained" : "outlined"}
        >
          Airtable
        </Button>
      </ButtonGroup>

      <div style={styles.generator}>
        <Typography variant="subtitle1" gutterBottom>
          Paste {getSystemWording(system)}:
        </Typography>
        <TextField
          disabled={generating}
          error={promptError}
          helperText={promptError}
          fullWidth
          multiline
          rows={4}
          placeholder='=IF(A1>3,"Over Budget","")'
          value={prompt}
          variant="outlined"
          onChange={handleSetPrompt}
        />
        <Button
          color="primary"
          disabled={generating || outOfCredits || user.paymentDelinquent}
          onClick={handleGenerate}
          variant="contained"
          style={styles.generateButton}
          fullWidth={false}
        >
          {generating ? "Explaining..." : "Explain"}
        </Button>
        {user.paymentDelinquent && (
          <Alert severity="error">
            Your subscription seems to have a payment issue, please resolve that{" "}
            <Link to="/app/billing">in your billing page</Link> first{" "}
            <Emoji symbol="🙏" />
          </Alert>
        )}
        {result && (
          <>
            <Typography variant="h4" gutterBottom>
              <b>Explanation:</b>
            </Typography>
            <Paper style={styles.result}>
              <code>{result}</code>
            </Paper>
            <Button
              color="primary"
              onClick={() => {
                navigator.clipboard.writeText(result);
              }}
              variant="contained"
              style={styles.generateButton}
            >
              Click to Copy Result
            </Button>
          </>
        )}
      </div>
    </DashboardWrapper>
  );
}
