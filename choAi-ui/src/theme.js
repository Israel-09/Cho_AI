import { createTheme } from "@mui/material";

const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#ffffff",
    },
    secondary: {
      main: "#fff",
    },
    action: {
      focus: "#fff",
    },
    text: {
      secondary: "#d3d3d3",
    },
    background: {
      default: "#050505",
    },
  },
  shape: {
    borderRadius: "12px",
  },
  typography: {
    h1: {
      fontFamily: '"Montserrat", "Roboto", "Helvetica", sans-serif',
    },
    h2: {
      fontFamily: '"Montserrat", "Roboto", "Helvetica", sans-serif',
    },
    fontFamily: '"Public Sans", "Roboto", "Helvetica", sans-serif',
  },
});

export default theme;
