
var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");

// Root Route - Landing Page
router.get("/", function(req, res) {
  res.render("landing");
});

// ===========
// AUTH ROUTES
// ===========

// Show sign up form
router.get("/register", function(req, res) {
  res.render("register");
});

// Handle sign up logic
router.post("/register", function(req, res) {
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
router.get("/login", function(req, res) {
  res.render("login");
});

// Log in logic
router.post("/login", passport.authenticate("local",
  // run middleware prior to logging in
  {
    successRedirect: "/campgrounds",
    failureRedirect: "/login"
  }), function(req, res) {
});

// Log out route
router.get("/logout", function(req, res) {
  req.logout();
  res.redirect("/campgrounds");
});

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
};

module.exports = router;
