import React from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { Navigate, useLocation } from "react-router-dom";

import { auth } from "../firebase";

import Login from "../components/login";

export const UserContext = React.createContext(null);

export default function User({ children }) {
  // TODO: STOPPED HERE -- The user returned by auth state is not actually in the user in our DB, need to also provide that as well
  const [user, loading, error] = useAuthState(auth);
  const location = useLocation();

  if (loading) {
    return "Loading...";
  }

  if (error) {
    return error;
  }

  if (!user && location.pathname !== "/signin") {
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }

  if (user && location.pathname === "/signin") {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return <UserContext.Provider value={user}>{children}</UserContext.Provider>;
}
