const express=require('express');
const router=express.Router();
const {signup,login,getMe}=require('../controllers/authController');
const authMiddleware=require('../middleware/authMiddleware');
const { authLimiter } = require("../middleware/rateLimiters");

router.post("/signup", authLimiter, signup);
router.post("/login", authLimiter, login);
router.get("/me",authMiddleware,getMe);

module.exports=router;