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
    fontFamily: '"Public Sans", "Roboto", "Helvetica", sans-serif',
  },
});

export default theme;
