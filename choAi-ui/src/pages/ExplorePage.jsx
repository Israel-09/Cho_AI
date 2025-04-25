import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Container,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import AppNavbar from "../components/AppNavbar";
import image from "../assets/Welcome-images/code.png";

const CardComponent = ({ title, link, image, startFull }) => {
  const [isFull, setIsFull] = useState(startFull);

  const handleMouseEnter = () => {
    setIsFull((prev) => !prev);
  };

  return (
    <Box
      sx={{
        width: isFull ? "440px" : "290px",
        transition: "width 0.5s ease-in-out",
        cursor: "pointer",
        backgroundColor: "transparent",
        boxShadow: "none",
        borderRadius: "8px",
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseEnter}
    >
      <Box>
        <Box
          component="div"
          height="200px"
          image={image}
          alt={title}
          sx={{
            borderRadius: "8px",
            width: "100%",
            backgroundImage: `url(${image})`,
            backgroundPosition: "center",
            backgroundSize: "cover",
          }}
        >
          {isFull && (
            <Typography
              variant="body2"
              component="p"
              sx={{
                outline: "1px solid black",
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
          sx={{ textAlign: "center", fontSize: "0.7rem", color: "white" }}
        >
          {title}
        </Typography>
      )}
    </Box>
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
      <Container maxWidth="xl" sx={{ padding: 2, height: "100vh" }}>
        <Typography variant="h4" gutterBottom sx={{ fontSize: "1rem" }}>
          Explore
        </Typography>
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 2,
            justifyContent: "flex-start",
            padding: 2,
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
        </Box>
      </Container>
    </Box>
  );
};

export default ExplorePage;
