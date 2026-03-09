const mongoose = require('mongoose');

const classroomSchema = new mongoose.Schema({
  classroom_id: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  mentor_id: {
    type: String, // Should start with MTR_
    required: true
  },
  student_ids: [
    {
      type: String
    }
  ],
  course_id: {
    type: String
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Classroom', classroomSchema);
