import User from "../models/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { Query } from "mongoose";

const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: "24h" });
};

export const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Validate input fields
    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Please fill in all fields.",
        success: false,
      });
    }

    // Check if email already exists
    const isExist = await User.findOne({ email });
    if (isExist) {
      return res.status(400).json({
        message: "Email already exists.",
        success: false,
      });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const user = new User({
      name,
      email,
      password: hashedPassword,
      role: role || "staff",
    });

    // Save user to database
    const savedUser = await user.save();

    // Generate JWT token
    const token = generateToken(savedUser._id, savedUser.role);

    // Store token in HTTP-only cookie (for security)
    // res.cookie("token", token, {
    //   httpOnly: true, // Prevents client-side access to the cookie
    //   secure: process.env.NODE_ENV === "production", // Secure flag for production
    //   sameSite: "strict", // Prevent CSRF attacks
    //   maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    // });

    res.status(201).json({
      message: "User registered successfully.",
      success: true,
      user: {
        id: savedUser._id,
        name: savedUser.name,
        email: savedUser.email,
        role: savedUser.role,
      },
      token, // Can also return the token for frontend use
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({
      message: "Internal server error.",
      success: false,
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(401)
        .json({ message: "Invalid email or password.", success: false });
    }
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res
        .status(401)
        .json({ message: "Invalid email or password.", success: false });
    }
    const token = generateToken(user._id, user.role);
    // res.cookie("token", token, {
    //   httpOnly: true,
    //   secure: process.env.NODE_ENV === "production",
    //   sameSite: "strict",
    //   maxAge: 7 * 24 * 60 * 60 * 1000,
    // });

    res.status(201).json({
      message: "User Loggeed In successfully.",
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token, 
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      message: "Internal server error.",
      success: false,
    });
  }
};


// Check if user is authenticated
export const checkAuth = async(req,res)=>{
  try {
     const token = req.headers.authorization?.split(' ')[1];
     if(!token){
      return res.status(401).json({message: "Authorization denied no token exist.", success: false});
     }
    //  verify token
    const decoded = jwt.verify(token,process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return res.status(401).json({ message: "No user found.", success: false });
    }

    res.json({
      message: "User is authenticated.",
      success: true,
      user:{
        id:user._id,
        name:user.name,
        email:user.email,
        role:user.role
      }
    })
  } catch (error) {
    console.error("Check Auth error:", error);
    res.json({
      message: error.message,
      success: false
    })
  }
}

export const getAllUsers = async(req,res)=>{
  try {
    
    const users = await User.find().select('-password');
    res.status(200).json({message:"All users",success:true,data:users});
  } catch (error) {
    console.error("Get all users error:", error);
    res.status(400).json({message:error.message,success:false})
    
  }
}
