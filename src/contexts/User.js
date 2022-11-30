import React from "react";
import { Navigate, useLocation } from "react-router-dom";

import Login from "../components/login";

import useCurrentUser from "../hooks/useCurrentUser";

export const UserContext = React.createContext(null);

export default function User({ children }) {
  const [user, loading, error] = useCurrentUser();

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
