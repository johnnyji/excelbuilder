import React, { useCallback, useContext, useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Link as MUILink } from "@mui/material";
import { useLocalStorage, usePrevious } from "react-use";
import { useSnackbar } from "notistack";
import delay from "delay";

import {
  Alert,
  Button,
  ButtonGroup,
  Paper,
  TextField,
  Typography
} from "@mui/material";

import { createGeneration, getGenerationByPrompt } from "../../firebase";
import openai from "../../openai";

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
    wordBreak: "break-word",
    padding: "16px",
    "&:hover": {
      background: "#FFF",
      cursor: "pointer"
    }
  }
};

const getSystemWording = system => {
  if (system === "EXCEL") return "an Excel";
  if (system === "SHEETS") return "a Google Sheets";
  if (system === "AIRTABLE") return "an Airtable";
};

export default function Generator() {
  const { enqueueSnackbar } = useSnackbar();
  const fireConfetti = useContext(ConfettiContext);

  const user = useContext(UserContext);
  const [genStatus, setGenStatus] = useState("IDLE");
  const [system, setSystem] = useLocalStorage("ebBuilderSystem", "EXCEL");
  const [result, setResult] = useLocalStorage("ebBuilderResult", "");
  const [prompt, setPrompt] = useLocalStorage("ebBuilderPrompt", "");
  const [promptError, setPromptError] = useState(null);

  const [searchParams, setSearchParams] = useSearchParams();
  const postBillingRedirect = searchParams.get("billing_redirect");
  const { remainingCredits, updateRemainingCredits } = useContext(
    RemainingCreditsContext
  );
  const outOfCredits = remainingCredits === 0;
  const prevGenStatus = usePrevious(genStatus);

  useEffect(() => {
    if (postBillingRedirect === "SUCCESS") {
      fireConfetti();
      setSearchParams(searchParams.delete("billing_redirect"));
      enqueueSnackbar("Your plan was successfully changed!", {
        preventDuplicate: true,
        variant: "success"
      });
    }

    if (prevGenStatus !== "ERROR" && genStatus === "ERROR") {
      enqueueSnackbar(
        "Oops, something went wrong. Please double check your input!",
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
            setResult(existing.completion.text);
            fireConfetti();
            // TODO: If I decide to enable this again, I need to rework this
            // as the `result` here is not the same
            // createGeneration(user, prompt, result);
            updateRemainingCredits();
            enqueueSnackbar("Woohoo! Formula generated ✅", {
              variant: "success",
              preventDuplicate: true
            });
            setGenStatus("DONE");
            return;
          }

          const completion = await openai.createCompletion({
            model: "text-davinci-003",
            prompt: `Generate me ${getSystemWording(
              system
            )} formula for:\n\n${prompt}`,
            temperature: 0,
            max_tokens: 1000,
            top_p: 1,
            frequency_penalty: 0,
            presence_penalty: 0
          });

          const result = completion.data.choices[0];

          if (result) {
            fireConfetti();
            setResult(result.text);
            createGeneration(user, prompt, result, system);
            updateRemainingCredits();
            enqueueSnackbar("Woohoo! Formula generated ✅", {
              variant: "success",
              preventDuplicate: true
            });
            setGenStatus("DONE");
          }
        } catch (err) {
          setGenStatus("ERROR");
        }
      };

      processPrompt();
    }
  }, [
    enqueueSnackbar,
    fireConfetti,
    genStatus,
    prevGenStatus,
    postBillingRedirect,
    prompt,
    setResult,
    searchParams,
    setGenStatus,
    setSearchParams,
    system,
    updateRemainingCredits,
    user
  ]);

  const handleGenerate = useCallback(() => {
    if (prompt.length < 10) {
      setPromptError(
        "Your description is too short. Try to be a bit more descriptive."
      );
      return;
    }
    setGenStatus("GENERATING");
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
    <DashboardWrapper
      title="Build Formula"
      subtitle={`Describe in english what you want an Excel/Sheets/Airtable formula to do and ${process.env.REACT_APP_APP_NAME} will generate you the formula! 🤯`}
    >
      <RemainingCreditsBanner />
      <TutorialBanner />

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
          Describe the formula you want{" "}
          <MUILink
            href="https://rich-pencil-9ae.notion.site/Best-Practices-for-Prompting-7fa74f41b3e747b391210acad1748f8c"
            target="_blank"
          >
            (Not sure how? Check out our best practices)
          </MUILink>
        </Typography>
        <TextField
          disabled={generating}
          error={promptError}
          helperText={promptError || helpText}
          fullWidth
          multiline
          rows={4}
          placeholder="If Column A cell is over $3, mark Column C as Over Budget"
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
            <Link to="/app/billing">in your billing page</Link> first{" "}
            <Emoji symbol="🙏" />
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
