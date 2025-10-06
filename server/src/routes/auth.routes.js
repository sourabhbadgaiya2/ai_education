import express from "express";
import { authenticate } from "../middlewares/auth.middleware.js";
import * as authCtrl from "../controllers/auth.ctrl.js";

const router = express.Router();

router.post("/register", authCtrl.Register);

router.post("/login", authCtrl.Login);

router.get("/me", authenticate, authCtrl.getCurrentUser);

router.post("/logout", authenticate, authCtrl.Logout);

export default router;
