import { createTheme } from "@mui/material";

const isMobile = window.innerWidth <= 768;
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
    fontFamily: '"Public Sans", "Roboto", "Helvetica", sans-serif',
    fontSize: isMobile ? "0.7rem" : "0.9rem",
  },
});

export default theme;
