import React, { useCallback, useContext, useEffect, useState } from "react";
import {
  Button,
  ButtonGroup,
  Paper,
  FormHelperText,
  TextField,
  Typography
} from "@mui/material";

import CopyToClipboard from "react-copy-to-clipboard";

import { createGeneration } from "../../firebase";
import openai from "../../openai";

import RemainingCreditsBanner from "../shared/RemainingCreditsBanner";

import DashboardWrapper from "../ui/DashboardWrapper";

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
  const [genStatus, setGenStatus] = useState("IDLE");
  const [system, setSystem] = useState("EXCEL");
  const [result, setResult] = useState("");
  const [resultCopied, setResultCopied] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [promptError, setPromptError] = useState(null);

  useEffect(() => {
    if (genStatus === "GENERATING") {
      setResultCopied(false);

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
            setGenStatus("DONE");
          } else {
            setGenStatus("ERROR");
          }
        })
        .catch(_ => {
          setGenStatus("ERROR");
        });
    }
  }, [genStatus, setGenStatus, prompt, user, system]);

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
          disabled={generating}
          onClick={handleGenerate}
          variant="contained"
          style={styles.generateButton}
          fullWidth={false}
        >
          {generating ? "Explaining..." : "Explain"}
        </Button>
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
            {resultCopied && (
              <FormHelperText>Copied to clipboard!</FormHelperText>
            )}
          </>
        )}
      </div>
    </DashboardWrapper>
  );
}
