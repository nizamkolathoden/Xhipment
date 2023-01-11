const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema({
  coverLetter: {
    type: String,
  },
  postedBy: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
  },
  appliedBy: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
  },
  job: {
    type: mongoose.Schema.ObjectId,
    ref: "Job",
  },
});

module.exports = mongoose.model("Application", applicationSchema);
