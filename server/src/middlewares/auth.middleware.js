import jwt from "jsonwebtoken";
import config from "../config/env.config.js";
import User from "../models/user.models.js";

export const authenticate = async (req, res, next) => {
  try {
    const token =
      req.cookies.token || req.header("Authorization").replace("Bearer ", "");
    if (!token) {
      const error = new Error("No token provided");
      error.statusCode = 401;
      throw error;
    }

    const decoded = jwt.verify(token, config.JWT_SECRET);
    const user = await User.findById(decoded._id).select("-password");
    if (!user) {
      const error = new Error("User not found");
      error.statusCode = 401;
      throw error;
    }

    req.user = user;
    next();
  } catch (error) {
    error.statusCode = error.statusCode || 401;
    next(error);
  }
};

// export const authenticate = async (req, res, next) => {
//   try {
//     const authHeader = req.header("Authorization");

//     if (!authHeader) {
//       const error = new Error("Authorization header missing");
//       error.statusCode = 401;
//       throw error;
//     }

//     const token = authHeader.replace("Bearer ", "");
//     if (!token) {
//       const error = new Error("No token provided");
//       error.statusCode = 401;
//       throw error;
//     }

//     const decoded = jwt.verify(token, config.JWT_SECRET);
//     const user = await User.findById(decoded._id);

//     if (!user) {
//       const error = new Error("User not found");
//       error.statusCode = 401;
//       throw error;
//     }

//     req.user = user;
//     next();
//   } catch (error) {
//     error.statusCode = error.statusCode || 401;
//     next(error);
//   }
// };
