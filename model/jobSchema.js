const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema({
  title: {
    type: String,
    require: [true, "please enter job title"],
  },
  description: {
    type: String,
    require: [true, "Please Enter description"],
  },
  experienceLevel: {
    type: String,
    enum: {
      values: ["beginner", "intermediate", "senior"],
      message:
        "Please select catogery only from beginner, intermediate, senior ",
    },
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    require: true,
  },
  skills: Array,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Job", jobSchema);
