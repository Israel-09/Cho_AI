import {
  AppBar,
  Box,
  Button,
  Icon,
  IconButton,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import {
  AccountCircleOutlined as AccountIcon,
  Menu as MenuIcon,
} from "@mui/icons-material";
import React from "react";
import { Link } from "react-router-dom";
import "../styles/navbar.css";

const history = {
  today: [
    {
      title:
        "What is the best sales funnel in marketing as a very long something...",
    },
  ],
  last30days: [
    { title: "Chat with Cho" },
    { title: "Ask Cho about AI" },
    { title: "Chat with Cho" },
    { title: "Ask Cho about AI" },
    { title: "Chat with Cho" },
  ],
};

const NoHistory = () => {
  return (
    <Typography sx={{ fontSize: 12, color: "#b0b0b0" }}>
      No history yet.
    </Typography>
  );
};

const deleteNavigation = [
  { name: "Delete all chats", icon: <AccountIcon />, path: "/delete" },
  { name: "Delete account", icon: <AccountIcon />, path: "/delete-account" },
];

const isEmpty = (obj) => {
  return Object.keys(obj).length === 0 && obj.constructor === Object;
};

const AppNavbar = () => {
  const [open, setOpen] = React.useState(true);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const maxWidth = 320;

  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  return (
    <Box
      sx={{
        position: isMobile ? "absolute" : "block",
        inset: "0 auto 0 0",
        minHeight: "100vh",
        width: open ? maxWidth : "80px",
        backgroundColor: "rgba(58, 58, 58, 1)",
        animation: "fadeIn 0.3s",
        transition: "max-width 0.5s ease-in-out",
        paddingX: 1,
      }}
    >
      <Stack paddingTop={2}>
        <Box sx={{ width: "100%" }}>
          <IconButton
            sx={{ float: open && "right" }}
            onClick={handleDrawerToggle}
          >
            <i class="bx bx-menu-alt-left" style={{ fontSize: "24px" }}></i>
          </IconButton>
        </Box>

        <Box
          sx={{
            display: open ? "block" : "none",
            paddingLeft: 2,
            height: "300px",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            width: "90%",
          }}
        >
          <Typography
            variant="body1"
            sx={{ marginBottom: 1, fontWeight: "700" }}
          >
            History
          </Typography>

          {isEmpty(history) ? (
            <NoHistory />
          ) : (
            <>
              <Typography variant="body2" sx={{ marginY: "2px" }}>
                Today
              </Typography>
              {history.today.length === 0 ? (
                <NoHistory />
              ) : (
                <Box
                  sx={{
                    paddingLeft: 1,
                  }}
                >
                  {history.today.map((item, index) => (
                    <Typography
                      variant="body2"
                      key={index}
                      sx={{ fontSize: "14px", color: "#b0b0b0" }}
                    >
                      {item.title}
                    </Typography>
                  ))}
                </Box>
              )}

              <Typography variant="body2" sx={{ marginTop: "10px" }}>
                Last 30 days
              </Typography>
              <Box
                sx={{
                  paddingLeft: 1,
                }}
              >
                {isEmpty(history.last30days) ? (
                  <NoHistory />
                ) : (
                  <>
                    {history.last30days.map((item, index) => (
                      <Typography
                        variant="body2"
                        key={index}
                        sx={{ fontSize: "16px", color: "#b0b0b0" }}
                      >
                        {item.title}
                      </Typography>
                    ))}
                  </>
                )}
              </Box>
            </>
          )}
        </Box>
        <Box
          sx={{
            height: "350px",
            width: "90%",
            display: "flex",
            position: "absolute",
            bottom: 5,
            left: 2,
            flexDirection: "column",
            marginTop: open ? 0 : "170px",
          }}
        >
          <a href="#" style={{ textDecoration: "none", color: "#fff" }}>
            <Stack
              direction="row"
              spacing={1}
              alignItems="center"
              className={open ? "nav-item" : "nav-item nav-item-closed"}
            >
              <i class="bx bxs-binoculars"></i>
              <span>Explore</span>
            </Stack>
          </a>
          <Stack
            direction="row"
            spacing={1}
            alignItems="center"
            className={open ? "nav-item" : "nav-item nav-item-closed"}
          >
            <i class="bx bx-user-circle"></i>
            <span>Account</span>
          </Stack>

          <Stack
            sx={{
              paddingLeft: "7px",
              marginBottom: "20px",
              display: open ? "block" : "None",
            }}
          >
            <a href="#" style={{ textDecoration: "none", color: "#fff" }}>
              <Stack
                direction="row"
                spacing={1}
                alignItems="center"
                className={open ? "nav-item" : "nav-item nav-item-closed"}
              >
                <i class="bx bx-file"></i>
                <span>Terms of use</span>
              </Stack>
            </a>
            <a href="#" style={{ textDecoration: "none", color: "#fff" }}>
              <Stack
                direction="row"
                spacing={1}
                alignItems="center"
                className={open ? "nav-item" : "nav-item nav-item-closed"}
              >
                <i class="bx bx-smile"></i>
                <span>Privacy policy</span>
              </Stack>
            </a>
            <a href="#" style={{ textDecoration: "none", color: "#fff" }}>
              <Stack
                direction="row"
                spacing={1}
                alignItems="center"
                className={open ? "nav-item" : "nav-item nav-item-closed"}
              >
                <i class="bx bxs-hand"></i>
                <span>give us feedback</span>
              </Stack>
            </a>
          </Stack>
          <Box
            sx={{
              height: "150px",
              width: "100%",
              position: "absolute",
              bottom: open ? 0 : "0px",
            }}
          >
            <a href="#" style={{ textDecoration: "none", color: "#fff" }}>
              <Stack
                direction="row"
                spacing={1}
                alignItems="center"
                className={open ? "nav-item" : "nav-item nav-item-closed"}
              >
                <i class="bx bx-comment-dots"></i>
                <span>Contact us</span>
              </Stack>
            </a>
            <a href="#" style={{ textDecoration: "none", color: "#fff" }}>
              <Stack
                direction="row"
                spacing={1}
                alignItems="center"
                className={open ? "nav-item" : "nav-item nav-item-closed"}
              >
                <i class="bx bx-exit"></i>
                <span>Log out</span>
              </Stack>
            </a>
            <Stack
              sx={{ paddingLeft: "7px", display: open ? "block" : "None" }}
              className="sub-nav"
            >
              <a
                href="#"
                style={{ textDecoration: "none", color: theme.palette.error }}
              >
                <Stack
                  direction="row"
                  spacing={1}
                  alignItems="center"
                  sx={{ color: "#f00" }}
                  className={open ? "nav-item" : "nav-item nav-item-closed"}
                >
                  <i class="bx bx-x" style={{ fontSize: "24px" }}></i>
                  <span>Delete all chats</span>
                </Stack>
              </a>
              <a href="#" style={{ textDecoration: "none", color: "0101ff" }}>
                <Stack
                  direction="row"
                  spacing={1}
                  alignItems="center"
                  sx={{ color: "#f00" }}
                  className={open ? "nav-item" : "nav-item nav-item-closed"}
                >
                  <i class="bx bx-user-circle"></i>
                  <span>Delete account</span>
                </Stack>
              </a>
            </Stack>
          </Box>
        </Box>
      </Stack>
    </Box>
  );
};

export default AppNavbar;
