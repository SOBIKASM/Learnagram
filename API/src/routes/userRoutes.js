const express = require("express");
const verifyToken = require("../middlewares/authMiddleware")
const authorizeRoles = require("../middlewares/roleMiddleware")
const router = express.Router();

//only admin can access this routes
router.get("/admin", verifyToken, authorizeRoles("admin"), (req, res) => {
  res.json({ message: `WElcome Admin` })
});

//only admin and teachers can access this routes
router.get("/prof", verifyToken, authorizeRoles("prof","admin"), (req, res) => {
  res.json({ message: `WElcome Prof` })
});

//all can accessrouter.get("/admin",(req,res)=>{
router.get("/user", verifyToken, authorizeRoles("user","prof","admin"), (req, res) => {
  res.json({ message: `WElcome user` })
});

module.exports = router