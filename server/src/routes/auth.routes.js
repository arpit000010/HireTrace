import express from "express";
import {
  register,
  verifyEmail,
  login,
  refreshAccessToken,
  logout,
  getMe,
} from "../controllers/auth.controller.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/register", register);
router.get("/verify-email/:token", verifyEmail);
router.post("/login", login);
router.post("/refresh", refreshAccessToken);
router.post("/logout", logout);
router.get("/me", protect, getMe); // protected route

export default router;
