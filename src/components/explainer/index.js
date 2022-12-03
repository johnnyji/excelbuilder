import React, { useCallback, useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useLocalStorage } from "react-use";
import { useSnackbar } from "notistack";
import {
  Alert,
  Button,
  ButtonGroup,
  Paper,
  TextField,
  Typography
} from "@mui/material";

import CopyToClipboard from "react-copy-to-clipboard";

import { createGeneration } from "../../firebase";
import openai from "../../openai";

import RemainingCreditsBanner from "../shared/RemainingCreditsBanner";

import DashboardWrapper from "../ui/DashboardWrapper";
import Emoji from "../ui/Emoji";

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

  useEffect(() => {
    if (genStatus === "GENERATING") {
      openai
        .createCompletion({
          model: "text-davinci-003",
          prompt: `Explain to me what this ${getSystemWording(
            system
          )} is doing in plain english:\n\n${prompt}`,
          temperature: 0,
          max_tokens: 1000,
          top_p: 1,
          frequency_penalty: 0,
          presence_penalty: 0
        })
        .then(resp => {
          const result = resp.data.choices[0];
          if (result) {
            setResult(result.text);
            createGeneration(user, prompt, result);
            updateRemainingCredits();
            enqueueSnackbar("Woohoo! Explanation generated ✅", {
              variant: "success"
            });
            setGenStatus("DONE");
          } else {
            setGenStatus("ERROR");
          }
        })
        .catch(_ => {
          setGenStatus("ERROR");
        });
    }
  }, [
    enqueueSnackbar,
    genStatus,
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
            <Link to="/billing">in your billing page</Link> first{" "}
            <Emoji symbol="🙏" />
          </Alert>
        )}
        {outOfCredits && (
          <Alert severity="error">
            You're out of credits for the month <Emoji symbol="😢" /> Credits
            reset on the 1st of every month. If you would like unlimited
            credits, you can <Link to="/billing">upgrade your plan here!</Link>
          </Alert>
        )}
        {result && (
          <>
            <Typography variant="h4" gutterBottom>
              <b>Explanation:</b>
            </Typography>
            <CopyToClipboard text={result}>
              <Paper style={styles.result}>
                <code>{result}</code>
              </Paper>
            </CopyToClipboard>
          </>
        )}
      </div>
    </DashboardWrapper>
  );
}
