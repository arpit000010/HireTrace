import express from "express";
import {
  getAllExperiences,
  getTrendingExperiences,
  getAnalytics,
  getExperienceById,
  createExperience,
  updateExperience,
  deleteExperience,
  voteExperience,
  toggleBookmark,
  getMyExperiences,
} from "../controllers/experience.controller.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Public routes
router.get("/trending", getTrendingExperiences);
router.get("/analytics", getAnalytics);
router.get("/", getAllExperiences);
router.get("/my", protect, getMyExperiences);
router.get("/:id", getExperienceById);

// Protected routes
router.post("/", protect, createExperience);
router.put("/:id", protect, updateExperience);
router.delete("/:id", protect, deleteExperience);
router.post("/:id/vote", protect, voteExperience);
router.post("/:id/bookmark", protect, toggleBookmark);

export default router;
