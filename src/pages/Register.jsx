import { useState, useEffect } from "react";
import { auth } from "../firebase";
import { 
  createUserWithEmailAndPassword, 
  linkWithCredential,
  EmailAuthProvider 
} from "firebase/auth";
import {
  Container,
  TextField,
  Button,
  Box,
  AppBar,
  Toolbar,
  Typography,
  Avatar,
  Alert,
} from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";

export default function Register() {
  const [name, setName] = useState(""); 
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [birthdate, setBirthdate] = useState("");
  const [occupation, setOccupation] = useState("");
  const [profilePic, setProfilePic] = useState(""); 
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const isOAuthUser = location.state?.isOAuth;

  useEffect(() => {
    if (location.state?.email) {
      setEmail(location.state.email);
      setName(location.state.name || "");
      setProfilePic(location.state.profilePicture || "");
    }
  }, [location.state]);

  const handleRegister = async () => {
    if (!name || !email || !password) {
      setError("Name, Email, and Password are required.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    try {
      let firebase_uid;

      if (isOAuthUser) {
        // For OAuth users, link email/password to their account
        const credential = EmailAuthProvider.credential(email, password);
        await linkWithCredential(auth.currentUser, credential);
        firebase_uid = auth.currentUser.uid;
      } else {
        // For new users, create account with email/password
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        firebase_uid = userCredential.user.uid;
      }

      // Store additional user data in MySQL
      const userData = {
        name,
        email,
        firebase_uid,
        birthdate,
        occupation,
        profile_picture: profilePic,
      };

      const response = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();
      if (response.ok) {
        navigate("/todolist");
      } else {
        if (!isOAuthUser) {
          // If MySQL registration fails for new users, delete the Firebase user
          await auth.currentUser.delete();
        }
        setError(data.message || "Registration failed");
      }
    } catch (err) {
      console.error("Registration error:", err);
      if (err.code === 'auth/email-already-in-use') {
        setError("This email is already registered. Please use a different email or try logging in.");
      } else {
        setError(err.message || "An error occurred while registering.");
      }
    }
  };

  return (
    <>
      <AppBar position="static">
        <Toolbar sx={{ display: "flex", justifyContent: "space-between", px: 2 }}>
          <Typography variant="h6">Register</Typography>
          <Avatar alt="Profile" src={profilePic} />
        </Toolbar>
      </AppBar>

      <Container maxWidth="sm" sx={{ mt: 6, px: 2 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {isOAuthUser && (
            <Alert severity="info">
              Please set a password to enable email/password login for your account
            </Alert>
          )}

          <TextField
            label="Name"
            variant="outlined"
            fullWidth
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <TextField
            label="Email"
            variant="outlined"
            fullWidth
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isOAuthUser} // Disable email field for OAuth users
          />
          <TextField
            label="Password"
            variant="outlined"
            fullWidth
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <TextField
            label="Birthdate"
            variant="outlined"
            fullWidth
            value={birthdate}
            onChange={(e) => setBirthdate(e.target.value)}
            type="date"
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="Occupation"
            variant="outlined"
            fullWidth
            value={occupation}
            onChange={(e) => setOccupation(e.target.value)}
          />
          
          {error && (
            <Typography color="error" sx={{ mt: 1 }}>
              {error}
            </Typography>
          )}

          <Button
            variant="contained"
            fullWidth
            color="primary"
            onClick={handleRegister}
            sx={{ mt: 2 }}
          >
            {isOAuthUser ? "Complete Registration" : "Register"}
          </Button>

          {!isOAuthUser && (
            <Button
              variant="text"
              fullWidth
              onClick={() => navigate("/login")}
            >
              Already have an account? Login
            </Button>
          )}
        </Box>
      </Container>
    </>
  );
}
