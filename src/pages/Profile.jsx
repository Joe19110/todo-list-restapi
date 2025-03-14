import { useEffect, useState } from "react";
import { auth, db, googleProvider, githubProvider } from "../firebase";
import { doc, getDoc, updateDoc, deleteDoc } from "firebase/firestore";
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
  const navigate = useNavigate();
  const user = auth.currentUser;

  useEffect(() => {
    if (user) {
      const fetchUserData = async () => {
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          setUserData(userSnap.data());
          setEditedData(userSnap.data());
        }
      };
      fetchUserData();
    }
  }, [user]);

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
      await updateDoc(doc(db, "users", user.uid), editedData);
      setUserData(editedData);
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "ml_default");

    try {
      const res = await axios.post(`https://api.cloudinary.com/v1_1/dpcju4avd/image/upload`, formData);
      const imageUrl = res.data.secure_url;

      await updateDoc(doc(db, "users", user.uid), { profilePicture: imageUrl });

      setUserData((prev) => ({ ...prev, profilePicture: imageUrl }));
    } catch (error) {
      console.error("Error uploading image:", error);
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

      await deleteDoc(doc(db, "users", user.uid));
      await deleteUser(user);

      alert("Account deleted successfully.");
      navigate("/login");
    } catch (err) {
      setError(err.message);
    }
  };

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
            src={userData?.profilePicture || ""}
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
                value={editedData.birthdate || ""}
                onChange={handleChange}
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
                <strong>Birthdate:</strong> {userData?.birthdate}
              </Typography>
              <Typography variant="body1" sx={{ mb: 1 }}>
                <strong>Occupation:</strong> {userData?.occupation}
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
