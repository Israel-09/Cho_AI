import { Box, Grid2, Typography, useMediaQuery, useTheme } from "@mui/material";
import React from "react";
import codeImage from "../assets/Welcome-images/code.png";
import askImage from "../assets/Welcome-images/ask.jpg";
import emailImage from "../assets/Welcome-images/email.jpg";
import imageImage from "../assets/Welcome-images/images.jpg";
import createImage from "../assets/Welcome-images/cocreate.jpg";
import productivityImage from "../assets/Welcome-images/productivity.jpg";
import { Link } from "react-router-dom";

const features = [
  { title: "Help me summarrize", image: askImage },
  { title: "Let's Cocreate", image: createImage },
  { title: "Generate Images", image: imageImage },
  { title: "Be my coding buddy", image: codeImage },
  { title: "Help me write an email", image: emailImage },
  { title: "Productivity Recommendation", image: productivityImage },
];

const FeatureCard = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <Grid2
      container
      direction="row"
      gap={isMobile ? 1 : 3}
      sx={{
        display: "flex",
        overflowX: isMobile ? "auto" : "hidden",
        flexWrap: "nowrap",
        justifyContent: "center",
        alignItems: "flex-start",
        width: "100%",
        height: isMobile ? "150px" : "220px",
        padding: isMobile ? "0 10px" : "0",
      }}
    >
      {features.map((item, key) => (
        <Grid2
          key={key}
          sx={{
            flex: "0 0 auto",
            width: isMobile ? "60px" : "100px",
            height: isMobile ? "120px" : "180px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            transition: "scale 0.3s ease-in-out",
            fontWeight: 700,
            "&:hover": {
              filter: "grayscale(100%)",
              scale: 0.8,
              animation: "fade-in 0.1s",
              transition: "scale 0.5s, width 0.1s",
              fontWeight: 400,
            },
          }}
        >
          <Box
            component="div"
            sx={{
              borderRadius: isMobile ? "10px" : "13px",
              width: isMobile ? "60px" : "100px",
              height: isMobile ? "90px" : "145px",
              backgroundImage: `url(${item.image})`,
              backgroundPosition: "center",
              backgroundSize: "cover",
              cursor: "pointer",
              marginBottom: 1,
            }}
          />
          <Typography
            variant="subtitle1"
            align="center"
            fontSize={isMobile ? "0.45rem" : "0.6rem"}
          >
            {item.title}
          </Typography>
        </Grid2>
      ))}
    </Grid2>
  );
};

export default FeatureCard;
