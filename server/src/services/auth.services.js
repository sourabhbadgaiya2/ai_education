import { sendEmailViaVercelAPI } from "../helpers/sendEmail.js";
import User from "../models/user.models.js";
import fetch from "node-fetch"; // ya "undici" agar Node 18+ hai

export const createUser = async (name, email, password) => {
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    const error = new Error("Email is already registered");
    error.statusCode = 400;
    throw error;
  }

  const user = new User({ name, email, password });
  await user.save();
  return user;
};

export const loginUser = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user || !(await user.comparePassword(password))) {
    const error = new Error("Invalid email or password");
    error.statusCode = 401;
    throw error;
  }
  const accessToken = await user.generateAuthToken();

  return { user, accessToken };
};

export const generateForgetPasswordOTP = async (email) => {
  const user = await User.findOne({ email });
  if (!user) throw { statusCode: 404, message: "User not found" };

  const otp = Math.floor(100000 + Math.random() * 900000); // 6-digit OTP
  user.resetPasswordToken = otp;
  user.resetPasswordExpires = Date.now() + 10 * 60 * 1000; // 10 min
  await user.save({ validateBeforeSave: false });

  // Send email via Vercel API
  await sendEmailViaVercelAPI({
    to: email,
    subject: "Your OTP for Password Reset",
    text: `Your OTP is ${otp}. It will expire in 10 minutes.`,
  });

  return otp;
};

export const verifyOTPAndResetPassword = async (email, otp, newPassword) => {
  const user = await User.findOne({
    email,
    resetPasswordToken: otp,
    resetPasswordExpires: { $gt: Date.now() },
  });

  if (!user) throw { statusCode: 400, message: "Invalid or expired OTP" };

  user.password = newPassword;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;

  await user.save();

  return user;
};
