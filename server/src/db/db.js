import mongoose from "mongoose";
import config from "../config/env.config.js";

const connectDB = async () => {
  try {
    await mongoose.connect(config.MONGODB_URL);
    console.log("MongoDB connected");
  } catch (error) {
    console.log(error.message);
  }
};

export default connectDB;
