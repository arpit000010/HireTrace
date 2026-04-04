import { Navigate, Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth.js";

// Shows a full-screen loader while auth state is resolving
const Spinner = () => (
  <div className="flex items-center justify-center min-h-screen bg-[var(--bg-primary)]">
    <div className="w-10 h-10 border-2 border-[var(--border)] border-t-[var(--indigo)] rounded-full animate-spin" />
  </div>
);

/**
 * Wraps routes that require the user to be logged in.
 * Redirects to /login if unauthenticated.
 */
const ProtectedRoute = () => {
  const { user, loading } = useAuth();

  if (loading) return <Spinner />;
  if (!user) return <Navigate to="/login" replace />;

  return <Outlet />;
};

export default ProtectedRoute;
