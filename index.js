 //this is my index.js -->
import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 3000;

const db = new pg.Client({
user: "postgres",
host: "localhost",
database: "Notes",
password: "Pichipiu2020",
port: 5432,
});

db. connect();

app.use(express.static("public"));

app.use(bodyParser.urlencoded({ extended: true }));

let previousNote;

app.get("/", async (req, res) => {
    const allNotes = await db.query("SELECT note FROM notes ORDER BY created_at DESC");
    const notes = allNotes.rows.map(row => row.note);
    res.render("index.ejs", { notes: notes });
});

app.get("/newNotePage", (req, res) => {
    res.render("new-note.ejs");
});

app.get("/backToHome", (req,res) => {
    res.redirect("/");
})

app.post("/editNotePage", (req, res) => {
    const oldNote = req.body.note;
    previousNote = oldNote;
    console.log(oldNote);
    res.render("edit-note.ejs", { oldNote: oldNote });
});

app.post("/CreateNote", async (req, res) => {
    const typedNote = req.body.note;
    const insertNote = await db.query("INSERT INTO notes (note, created_at, updated_at) VALUES ($1, NOW(), NOW())", [typedNote]);
    const allNotes = await db.query("SELECT note FROM notes ORDER BY created_at DESC");
    const notes = allNotes.rows.map(row => row.note);
    res.render("index.ejs", { notes: notes });
});



app.post("/deleteNote", async (req, res) => {
    const typedNote = req.body.note;
    
    try {
        const selectedNote = await db.query("SELECT id FROM notes WHERE note = $1", [typedNote]);
        if (selectedNote.rows.length > 0) {
            const selectedID = selectedNote.rows[0].id;
            console.log("id to delete: " + selectedID);

            await db.query("DELETE FROM notes WHERE id = $1", [selectedID]);
            res.redirect("/");
        } else {
            console.log("Note not found");
            res.status(404).send("Note not found");
        }

    } catch (err) {
        console.error(err);
        res.status(500).send("Server error");
    }
});

app.post("/editNote", async (req, res) => {
    const editedNote = req.body.note;
    console.log("Note to edit: " + editedNote);
    console.log("old note: " + previousNote);
    try {
        await db.query("UPDATE notes SET note = $1, updated_at = NOW() WHERE note = $2", [editedNote, previousNote]);
        res.redirect("/");
    } catch (error) {
        res.status(500).send("Server error");
    }
});


app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});