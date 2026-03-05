const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  console.log("Auth middleware - Headers:", req.headers); // Debug log
  
  const authHeader = req.headers.authorization || req.headers.Authorization;
  
  if (!authHeader) {
    console.log("No authorization header");
    return res.status(401).json({ message: "No token provided" });
  }

  if (!authHeader.startsWith("Bearer ")) {
    console.log("Invalid token format");
    return res.status(401).json({ message: "Invalid token format" });
  }

  const token = authHeader.split(" ")[1];
  
  if (!token) {
    console.log("No token in Bearer string");
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRETKEY);
    console.log("Token verified - User:", decoded);
    req.user = decoded;
    next();
  } catch (err) {
    console.log("Token verification failed:", err.message);
    return res.status(403).json({ message: "Invalid or expired token" });
  }
};

module.exports = verifyToken;