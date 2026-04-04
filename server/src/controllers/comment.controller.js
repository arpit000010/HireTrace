import Comment from "../models/comment.model.js";
import Experience from "../models/experience.model.js";
import ApiResponse from "../utils/ApiResponse.js";

// ─── @route GET /api/comments/experience/:experienceId ───────────
const getComments = async (req, res) => {
  try {
    const comments = await Comment.find({
      experienceId: req.params.experienceId,
    })
      .populate("userId", "name avatar")
      .sort({ createdAt: -1 });

    return res
      .status(200)
      .json(new ApiResponse(200, "Comments fetched", comments));
  } catch (error) {
    return res.status(500).json(new ApiResponse(500, error.message));
  }
};

// ─── @route POST /api/comments/experience/:experienceId ──────────
const addComment = async (req, res) => {
  try {
    const { text } = req.body;
    const { experienceId } = req.params;

    if (!text)
      return res
        .status(400)
        .json(new ApiResponse(400, "Comment text is required"));

    const experience = await Experience.findById(experienceId);
    if (!experience)
      return res.status(404).json(new ApiResponse(404, "Experience not found"));

    const comment = await Comment.create({
      experienceId,
      userId: req.user._id,
      text,
    });

    // Push comment reference into experience
    experience.comments.push(comment._id);
    await experience.save();

    // Populate user info before returning
    await comment.populate("userId", "name avatar");

    return res.status(201).json(new ApiResponse(201, "Comment added", comment));
  } catch (error) {
    return res.status(500).json(new ApiResponse(500, error.message));
  }
};

// ─── @route DELETE /api/comments/:id ─────────────────────────────
const deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment)
      return res.status(404).json(new ApiResponse(404, "Comment not found"));

    if (comment.userId.toString() !== req.user._id.toString())
      return res
        .status(403)
        .json(new ApiResponse(403, "Not authorized to delete this comment"));

    // Remove comment reference from experience
    await Experience.findByIdAndUpdate(comment.experienceId, {
      $pull: { comments: comment._id },
    });

    await comment.deleteOne();

    return res.status(200).json(new ApiResponse(200, "Comment deleted"));
  } catch (error) {
    return res.status(500).json(new ApiResponse(500, error.message));
  }
};

export { getComments, addComment, deleteComment };
