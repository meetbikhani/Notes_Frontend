import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Card,
  CardContent,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Box,
  Tooltip,
  Fade,
  Stack,
} from "@mui/material";
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Logout as LogoutIcon,
} from "@mui/icons-material";
import api from "../api/axios";

const Notes = () => {
  const [notes, setNotes] = useState([]);
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [editingNote, setEditingNote] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      const response = await api.get("/notes");
      setNotes(response.data);
    } catch (err) {
      if (err.response?.status === 401) {
        navigate("/login");
      }
    }
  };

  const handleCreateNote = async () => {
    try {
      await api.post("/notes", { title, content });
      setOpen(false);
      setTitle("");
      setContent("");
      fetchNotes();
    } catch (err) {
      if (err.response?.status === 401) {
        navigate("/login");
      }
      else console.error("Error creating note:", err);
    }
  };

  const handleEditNote = async () => {
    try {
      await api.patch(`/notes/${editingNote._id}`, { title, content });
      setOpen(false);
      setTitle("");
      setContent("");
      setEditingNote(null);
      fetchNotes();
    } catch (err) {
      if (err.response?.status === 401) {
        navigate("/login");
      }
      else console.error("Error editing note:", err);
    }
  };

  const handleDeleteNote = async (id) => {
    try {
      await api.delete(`/notes/${id}`);
      fetchNotes();
    } catch (err) {
      if (err.response?.status === 401) {
        navigate("/login");
      }
      else console.error("Error deleting note:", err);
    }
  };

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout");
      navigate("/login");
    } catch (err) {
      if (err.response?.status === 401) {
        navigate("/login");
      }
      else console.error("Error logging out:", err);
    }
  };

  const handleDialogClose = () => {
    setOpen(false);
    setEditingNote(null);
    setTitle("");
    setContent("");
  };

  return (
    <Container maxWidth="md" sx={{ mt: 0, mb: 0 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 4,
        }}
      >
        <Typography
          variant="h4"
          sx={{
            background: "linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            fontWeight: "bold",
          }}
        >
          My Notes
        </Typography>
        <Box>
          <Tooltip title="Logout">
            <IconButton
              onClick={handleLogout}
              sx={{ mr: 2, color: "error.main" }}
            >
              <LogoutIcon />
            </IconButton>
          </Tooltip>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => {
              setEditingNote(null);
              setTitle("");
              setContent("");
              setOpen(true);
            }}
            sx={{
              background: "linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)",
              boxShadow: "0 3px 5px 2px rgba(33, 203, 243, .3)",
            }}
          >
            New Note
          </Button>
        </Box>
      </Box>

      <Box sx={{ width: "100%" }}>
        <Stack spacing={2}>
          {notes.map((note) => (
            <Fade in={true} key={note._id}>
              <Card
                sx={{
                  width: "100%",
                  position: "relative",
                  px: 2,
                  py: 1.5,
                }}
              >
                <CardContent sx={{ pb: 1 }}>
                  <Typography variant="h6" gutterBottom>
                    {note.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 2 }}
                  >
                    {new Date(note.createdAt).toLocaleDateString()}
                  </Typography>
                  <Box
                    sx={{
                      position: "absolute",
                      top: 8,
                      right: 8,
                      display: "flex",
                      gap: 1,
                    }}
                  >
                    <Tooltip title="Edit">
                      <IconButton
                        size="small"
                        color="primary"
                        onClick={() => {
                          setEditingNote(note);
                          setTitle(note.title);
                          setContent(note.content);
                          setOpen(true);
                        }}
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleDeleteNote(note._id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </CardContent>
              </Card>
            </Fade>
          ))}
        </Stack>
      </Box>

      <Dialog
        open={open}
        onClose={handleDialogClose}
        maxWidth="lg"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            width: "900px",
            maxWidth: "95vw",
            bgcolor: "#f8fafc",
            boxShadow: "0 8px 32px rgba(33, 150, 243, 0.15)",
            p: 3,
          },
        }}
      >
        <DialogTitle
          sx={{
            pb: 2,
            fontSize: "2rem",
            fontWeight: 700,
            color: "primary.main",
            letterSpacing: 1,
          }}
        >
          {editingNote ? "Edit Note" : "Create New Note"}
        </DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            margin="normal"
            autoFocus
            InputProps={{ sx: { fontSize: "1.25rem", fontWeight: 500 } }}
            InputLabelProps={{ sx: { fontSize: "1.1rem" } }}
          />
          <Box sx={{ my: 2, borderBottom: "1px solid #e0e0e0" }} />
          <TextField
            fullWidth
            label="Content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            margin="normal"
            multiline
            rows={8}
            InputProps={{ sx: { fontSize: "1.1rem" } }}
            InputLabelProps={{ sx: { fontSize: "1.05rem" } }}
          />
        </DialogContent>
        <DialogActions sx={{ px: 4, pb: 3 }}>
          <Button
            onClick={handleDialogClose}
            sx={{
              color: "text.secondary",
              fontSize: "1.1rem",
              px: 3,
              py: 1,
              borderRadius: 2,
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={editingNote ? handleEditNote : handleCreateNote}
            variant="contained"
            sx={{
              background: "linear-gradient(90deg, #2196F3 0%, #21CBF3 100%)",
              boxShadow: "0 3px 10px 2px rgba(33, 203, 243, .15)",
              fontSize: "1.1rem",
              px: 4,
              py: 1.2,
              borderRadius: 2,
            }}
          >
            {editingNote ? "Update" : "Save"}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Notes;
