
const http = require('http');
const hostname = '127.0.0.1';
const port = 3000;

var express = require("express")
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var passport = require("passport");
var LocalStrategy = require("passport-local");

// Schemas
var Campground = require("./models/campground");
var Comment = require("./models/comment");
var User = require("./models/user");
var seedDB = require("./seeds");

// Require Routes
var commentRoutes = require("./routes/comments"),
    campgroundRoutes = require("./routes/campgrounds"),
    indexRoutes = require("./routes/index");

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

// pass req.user to every single template
// whatever put inside res.locals is available to every template
app.use(function(req, res, next) {
  res.locals.currentUser = req.user;
  next();
});

mongoose.connect("mongodb://localhost/khai_camp");


// simplify with writing xxx instead of xxx.ejs
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended:true}));
// __dirnmae refers to the script that is running
app.use(express.static(__dirname + "/public"));

// ============================================
// REST: Representational State Transfer routes
// ============================================

app.use(indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);


app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
