// require express
const express = require("express");
//require path
const path = require("path");
//require fs
const fs = require("fs");
// setup your server
const app = express();
//set up port for listener
const PORT = process.env.PORT || 8080;

let notesData = [];
//set up parsing, public static folder, and route middleware  
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

//ROUTES
    //get all the notes
    app.get("/api/notes", function(err,res) {
        try {
            notesData = fs.readFileSync("./db/db.json", "utf8");
            notesData = JSON.parse(notesData);
        }
        catch (err) {
            console.log(err);
        }
        //send note objects to browser
        res.json(notesData);
    });
    //create new notes an save it 
    app.post("/api/notes", function(req,res) {
        try {
            //read the json file
            notesData = fs.readFileSync("./db/db.json", "utf8");
            console.log(notesData);
            //parse the data
            notesData = JSON.parse(notesData);
            //create id for each note 
            req.body.id = notesData.length;
            //add new note to the array of note objects
            notesData.push(req.body);
            //stringify note 
            notesData = JSON.stringify(notesData);
            //write new note to the file 
            fs.writeFile("./db/db.json", notesData, "utf8", function(err) {
                if (err) throw err;
            });
            //change back to an array of object to send it to the browser 
            res.json(JSON.parse(notesData));
        }
        catch (err){
            console.log(err);
        }
    });
    //delete note 
    app.delete("/api/notes/:id", function(req,res) {
        try {
            //read the file 
            notesData = fs.readFileSync("./db/db.json", "utf8");
            //parse the data 
            notesData = JSON.parse(notesData);
            //delete note from the array
            notesData = notesData.filter(function(note) {
                return note.id != req.params.id;
            });
            notesData = JSON.stringify(notesData);
            fs.writeFile("./db/db.json", notesData, "utf8", function (err) {
                if (err) throw err; 
            });
            res.send(JSON.parse(notesData));
        }
        catch (err) {
            console.log(err);
        }
    });
    //HTML 
        //route for notes.html
    app.get("/notes", function(req,res) {
        res.sendFile(path.join(__dirname, "public/notes.html"));
    });
        //home route
    app.get("/", function (req,res) {
        res.sendFile(path.join(__dirname, "public/index.html"));
    });
        //route for notes api 
    app.get("/api/notes", function (req,res) {
        return res.sendFile(path.json(__dirname, "db/db.json"));
    });
    
    //start the server to begin listening 
    app.listen(PORT, function() {
        console.log("App listening on PORT " + PORT);
    });
    
    // DEPLOYMENT
        // follow heroku guide instructions