import React, { useEffect, useContext, useState } from "react";
import moment from "moment";

import { UserContext } from "./User";

import { query, getDocs, collection, where } from "firebase/firestore";

import { db } from "../firebase";

import FullPageError from "../components/ui/FullPageError";
import FullPageSpinner from "../components/ui/FullPageSpinner";

export const RemainingCreditsContext = React.createContext();

export default function RemainingCredits({ children }) {
  const user = useContext(UserContext);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [remainingCredits, setRemainingCredits] = useState(-1);

  useEffect(() => {
    if (user) {
      setLoading(true);
      setError(null);

      const periodCurrent = moment()
        .startOf("month")
        .toDate();
      const periodNext = moment()
        .endOf("month")
        .toDate();

      const creditsUsedQuery = query(
        collection(db, "generations"),
        where("userUid", "==", user.uid),
        where("generatedAt", ">=", periodCurrent),
        where("generatedAt", "<", periodNext)
      );

      getDocs(creditsUsedQuery)
        .then(resp => {
          const remaining = 7 - resp.docs.length;
          setLoading(false);
          setRemainingCredits(remaining < 0 ? 0 : remaining);
        })
        .catch(e => {
          console.log(e);
          alert(e);
        });
    } else {
      setLoading(false);
    }
  }, [setLoading, setError, user]);

  if (loading) return <FullPageSpinner />;

  if (error) return <FullPageError />;

  return (
    <RemainingCreditsContext.Provider value={remainingCredits}>
      {children}
    </RemainingCreditsContext.Provider>
  );
}
