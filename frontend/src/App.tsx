import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "../src/context/AuthContext";
import { ProtectedRoute } from "../src/component/ProtectedRoute";
import Login from "../src/pages/Login";
import Register from "../src/pages/Register";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { PublicRoute } from "./component/PublicRoute";

function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-sky-50">
      <h1 className="text-3xl font-bold text-indigo-700 mb-4">
        Welcome to CloudBlitz CRM ⚡
      </h1>
      <p className="text-gray-600">You are logged in successfully.</p>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Protected route: Home (Dashboard) */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />

          {/* Public routes */}
          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />

          <Route
            path="/register"
            element={
              <PublicRoute>
                <Register />
              </PublicRoute>
            }
          />

          {/* Redirect all unknown routes */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>

        <ToastContainer position="top-right" autoClose={3000} />
      </BrowserRouter>
    </AuthProvider>
  );
}
