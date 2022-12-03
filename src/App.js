import React from "react";
import { QueryClient, QueryClientProvider } from "react-query";

import { Routes, Route } from "react-router-dom";

import CssBaseline from "@mui/material/CssBaseline";

import { SnackbarProvider } from "notistack";

import Dashboard from "./components/dashboard";
import Generator from "./components/generator";
import Explainer from "./components/explainer";
import Login from "./components/login";
import Billing from "./components/billing";
import NoMatch from "./components/nomatch";

import UserContext from "./contexts/User";

import "./firebase";

const styles = {
  main: {
    display: "flex",
    flexDirection: "column",
  },
};

const queryClient = new QueryClient();

export default function App() {
  return (
    <div style={styles.main}>
      <QueryClientProvider client={queryClient}>
        <SnackbarProvider
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
          autoHideDuration={5000}
          maxSnack={4}
        >
          <CssBaseline />
          <UserContext>
            <Routes>
              <Route path="/signin" element={<Login />} />
              <Route path="/" element={<Dashboard />}>
                <Route index element={<Generator />} />
                <Route path="/explainer" element={<Explainer />} />
                <Route path="/billing" element={<Billing />} />
              </Route>
              <Route path="*" element={<NoMatch />} />
            </Routes>
          </UserContext>
        </SnackbarProvider>
      </QueryClientProvider>
    </div>
  );
}
