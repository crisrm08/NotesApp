 //this is my index.js -->
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


app.post("/deleteNote", (req, res) => {
    const index = parseInt(req.query.index); 
    if (index >= 0 && index < notes.length) {
        notes.splice(index, 1); 
        res.redirect("/");
    } else {
        res.send("Invalid note index!");
    }
});



app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});