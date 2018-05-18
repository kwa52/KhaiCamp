var express = require("express")
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var Campground = require("./models/campground");
var Comment = require("./models/comment");
var seedDB = require("./seeds");

seedDB();

const http = require('http');
const hostname = '127.0.0.1';
const port = 3000;

mongoose.connect("mongodb://localhost/khai_camp");


// simplify with writing xxx instead of xxx.ejs
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended:true}));

app.get("/", function(req, res) {
  res.render("landing");
});

// ============================================
// REST: Representational State Transfer routes
// ============================================

// INDEX route - Display all campgrounds
app.get("/campgrounds", function(req, res) {
  // name to use in ejs file : data to pass in
  Campground.find({}, function(err, allCampgrounds) {
    if (err) {
      console.log(err);
    }
    else {
      res.render("campgrounds/index", {campgrounds: allCampgrounds});
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
  res.render("campgrounds/new");
});

// SHOW Route - shows more info about one campground
app.get("/campgrounds/:id", function(req, res) {
  // Get id from the request
  Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground) {
    if (err) {
      console.log(err);
    }
    else {
      console.log(foundCampground);
      res.render("campgrounds/show", {campground: foundCampground});
    }
  });
});

// ===============
// COMMENTS ROUTES
// ===============

app.get("/campgrounds/:id/comments/new", function(req,res) {
  Campground.findById(req.params.id, function(err, campground) {
    if (err) {
      console.log(err);
    }
    else {
      res.render("comments/new", {campground, campground});
    }
  });
});

app.post("/campgrounds/:id/comments", function(req, res) {
  Campground.findById(req.params.id, function(err, campground) {
    if (err) {
      console.log(err);
      res.redirect("/campgrounds");
    }
    else {
      Comment.create(req.body.comment, function(err, comment) {
        if (err) {
          console.log(err);
        }
        else {
          campground.comments.push(comment);
          campground.save();
          res.redirect("/campgrounds/" + campground._id);
        }
      });
    }
  });
});

app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
