import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth"; // Adjust path as needed
import {
  Container,
  Typography,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  CircularProgress,
  Box,
  Snackbar,
  IconButton,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import {
  Email,
  Lock,
  Person,
  VolumeUp as VolumeUpIcon,
  Delete,
  ArrowBackIosSharp,
  ArrowBack,
} from "@mui/icons-material";
import { auth, db } from "../config/firebase"; // Adjust path as needed
import {
  updateEmail,
  updatePassword,
  updateProfile,
  EmailAuthProvider,
  reauthenticateWithCredential,
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { Alert } from "@mui/material";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";

const AccountSettings = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [voices, setVoices] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newUsername, setNewUsername] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [userData, setUserData] = useState(null);
  const [showUsernameFields, setShowUsernameFields] = useState(false);
  const [showEmailFields, setShowEmailFields] = useState(false);
  const [currentEmailPassword, setCurrentEmailPassword] = useState("");

  // Load available voices for "Read Aloud"
  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      if (availableVoices.length > 0) {
        setVoices(availableVoices);
      }
    };
    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
  }, []);

  // Fetch user preferences from Firestore
  useEffect(() => {
    const fetchUserData = async () => {
      const userDoc = doc(db, "users", user.uid);
      const docSnap = await getDoc(userDoc);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setSelectedVoice(data.preferredVoice || "");
        setUserData(data);
        console.log("AccountSettings: User data fetched");
      }
    };

    fetchUserData();
  }, [user]);

  // Re-authenticate user for sensitive actions
  const reauthenticate = async (currentPassword) => {
    const credential = EmailAuthProvider.credential(
      user.email,
      currentPassword
    );
    await reauthenticateWithCredential(user, credential);
  };

  // Change email
  const handleChangeEmail = async () => {
    setLoading(true);
    try {
      await reauthenticate(currentEmailPassword);
      await updateEmail(user, newEmail);
      setSuccess("Email updated successfully");
      setNewEmail("");
      setCurrentEmailPassword("");
      setShowEmailFields(false);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Update password
  const handleUpdatePassword = async () => {
    setLoading(true);
    try {
      await reauthenticate(currentPassword);
      await updatePassword(user, newPassword);
      setSuccess("Password updated successfully");
      setNewPassword("");
      setCurrentPassword("");
      setShowPasswordFields(false);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Update username
  const handleUpdateUsername = async () => {
    setLoading(true);
    try {
      await updateProfile(user, { displayName: newUsername });
      const userDoc = doc(db, "users", user.uid);
      await setDoc(userDoc, { username: newUsername }, { merge: true });
      setSuccess("Username updated successfully");
      setNewUsername("");
      setShowUsernameFields(false);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Set "Read Aloud" voice preference
  const handleSetVoice = async (voiceName) => {
    try {
      const userDoc = doc(db, "users", user.uid);
      await setDoc(userDoc, { preferredVoice: voiceName }, { merge: true });
      setSelectedVoice(voiceName);
      setSuccess("Voice preference updated");
    } catch (error) {
      setError(error.message);
    }
  };

  // Test the selected voice
  const testVoice = (voiceName) => {
    const voice = voices.find((v) => v.name === voiceName);
    if (voice) {
      const utterance = new SpeechSynthesisUtterance(
        "Hello! How would you like me to serve you."
      );
      utterance.voice = voice;
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 4,
        }}
      >
        <Box backgroundColor="">
          <Typography variant="h1" gutterBottom sx={{ color: "white" }}>
            Account Settings
          </Typography>
          <Typography variant="caption" gutterBottom sx={{ color: "#CCC" }}>
            Manage your personal information, preferences, and account settings.
          </Typography>
        </Box>
        <Box>
          <IconButton onClick={() => navigate(-1)}>
            <ArrowBack sx={{ fontSize: "2rem" }} />
          </IconButton>
        </Box>
      </Box>
      <Grid container spacing={4} sx={{ marginTop: 4 }}>
        {/* Profile Settings */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              mb: 2,
              fontSize: "1.5rem",
            }}
          >
            <Person sx={{ mr: 1, color: "white" }} />
            <Typography variant="h6">Profile</Typography>
          </Box>
          <Box sx={{ mb: 2 }}>
            <TextField
              label="Current Username"
              value={user?.displayName || ""}
              disabled
              fullWidth
              sx={{
                mr: 2,
                mb: 1,
                input: { color: "white" },
                label: { color: "white" },
              }}
            />
            <Button
              variant="contained"
              onClick={() => setShowUsernameFields(!showUsernameFields)}
            >
              {showUsernameFields ? "Close" : "Update"}
            </Button>
          </Box>
          {showUsernameFields && (
            <>
              <TextField
                label="New Username"
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
                fullWidth
                sx={{
                  mb: 2,
                  input: { color: "white" },
                  label: { color: "white" },
                }}
              />
              <Button
                variant="contained"
                onClick={handleUpdateUsername}
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} /> : "Save Username"}
              </Button>
            </>
          )}
        </Grid>

        {/* Email */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              mb: 2,
              fontSize: "1.5rem",
            }}
          >
            <Email sx={{ mr: 1, color: "white" }} />
            <Typography variant="h6">Change Email</Typography>
          </Box>
          <Box sx={{ mb: 2 }}>
            <TextField
              label="Current Email"
              value={user.email}
              disabled
              fullWidth
              sx={{
                mr: 2,
                mb: 1,
                input: { color: "white" },
                label: { color: "white" },
              }}
            />
            <Button
              variant="contained"
              onClick={() => setShowEmailFields(!showEmailFields)}
            >
              {showEmailFields ? "Close" : "Update"}
            </Button>
          </Box>
          {showEmailFields && (
            <>
              <TextField
                label="New Email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                fullWidth
                sx={{
                  mb: 2,
                  input: { color: "white" },
                  label: { color: "white" },
                }}
              />
              <TextField
                label="Current Password"
                type="password"
                value={currentEmailPassword}
                onChange={(e) => setCurrentEmailPassword(e.target.value)}
                fullWidth
                sx={{
                  mb: 2,
                  input: { color: "white" },
                  label: { color: "white" },
                }}
              />
              <Button
                variant="contained"
                onClick={handleChangeEmail}
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} /> : "Save Email"}
              </Button>
            </>
          )}
        </Grid>

        {/* Preferences */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              mb: 2,
              fontSize: "1.5rem",
            }}
          >
            <VolumeUpIcon sx={{ mr: 1, color: "white" }} />
            <Typography variant="h6">Read Aloud Voice</Typography>
          </Box>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel id="voice-select-label" sx={{ color: "white" }}>
              Select Voice
            </InputLabel>
            <Select
              labelId="voice-select-label"
              value={selectedVoice}
              onChange={(e) => setSelectedVoice(e.target.value)}
            >
              {voices.map((voice, index) => (
                <MenuItem key={index} value={voice.name}>
                  {voice.name.split(" - ")[0]}
                  {console.log(voice)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Box sx={{ display: "flex", gap: 2 }}>
            <Button
              variant="outlined"
              onClick={() => testVoice(selectedVoice)}
              disabled={!selectedVoice}
              sx={{ color: "white", borderColor: "white" }}
            >
              Test Voice
            </Button>
            <Button
              variant="contained"
              onClick={() => handleSetVoice(selectedVoice)}
              disabled={!selectedVoice}
            >
              Save Voice
            </Button>
          </Box>
        </Grid>

        {/* Password
        <Grid size={{ xs: 12, md: 6 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              mb: 2,
              fontSize: "1.5rem",
            }}
          >
            <Lock sx={{ mr: 1, color: "white" }} />
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              Update your password
            </Typography>
          </Box>

          <TextField
            label="Current Password"
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            fullWidth
            sx={{
              mb: 2,
              input: { color: "white" },
              label: { color: "white" },
            }}
          />
          <TextField
            label="New Password"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            fullWidth
            sx={{
              mb: 2,
              input: { color: "white" },
              label: { color: "white" },
            }}
          />
          <Button
            variant="contained"
            onClick={handleUpdatePassword}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : "Save Password"}
          </Button>
        </Grid> */}

        {/* Account Deletion */}
        <Grid size={{ xs: 12 }}>
          {/* <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
            <Delete sx={{ mr: 1, color: "error.main" }} />
            <Typography variant="h6" color="error">
              Delete Account
            </Typography>
          </Box>
          <Button
            variant="outlined"
            color="error"
            onClick={() => setOpenDeleteDialog(true)}
          >
            Delete Account
          </Button> */}
          <Dialog
            open={openDeleteDialog}
            onClose={() => setOpenDeleteDialog(false)}
            PaperProps={{ sx: { backgroundColor: "#333", color: "white" } }}
          >
            <DialogTitle>Delete Account</DialogTitle>
            <DialogContent>
              <DialogContentText sx={{ color: "white" }}>
                Are you sure you want to delete your account? This action cannot
                be undone.
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button
                onClick={() => setOpenDeleteDialog(false)}
                sx={{ color: "white" }}
              >
                Cancel
              </Button>
              <Button
                onClick={() => {
                  // Delete account logic (unchanged)
                }}
                color="error"
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} /> : "Delete"}
              </Button>
            </DialogActions>
          </Dialog>
        </Grid>
      </Grid>

      {/* Feedback Snackbars */}
      <Snackbar
        open={!!error}
        onClose={() => setError(null)}
        autoHideDuration={3000}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert severity="error" sx={{ width: "100%" }}>
          {error}
        </Alert>
      </Snackbar>
      <Snackbar
        open={!!success}
        onClose={() => setSuccess(null)}
        autoHideDuration={3000}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert severity="success" sx={{ width: "100%" }}>
          {success}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default AccountSettings;
