import React, { useCallback, useEffect, useState } from "react";

import ConfettiBlast from "../components/ui/ConfettiBlast";

export const ConfettiContext = React.createContext();

export default function ConfettiContextProvider({ children }) {
  const [isConfettiExploding, setIsConfettiExploding] = useState(false);

  useEffect(() => {
    if (isConfettiExploding) {
      setTimeout(() => {
        setIsConfettiExploding(false);
      }, 2000);
    }
  }, [isConfettiExploding, setIsConfettiExploding]);

  const fireConfetti = useCallback(() => {
    setIsConfettiExploding(true);
  }, [setIsConfettiExploding]);

  return (
    <ConfettiContext.Provider value={fireConfetti}>
      {children}
      <ConfettiBlast fire={isConfettiExploding} />
    </ConfettiContext.Provider>
  );
}
