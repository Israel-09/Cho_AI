import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  ImageList,
  ImageListItem,
  Box,
  Container,
  Skeleton,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import { ref, list, getDownloadURL } from "firebase/storage";
import { storage } from "../config/firebase";
import ImageViewer from "./ImageViewer";

const CreateImageBackground = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm")); // < 600px
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md")); // 600–900px
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));
  const [openImageViewer, setOpenImageViewer] = useState(false);

  // Dynamic columns
  const cols = isMobile ? 4 : isTablet ? 4 : 5;

  // Estimate images per screen (aiming for ~10–15 visible)
  const estimateImagesPerScreen = () => {
    const height = window.innerHeight || 800;
    const avgImageHeight = 420;
    const imagesPerColumn = Math.ceil(height / avgImageHeight) + 2;
    return imagesPerColumn * cols;
  };

  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [pageToken, setPageToken] = useState(undefined);
  const observer = useRef();

  const IMAGES_PER_BATCH = Math.max(15, estimateImagesPerScreen()); // at least 15

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;
    setLoading(true);

    try {
      const storageRef = ref(storage, "public/marketing-images/");
      const res = await list(storageRef, {
        maxResults: IMAGES_PER_BATCH,
        pageToken: pageToken,
      });

      if (res.items.length === 0) {
        setHasMore(false);
        setLoading(false);
        return;
      }

      // 1. Add skeleton placeholders immediately
      const placeholders = res.items.map((itemRef, i) => ({
        id: `${itemRef.fullPath}-${Date.now()}-${i}`,
        src: null,
        loaded: false,
        name: itemRef.name,
      }));
      setImages((prev) => [...prev, ...placeholders]);

      // 2. Load real URLs one by one (staggered for beauty)
      res.items.forEach((itemRef, i) => {
        setTimeout(async () => {
          try {
            const url = await getDownloadURL(itemRef);
            setImages((prev) =>
              prev.map((img) =>
                img.name === itemRef.name
                  ? { ...img, src: url, loaded: true }
                  : img
              )
            );
          } catch (err) {
            console.error("Failed to load image:", itemRef.name, err);
          }
        }, i * 120); // Smooth staggered reveal
      });

      // 3. Update pagination
      setPageToken(res.nextPageToken || undefined);
      setHasMore(!!res.nextPageToken);
    } catch (error) {
      console.error("Error loading batch:", error);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  }, [loading, pageToken, hasMore, cols]);

  // Initial load
  useEffect(() => {
    loadMore();
  }, []);

  // Intersection Observer for infinite scroll
  const lastImageRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          loadMore();
        }
      });

      if (node) observer.current.observe(node);
    },
    [loading, hasMore, loadMore]
  );

  return (
    <Container
      sx={{
        py: { xs: 1, sm: 2, md: 3 },
        overflowX: "hidden",
        position: "relative",
        margin: "0 auto",
      }}
    >
      <ImageList variant="masonry" cols={cols} gap={8} sx={{ width: "100%" }}>
        <AnimatePresence>
          {images.map((img, index) => {
            const isLast = index === images.length - 1;

            return (
              <ImageListItem
                key={img.id}
                {...(isLast ? { ref: lastImageRef } : {})}
                component={motion.div}
                initial={{ opacity: 0, scale: 0.88 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.7, ease: "easeOut" }}
                whileHover={{ y: -16, transition: { duration: 0.4 } }}
                sx={{
                  borderRadius: 1,
                  overflow: "hidden",
                  boxShadow: "0 20px 50px rgba(0,0,0,0.7)",
                  transition: "box-shadow 0.4s",
                  "&:hover": {
                    boxShadow: "0 35px 80px rgba(0,0,0,0.95)",
                  },
                  cursor: "pointer",
                  width: "100%",
                }}
                onClick={() => setOpenImageViewer(false)}
              >
                {/* Floating animation */}
                <motion.div
                  animate={{
                    y: [0, -22, 0],
                    rotate: [0, 1.4, -1, 0],
                  }}
                  transition={{
                    duration: 20 + (index % 12) * 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  {!img.loaded ? (
                    <Skeleton
                      variant="rectangular"
                      width="100%"
                      height={350 + (index % 10) * 30}
                      animation="wave"
                      sx={{ bgcolor: "grey.900" }}
                    />
                  ) : (
                    <img
                      src={img.src}
                      style={{
                        display: "block",
                        height: isMobile
                          ? `${150 + (index % 9) * 20}px`
                          : `${350 + (index % 10) * 30}px`,
                        width: "100%",
                        objectFit: "cover",
                        transition:
                          "transform 10s cubic-bezier(0.25,0.46,0.45,0.94)",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = "scale(1.08)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = "scale(1)";
                      }}
                    />
                  )}
                </motion.div>
              </ImageListItem>
            );
          })}
        </AnimatePresence>
      </ImageList>

      {/* Optional loading indicator */}
      {loading && (
        <Box sx={{ textAlign: "center", py: 4 }}>
          <Skeleton
            variant="text"
            width={180}
            height={40}
            sx={{ mx: "auto", bgcolor: "grey.800" }}
          />
        </Box>
      )}

      {openImageViewer && (
        <Box
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            zIndex: 1300,
          }}
        >
          <ImageViewer
            imageUrl={images.find((img) => img.loaded)?.src}
            handleClose={() => setOpenImageViewer(false)}
            isMobile={isMobile}
          />
        </Box>
      )}
    </Container>
  );
};

export default CreateImageBackground;
