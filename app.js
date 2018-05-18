var express = require("express")
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");

const http = require('http');
const hostname = '127.0.0.1';
const port = 3000;

mongoose.connect("mongodb://localhost/khai_camp");

// Schema Setup
var campgroundSchema = new mongoose.Schema({
  name:String,
  image:String
});

// Assign model to a variable and generate a collection and pluralize it with the name "campgrounds" in the database
var Campground = mongoose.model("Campground", campgroundSchema);

// Campground.create(
//   {
//     name: "Granite Hill",
//     image: "https://images.pexels.com/photos/699558/pexels-photo-699558.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=350"
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

// Display all campgrounds
app.get("/campgrounds", function(req, res) {
  // name to use in ejs file : data to pass in
  Campground.find({}, function(err, allCampgrounds) {
    if (err) {
      console.log(err);
    }
    else {
      res.render("campgrounds", {campgrounds:allCampgrounds});
    }
  });
});

// page to create new campground
app.post("/campgrounds", function(req, res) {
  //get the form data and add to campground array
  //redirect back too all campground page
  var name = req.body.name;
  var image = req.body.image;
  var newCampground = {name: name, image:image};
  Campground.create(newCampground, function(err, newlyCreated) {
    if (err) {
      console.log(err);
    }
    else {
      res.redirect("/campgrounds");
    }
  })
});

//
app.get("/campgrounds/new", function(req, res) {
  res.render("new");
});

app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
