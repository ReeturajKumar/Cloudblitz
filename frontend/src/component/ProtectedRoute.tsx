import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";

interface Props {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<Props> = ({ children }) => {
  const { user, token, loading } = useAuth();

  // ✅ Show CloudBlitz loader while checking authentication
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-50">
        {/* CloudBlitz Logo Animation */}
        <div className="relative mb-4">
          {/* Outer glow ring */}
          <div className="absolute inset-0 rounded-full bg-indigo-400 blur-xl opacity-30 animate-pulse"></div>

          {/* Logo Circle */}
          <div className="w-20 h-20 flex items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-blue-600 shadow-lg">
            <span className="text-white font-bold text-3xl tracking-wide animate-pulse">
              CB
            </span>
          </div>
        </div>

        {/* Text */}
        <p className="text-gray-600 font-medium animate-pulse">
          Checking authentication...
        </p>

        {/* Loading shimmer bar */}
        <div className="w-40 h-1.5 mt-4 bg-gradient-to-r from-indigo-400 via-blue-400 to-indigo-400 rounded-full animate-[shimmer_1.5s_infinite] bg-[length:200%_100%]" />
      </div>
    );
  }

  // ✅ Redirect if not authenticated
  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};
