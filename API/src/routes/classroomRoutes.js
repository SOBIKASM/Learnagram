const express = require("express");
const router = express.Router();
const verifyToken = require("../middlewares/authMiddleware");
const Classroom = require("../models/Classroom");

// Get all classrooms user is in
router.get("/", verifyToken, async (req, res) => {
  console.log("GET /api/classrooms - User:", req.user); // Debug log
  
  try {
    const classrooms = await Classroom.find({
      members: req.user.id
    })
    .populate("createdBy", "name username")
    .populate("members", "name username")
    .sort({ updatedAt: -1 });
    
    console.log(`Found ${classrooms.length} classrooms`); // Debug log
    res.json(classrooms);
  } catch (err) {
    console.error("Error in GET /classrooms:", err);
    res.status(500).json({ message: err.message });
  }
});

// Create classroom
router.post("/", verifyToken, async (req, res) => {
  console.log("POST /api/classrooms - Body:", req.body); // Debug log
  console.log("User:", req.user); // Debug log
  
  try {
    const { name, description } = req.body;
    
    if (!name) {
      return res.status(400).json({ message: "Classroom name is required" });
    }
    
    const classroom = new Classroom({
      name,
      description: description || "",
      createdBy: req.user.id,
      members: [req.user.id]
    });
    
    await classroom.save();
    
    const populatedClassroom = await Classroom.findById(classroom._id)
      .populate("createdBy", "name username")
      .populate("members", "name username");
    
    res.status(201).json(populatedClassroom);
  } catch (err) {
    console.error("Error in POST /classrooms:", err);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;