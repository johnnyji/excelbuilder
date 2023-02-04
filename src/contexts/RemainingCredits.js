import React, { useCallback, useEffect, useContext, useState } from "react";
import { usePrevious } from "react-use";
import moment from "moment";
import { useSnackbar } from "notistack";
import { v4 as uuidv4 } from "uuid";

import { UserContext } from "./User";

import { query, getDocs, collection, where } from "firebase/firestore";

import { db } from "../firebase";

import { subscriptionPlanKey } from "../config/billing";

import FullPageError from "../components/ui/FullPageError";
import FullPageSpinner from "../components/ui/FullPageSpinner";

const initialRetriggerId = uuidv4();

export const RemainingCreditsContext = React.createContext();

export default function RemainingCredits({ children }) {
  const user = useContext(UserContext);
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(true);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(null);
  const [retriggerId, setRetriggerId] = useState(initialRetriggerId);
  const [remainingCredits, setRemainingCredits] = useState(-1);
  const prevRemainingCredits = usePrevious(remainingCredits);

  useEffect(() => {
    if (
      prevRemainingCredits > 0 &&
      remainingCredits === 0 &&
      user.subscriptionPlanKey === subscriptionPlanKey.STARTER
    ) {
      enqueueSnackbar(
        "You're out of credits for the month. Please upgrade your plan to have unlimited credits!",
        {
          preventDuplicate: true,
          variant: "error"
        }
      );
    }
  }, [
    enqueueSnackbar,
    prevRemainingCredits,
    remainingCredits,
    user.subscriptionPlanKey
  ]);

  useEffect(() => {
    if (user.uid && user.subscriptionPlanKey === subscriptionPlanKey.STARTER) {
      // We trigger this everytime the user generates an OpenAI completion
      // in order to deduct credits in the UI, on secondary competions
      // the credits are already loaded, so no need to distrupt the user with
      // a loading spinner
      if (!loaded) {
        setLoading(true);
      }

      setError(null);

      const periodCurrent = moment()
        .startOf("month")
        .toDate();
      const periodNext = moment()
        .endOf("month")
        .toDate();

      const creditsUsedQuery = query(
        collection(db, "completions"),
        where("userUid", "==", user.uid),
        where("generatedAt", ">=", periodCurrent),
        where("generatedAt", "<", periodNext)
      );

      getDocs(creditsUsedQuery)
        .then(resp => {
          const remaining = 7 - resp.docs.length;
          setLoading(false);
          setRemainingCredits(remaining < 0 ? 0 : remaining);
          setLoaded(true);
        })
        .catch(error => {
          console.error(error);
          setLoading(false);
          setError(
            `Error loading your remaining credits, please refresh the page. If the issue persists, reach out to ${process.env.REACT_APP_SUPPORT_EMAIL}`
          );
        });
    } else {
      setLoading(false);
    }
  }, [
    loaded,
    retriggerId,
    setLoaded,
    setLoading,
    setError,
    user.uid,
    user.subscriptionPlanKey
  ]);

  const updateRemainingCredits = useCallback(() => {
    setRetriggerId(uuidv4());
  }, [setRetriggerId]);

  if (loading) return <FullPageSpinner />;

  if (error) return <FullPageError />;

  const value = { remainingCredits, updateRemainingCredits };

  return (
    <RemainingCreditsContext.Provider value={value}>
      {children}
    </RemainingCreditsContext.Provider>
  );
}
