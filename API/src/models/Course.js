const mongoose = require("mongoose");

const CourseSchema = new mongoose.Schema({
  regulation: {
    type: String,
    required: true
  },

  department: {
    type: String,
    required: true
  },

  semester: {
    type: Number,
    required: true
  },

  course_id: {
    type: String,
    required: true,
    unique: true
  },

  course_name: {
    type: String,
    required: true
  },

  L: {
    type: Number,
    default: 0
  },

  T: {
    type: Number,
    default: 0
  },

  P: {
    type: Number,
    default: 0
  },

  C: {
    type: Number,
    required: true
  }
});

module.exports = mongoose.model("Course", CourseSchema);