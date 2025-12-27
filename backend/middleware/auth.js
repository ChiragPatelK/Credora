const jwt = require("jsonwebtoken");
const User=require("../models/User")
async function auth(req, res, next) {
  // Get the Authorization header
  const authHeader = req.header("Authorization"); // frontend sends "Authorization: Bearer <token>"

  if (!authHeader) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  // Split the header to get the token
  const parts = authHeader.split(" ");
  if (parts.length !== 2 || parts[0] !== "Bearer") {
    return res.status(401).json({ message: "No token or invalid format, authorization denied" });
  }

  const token = parts[1];

  try { 
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ message: "User no longer exists" });
    }
    req.user = decoded; // Attach decoded user info to request
    next(); // Proceed to the route
  } catch (err) {
    return res.status(401).json({ message: "Token is not valid" });
  }
}

module.exports = auth;
