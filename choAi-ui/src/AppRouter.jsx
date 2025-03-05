// AppRouter.js
import { Routes, Route } from "react-router-dom";
import SlashPage from "./pages/SlashPage";
import OnboardingPage from "./pages/OnboardingPage";

function Router() {
  return (
    <Routes>
      <Route path="/" element={<SlashPage />} />
      <Route path="onboarding" element={<OnboardingPage />} />
    </Routes>
  );
}

export default Router;
