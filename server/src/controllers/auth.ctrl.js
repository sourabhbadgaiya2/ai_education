import config from "../config/env.config.js";
import * as authService from "../services/auth.services.js";

export const Register = async (req, res, next) => {
  const { name, email, password } = req.body;
  try {
    const user = await authService.createUser(name, email, password);
    res.status(201).json({
      status: "success",
      message: "User registered successfully",
      data: {
        user,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const Login = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const { user, accessToken } = await authService.loginUser(email, password);

    res
      .status(200)
      .cookie("token", accessToken, {
        httpOnly: true,
        secure: config.NODE_ENV === "production",
        sameSite: config.NODE_ENV === "production" ? "none" : "lax",
        maxAge: 24 * 60 * 60 * 1000,
      })
      .json({
        status: "success",
        message: "User logged in successfully",
        data: {
          user,
          accessToken,
        },
      });
  } catch (error) {
    next(error);
  }
};

export const getCurrentUser = async (req, res, next) => {
  try {
    const user = req.user; // Assuming req.user is populated by authentication middleware
    res.status(200).json({
      status: "success",
      message: "Current user fetched successfully",
      data: {
        user,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const Logout = async (req, res, next) => {
  try {
    res
      .status(200)
      .clearCookie("token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 0,
      })
      .json({
        status: "success",
        message: "User logged out successfully",
      });
  } catch (error) {
    next(error);
  }
};

export const forgetPasswordController = async (req, res, next) => {
  try {
    const { email } = req.body;
    await authService.generateForgetPasswordOTP(email);
    res.json({ message: "OTP sent to your email ✅" });
  } catch (err) {
    console.error(err);
    next(err);
  }
};

export const verifyOTPController = async (req, res, next) => {
  try {
    const { email, otp, newPassword } = req.body;
    await authService.verifyOTPAndResetPassword(email, otp, newPassword);
    res.json({ message: "Password reset successfully ✅" });
  } catch (err) {
    console.error(err);
    next(err);
  }
};
