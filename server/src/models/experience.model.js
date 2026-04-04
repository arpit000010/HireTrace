import mongoose from "mongoose";

const roundSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, default: "" },
  difficulty: {
    type: String,
    enum: ["easy", "medium", "hard"],
    default: "medium",
  },
});

const experienceSchema = new mongoose.Schema(
  {
    company: {
      type: String,
      required: [true, "Company name is required"],
      trim: true,
      index: true,
    },
    role: {
      type: String,
      required: [true, "Role is required"],
      trim: true,
    },
    experienceType: {
      type: String,
      enum: ["onsite", "online", "phone", "take-home"],
      default: "online",
    },
    result: {
      type: String,
      enum: ["selected", "rejected", "pending", "no-response"],
      default: "pending",
    },
    rounds: [roundSchema],
    questions: [{ type: String }],
    difficulty: {
      type: String,
      enum: ["easy", "medium", "hard"],
      default: "medium",
    },
    tags: [{ type: String, index: true }],
    tips: { type: String, default: "" },
    content: {
      type: String,
      required: [true, "Experience content is required"],
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    upvotes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    downvotes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    views: { type: Number, default: 0 },
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
  },
  { timestamps: true },
);

// Virtual: net vote score
experienceSchema.virtual("voteScore").get(function () {
  return this.upvotes.length - this.downvotes.length;
});

const Experience = mongoose.model("Experience", experienceSchema);
export default Experience;
