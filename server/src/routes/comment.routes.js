import express from "express";
import {
  getComments,
  addComment,
  deleteComment,
} from "../controllers/comment.controller.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/experience/:experienceId", getComments);
router.post("/experience/:experienceId", protect, addComment);
router.delete("/:id", protect, deleteComment);

export default router;
