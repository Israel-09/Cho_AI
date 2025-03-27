import { createTheme } from "@mui/material";

const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#ffffff",
    },
  },
  shape: {
    borderRadius: "12px",
  },
  typography: {
    fontWeightBold: 700,
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
