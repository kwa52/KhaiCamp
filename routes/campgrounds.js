var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");


// INDEX route - Display all campgrounds
router.get("/", function(req, res) {
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
router.post("/", isLoggedIn, function(req, res) {
  //get the form data and add to campground array
  //redirect back too all campground page
  var name = req.body.name;
  var image = req.body.image;
  var desc = req.body.description;
  var author = {
    id: req.user._id,
    username: req.user.username
  };
  var newCampground = {name: name, image:image, description: desc, author: author};
  Campground.create(newCampground, function(err, newlyCreated) {
    if (err) {
      console.log(err);
    }
    else {
      res.redirect("/campgrounds");
    }
  })
});

// NEW Route - New Campground
router.get("/new", isLoggedIn, function(req, res) {
  res.render("campgrounds/new");
});

// SHOW Route - shows more info about one campground
router.get("/:id", function(req, res) {
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

// middleware
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
};

module.exports = router;
