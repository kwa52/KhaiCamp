
var mongoose = require("mongoose");

// Schema Setup
var campgroundSchema = new mongoose.Schema({
  name:String,
  image:String,
  description:String,
  author: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    username: String
  },
  comments: [
      {
         type: mongoose.Schema.Types.ObjectId,
         ref: "Comment"
      }
   ]
});

// Assign model to a variable and generate a collection and pluralize it with the name "campgrounds" in the database
// var Campground = mongoose.model("Campground", campgroundSchema);

// this line is used when the model is in an independent file, returning the schema to whichever application requires (app.js)
module.exports = mongoose.model("Campground", campgroundSchema);
