var express = require("express")
var app = express();

const http = require('http');
const hostname = '127.0.0.1';
const port = 3000;

// simplify with writing xxx instead of xxx.ejs
app.set("view engine", "ejs");

app.get("/", function(req, res) {
  res.render("landing");
});

app.get("/campgrounds", function(req, res) {
  var campgrouds = [
    {name: "Salmon Creek", image: ""}
    {name: "Granite Hill", image: ""}
    {name: "Mountain Goat", image: ""}
  ]
});

app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
