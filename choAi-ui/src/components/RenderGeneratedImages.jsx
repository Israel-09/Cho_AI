import React, { useState } from "react";
import {
  Box,
  Dialog,
  DialogContent,
  Skeleton,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import {
  ArrowBackIosNewRounded,
  ArrowBackRounded,
  FileDownloadRounded,
  CloseRounded,
} from "@mui/icons-material";
import ImageViewer from "./ImageViewer";

const RenderGeneratedImages = ({ images, status }) => {
  const [open, setOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const handleImageClick = (imageSrc) => {
    setSelectedImage(imageSrc);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedImage(null); // Clear the selected image when closing
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      gap={2}
      sx={{
        my: 2,
        overflow: "hidden",
        paddingLeft: isMobile ? "22px" : "22px",
      }}
    >
      {status === "processing" ? (
        <Skeleton variant="rectangular" width={400} height={400} />
      ) : (
        images.map((image, index) => (
          <Box
            key={index}
            component="img"
            src={image}
            alt={`Generated ${index}`}
            width="400px"
            height="400px"
            onClick={() => handleImageClick(image)} // Pass the image URL to the handler
            sx={{ cursor: "pointer", objectFit: "cover", borderRadius: "13px" }}
          />
        ))
      )}
      {/* MUI Dialog/Modal for displaying the enlarged image */}
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="md"
        fullWidth
        sx={{
          "& .MuiDialog-paper": {
            backgroundColor: "#000000ff",
            boxShadow: "none",
            overflow: "hidden",
            width: isMobile ? "95%" : "100vw",
          },
        }}
      >
        <Box
          sx={{
            background: "transparent",
            padding: isMobile ? "20px" : "40px",
            justifyContent: "center",
            alignItems: "center",
            animation: "fadeIn 1s",
            transition: "width 1s ease-in-out ",
            overflow: "hidden",
          }}
        >
          <Box
            sx={{
              height: "30px",
              marginBottom: "30px",
              display: "flex",
              justifyContent: "space-between",
              overflow: "hidden",
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
                if (selectedImage) {
                  const link = document.createElement("a");
                  link.href = selectedImage;
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
              src={selectedImage}
              alt={`Generated Image`}
              sx={{
                borderRadius: "25px",
                width: isMobile ? "90%" : "400px",
              }}
            />
          </Box>
        </Box>
      </Dialog>
    </Box>
  );
};

export default RenderGeneratedImages;
