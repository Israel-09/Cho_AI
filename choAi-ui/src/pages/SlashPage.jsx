import { Container, Typography } from "@mui/material";
import React from "react";

const SlashPage = () => {
  return (
    <Container
      sx={{
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      maxWidth="1024px"
    >
      <Typography variant="h1" sx={{ fontWeight: "700", fontSize: "3rem" }}>
        ASKCHO.AI
      </Typography>
    </Container>
  );
};

export default SlashPage;
