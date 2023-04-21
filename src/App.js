import React from "react";
import { QueryClient, QueryClientProvider } from "react-query";

import { Routes, Route } from "react-router-dom";

import CssBaseline from "@mui/material/CssBaseline";

import { createTheme, ThemeProvider } from "@mui/material/styles";

import { SnackbarProvider } from "notistack";

import LandingPage from "./components/landingPage";
import Dashboard from "./components/dashboard";
import Generator from "./components/generator";
import Explainer from "./components/explainer";
import Login from "./components/login";
import Billing from "./components/billing";
import NoMatch from "./components/nomatch";

import PluginBillingCancel from "./components/plugin_billing_cancel";
import PluginBillingSuccess from "./components/plugin_billing_success";
import PrivacyPolicy from "./components/legal/PrivacyPolicy";
import TermsOfService from "./components/legal/TermsOfService";

import ConfettiContext from "./contexts/Confetti";
import UserContext from "./contexts/User";

import "./firebase";

const styles = {
  main: {
    display: "flex",
    flexDirection: "column"
  }
};

const queryClient = new QueryClient();

const muiTheme = createTheme();

export default function App() {
  return (
    <ThemeProvider theme={muiTheme}>
      <div style={styles.main}>
        <QueryClientProvider client={queryClient}>
          <SnackbarProvider
            anchorOrigin={{ vertical: "top", horizontal: "center" }}
            autoHideDuration={5000}
            maxSnack={4}
          >
            <CssBaseline />
            <UserContext>
              <ConfettiContext>
                <Routes>
                  <Route path="/" element={<LandingPage />} />
                  <Route path="/privacy_policy" element={<PrivacyPolicy />} />
                  <Route
                    path="/terms_of_service"
                    element={<TermsOfService />}
                  />
                  <Route
                    path="/plugin_billing_success"
                    element={<PluginBillingSuccess />}
                  />
                  <Route
                    path="/plugin_billing_cancel"
                    element={<PluginBillingCancel />}
                  />
                  <Route path="/signin" element={<Login />} />
                  <Route path="/app" element={<Dashboard />}>
                    <Route index element={<Generator />} />
                    <Route path="explainer" element={<Explainer />} />
                    <Route path="billing" element={<Billing />} />
                  </Route>
                  <Route path="*" element={<NoMatch />} />
                </Routes>
              </ConfettiContext>
            </UserContext>
          </SnackbarProvider>
        </QueryClientProvider>
      </div>
    </ThemeProvider>
  );
}
