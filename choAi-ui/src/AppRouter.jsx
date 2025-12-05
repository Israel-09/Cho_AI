// AppRouter.js
import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import SlashPage from "./pages/SlashPage";
import OnboardingPage from "./pages/OnboardingPage";
import SignupPage from "./pages/SignupPage";
import SigninPage from "./pages/SigninPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import ContactUsPage from "./pages/ContactUsPage";
import ChatPage from "./pages/ChatPage";
import ExplorePage from "./pages/ExplorePage";
import { useAuth } from "./hooks/useAuth";
import LoadingScreen from "./components/LoadingScreen";
import GetStarted from "./pages/GetStarted";

import VerifyEmailPage from "./pages/VerifyEmailPage";
import AccountSettings from "./pages/AccountSettings";
import ResearchAssistantPage from "./pages/ResearchAssistantPage";

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  if (!user) {
    return <Navigate to="/signin" replace />;
  }

  return (
    <>
      {children}
      <Outlet />
    </>
  );
};

// Public Route Component (accessible only when not authenticated)
const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  if (user) {
    return <Navigate to="/chat" replace />;
  }

  return (
    <>
      {children}
      <Outlet />
    </>
  );
};

function Router() {
  const { user } = useAuth();

  return (
    <Routes>
      <Route element={<PublicRoute />}>
        <Route path="/" element={<SlashPage />} />
        <Route path="onboarding" element={<OnboardingPage />} />
        <Route path="signup" element={<SignupPage />} />
        <Route path="signin" element={<SigninPage />} />
        <Route path="reset-password" element={<ResetPasswordPage />} />
        {/* <Route path="waitlist" element={<WaitlistPage />} /> */}

        <Route path="get-started" element={<GetStarted />} />
        <Route path="" />
      </Route>
      <Route path="verify-email" element={<VerifyEmailPage />} />
      <Route path="chat" element={<ChatPage />} />
      <Route path="contact-us" element={<ContactUsPage />} />

      <Route element={<ProtectedRoute />}>
        <Route path="/chat/:conversationId" element={<ChatPage />} />
        <Route path="explore" element={<ExplorePage />} />
        <Route path="account-details" element={<AccountSettings />} />
        <Route path="research-assistant" element={<ResearchAssistantPage />} />
      </Route>
      {/* Redirect all other paths to the home page */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default Router;
