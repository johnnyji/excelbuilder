import React, { useCallback, useContext, useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useWindowSize } from "react-use";
import { useSnackbar } from "notistack";
import Confetti from "react-confetti";

import {
  Alert,
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

const configuration = new Configuration({
  apiKey: process.env.REACT_APP_OPENAI_API_KEY
});

const openai = new OpenAIApi(configuration);

const getSystemWording = system => {
  if (system === "EXCEL") return "an Excel";
  if (system === "SHEETS") return "a Google Sheets";
  if (system === "AIRTABLE") return "an Airtable";
};

// Take first name of name column, add a "@gmail.com" to the end and put that into the email column

export default function Generator() {
  const { enqueueSnackbar } = useSnackbar();
  const { width: windowWidth, height: windowHeight } = useWindowSize();
  const [isConfettiExploding, setIsConfettiExploding] = useState(false);
  const user = useContext(UserContext);
  const [genStatus, setGenStatus] = useState("IDLE");
  const [system, setSystem] = useState("EXCEL");
  const [result, setResult] = useState("");
  const [resultCopied, setResultCopied] = useState(false);
  const [prompt, setPrompt] = useState(
    "If budget is >3, then mark hello as paid"
  );
  const [promptError, setPromptError] = useState(null);

  const [searchParams, setSearchParams] = useSearchParams();
  const postBillingRedirect = searchParams.get("billing_redirect");
  const remainingCredits = useContext(RemainingCreditsContext);
  const outOfCredits = remainingCredits === 0;

  useEffect(() => {
    if (postBillingRedirect === "SUCCESS") {
      setIsConfettiExploding(true);
      setSearchParams(searchParams.delete("billing_redirect"));
      enqueueSnackbar("Your plan was successfully changed!", {
        preventDuplicate: true,
        variant: "success"
      });
    }

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
  }, [
    enqueueSnackbar,
    genStatus,
    postBillingRedirect,
    prompt,
    searchParams,
    setGenStatus,
    setSearchParams,
    system,
    user
  ]);

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
    <DashboardWrapper title="Build Formula">
      {isConfettiExploding && (
        <Confetti
          numberOfPieces={1000}
          recycle={false}
          height={windowHeight}
          width={windowWidth}
          style={{ zIndex: 10000 }}
        />
      )}

      <RemainingCreditsBanner />

      <Typography variant="subtitle1" gutterBottom>
        What type of system is this for?
      </Typography>
      <ButtonGroup disabled={generating}>
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
          disabled={generating || outOfCredits || user.paymentDelinquent}
          onClick={handleGenerate}
          variant="contained"
          style={styles.generateButton}
          fullWidth={false}
        >
          {generating ? "Generating..." : "Generate"}
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
    </DashboardWrapper>
  );
}
