import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ProtectedRoute } from "./component/ProtectedRoute";
import { PublicRoute } from "./component/PublicRoute";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Auth Pages
import Login from "./pages/Login";
import Register from "./pages/Register";

// Admin Layout + Pages
import DashboardLayout from "./component/layout/DashboardLayout";
import Dashboard from "./pages/admin/Dashboard";
import EnquiryPage from "./pages/admin/Enquiries";
import UsersPage from "./pages/admin/Users";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* ✅ Public Routes */}
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

          {/* ✅ Protected Routes */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="enquiries" element={<EnquiryPage />} />
            <Route path="users" element={<UsersPage />} />
          </Route>

          {/* ✅ Redirect Unknown Routes */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>

        {/* Toastify Notifications */}
        <ToastContainer position="top-right" autoClose={3000} />
      </BrowserRouter>
    </AuthProvider>
  );
}
