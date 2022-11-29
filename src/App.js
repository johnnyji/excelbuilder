import React from "react";

import { Routes, Route } from "react-router-dom";

import CssBaseline from "@mui/material/CssBaseline";

import Dashboard from "./components/dashboard";
import Generator from "./components/generator";
import Explainer from "./components/explainer";
import Login from "./components/login";
import Billing from "./components/billing";
import NoMatch from "./components/nomatch";

import RemainingCreditsContext from "./contexts/RemainingCredits";
import UserContext from "./contexts/User";

const styles = {
  main: {
    display: "flex",
    flexDirection: "column"
  }
};

export default function ExcelBuilder() {
  return (
    <div style={styles.main}>
      <CssBaseline />
      <UserContext>
        <RemainingCreditsContext>
          <Routes>
            <Route path="/signin" element={<Login />} />
            <Route path="/" element={<Dashboard />}>
              <Route index element={<Generator />} />
              <Route path="/explainer" element={<Explainer />} />
              <Route path="/billing" element={<Billing />} />
            </Route>
            <Route path="*" element={<NoMatch />} />
          </Routes>
        </RemainingCreditsContext>
      </UserContext>
    </div>
  );
}
