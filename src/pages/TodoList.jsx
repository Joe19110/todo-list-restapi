import { getAuth, onAuthStateChanged } from "firebase/auth";
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

export default function TodoList() {
  const [userId, setUserId] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [task, setTask] = useState("");
  const [editingIndex, setEditingIndex] = useState(null);
  const [profilePic, setProfilePic] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
        // Create or update user in MySQL when they log in
        fetch("http://localhost:5000/api/users", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            firebase_uid: user.uid,
            profile_picture: user.photoURL || ""
          }),
        });
      } else {
        navigate("/login");
      }
    });
  
    return () => unsubscribe();
  }, [navigate]);

  useEffect(() => {
    if (!userId) return;

    // Fetch user data (including profile picture)
    fetch(`http://localhost:5000/api/users/${userId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.profile_picture) {
          setProfilePic(data.profile_picture);
        }
      })
      .catch(console.error);

    // Fetch tasks
    fetch(`http://localhost:5000/api/tasks?userId=${userId}`)
      .then((res) => res.json())
      .then(setTasks)
      .catch(console.error);
  }, [userId]);

  const handleAddTask = async () => {
    if (task.trim() === "") return;

    try {
      const res = await fetch("http://localhost:5000/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: task, userId }),
      });

      const newTask = await res.json();
      setTasks([newTask, ...tasks]);
      setTask("");
    } catch (error) {
      console.error("Failed to add task:", error);
    }
  };

  const handleDeleteTask = async (id) => {
    try {
      await fetch(`http://localhost:5000/api/tasks/${id}`, { 
        method: "DELETE" 
      });
      setTasks(tasks.filter((t) => t.id !== id));
    } catch (error) {
      console.error("Failed to delete task:", error);
    }
  };

  const handleEditTask = (id) => {
    setEditingIndex(id);
  };

  const handleUpdateTask = async (id, newText) => {
    try {
      const res = await fetch(`http://localhost:5000/api/tasks/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: newText }),
      });

      const updatedTask = await res.json();
      setTasks(
        tasks.map((t) => (t.id === id ? updatedTask : t))
      );
      setEditingIndex(null);
    } catch (error) {
      console.error("Failed to update task:", error);
    }
  };

  const handleToggleComplete = async (id, completed) => {
    try {
      const res = await fetch(`http://localhost:5000/api/tasks/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed: !completed }),
      });

      const updatedTask = await res.json();
      setTasks(
        tasks.map((t) => (t.id === id ? updatedTask : t))
      );
    } catch (error) {
      console.error("Failed to toggle task completion:", error);
    }
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
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                handleAddTask();
              }
            }}
          />
          <Button variant="contained" color="primary" onClick={handleAddTask}>
            Add
          </Button>
        </Box>

        <List sx={{ mt: 3 }}>
          {tasks.map((t) => (
            <Card key={t.id} sx={{ mb: 2, p: 1 }}>
              <CardContent sx={{ display: "flex", alignItems: "center", flexWrap: "wrap" }}>
                <Checkbox 
                  checked={t.completed} 
                  onChange={() => handleToggleComplete(t.id, t.completed)}
                />
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
                      sx={{ 
                        textDecoration: t.completed ? "line-through" : "none",
                        wordBreak: "break-word"
                      }}
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
