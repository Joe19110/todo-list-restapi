import { useState } from "react";
import { auth, googleProvider } from "../firebase";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { Container, TextField, Typography, Box, IconButton, Button } from "@mui/material";
import GoogleIcon from "../assets/google.webp";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, form.email, form.password);
      const user = userCredential.user;
      
      // Check if user exists in MySQL
      const checkResponse = await fetch(`http://localhost:5000/api/users/${user.uid}`);
      
      if (checkResponse.ok) {
        navigate("/todolist");
      } else {
        // If user doesn't exist, redirect to registration
        navigate("/register", { 
          state: { 
            email: user.email,
            name: user.displayName,
            profilePicture: user.photoURL
          }
        });
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const handleOAuthLogin = async (provider) => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      
      // Check if user exists in MySQL
      const checkResponse = await fetch(`http://localhost:5000/api/users/${user.uid}`);
      
      if (checkResponse.ok) {
        // Existing user, proceed to todo list
        navigate("/todolist");
      } else {
        // New user, redirect to registration to complete profile
        navigate("/register", { 
          state: { 
            email: user.email,
            name: user.displayName,
            profilePicture: user.photoURL,
            isOAuth: true,
            firebase_uid: user.uid
          }
        });
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <Container maxWidth="xs">
      <Box textAlign="center" mt={10}>
        <Typography variant="h4" gutterBottom>
          Login
        </Typography>

        <TextField label="Email" name="email" fullWidth onChange={handleChange} margin="dense" />
        <TextField label="Password" name="password" type="password" fullWidth onChange={handleChange} margin="dense" />

        <Box mt={3}>
          <Button variant="contained" color="primary" fullWidth onClick={handleLogin}>
            Login
          </Button>
        </Box>

        <Box display="flex" justifyContent="center" mt={2} gap={2}>
          <IconButton onClick={() => handleOAuthLogin(googleProvider)}>
            <img src={GoogleIcon} alt="Google Login" width={40} height={40} />
          </IconButton>
        </Box>

        <Box mt={2}>
          <Typography variant="body2">
            Don't have an account?{" "}
            <span
              style={{
                color: "blue",
                cursor: "pointer",
                textDecoration: "underline",
              }}
              onClick={() => navigate("/register")}
            >
              Register
            </span>
          </Typography>
        </Box>

        {error && (
          <Typography color="error" sx={{ mt: 2 }}>
            {error}
          </Typography>
        )}
      </Box>
    </Container>
  );
}
