const mongoose = require('mongoose');

const assignmentSchema = new mongoose.Schema({
  assignment_id: {
    type: String,
    required: true,
    unique: true
  },
  classroom_id: {
    type: String,
    required: true
  },
  mentor_id: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  due_date: {
    type: Date
  },
  enrolled_students: [
    {
      type: String
    }
  ],
  submissions: [
    {
      student_id: String,
      file_url: String,
      file_name: String,
      submitted_at: { type: Date, default: Date.now },
      status: { type: String, enum: ['Pending', 'Graded'], default: 'Pending' },
      score: Number,
      remarks: String
    }
  ]
}, {
  timestamps: true
});

module.exports = mongoose.model('Assignment', assignmentSchema);