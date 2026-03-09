const express = require('express');
const router = express.Router();
const Classroom = require('../models/Classroom');
const Assignment = require('../models/Assignment');
const Message = require('../models/Message');
const Notification = require('../models/Notification');

// Middleware to check if user is a mentor
const isMentor = (req, res, next) => {
  const { user_id } = req.body;
  if (user_id && user_id.startsWith('MTR_')) {
    next();
  } else {
    res.status(403).json({ message: 'Only mentors can perform this action' });
  }
};
// Get ALL classrooms (or filter by user)
router.get('/', async (req, res) => {
  try {
    const classrooms = await Classroom.find();
    res.json({ success: true, classrooms });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
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
  const { assignment_id, classroom_id, mentor_id, title, description, due_date, enrolled_students } = req.body;
  try {
    const assignment = new Assignment({ assignment_id, classroom_id, mentor_id, title, description, due_date, enrolled_students });
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

// Send a message
router.post('/:classroom_id/messages', async (req, res) => {
  const { sender_id, content } = req.body;
  try {
    const message = new Message({
      classroom_id: req.params.classroom_id,
      sender_id,
      content
    });
    await message.save();
    res.json(message);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get classrooms for a user
router.get('/my-classrooms/:user_id', async (req, res) => {
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
