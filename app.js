var express = require("express")
var app = express();
var bodyParser = require("body-parser");

const http = require('http');
const hostname = '127.0.0.1';
const port = 3000;

var campgrounds = [
  {name: "Salmon Creek", image: "https://images.pexels.com/photos/699558/pexels-photo-699558.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=350"},
  {name: "Granite Hill", image: "https://images.pexels.com/photos/803226/pexels-photo-803226.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=350"},
  {name: "Mountain Goat", image: "https://images.pexels.com/photos/1061640/pexels-photo-1061640.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=350"}
]

// simplify with writing xxx instead of xxx.ejs
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended:true}));

app.get("/", function(req, res) {
  res.render("landing");
});

app.get("/campgrounds", function(req, res) {
  // name to use in ejs file : data to pass in
  res.render("campgrounds", {campgrounds, campgrounds});
});

// page to create new campground
app.post("/campgrounds", function(req, res) {
  //get the form data and add to campground array
  //redirect back too all campground page
  var name = req.body.name;
  var image = req.body.image;
  var newCampground = {name: name, image:image};
  campgrounds.push(newCampground);
  res.redirect("/campgrounds");
});

//
app.get("/campgrounds/new", function(req, res) {
  res.render("new");
});

app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
