const express = require('express');
const router = express.Router();
const Classroom = require('../models/Classroom');
const Assignment = require('../models/Assignment');
const Message = require('../models/Message');
const Notification = require('../models/Notification');

// Middleware to check if user is a mentor
const isMentor = (req, res, next) => {
  const { user_id } = req.body;
  if (user_id && user_id.startsWith('MTR')) {
    next();
  } else {
    res.status(403).json({ message: 'Only mentors can perform this action' });
  }
};
// Get ALL classrooms (or filter by user/dept/sem)
router.get('/', async (req, res) => {
  const { department, semester } = req.query;
  try {
    const filter = {};
    if (department) filter.name = new RegExp(department, 'i'); // Simple check against name for now
    // Actually, we should filter by course_id/semester if we have a proper mapping
    const classrooms = await Classroom.find(filter);
    res.json({ success: true, classrooms });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get a single classroom by ID
router.get('/:classroom_id', async (req, res) => {
  try {
    const classroom = await Classroom.findOne({ classroom_id: req.params.classroom_id });
    if (!classroom) return res.status(404).json({ message: 'Classroom not found' });
    res.json(classroom);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
// Create a classroom (Mentor only)
router.post('/create', isMentor, async (req, res) => {
  const { classroom_id, name, mentor_id, student_ids } = req.body;
  try {
    const classroom = new Classroom({ classroom_id, name, mentor_id, student_ids });
    await classroom.save();
    res.json(classroom);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create an assignment (Mentor only)
router.post('/assignment', isMentor, async (req, res) => {
  const { assignment_id, classroom_id, mentor_id, title, description, due_date, enrolled_students, points } = req.body;
  try {
    const assignment = new Assignment({ assignment_id, classroom_id, mentor_id, title, description, due_date, enrolled_students, points });
    await assignment.save();

    // Create notifications for enrolled students
    const notifications = enrolled_students.map(student_id => ({
      user_id: student_id,
      type: 'assignment',
      content: `New assignment: ${title} in Classroom ${classroom_id}`,
      reference_id: assignment_id
    }));
    await Notification.insertMany(notifications);

    // Add notification message to classroom chat
    const msg = new Message({
      classroom_id,
      sender_id: mentor_id,
      content: `I've added a new assignment: ${title}. Due on ${new Date(due_date).toLocaleDateString()}`,
      type: 'assignment'
    });
    await msg.save();

    res.json(assignment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get messages for a classroom
router.get('/:classroom_id/messages', async (req, res) => {
  try {
    const messages = await Message.find({ classroom_id: req.params.classroom_id }).sort({ createdAt: 1 });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Send a message (Update to handle files)
router.post('/:classroom_id/messages', async (req, res) => {
  const { sender_id, content, type, file_url, file_name, file_type } = req.body;
  try {
    const message = new Message({
      classroom_id: req.params.classroom_id,
      sender_id,
      content,
      type: type || 'text',
      file_url,
      file_name,
      file_type
    });
    await message.save();
    res.json(message);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Submit an assignment
router.post('/assignment/:assignment_id/submit', async (req, res) => {
  const { student_id, file_url, file_name } = req.body;
  try {
    const assignment = await Assignment.findOne({ assignment_id: req.params.assignment_id });
    if (!assignment) return res.status(404).json({ message: 'Assignment not found' });

    // Remove old submission if exists
    assignment.submissions = assignment.submissions.filter(s => s.student_id !== student_id);

    assignment.submissions.push({
      student_id,
      file_url,
      file_name,
      submitted_at: new Date(),
      status: 'Pending'
    });

    await assignment.save();
    res.json({ success: true, assignment });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Grade an assignment (Mentor only)
router.post('/assignment/:assignment_id/grade', isMentor, async (req, res) => {
  const { student_id, score, remarks, user_id } = req.body; // user_id for isMentor middleware
  try {
    const assignment = await Assignment.findOne({ assignment_id: req.params.assignment_id });
    if (!assignment) return res.status(404).json({ message: 'Assignment not found' });

    const submission = assignment.submissions.find(s => s.student_id === student_id);
    if (!submission) return res.status(404).json({ message: 'Submission not found' });

    submission.score = score;
    submission.remarks = remarks;
    submission.status = 'Graded';

    await assignment.save();

    // Notify student
    const notification = new Notification({
      user_id: student_id,
      type: 'assignment_graded',
      content: `Your assignment "${assignment.title}" has been graded. Score: ${score}`,
      reference_id: req.params.assignment_id
    });
    await notification.save();

    res.json({ success: true, assignment });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get classrooms for a user
router.get('/my-classrooms/:user_id', async (req, res) => {
// ... existing code ...
  const { user_id } = req.params;
  try {
    const classrooms = await Classroom.find({
      $or: [
        { mentor_id: user_id },
        { student_ids: user_id }
      ]
    });
    res.json(classrooms);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get assignments for a user
router.get('/my-assignments/:user_id', async (req, res) => {
  const { user_id } = req.params;
  try {
    const assignments = await Assignment.find({
      $or: [
        { mentor_id: user_id },
        { enrolled_students: user_id }
      ]
    }).sort({ createdAt: -1 });
    res.json(assignments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get notifications for a user
router.get('/notifications/:user_id', async (req, res) => {
  const { user_id } = req.params;
  try {
    const notifications = await Notification.find({ user_id }).sort({ createdAt: -1 });
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
