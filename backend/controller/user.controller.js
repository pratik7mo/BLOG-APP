// Import the User model from the models directory
import { User } from "../models/user.model.js";
import { v2 as cloudinary } from "cloudinary";
import bcrypt from "bcrypt";
import createTokenAndSaveCookies from "../jwt/AuthToken.js"

// Define an asynchronous function for user registration
export const register = async (req, res) => {
try {
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).json({ message: "User photo is required" });
  }
  const { photo } = req.files;
  const allowedformats = ["image/png", "image/jpeg", "image/webp"];
  if (!allowedformats.includes(photo.mimetype)) {
    return res
      .status(400)
      .json({ message: "Invalid photo format .Only jpg and png are allowed" });
  }
  // Destructure the incoming request body to extract user details
  const { email, name, password, phone, education, role } = req.body;

  // Check if all required fields are provided in the request
  if (!email || !name || !password || !phone || !education || !role || !photo) {
    // If any field is missing, send a 400 status with an error message
    return res.status(400).json({ message: "Please fill the required fields" });
  }

  // Check if a user already exists with the same email in the database await i s
  const user = await User.findOne({ email });
  if (user) {
    // If a user is found, send a 400 status with a message indicating the user already exists
    return res
      .status(400)
      .json({ message: "User already exists with this email" });
  }

  const cloudinaryResponse = await cloudinary.uploader.upload(
    photo.tempFilePath
  );
  if (!cloudinaryResponse || cloudinaryResponse.error) {
    console.log(cloudinaryResponse.error);
  }

  const hasedPassword = await bcrypt.hash(password, 10);
  // If no user exists, create a new user instance with the provided data
  const newUser = new User({
    email,
    name,
    password: hasedPassword,
    phone,
    education,
    role,
    photo: {
      public_id: cloudinaryResponse.public_id,
      url: cloudinaryResponse.url,
    },
  });

  // Save the new user to the database
  await newUser.save();

  // If the user is successfully saved, send a success response
  if (newUser) {
    const token = await createTokenAndSaveCookies(newUser._id,res)
    console.log("signup: ",token)
    res.status(201).json({ message: "User registered successfully", newUser,token });
  }
} catch (error) {
  console.log(error)
  return res.status(500).json({error:"Internal Server error"})
}
};

export const login=async(req,res)=>{
  const {email,password,role}=req.body
  try {
    if (!email || !password || !role){
      return res.status(400).json({message:"Please fill required fields"});
    }
    const user=await User.findOne({email}).select("+password");
    if(!user.password){
      return res.status(400).json({message:"User password is missing"});
    }
 // Match daatbase password  with req.body giver password by user
    const isMatch=await bcrypt.compare(password, user.password);
    if(!user  || !isMatch){
      return res.status(400).json({message:"Invalid email or password"});
    }
    if(user.role!==role){
      return res.status(400).json({message:`Given role ${role} not found`});
    }
    const token =await createTokenAndSaveCookies(user._id,res)
    console.log("login: ",token)
    return res.status(200).json({message:"User logged in Successfully",user:{
      _id:user._id,
      name:user.name,
      email:user.email,
      role:user.role,
    },token:token})
  } catch (error) {
    console.log(error)
    return res.status(500).json({error:"Internal Server error"});
  }
}

export const logout=async(req,res)=>{
 try {
  res.clearCookie("jwt");
  res.status(200).json({message:"User logged out Successfully"});
 } catch (error) {
  console.log(error)
  return res.status(500).json({error:"Internal Server error"});
 }
};

export const getMyProfile=async(req,res)=>{
  const user=await req.user;
  res.status(200).json({user});
}

export const getAdmins=async(req,res)=>{
 const admins=await User.find({role:"admin"});
 res.status(200).json({admins}); 
}