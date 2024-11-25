const AsyncHandler = require("../utils/AsynicHandler");
const User = require('../models/User.model');
const sendToken = require('../utils/sendToken'); // Ensure this is the correct import

const ApiErrorHandler = require("../utils/ApiError.js");


exports.Register = AsyncHandler(async (req, res, next) => {
  const { name, email, password } = req.body;

  if ([email, password, name].some((field) => field?.trim() === "")) {
    throw next(new ApiErrorHandler(400, "All fields are required"));
  }

  const existedUser = await User.findOne({
    $or: [{ email }],
  });

  if (existedUser) {
    throw next(new ApiErrorHandler( "User with email already exists",409,));
  }

  const user = await User.create({
    name,
    email,
    password,
  });

  sendToken(user, 201, res);
});

exports.Login = AsyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  if ([email, password].some((field) => field?.trim() === "")) {
    throw next(new ApiErrorHandler(400, "All fields are required"));
  }

  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    throw next(new ApiErrorHandler(400, "User not found"));
  }

  const isPasswordMatch = await user.comparePassword(password);
  if (!isPasswordMatch) {
    throw next(new ApiErrorHandler(401, "Invalid email or password"));
  }

  sendToken(user, 200, res);
});

// LogOut User
exports.Logout=AsyncHandler(async(req,res,next)=>{
  res.cookie("token",null,{
    expires:new Date(Date.now()),
    httpOnly:true,
  })
  res.status(200).json({
    success:true,
    message:"Logged Out",
  })
})
