// AppRouter.js
import { Routes, Route } from "react-router-dom";
import SlashPage from "./pages/SlashPage";
import OnboardingPage from "./pages/OnboardingPage";
import SignupPage from "./pages/SignupPage";
import SigninPage from "./pages/SigninPage";

function Router() {
  return (
    <Routes>
      <Route path="/" element={<SlashPage />} />
      <Route path="onboarding" element={<OnboardingPage />} />
      <Route path="signup" element={<SignupPage />} />
      <Route path="signin" element={<SigninPage />} />
    </Routes>
  );
}

export default Router;
