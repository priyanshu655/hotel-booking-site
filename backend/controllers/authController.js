const jwt=require('jsonwebtoken');
const bcrypt=require('bcryptjs');
const User=require('../models/User');

exports.signup=async (req,res)=>{
    try{
 let  {username,email,password,role}=req.body;
 if(!username||!email||!password){
 return res.status(400).json({message:"Enter the required fields!"});
 }
 const userexists=await User.findOne({email});
 if(userexists){
    return res.status(400).json({message:"User already exists!"});
 }
 const hashedPassword=await bcrypt.hash(password,10);

 const validRole = (role === "admin" || role === "seller") ? role : "user";

 const newUser=await User.create({
    username:username,
    email:email,
    password:hashedPassword,
    role: validRole
 });


  res.status(201).json({
      message: "User registered successfully",
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        role: newUser.role
      }
    });

    }catch(err){
        return res.status(400).json({message:"error registering user", error:err.message});
    }
}

exports.login=async (req,res)=>{
    try{
        let {email,password}=req.body;
        
        if(!email || !password){
            return res.status(400).json({message:"Please provide email and password"});
        }

        // Make sure JWT_SECRET is set
        if(!process.env.JWT_SECRET){
            console.error("JWT_SECRET is not defined in environment variables");
            return res.status(500).json({message:"Server configuration error"});
        }

        const isuser=await User.findOne({email});
        if(!isuser){
            return res.status(401).json({message:"Invalid email or password"});
        }

        const isMatch = await bcrypt.compare(password, isuser.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        const token=jwt.sign({id:isuser._id, role:isuser.role}, process.env.JWT_SECRET, { expiresIn: '7d' });
        return res.status(200).json({ 
            message: 'Login successful', 
            token: token, 
            user: { 
                id: isuser._id, 
                username: isuser.username, 
                email: isuser.email, 
                role: isuser.role 
            } 
        });
    }catch(err){
        console.error('Login error:', err);
        return res.status(500).json({ message: "Server error during login", error: err.message });
    }
}

exports.getMe=async (req,res)=>{
    try{
        const user=await User.findById(req.userId).select('-password');
        if(!user) return res.status(404).json({message:"User not found"});
        res.json({ id: user._id, username: user.username, email: user.email, role: user.role });
    }catch(err){
        res.status(500).json({message:"Error fetching user",error:err.message});
    }
}