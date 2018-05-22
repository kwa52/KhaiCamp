var express = require("express")
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var passport = require("passport");
var LocalStrategy = require("passport-local");

var Campground = require("./models/campground");
var Comment = require("./models/comment");
var User = require("./models/user");
var seedDB = require("./seeds");

seedDB();

// PASSPORT CONFIGURATION
app.use(require("express-session")({
  secret: "Passport configuration secret message setup",
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
// User.authenticate() comes with passport local mongoose plugin
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

const http = require('http');
const hostname = '127.0.0.1';
const port = 3000;

mongoose.connect("mongodb://localhost/khai_camp");


// simplify with writing xxx instead of xxx.ejs
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended:true}));
// __dirnmae refers to the script that is running
app.use(express.static(__dirname + "/public"));

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

// ===========
// AUTH ROUTES
// ===========

// Show sign up form
app.get("/register", function(req, res) {
  res.render("register");
});

// Handle sign up logic
app.post("/register", function(req, res) {
  // initialize a new user only with the username
  var newUser = new User({username: req.body.username});
  // adding a hashed password to newUser
  User.register(newUser, req.body.password, function(err, user) {
    if (err) {
      console.log(err);
      return res.render("register");
    }
    passport.authenticate("local")(req, res, function() {
      res.redirect("/campgrounds");
    });
  });
});

// Show log in form
app.get("/login", function(req, res) {
  res.render("login");
});

// Log in logic
app.post("/login", passport.authenticate("local",
  // run middleware prior to logging in
  {
    successRedirect: "/campgrounds",
    failureRedirect: "/login"
  }), function(req, res) {
});

app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
