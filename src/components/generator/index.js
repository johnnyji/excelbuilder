import React, { useCallback, useContext, useEffect, useState } from "react";
import {
  Button,
  ButtonGroup,
  Paper,
  FormHelperText,
  TextField,
  Typography
} from "@mui/material";
import { Configuration, OpenAIApi } from "openai";

import CopyToClipboard from "react-copy-to-clipboard";

import { createGeneration } from "../../firebase";

import RemainingCreditsBanner from "../shared/RemainingCreditsBanner";

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

const configuration = new Configuration({
  apiKey: "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"
});

const openai = new OpenAIApi(configuration);

const getSystemWording = system => {
  if (system === "EXCEL") return "an Excel";
  if (system === "SHEETS") return "a Google Sheets";
  if (system === "AIRTABLE") return "an Airtable";
};

// Take first name of name column, add a "@gmail.com" to the end and put that into the email column

export default function Generator() {
  const user = useContext(UserContext);
  const [genStatus, setGenStatus] = useState("IDLE");
  const [system, setSystem] = useState("EXCEL");
  const [result, setResult] = useState("");
  const [resultCopied, setResultCopied] = useState(false);
  const [prompt, setPrompt] = useState(
    "If budget is >3, then mark hello as paid"
  );
  const [promptError, setPromptError] = useState(null);

  useEffect(() => {
    if (genStatus === "GENERATING") {
      setResultCopied(false);

      openai
        .createCompletion({
          model: "text-davinci-002",
          prompt: `Generate me ${getSystemWording(
            system
          )} formula for:\n\n${prompt}`,
          temperature: 0,
          max_tokens: 256,
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
    if (prompt.length < 10) {
      setPromptError(
        "Your description is too short. Try to be a bit more descriptive."
      );
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

  const helpText =
    "Try to be as descriptive as possible with instructions, referring to column/header names whenever possible.";

  const generating = genStatus === "GENERATING";

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        <b>Build a formula</b>
      </Typography>
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
          Describe the formula you want
        </Typography>
        <TextField
          disabled={generating}
          error={promptError}
          helperText={promptError || helpText}
          fullWidth
          multiline
          rows={4}
          placeholder="If the Budget cell is over $3, mark as Over Budget"
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
          {generating ? "Generating..." : "Generate"}
        </Button>
        {result && (
          <>
            <Typography variant="h4" gutterBottom>
              <b>Result:</b>
            </Typography>
            <Typography variant="subtitle1" gutterBottom>
              Copy/paste this formula into your "Formula" field:
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
    </div>
  );
}
