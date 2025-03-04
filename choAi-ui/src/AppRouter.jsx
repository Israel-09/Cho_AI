// AppRouter.js
import { Routes, Route } from "react-router-dom";
import SlashPage from "./pages/SlashPage";

function Router() {
  return (
    <Routes>
      <Route path="/" element={<SlashPage />} />
    </Routes>
  );
}

export default Router;
