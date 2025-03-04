import { useState } from "react";
import { ThemeProvider, Typography } from "@mui/material";
import { BrowserRouter as Router } from "react-router-dom";
import AppRouter from "./AppRouter.jsx";


function App() {
  return (
    <Router>
      <AppRouter />
    </Router>
  );
}

export default App;
