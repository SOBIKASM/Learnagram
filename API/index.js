const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const http = require("http");
const { Server } = require("socket.io");
require("dotenv").config();

const app = express();
const server = http.createServer(app);
const corsOptions = {
  origin: true, // Allow any origin
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  credentials: true
};

const io = new Server(server, { cors: corsOptions });

app.use(express.json());
app.use(cors(corsOptions));
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`, req.body);
  next();
});
// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/learnagram")
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// Socket.io logic
io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);
  socket.on("join_dm", (roomKey) => {
  socket.join(roomKey);
});

socket.on("send_dm", (data) => {
  io.to(data.roomKey).emit("receive_dm", data);
});
  socket.on("join_classroom", (classroomId) => {
    socket.join(classroomId);
    console.log(`User ${socket.id} joined classroom: ${classroomId}`);
  });

  socket.on("send_message", (data) => {
    // data: { classroom_id, sender_id, content }
    io.to(data.classroom_id).emit("receive_message", data);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

// Routes
app.use("/api/auth", require("./src/routes/auth"));
app.use("/api/posts", require("./src/routes/posts"));
app.use("/api/classrooms", require("./src/routes/classrooms"));
app.use("/api/users", require("./src/routes/users"));
app.use("/api/dm", require("./src/routes/dm"));

const PORT = process.env.PORT || 7001;
server.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
