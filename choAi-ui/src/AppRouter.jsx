// AppRouter.js
import { Routes, Route, Navigate } from "react-router-dom";
import SlashPage from "./pages/SlashPage";
import OnboardingPage from "./pages/OnboardingPage";
import SignupPage from "./pages/SignupPage";
import SigninPage from "./pages/SigninPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import WaitlistPage from "./pages/WaitlistPage";

function Router() {
  return (
    <Routes>
      <Route path="/" element={<SlashPage />} />
      <Route path="onboarding" element={<OnboardingPage />} />
      <Route path="signup" element={<SignupPage />} />
      <Route path="signin" element={<SigninPage />} />
      <Route path="reset-password" element={<ResetPasswordPage />} />
      <Route path="waitlist" element={<WaitlistPage />} />
    </Routes>
  );
}

export default Router;
