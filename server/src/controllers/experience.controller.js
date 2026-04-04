import Experience from "../models/experience.model.js";
import User from "../models/user.model.js";
import ApiResponse from "../utils/ApiResponse.js";

// ─── @route GET /api/experiences ─────────────────────────────────
const getAllExperiences = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      company,
      difficulty,
      tags,
      result,
      experienceType,
      search,
      sort = "latest",
    } = req.query;

    const filter = {};

    if (company) filter.company = { $regex: company, $options: "i" };
    if (difficulty) filter.difficulty = difficulty;
    if (result) filter.result = result;
    if (experienceType) filter.experienceType = experienceType;
    if (tags) filter.tags = { $in: tags.split(",") };
    if (search) {
      filter.$or = [
        { company: { $regex: search, $options: "i" } },
        { role: { $regex: search, $options: "i" } },
        { tags: { $in: [new RegExp(search, "i")] } },
      ];
    }

    const sortMap = {
      latest: { createdAt: -1 },
      oldest: { createdAt: 1 },
      mostVoted: { upvotes: -1 },
      mostViewed: { views: -1 },
    };
    const sortOption = sortMap[sort] || sortMap.latest;

    const skip = (Number(page) - 1) * Number(limit);
    const total = await Experience.countDocuments(filter);

    const experiences = await Experience.find(filter)
      .sort(sortOption)
      .skip(skip)
      .limit(Number(limit))
      .populate("author", "name avatar")
      .select("-comments");

    return res.status(200).json(
      new ApiResponse(200, "Experiences fetched", {
        experiences,
        pagination: {
          total,
          page: Number(page),
          pages: Math.ceil(total / Number(limit)),
        },
      }),
    );
  } catch (error) {
    return res.status(500).json(new ApiResponse(500, error.message));
  }
};

// ─── @route GET /api/experiences/trending ────────────────────────
const getTrendingExperiences = async (req, res) => {
  try {
    const experiences = await Experience.find()
      .populate("author", "name avatar")
      .select("-comments")
      .lean();

    const now = Date.now();

    const scored = experiences.map((exp) => {
      const daysSince =
        (now - new Date(exp.createdAt).getTime()) / (1000 * 60 * 60 * 24);
      const recencyBoost = Math.max(0, 10 - daysSince);
      const voteScore =
        (exp.upvotes?.length || 0) - (exp.downvotes?.length || 0);
      const score =
        voteScore +
        (exp.views || 0) * 0.1 +
        (exp.comments?.length || 0) * 2 +
        recencyBoost;
      return { ...exp, trendingScore: score };
    });

    const trending = scored
      .sort((a, b) => b.trendingScore - a.trendingScore)
      .slice(0, 10);

    return res
      .status(200)
      .json(new ApiResponse(200, "Trending experiences", trending));
  } catch (error) {
    return res.status(500).json(new ApiResponse(500, error.message));
  }
};

// ─── @route GET /api/experiences/analytics ───────────────────────
const getAnalytics = async (req, res) => {
  try {
    const [topCompanies, difficultyDist, resultDist, totalExperiences] =
      await Promise.all([
        Experience.aggregate([
          { $group: { _id: "$company", count: { $sum: 1 } } },
          { $sort: { count: -1 } },
          { $limit: 10 },
        ]),
        Experience.aggregate([
          { $group: { _id: "$difficulty", count: { $sum: 1 } } },
        ]),
        Experience.aggregate([
          { $group: { _id: "$result", count: { $sum: 1 } } },
        ]),
        Experience.countDocuments(),
      ]);

    return res.status(200).json(
      new ApiResponse(200, "Analytics", {
        totalExperiences,
        topCompanies,
        difficultyDist,
        resultDist,
      }),
    );
  } catch (error) {
    return res.status(500).json(new ApiResponse(500, error.message));
  }
};

// ─── @route GET /api/experiences/:id ─────────────────────────────
const getExperienceById = async (req, res) => {
  try {
    const experience = await Experience.findByIdAndUpdate(
      req.params.id,
      { $inc: { views: 1 } },
      { new: true },
    )
      .populate("author", "name avatar bio")
      .populate({
        path: "comments",
        populate: { path: "userId", select: "name avatar" },
      });

    if (!experience)
      return res.status(404).json(new ApiResponse(404, "Experience not found"));

    return res
      .status(200)
      .json(new ApiResponse(200, "Experience fetched", experience));
  } catch (error) {
    return res.status(500).json(new ApiResponse(500, error.message));
  }
};

// ─── @route POST /api/experiences ────────────────────────────────
const createExperience = async (req, res) => {
  try {
    const {
      company,
      role,
      experienceType,
      result,
      rounds,
      questions,
      difficulty,
      tags,
      tips,
      content,
    } = req.body;

    if (!company || !role || !content)
      return res
        .status(400)
        .json(new ApiResponse(400, "Company, role, and content are required"));

    const experience = await Experience.create({
      company,
      role,
      experienceType,
      result,
      rounds,
      questions,
      difficulty,
      tags,
      tips,
      content,
      author: req.user._id,
    });

    // Add to user's createdExperiences
    await User.findByIdAndUpdate(req.user._id, {
      $push: { createdExperiences: experience._id },
    });

    return res
      .status(201)
      .json(new ApiResponse(201, "Experience created", experience));
  } catch (error) {
    return res.status(500).json(new ApiResponse(500, error.message));
  }
};

// ─── @route PUT /api/experiences/:id ─────────────────────────────
const updateExperience = async (req, res) => {
  try {
    const experience = await Experience.findById(req.params.id);

    if (!experience)
      return res.status(404).json(new ApiResponse(404, "Experience not found"));

    if (experience.author.toString() !== req.user._id.toString())
      return res
        .status(403)
        .json(new ApiResponse(403, "Not authorized to edit this experience"));

    const updated = await Experience.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true },
    );

    return res
      .status(200)
      .json(new ApiResponse(200, "Experience updated", updated));
  } catch (error) {
    return res.status(500).json(new ApiResponse(500, error.message));
  }
};

// ─── @route DELETE /api/experiences/:id ──────────────────────────
const deleteExperience = async (req, res) => {
  try {
    const experience = await Experience.findById(req.params.id);

    if (!experience)
      return res.status(404).json(new ApiResponse(404, "Experience not found"));

    if (experience.author.toString() !== req.user._id.toString())
      return res
        .status(403)
        .json(new ApiResponse(403, "Not authorized to delete this experience"));

    await experience.deleteOne();

    await User.findByIdAndUpdate(req.user._id, {
      $pull: { createdExperiences: experience._id },
    });

    return res.status(200).json(new ApiResponse(200, "Experience deleted"));
  } catch (error) {
    return res.status(500).json(new ApiResponse(500, error.message));
  }
};

// ─── @route POST /api/experiences/:id/vote ───────────────────────
const voteExperience = async (req, res) => {
  try {
    const { type } = req.body; // 'up' or 'down'
    const userId = req.user._id;
    const experience = await Experience.findById(req.params.id);

    if (!experience)
      return res.status(404).json(new ApiResponse(404, "Experience not found"));

    const alreadyUpvoted = experience.upvotes.includes(userId);
    const alreadyDownvoted = experience.downvotes.includes(userId);

    if (type === "up") {
      if (alreadyUpvoted) {
        experience.upvotes.pull(userId); // toggle off
      } else {
        experience.upvotes.push(userId);
        experience.downvotes.pull(userId); // remove opposite
      }
    } else if (type === "down") {
      if (alreadyDownvoted) {
        experience.downvotes.pull(userId); // toggle off
      } else {
        experience.downvotes.push(userId);
        experience.upvotes.pull(userId); // remove opposite
      }
    } else {
      return res
        .status(400)
        .json(new ApiResponse(400, 'Vote type must be "up" or "down"'));
    }

    await experience.save();

    return res.status(200).json(
      new ApiResponse(200, "Vote recorded", {
        upvotes: experience.upvotes.length,
        downvotes: experience.downvotes.length,
        voteScore: experience.upvotes.length - experience.downvotes.length,
      }),
    );
  } catch (error) {
    return res.status(500).json(new ApiResponse(500, error.message));
  }
};

// ─── @route POST /api/experiences/:id/bookmark ───────────────────
const toggleBookmark = async (req, res) => {
  try {
    const userId = req.user._id;
    const experienceId = req.params.id;

    const user = await User.findById(userId);
    const isBookmarked = user.bookmarks.includes(experienceId);

    if (isBookmarked) {
      user.bookmarks.pull(experienceId);
    } else {
      user.bookmarks.push(experienceId);
    }

    await user.save();

    return res.status(200).json(
      new ApiResponse(200, isBookmarked ? "Bookmark removed" : "Bookmarked", {
        isBookmarked: !isBookmarked,
      }),
    );
  } catch (error) {
    return res.status(500).json(new ApiResponse(500, error.message));
  }
};

const getMyExperiences = async (req, res) => {
  const experiences = await Experience.find({ author: req.user._id })
    .sort({ createdAt: -1 })
    .populate("author", "name avatar")
    .select("-comments");
  res.json(new ApiResponse(200, "My experiences", { experiences }));
};

export {
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
};
