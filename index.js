import express from "express";
import bodyParser from "body-parser";

const app = express();
const port = 3000;

app.use(express.static("public"));

app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.render("index.ejs");
});

app.get("/newNotePage", (req, res) => {
    console.log("page working");
    res.render("new-note.ejs");
});

var notes = [];

app.post("/CreateNote", (req,res) => {
    notes.push(req.body.push);
    var noteContent = req.body.note;
    res.render("index.ejs", {noteContent: noteContent});
})



app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});