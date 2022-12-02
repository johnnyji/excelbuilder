import React from "react";
import { Navigate, useLocation } from "react-router-dom";

import FullPageError from "../components/ui/FullPageError";
import FullPageSpinner from "../components/ui/FullPageSpinner";

import useCurrentUser from "../hooks/useCurrentUser";

export const UserContext = React.createContext(null);

export default function User({ children }) {
  const [user, loading, error] = useCurrentUser();

  const location = useLocation();

  if (loading) {
    return <FullPageSpinner />;
  }

  if (error) {
    return <FullPageError />;
  }

  if (!user && location.pathname !== "/signin") {
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }

  if (user && location.pathname === "/signin") {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return <UserContext.Provider value={user}>{children}</UserContext.Provider>;
}
