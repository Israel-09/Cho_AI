import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Container,
  Grid2,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import AppNavbar from "../components/AppNavbar";
import image from "../assets/Welcome-images/code.png";

const CardComponent = ({ title, link, image, startFull }) => {
  const [isFull, setIsFull] = useState(startFull);

  const handleMouseEnter = () => {
    setIsFull(true); // Expand card on hover
  };

  const handleMouseLeave = () => {
    setIsFull(startFull); // Reset to initial startFull value on leave
  };

  return (
    <Grid2
      size={isFull ? 4 : 2}
      sx={{
        transition: "all 0.3s ease-in-out", // Smooth transition for size changes
        cursor: "pointer",
        backgroundColor: "transparent",
        boxShadow: "none",
        borderRadius: "8px",
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Box
        sx={{
          position: "relative", // For absolute positioning of title in isFull mode
          borderRadius: "8px",
          overflow: "hidden", // Ensure rounded corners clip the image
        }}
      >
        <Box
          component="div"
          sx={{
            height: { xs: "200px", md: "250px" }, // Responsive height
            width: "100%",
            backgroundImage: `url(${image || "path/to/placeholder.jpg"})`, // Fallback image
            backgroundPosition: "center",
            backgroundSize: "cover",
            borderRadius: "8px",
          }}
        >
          {isFull && (
            <Typography
              variant="body2"
              component="p"
              sx={{
                position: "absolute",
                bottom: 8,
                left: 8,
                padding: "4px 8px",
                backgroundColor: "rgba(0, 0, 0, 0.6)", // Semi-transparent background
                color: "white",
                borderRadius: "4px",
                fontWeight: "bold",
              }}
            >
              {title}
            </Typography>
          )}
        </Box>
      </Box>
      {!isFull && (
        <Typography
          variant="h6"
          sx={{
            textAlign: "center",
            fontSize: { xs: "0.9rem", md: "1rem" }, // Improved readability
            color: "white",
            marginTop: "8px",
          }}
        >
          {title}
        </Typography>
      )}
    </Grid2>
  );
};

const ExplorePage = () => {
  const exploreFeatures = [
    {
      title: "Reasearch With Askcho",
      link: "#",
      image: image,
      startFull: false,
    },
    {
      title: "Reasearch With Askcho",
      link: "#",
      image: image,
      startFull: true,
    },
    {
      title: "Reasearch With Askcho",
      link: "#",
      image: image,
      startFull: false,
    },
    {
      title: "Reasearch With Askcho",
      link: "#",
      image: image,
      startFull: true,
    },
    {
      title: "Reasearch With Askcho",
      link: "#",
      image: image,
      startFull: true,
    },
    {
      title: "Reasearch With Askcho",
      link: "#",
      image: image,
      startFull: false,
    },
    {
      title: "Reasearch With Askcho",
      link: "#",
      image: image,
      startFull: false,
    },
    {
      title: "Reasearch With Askcho",
      link: "#",
      image: image,
      startFull: false,
    },
    {
      title: "Reasearch With Askcho",
      link: "#",
      image: image,
      startFull: true,
    },
    {
      title: "Reasearch With Askcho",
      link: "#",
      image: image,
      startFull: false,
    },
  ];

  return (
    <Box sx={{ display: "flex" }}>
      <Box>
        <AppNavbar />
      </Box>
      <Container
        maxWidth="lg"
        sx={{ padding: 2, height: "100vh", background: "blue" }}
      >
        <Typography
          variant="h4"
          gutterBottom
          sx={{ fontSize: "1rem", fontWeight: "bold" }}
        >
          Explore
        </Typography>
        <Grid2
          container
          sx={{
            width: "120%",
            flexWrap: "wrap",
            gap: 2,
            justifyContent: "flex-start",
            padding: 2,
            overflowX: "hidden",
            background: "red",
          }}
        >
          {exploreFeatures.map((feature, index) => (
            <CardComponent
              key={index}
              image={feature.image}
              title={feature.title}
              startFull={feature.startFull}
            />
          ))}
        </Grid2>
      </Container>
    </Box>
  );
};

export default ExplorePage;
