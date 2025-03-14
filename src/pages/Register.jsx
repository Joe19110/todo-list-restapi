import { useState, useEffect } from "react";
import { auth, db, googleProvider } from "../firebase";
import {
  createUserWithEmailAndPassword,
  signInWithPopup,
  updateProfile,
  linkWithCredential,
  EmailAuthProvider,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  IconButton,
} from "@mui/material";
import GoogleIcon from "../assets/google.webp";
import { useNavigate, useLocation } from "react-router-dom";

export default function Register() {
  const [form, setForm] = useState({
    email: "",
    password: "",
    name: "",
    birthdate: "",
    occupation: "",
  });
  const [error, setError] = useState("");
  const [isGoogleSignUp, setIsGoogleSignUp] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.state?.email) {
      setForm((prev) => ({
        ...prev,
        email: location.state.email,
        name: location.state.name || "",
      }));
      setIsGoogleSignUp(!!location.state.profilePicture);
    }
  }, [location.state]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async () => {
    if (!form.name || !form.email || (!isGoogleSignUp && !form.password)) {
      setError("Name, Email, and Password are required.");
      return;
    }

    if (!isGoogleSignUp && form.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    try {
      let user;
      if (isGoogleSignUp) {
        user = auth.currentUser;
        const credential = EmailAuthProvider.credential(form.email, form.password);
        await linkWithCredential(user, credential);
      } else {
        const userCredential = await createUserWithEmailAndPassword(auth, form.email, form.password);
        user = userCredential.user;
      }
      
      await updateProfile(user, { displayName: form.name });
      await setDoc(doc(db, "users", user.uid), {
        name: form.name,
        birthdate: form.birthdate,
        occupation: form.occupation,
        email: form.email,
        profilePicture: isGoogleSignUp ? user.photoURL || "" : "",
      });

      navigate("/todolist");
    } catch (err) {
      setError(err.message);
    }
  };

  const handleOAuthSignUp = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      navigate("/register", {
        state: {
          email: user.email,
          name: user.displayName || "",
          profilePicture: user.photoURL || "",
        },
      });
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <Container maxWidth="xs">
      <Box textAlign="center" mt={10}>
        <Typography variant="h4" gutterBottom>
          Register
        </Typography>

        <TextField
          label="Name"
          name="name"
          fullWidth
          onChange={handleChange}
          margin="dense"
          value={form.name}
          required
        />
        <TextField
          label="Birthdate"
          name="birthdate"
          fullWidth
          onChange={handleChange}
          margin="dense"
        />
        <TextField
          label="Occupation"
          name="occupation"
          fullWidth
          onChange={handleChange}
          margin="dense"
        />
        <TextField
          label="Email"
          name="email"
          fullWidth
          onChange={handleChange}
          margin="dense"
          value={form.email}
          disabled={isGoogleSignUp}
          required
        />
        {!isGoogleSignUp && (
          <TextField
            label="Password"
            name="password"
            type="password"
            fullWidth
            onChange={handleChange}
            margin="dense"
            required
            error={form.password.length > 0 && form.password.length < 6}
            helperText={form.password.length > 0 && form.password.length < 6 ? "Password must be at least 6 characters." : ""}
          />
        )}
        {isGoogleSignUp && (
          <TextField
            label="Set Password"
            name="password"
            type="password"
            fullWidth
            onChange={handleChange}
            margin="dense"
            required
            error={form.password.length > 0 && form.password.length < 6}
            helperText={form.password.length > 0 && form.password.length < 6 ? "Password must be at least 6 characters." : ""}
          />
        )}

        <Button
          variant="contained"
          fullWidth
          onClick={handleRegister}
          sx={{ mt: 2 }}
          disabled={!form.name || !form.email || (!isGoogleSignUp && form.password.length < 6)}
        >
          Register
        </Button>

        {!isGoogleSignUp && (
          <Box display="flex" justifyContent="center" mt={2} gap={2}>
            <IconButton onClick={handleOAuthSignUp}>
              <img src={GoogleIcon} alt="Google Sign Up" width={40} height={40} />
            </IconButton>
          </Box>
        )}

        <Box mt={2}>
          <Typography variant="body2">
            Already have an account?{" "}
            <span
              style={{ color: "blue", cursor: "pointer", textDecoration: "underline" }}
              onClick={() => navigate("/login")}
            >
              Login
            </span>
          </Typography>
        </Box>

        {error && <Typography color="error">{error}</Typography>}
      </Box>
    </Container>
  );
}
