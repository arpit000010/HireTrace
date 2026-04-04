import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import ApiResponse from "../utils/ApiResponse.js";

const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(401)
        .json(new ApiResponse(401, "Not authorized, no token"));
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    req.user = await User.findById(decoded.id).select("-password");

    if (!req.user) {
      return res.status(401).json(new ApiResponse(401, "User not found"));
    }

    next();
  } catch (error) {
    return res
      .status(401)
      .json(new ApiResponse(401, "Token is invalid or expired"));
  }
};

export { protect };
