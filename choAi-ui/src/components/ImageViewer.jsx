import { CloseRounded, FileDownloadRounded } from "@mui/icons-material";
import { Box } from "@mui/material";
import React from "react";

const ImageViewer = ({ imageUrl, handleClose, isMobile }) => {
  return (
    <Box
      sx={{
        backgroundColor: "rgba(0, 0, 0, 0.97)",
        width: "100%",
        height: "100vh",
        position: "absolute",
        top: 0,
        left: 0,
        zIndex: 1300, // Ensure it appears above other content
        padding: isMobile ? "20px" : "40px",
        justifyContent: "center",
        alignItems: "center",
        animation: "fadeIn 1s",
        transition: "width 1s ease-in-out ",
      }}
    >
      <Box
        sx={{
          height: "30px",
          marginBottom: "30px",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <CloseRounded
          sx={{
            cursor: "pointer",
            fontSize: "28px",
            borderRadius: "50%",
            backgroundColor: "#1d1717aa",
          }}
          onClick={handleClose}
          color="error"
        />
        <FileDownloadRounded
          sx={{ cursor: "pointer", fontSize: "28px" }}
          onClick={() => {
            if (imageUrl) {
              const link = document.createElement("a");
              link.href = imageUrl;
              link.download = "generated_image.png";
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
            }
          }}
        />
      </Box>
      <Box
        sx={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Box
          component="img"
          src={imageUrl}
          alt={`Generated Image`}
          maxWidth={isMobile ? "90%" : "550px"}
          sx={{
            borderRadius: "25px",
          }}
        />
      </Box>
    </Box>
  );
};

export default ImageViewer;
