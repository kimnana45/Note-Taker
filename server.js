// require express
const express = require("express");
//require path
const path = require("path");
//require fs
const fs = require("fs");
// setup your server
const app = express();
//set up port for listener
const PORT = 8080;

let notesData = [];
//set up parsing, public static folder, and route middleware  
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

