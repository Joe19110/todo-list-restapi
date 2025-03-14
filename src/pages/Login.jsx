import { useState } from "react";
import { auth, googleProvider } from "../firebase";
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  fetchSignInMethodsForEmail,
  linkWithCredential,
  EmailAuthProvider,
} from "firebase/auth";
import { Container, TextField, Typography, Box, IconButton, Button } from "@mui/material";
import GoogleIcon from "../assets/google.webp";
import { useNavigate } from "react-router-dom";
import { doc, getDoc, setDoc } from "firebase/firestore"; // Firestore imports
import { db } from "../firebase"; // Import Firestore instance

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, form.email, form.password);
      navigate("/todolist");
    } catch (err) {
      if (err.code === "auth/invalid-credential") {
        const signInMethods = await fetchSignInMethodsForEmail(auth, form.email);

        if (signInMethods.includes("google.com")) {
          setError("This account is linked to Google. Try logging in with Google.");
        } else {
          setError("Incorrect email or password.");
        }
      } else {
        setError(err.message);
      }
    }
  };

  const handleOAuthLogin = async (provider) => {
    try {
        const result = await signInWithPopup(auth, provider);
        const user = result.user;
        const userRef = doc(db, "users", user.uid); // Use UID, not email
        const userSnap = await getDoc(userRef);
        const email = user.email;
        const signInMethods = await fetchSignInMethodsForEmail(auth, email);
        if (!userSnap.exists() || !userSnap.data().name) {
        
        navigate("/register", { state: { email, name: user.displayName || "", profilePicture: user.photoURL || "" } });
      } else {
       
        if (!signInMethods.includes("password")) {
          try {
            const tempPassword = form.password || "TempPassword123!";
            const credential = EmailAuthProvider.credential(email, tempPassword);
            await linkWithCredential(user, credential);
          } catch (err) {
            if (err.code !== "auth/provider-already-linked") {
              throw err;
            }
          }
        }
        
        navigate("/todolist");
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
              style={{ color: "blue", cursor: "pointer", textDecoration: "underline" }}
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
