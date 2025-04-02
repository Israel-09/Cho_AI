// AppRouter.js
import { Routes, Route, Navigate } from "react-router-dom";
import SlashPage from "./pages/SlashPage";
import OnboardingPage from "./pages/OnboardingPage";
import SignupPage from "./pages/SignupPage";
import SigninPage from "./pages/SigninPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import WaitlistPage from "./pages/WaitlistPage";
import PersonaPage from "./pages/PersonaPage";
import ChatPage from "./pages/ChatPage";

function Router() {
  return (
    <Routes>
      <Route path="/" element={<SlashPage />} />
      <Route path="onboarding" element={<OnboardingPage />} />
      <Route path="signup" element={<SignupPage />} />
      <Route path="signin" element={<SigninPage />} />
      <Route path="reset-password" element={<ResetPasswordPage />} />
      <Route path="waitlist" element={<WaitlistPage />} />
      <Route path="get-started" element={<PersonaPage />} />
      <Route path="chat" element={<ChatPage />} />

      {/* Redirect all other paths to the home page */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default Router;
