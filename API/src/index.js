const express = require("express")
const cors = require("cors"); // Add this
const dotenv = require("dotenv").config();
const dbConnect = require("./config/dbConnect");
const authRoutes = require("./routes/authRoutes")
const userRoutes = require("./routes/userRoutes")

dbConnect();

const app = express();

// Middleware
app.use(express.json());
// In API/index.js, update the CORS configuration
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000', 'http://127.0.0.1:5173'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));
// Routes
app.use("/api/auth", authRoutes)
app.use("/api/users", userRoutes)

// Start the server
const PORT = process.env.PORT || 7002
app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});