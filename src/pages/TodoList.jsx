import { useState, useEffect } from "react";
import {
  Container,
  TextField,
  Button,
  List,
  ListItemText,
  IconButton,
  Checkbox,
  Card,
  CardContent,
  InputBase,
  Box,
  AppBar,
  Toolbar,
  Typography,
  Avatar,
} from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { db, auth } from "../firebase";
import { collection, addDoc, updateDoc, deleteDoc, doc, onSnapshot, query, where, getDoc } from "firebase/firestore";

export default function TodoList() {
  const [user, setUser] = useState(null); // Track user state
  const [tasks, setTasks] = useState([]);
  const [task, setTask] = useState("");
  const [editingIndex, setEditingIndex] = useState(null);
  const [profilePic, setProfilePic] = useState(""); // Default profile picture
  const navigate = useNavigate();

  // Watch for auth state changes
  useEffect(() => {
    const unsubscribeAuth = auth.onAuthStateChanged((authUser) => {
      setUser(authUser);
    });

    return () => unsubscribeAuth();
  }, []);

  // Fetch user profile picture when user is available
  useEffect(() => {
    if (!user) return;

    const userDocRef = doc(db, "users", user.uid);

    const fetchProfilePic = async () => {
      const docSnap = await getDoc(userDocRef);
      if (docSnap.exists()) {
        const profileUrl = docSnap.data().profilePicture || "";
        setProfilePic(`${profileUrl}?t=${new Date().getTime()}`); // Force refresh
      }
    };

    fetchProfilePic();

    // Real-time listener for profile pic updates
    const unsubscribeProfile = onSnapshot(userDocRef, (docSnap) => {
      if (docSnap.exists()) {
        const profileUrl = docSnap.data().profilePicture || "";
        setProfilePic(`${profileUrl}?t=${new Date().getTime()}`);
      }
    });

    return () => unsubscribeProfile();
  }, [user]);

  // Fetch tasks when user is available
  useEffect(() => {
    if (!user) return;

    const q = query(collection(db, "tasks"), where("userId", "==", user.uid));
    const unsubscribeTasks = onSnapshot(q, (snapshot) => {
      setTasks(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });

    return () => unsubscribeTasks();
  }, [user]);

  const handleAddTask = async () => {
    if (task.trim() === "" || !user) return;

    await addDoc(collection(db, "tasks"), {
      text: task,
      completed: false,
      userId: user.uid,
    });

    setTask("");
  };

  const handleDeleteTask = async (id) => {
    await deleteDoc(doc(db, "tasks", id));
  };

  const handleEditTask = (id) => {
    setEditingIndex(id);
  };

  const handleUpdateTask = async (id, newText) => {
    await updateDoc(doc(db, "tasks", id), { text: newText });
    setEditingIndex(null);
  };

  const handleToggleComplete = async (id, completed) => {
    await updateDoc(doc(db, "tasks", id), { completed: !completed });
  };

  return (
    <>
      <AppBar position="static">
        <Toolbar sx={{ display: "flex", justifyContent: "space-between", px: 2 }}>
          <Typography variant="h6">Todo List</Typography>
          <IconButton onClick={() => navigate("/profile")}>
            <Avatar alt="Profile" src={profilePic} />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Container maxWidth="sm" sx={{ mt: 6, px: 2 }}>
        <Box display="flex" alignItems="center" gap={2}>
          <TextField
            label="New Task"
            variant="outlined"
            fullWidth
            value={task}
            onChange={(e) => setTask(e.target.value)}
          />
          <Button variant="contained" color="primary" onClick={handleAddTask}>
            Add
          </Button>
        </Box>

        <List sx={{ mt: 3 }}>
          {tasks.map((t) => (
            <Card key={t.id} sx={{ mb: 2, p: 1 }}>
              <CardContent sx={{ display: "flex", alignItems: "center", flexWrap: "wrap" }}>
                <Checkbox checked={t.completed} onChange={() => handleToggleComplete(t.id, t.completed)} />
                <Box flex={1} minWidth={0} sx={{ display: "flex", alignItems: "center" }}>
                  {editingIndex === t.id ? (
                    <InputBase
                      defaultValue={t.text}
                      autoFocus
                      fullWidth
                      onBlur={(e) => handleUpdateTask(t.id, e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleUpdateTask(t.id, e.target.value);
                        if (e.key === "Escape") setEditingIndex(null);
                      }}
                      sx={{ flex: 1 }}
                    />
                  ) : (
                    <ListItemText
                      primary={t.text}
                      sx={{ textDecoration: t.completed ? "line-through" : "none", wordBreak: "break-word" }}
                    />
                  )}
                </Box>

                <Box sx={{ display: "flex" }}>
                  {editingIndex !== t.id && (
                    <IconButton onClick={() => handleEditTask(t.id)} color="primary">
                      <Edit />
                    </IconButton>
                  )}
                  <IconButton onClick={() => handleDeleteTask(t.id)} color="error">
                    <Delete />
                  </IconButton>
                </Box>
              </CardContent>
            </Card>
          ))}
        </List>
      </Container>
    </>
  );
}
