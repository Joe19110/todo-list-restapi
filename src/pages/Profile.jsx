import { useEffect, useState } from "react";
import { auth, googleProvider, githubProvider } from "../firebase";
import {
  deleteUser,
  reauthenticateWithPopup,
  reauthenticateWithCredential,
  EmailAuthProvider,
} from "firebase/auth";
import axios from "axios";
import {
  Container,
  Typography,
  Avatar,
  Button,
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  TextField,
  Alert,
  CircularProgress,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const [userData, setUserData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState({});
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const user = auth.currentUser;

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) {
        navigate("/login");
        return;
      }

      try {
        const response = await fetch(`http://localhost:5000/api/users/${user.uid}`);
        if (response.ok) {
          const data = await response.json();
          setUserData(data);
          setEditedData(data);
        } else {
          throw new Error('Failed to fetch user data');
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        setError("Failed to load user data");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [user, navigate]);

  const handleLogout = async () => {
    await auth.signOut();
    navigate("/login");
  };

  const toggleEdit = () => {
    setIsEditing(!isEditing);
    setEditedData(userData);
  };

  const handleChange = (e) => {
    setEditedData({ ...editedData, [e.target.name]: e.target.value });
  };

  const saveChanges = async () => {
    if (!user) return;
    try {
      const response = await fetch(`http://localhost:5000/api/users/${user.uid}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editedData),
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      const updatedData = await response.json();
      setUserData(updatedData);
      setIsEditing(false);
      setError("");
    } catch (error) {
      console.error("Error updating profile:", error);
      setError("Failed to update profile");
    }
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Check file type
    if (!file.type.startsWith('image/')) {
      setError("Please upload an image file");
      return;
    }

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("Image size should be less than 5MB");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      // First, upload to our backend which will handle Cloudinary upload
      const uploadResponse = await fetch('http://localhost:5000/api/upload', {
        method: 'POST',
        body: formData
      });

      if (!uploadResponse.ok) {
        const errorData = await uploadResponse.json();
        throw new Error(errorData.message || 'Failed to upload image');
      }

      const { imageUrl } = await uploadResponse.json();

      // Then update user profile with new image URL
      const response = await fetch(`http://localhost:5000/api/users/${user.uid}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ profile_picture: imageUrl }),
      });

      if (!response.ok) {
        throw new Error('Failed to update profile picture');
      }

      const updatedData = await response.json();
      setUserData(updatedData);
      setEditedData(updatedData);
      setError("");
    } catch (error) {
      console.error("Error uploading image:", error);
      setError(error.message || "Failed to upload image");
    }
  };

  const handleDeleteAccount = async () => {
    if (!user) return;

    try {
      if (user.providerData[0]?.providerId === "password") {
        if (!password) {
          setError("Enter your password to confirm deletion.");
          return;
        }
        const credential = EmailAuthProvider.credential(user.email, password);
        await reauthenticateWithCredential(user, credential);
      } else {
        const provider = user.providerData[0]?.providerId === "google.com" ? googleProvider : githubProvider;
        await reauthenticateWithPopup(user, provider);
      }

      // Delete from MySQL first
      const response = await fetch(`http://localhost:5000/api/users/${user.uid}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete account from database');
      }

      // Then delete from Firebase
      await deleteUser(user);
      navigate("/login");
    } catch (err) {
      console.error("Error deleting account:", err);
      setError(err.message || "Failed to delete account");
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="xs">
      <IconButton onClick={() => navigate("/todolist")} sx={{ mt: 2 }}>
        <ArrowBackIcon />
      </IconButton>

      <Box textAlign="center" mt={3}>
        <Typography variant="h5" gutterBottom>
          Profile
        </Typography>

        <input type="file" id="profile-upload" style={{ display: "none" }} onChange={handleImageUpload} />
        <label htmlFor="profile-upload">
          <Avatar
            src={userData?.profile_picture || ""}
            sx={{ width: 120, height: 120, margin: "auto", cursor: "pointer" }}
          />
        </label>

        <Box mt={3}>
          {isEditing ? (
            <>
              <TextField
                fullWidth
                label="Name"
                name="name"
                value={editedData.name || ""}
                onChange={handleChange}
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="Birthdate"
                name="birthdate"
                type="date"
                value={editedData.birthdate || ""}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="Occupation"
                name="occupation"
                value={editedData.occupation || ""}
                onChange={handleChange}
                sx={{ mb: 2 }}
              />
              <Button variant="contained" color="success" fullWidth onClick={saveChanges} sx={{ mt: 2 }}>
                Save Changes
              </Button>
            </>
          ) : (
            <>
              <Typography variant="body1" sx={{ mb: 1 }}>
                <strong>Name:</strong> {userData?.name}
              </Typography>
              <Typography variant="body1" sx={{ mb: 1 }}>
                <strong>Email:</strong> {userData?.email}
              </Typography>
              <Typography variant="body1" sx={{ mb: 1 }}>
                <strong>Birthdate:</strong> {userData?.birthdate || 'Not set'}
              </Typography>
              <Typography variant="body1" sx={{ mb: 1 }}>
                <strong>Occupation:</strong> {userData?.occupation || 'Not set'}
              </Typography>
            </>
          )}
        </Box>

        {isEditing ? (
          <Button variant="outlined" fullWidth onClick={() => setIsEditing(false)} sx={{ mt: 2 }}>
            Cancel
          </Button>
        ) : (
          <Button variant="contained" fullWidth onClick={toggleEdit} sx={{ mt: 2 }}>
            Edit Profile
          </Button>
        )}

        <Button variant="contained" color="primary" fullWidth onClick={handleLogout} sx={{ mt: 2 }}>
          Logout
        </Button>
        <Button variant="contained" color="error" fullWidth onClick={() => setOpenConfirmDialog(true)} sx={{ mt: 2 }}>
          Delete Account
        </Button>

        <Dialog open={openConfirmDialog} onClose={() => setOpenConfirmDialog(false)}>
          <DialogTitle>Confirm Account Deletion</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to delete your account? This action cannot be undone.
            </DialogContentText>
            {user?.providerData[0]?.providerId === "password" && (
              <TextField
                fullWidth
                label="Enter Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                sx={{ mt: 2 }}
              />
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenConfirmDialog(false)}>Cancel</Button>
            <Button color="error" onClick={handleDeleteAccount}>
              Delete
            </Button>
          </DialogActions>
        </Dialog>

        {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
      </Box>
    </Container>
  );
}
