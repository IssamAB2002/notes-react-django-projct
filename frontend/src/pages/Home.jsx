import { useState, useEffect } from "react";
import Note from "../components/Note";
import api from "../api";
import LoadingIndicator from "../components/LoadingIndicator";
import "../styles/Home.css";
function Home() {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [notesLoading, setNotesLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  useEffect(() => {
    getNotes();
  }, []);
  const getNotes = () => {
    if (notes == []) {
      setNotesLoading(true);
    }
    api
      .get("/api/notes/")
      .then((response) => {
        return response.data;
      })
      .then((data) => {
        setNotes(data);
        console.log(data);
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setNotesLoading(false);
      });
  };
  const deleteNote = (id) => {
    setDeleteLoading(true);
    api
      .delete(`/api/notes/delete/${id}/`)
      .then((response) => {
        if (response.status === 200) {
          alert("note deleted !");
          getNotes();
        } else {
          alert("error deleting note");
        }
      })
      .catch((error) => console.log(error))
      .finally(() => {
        setDeleteLoading(false);
        getNotes();
      });
  };
  const createNote = (e) => {
    e.preventDefault();
    setLoading(true);
    api
      .post("/api/notes/", { title, content })
      .then((response) => {
        if (response.status === 201) {
          alert("note created");
          getNotes();
        } else {
          alert("error creating note");
        }
      })
      .catch((error) => {
        alert(error);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  return (
    <div>
      <div>
        <h2>Notes</h2>
        {notesLoading ? (
          <LoadingIndicator />
        ) : (
          notes.map((note) => (
            <Note
              note={note}
              onDelete={() => {
                deleteNote(note.id);
              }}
            />
          ))
        )}
      </div>
      <h2>Create a Note</h2>
      <form onSubmit={createNote}>
        <label htmlFor="title">Title:</label>
        <br />
        <input
          type="text"
          id="title"
          name="title"
          required
          onChange={(e) => setTitle(e.target.value)}
          value={title}
        />
        <label htmlFor="content">Content:</label>
        <br />
        <textarea
          id="content"
          name="content"
          required
          value={content}
          onChange={(e) => setContent(e.target.value)}></textarea>
        <br />
        <input type="submit" value="Submit"></input>
      </form>
    </div>
  );
}
export default Home;
