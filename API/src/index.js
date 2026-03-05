const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv").config();
const dbConnect = require("./config/dbConnect");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const postRoutes = require("./routes/postRoutes");
const classroomRoutes = require("./routes/classroomRoutes");
dbConnect();

const app = express();

// Middleware
app.use(express.json());
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true
}));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/classrooms", classroomRoutes);

// Test route
app.get("/api/test", (req, res) => {
  res.json({ message: "Learnagram API is running!" });
});
const classroomRoutes = require("./routes/classroomRoutes");
app.use("/api/classrooms", classroomRoutes);
const PORT = process.env.PORT || 7001;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});