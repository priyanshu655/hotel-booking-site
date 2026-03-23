const jwt = require("jsonwebtoken");
const User = require("../models/User");

const adminMiddleware = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);
    if (!user || (user.role !== "admin" && user.role !== "seller")) {
      return res.status(403).json({ message: "Admin or Seller access required" });
    }
    next();
  } catch (err) {
    return res.status(500).json({ message: "Authorization error" });
  }
};

module.exports = adminMiddleware;
