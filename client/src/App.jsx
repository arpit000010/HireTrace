import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

// Auth pages (public)
import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import VerifyEmailPage from "./pages/VerifyEmailPage.jsx";

// App pages (protected)
import FeedPage from "./pages/FeedPage.jsx";
import ExperienceDetailPage from "./pages/ExperienceDetailPage.jsx";
import CreateExperiencePage from "./pages/CreateExperiencePage.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import BookmarksPage from "./pages/BookmarksPage.jsx";

function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/verify-email/:token" element={<VerifyEmailPage />} />

      {/* Protected routes */}
      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<FeedPage />} />
        <Route path="/experience/:id" element={<ExperienceDetailPage />} />
        <Route path="/create" element={<CreateExperiencePage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/bookmarks" element={<BookmarksPage />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
