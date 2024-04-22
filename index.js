import express from "express";
import bodyParser from "body-parser";

const app = express();
const port = 3000;

app.use(express.static("public"));

app.use(bodyParser.urlencoded({ extended: true }));

var notes = [];

app.get("/", (req, res) => {
    res.render("index.ejs", {notes: notes});
});

app.get("/newNotePage", (req, res) => {
    res.render("new-note.ejs");
});

app.post("/CreateNote", (req, res) => {
    notes.push(req.body.note);
    res.render("index.ejs", { notes: notes });
});


app.get("/editNotePage", (req, res) => {
    const index = req.query.index;
    if (index !== undefined && notes[index]) { 
        res.render("edit-note.ejs", { note: notes[index], index: index });
    } else {
        res.send("Invalid note index!"); 
    }
})

app.post("/EditNote", (req, res) => {
    const index = parseInt(req.body.index); 
    if (index >= 0 && index < notes.length) {
        notes[index] = req.body.note; 
        res.redirect("/");
    } else {
        res.send("Invalid note index!"); 
    }
})


app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});