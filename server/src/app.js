import express from "express";
import morgan from "morgan";

import ErrorHandler from "./middlewares/error.middleware.js";
import cookieParser from "cookie-parser";

import cors from "cors";
import config from "./config/env.config.js";

const app = express();

const allowedOrigins = [
  config.FRONTEND_URL,
  "https://mail-send-weld.vercel.app",
];

// middlewares
app.use(express.json());

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true); // Postman ya server requests ke liye
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);
// app.use(
//   cors({
//     origin: config.FRONTEND_URL,
//     credentials: true,
//   })
// );
app.use(express.urlencoded({ extended: true }));

app.use(morgan("dev"));
app.use(cookieParser());

//Router
app.use("/api/v1/auth", (await import("./routes/auth.routes.js")).default);
app.use("/api/v1/notes", (await import("./routes/notes.routes.js")).default);
app.use("/api/v1/ai", (await import("./routes/ai.routes.js")).default);

// Error handler
app.use((req, res, next) => {
  const err = new Error(`Can't find ${req.originalUrl} on this server!`);
  err.status = "fail";
  err.statusCode = 404;
  next(err);
});

app.use(ErrorHandler);

export default app;
