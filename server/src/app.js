import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.routes.js";
import experienceRoutes from "./routes/experience.routes.js";
import commentRoutes from "./routes/comment.routes.js";
import { errorHandler } from "./middlewares/error.middleware.js";

const app = express();

// Middlewares
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());

// Routes
app.get("/", (req, res) => res.send("HireTrace API is running..."));
app.use("/api/auth", authRoutes);
app.use("/api/experiences", experienceRoutes);
app.use("/api/comments", commentRoutes);

// Global error handler (must be last)
app.use(errorHandler);

export default app;
