import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";

interface Props {
  children: React.ReactNode;
}

export const PublicRoute: React.FC<Props> = ({ children }) => {
  const { token } = useAuth();

  if (token) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};
