var express = require("express")
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var Campground = require("./models/campground");

const http = require('http');
const hostname = '127.0.0.1';
const port = 3000;

mongoose.connect("mongodb://localhost/khai_camp");

// Campground.create(
//   {
//     name: "Granite Hill",
//     image: "https://images.pexels.com/photos/699558/pexels-photo-699558.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=350",
//     description: "This is the new Granite Hill."
//   },
//   function(err, campground) {
//     if (err) {
//       console.log(err);
//     }
//     else {
//       console.log("NEWLY CREATED CAMPGROUND");
//       console.log(campground);
//     }
//   }
// )

// var campgrounds = [
//   {name: "Salmon Creek", image: "https://images.pexels.com/photos/1061640/pexels-photo-1061640.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=350"},
//   {name: "Granite Hill", image: "https://images.pexels.com/photos/803226/pexels-photo-803226.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=350"},
//   {name: "Mountain Goat", image: "https://images.pexels.com/photos/266436/pexels-photo-266436.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=350"},
//   {name: "Salmon Creek", image: "https://images.pexels.com/photos/1061640/pexels-photo-1061640.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=350"},
//   {name: "Granite Hill", image: "https://images.pexels.com/photos/803226/pexels-photo-803226.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=350"},
//   {name: "Mountain Goat", image: "https://images.pexels.com/photos/266436/pexels-photo-266436.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=350"}
// ]

// simplify with writing xxx instead of xxx.ejs
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended:true}));

app.get("/", function(req, res) {
  res.render("landing");
});

// REST: Representational State Transfer routes

// INDEX route - Display all campgrounds
app.get("/campgrounds", function(req, res) {
  // name to use in ejs file : data to pass in
  Campground.find({}, function(err, allCampgrounds) {
    if (err) {
      console.log(err);
    }
    else {
      res.render("index", {campgrounds: allCampgrounds});
    }
  });
});

// CREATE Route - page to create new campground
app.post("/campgrounds", function(req, res) {
  //get the form data and add to campground array
  //redirect back too all campground page
  var name = req.body.name;
  var image = req.body.image;
  var desc = req.body.description;
  var newCampground = {name: name, image:image, description: desc};
  Campground.create(newCampground, function(err, newlyCreated) {
    if (err) {
      console.log(err);
    }
    else {
      res.redirect("/campgrounds");
    }
  })
});

// NEW Route
app.get("/campgrounds/new", function(req, res) {
  res.render("new");
});

// SHOW Route - shows more info about one campground
app.get("/campgrounds/:id", function(req, res) {
  // Get id from the request
  Campground.findById(req.params.id, function(err, foundCampground) {
    if (err) {
      console.log(err);
    }
    else {
      res.render("show", {campground: foundCampground});
    }
  });
});

app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
