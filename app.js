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
  var campgrounds = [
    {name: "Salmon Creek", image: "https://images.pexels.com/photos/699558/pexels-photo-699558.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=350"},
    {name: "Granite Hill", image: "https://images.pexels.com/photos/803226/pexels-photo-803226.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=350"},
    {name: "Mountain Goat", image: "https://images.pexels.com/photos/1061640/pexels-photo-1061640.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=350"}
  ]

  // name : data to pass in
  res.render("campgrounds", {campgrounds, campgrounds});
});

app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
