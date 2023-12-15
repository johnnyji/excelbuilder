import React, { useCallback, useContext, useEffect, useState } from "react";
import * as Sentry from "@sentry/react";
import { Link, useLocation, useSearchParams } from "react-router-dom";
import { Link as MUILink } from "@mui/material";
import { useLocalStorage, usePrevious } from "react-use";
import { useSnackbar } from "notistack";
import delay from "delay";
import { httpsCallable } from "firebase/functions";
import { functions } from "../../firebase";

import { getDoc } from "firebase/firestore";

import {
  Alert,
  Button,
  ButtonGroup,
  Paper,
  TextField,
  Typography,
} from "@mui/material";

import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import ShareIcon from "@mui/icons-material/IosShare";

import { createGeneration, getGenerationByPrompt } from "../../firebase";

import RemainingCreditsBanner from "../shared/RemainingCreditsBanner";
import TutorialBanner from "../shared/TutorialBanner";
import ShareDialog from "./ShareDialog";

import DashboardWrapper from "../ui/DashboardWrapper";
import Emoji from "../ui/Emoji";

import { ConfettiContext } from "../../contexts/Confetti";
import { RemainingCreditsContext } from "../../contexts/RemainingCredits";
import { UserContext } from "../../contexts/User";

const styles = {
  generator: {
    marginTop: "16px",
    display: "flex",
    flexDirection: "column",
  },
  generateButton: {
    marginTop: "16px",
    marginBottom: "16px",
  },
  result: {
    background: "#F7F7F7",
    wordBreak: "break-word",
    padding: "16px",
    "&:hover": {
      background: "#FFF",
      cursor: "pointer",
    },
  },
};

export default function Generator() {
  const { enqueueSnackbar } = useSnackbar();
  const location = useLocation();
  const fireConfetti = useContext(ConfettiContext);

  const user = useContext(UserContext);
  const [genStatus, setGenStatus] = useState("IDLE");
  const [system, setSystem] = useLocalStorage("ebBuilderSystem", "EXCEL");
  const [result, setResult] = useLocalStorage("ebBuilderResult", "");
  const [resultObject, setResultObject] = useLocalStorage(
    "ebBuilderResultObject",
    null
  );
  const [prompt, setPrompt] = useLocalStorage("ebBuilderPrompt", "");
  const [promptError, setPromptError] = useState(null);

  const [shareLink, setShareLink] = useState(null);
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
        variant: "success",
      });
    }

    if (prevGenStatus !== "ERROR" && genStatus === "ERROR") {
      enqueueSnackbar(
        "Oops, something went wrong. Please double check your input or just simply try again!",
        {
          variant: "error",
          preventDuplicate: true,
        }
      );
    }

    if (prevGenStatus !== "GENERATING" && genStatus === "GENERATING") {
      const processPrompt = async () => {
        try {
          const existing = await getGenerationByPrompt(user, prompt, system);

          if (existing) {
            await delay(1000);
            setResult(existing.completion.text.replace(/\n/g, ""));
            setResultObject(existing);
            fireConfetti();
            // TODO: If I decide to enable this again, I need to rework this
            // as the `result` here is not the same
            // createGeneration(user, prompt, result);
            updateRemainingCredits();
            enqueueSnackbar("Woohoo! Formula generated ✅", {
              variant: "success",
              preventDuplicate: true,
            });
            setGenStatus("DONE");
            return;
          }

          const call = httpsCallable(functions, "generate");
          const { data: result } = await call({
            prompt,
            system,
          });

          if (result) {
            const newDocRef = await createGeneration(
              user,
              prompt,
              result,
              system
            );
            const newDocSnapshot = await getDoc(newDocRef);
            const newData = newDocSnapshot.data();
            fireConfetti();
            setResult(result.text.replace(/\n/g, ""));
            setResultObject(newData);
            updateRemainingCredits();
            enqueueSnackbar("Woohoo! Formula generated ✅", {
              variant: "success",
              preventDuplicate: true,
            });
            setGenStatus("DONE");
          }
        } catch (err) {
          Sentry.captureException(err, {
            page: location.pathname,
            prompt,
            user: user,
          });
          setGenStatus("ERROR");
        }
      };

      processPrompt();
    }
  }, [
    enqueueSnackbar,
    fireConfetti,
    genStatus,
    location.pathname,
    prevGenStatus,
    postBillingRedirect,
    prompt,
    setResult,
    setResultObject,
    searchParams,
    setGenStatus,
    setSearchParams,
    system,
    updateRemainingCredits,
    user,
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
    (e) => {
      setPrompt(e.target.value);
    },
    [setPrompt]
  );

  const handleSetSystem = useCallback(
    (e) => {
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
              color="success"
              onClick={() => {
                navigator.clipboard.writeText(result);
                enqueueSnackbar("Result copied to clipboard", {
                  variant: "success",
                  preventDuplicate: true,
                });
              }}
              variant="contained"
              style={{ marginBottom: 16, marginTop: 16 }}
            >
              <ContentCopyIcon style={{ marginRight: 8 }} />
              Copy Result
            </Button>
            <Button
              color="success"
              onClick={() => {
                if (resultObject) {
                  setShareLink(
                    `${process.env.REACT_APP_URL_BASE}/result/${resultObject.uid}`
                  );
                } else {
                  enqueueSnackbar(
                    "Please re-generate your formula and try again",
                    {
                      variant: "error",
                      preventDuplicate: true,
                    }
                  );
                }
              }}
              variant="outlined"
              style={{ marginBottom: 32 }}
            >
              <ShareIcon style={{ marginRight: 8 }} /> Share Result
            </Button>
          </>
        )}
      </div>
      <ShareDialog
        open={shareLink !== null}
        onClose={() => {
          setShareLink(null);
        }}
        link={shareLink}
      />
    </DashboardWrapper>
  );
}
